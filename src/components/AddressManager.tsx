import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Edit, Trash2, MapPin, Home, Building } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Address = Database['public']['Tables']['addresses']['Row'];
type AddressInsert = Database['public']['Tables']['addresses']['Insert'];

const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  company: z.string().optional(),
  addressLine1: z.string().min(5, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  stateProvince: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

interface AddressManagerProps {
  type?: 'shipping' | 'billing' | 'both';
  onAddressSelect?: (address: Address) => void;
  selectedAddressId?: string;
}

export function AddressManager({ type = 'both', onAddressSelect, selectedAddressId }: AddressManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      firstName: "",
      lastName: "",
      company: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "US",
      phone: "",
      isDefault: false,
    },
  });

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (type !== 'both') {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setAddresses(data || []);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error loading addresses",
        description: error.message || "Failed to load addresses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const openDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      form.reset({
        type: address.type as 'shipping' | 'billing',
        firstName: address.first_name,
        lastName: address.last_name,
        company: address.company || "",
        addressLine1: address.address_line_1,
        addressLine2: address.address_line_2 || "",
        city: address.city,
        stateProvince: address.state_province,
        postalCode: address.postal_code,
        country: address.country,
        phone: address.phone || "",
        isDefault: address.is_default ?? false,
      });
    } else {
      setEditingAddress(null);
      form.reset({
        type: type === 'both' ? 'shipping' : type,
        firstName: "",
        lastName: "",
        company: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "US",
        phone: "",
        isDefault: false,
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const addressData: AddressInsert = {
        user_id: user.id,
        type: values.type,
        first_name: values.firstName,
        last_name: values.lastName,
        company: values.company || null,
        address_line_1: values.addressLine1,
        address_line_2: values.addressLine2 || null,
        city: values.city,
        state_province: values.stateProvince,
        postal_code: values.postalCode,
        country: values.country,
        phone: values.phone || null,
        is_default: values.isDefault,
      };

      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);

        if (error) throw error;

        toast({
          title: "Address updated",
          description: "Your address has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('addresses')
          .insert(addressData);

        if (error) throw error;

        toast({
          title: "Address added",
          description: "Your new address has been successfully added.",
        });
      }

      await fetchAddresses();
      closeDialog();
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast({
        title: "Error saving address",
        description: error.message || "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirmation = (address: Address) => {
    setAddressToDelete(address);
    setIsDeleteConfirmationOpen(true);
  };

  const deleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressToDelete.id);

      if (error) throw error;

      toast({
        title: "Address deleted",
        description: "The address has been successfully deleted.",
      });

      await fetchAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error deleting address",
        description: error.message || "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteConfirmationOpen(false);
      setAddressToDelete(null);
    }
  };

  const setDefaultAddress = async (addressId: string, addressType: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      toast({
        title: "Default address updated",
        description: `This is now your default ${addressType} address.`,
      });

      await fetchAddresses();
    } catch (error: any) {
      console.error('Error setting default address:', error);
      toast({
        title: "Error updating default address",
        description: error.message || "Failed to update default address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      `${address.city}, ${address.state_province} ${address.postal_code}`,
      address.country !== 'US' ? address.country : null,
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">Please sign in to manage your addresses.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading addresses...</span>
        </CardContent>
      </Card>
    );
  }

  const filteredAddresses = type === 'both' 
    ? addresses 
    : addresses.filter(addr => addr.type === type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Address Book</h2>
          <p className="text-gray-600">Manage your shipping and billing addresses</p>
        </div>
        <Button onClick={() => openDialog()} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </Button>
      </div>

      {filteredAddresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses found</h3>
            <p className="text-gray-500 text-center mb-4">
              Add your first address to get started with orders and deliveries.
            </p>
            <Button onClick={() => openDialog()}>Add Your First Address</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAddresses.map((address) => (
            <Card 
              key={address.id} 
              className={`cursor-pointer transition-all ${
                selectedAddressId === address.id 
                  ? 'ring-2 ring-green-500 border-green-500' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onAddressSelect?.(address)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {address.type === 'shipping' ? (
                      <Home className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Building className="w-4 h-4 text-purple-500" />
                    )}
                    <CardTitle className="text-lg">
                      {address.first_name} {address.last_name}
                    </CardTitle>
                    {address.is_default && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDialog(address);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConfirmation(address);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 capitalize">
                    {address.type} Address
                  </p>
                  {address.company && (
                    <p className="font-medium">{address.company}</p>
                  )}
                  <p className="text-sm">{formatAddress(address)}</p>
                  {address.phone && (
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  )}
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefaultAddress(address.id, address.type);
                      }}
                      className="mt-2"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {editingAddress 
                ? 'Update your address information below.'
                : 'Add a new shipping or billing address to your account.'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {type === 'both' && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select address type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="shipping">Shipping Address</SelectItem>
                          <SelectItem value="billing">Billing Address</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stateProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="IT">Italy</SelectItem>
                          <SelectItem value="ES">Spain</SelectItem>
                          <SelectItem value="NL">Netherlands</SelectItem>
                          <SelectItem value="SE">Sweden</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Set as default address
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        Use this address as the default for this address type
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingAddress ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingAddress ? 'Update Address' : 'Add Address'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddressManager;
