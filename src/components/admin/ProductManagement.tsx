import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign,
  TrendingUp,
  Eye,
  Loader2,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import ImageManager from "../ImageManager";

type Package = Database['public']['Tables']['packages']['Row'];

const productSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  productType: z.string().min(2, "Product type is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  savings: z.number().optional(),
  isPopular: z.boolean().default(false),
});

export function ProductManagement() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Package | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Package | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPopular, setFilterPopular] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Package | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      productType: "",
      price: 0,
      originalPrice: 0,
      quantity: 1,
      savings: 0,
      isPopular: false,
    },
  });

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error loading products",
        description: error.message || "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDialog = (product?: Package) => {
    if (product) {
      setEditingProduct(product);
      form.reset({
        productName: product.product_name,
        productType: product.product_type,
        price: product.price,
        originalPrice: product.original_price || 0,
        quantity: product.quantity,
        savings: product.savings || 0,
        isPopular: product.is_popular || false,
      });
    } else {
      setEditingProduct(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsSubmitting(true);

    try {
      const productData = {
        product_name: values.productName,
        product_type: values.productType,
        price: values.price,
        original_price: values.originalPrice || null,
        quantity: values.quantity,
        savings: values.savings || null,
        is_popular: values.isPopular,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('packages')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Product updated",
          description: "Product has been successfully updated.",
        });
      } else {
        const { error } = await supabase
          .from('packages')
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Product created",
          description: "New product has been successfully created.",
        });
      }

      await fetchProducts();
      closeDialog();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error saving product",
        description: error.message || "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirmation = (product: Package) => {
    setProductToDelete(product);
    setIsDeleteConfirmationOpen(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', productToDelete.id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });

      await fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        description: error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteConfirmationOpen(false);
      setProductToDelete(null);
    }
  };

  const openImageManager = (product: Package) => {
    setSelectedProduct(product);
    setIsImageDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterPopular || product.is_popular;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading products...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="popular"
                checked={filterPopular}
                onCheckedChange={(checked) => setFilterPopular(checked === true)}
              />
              <label htmlFor="popular" className="text-sm font-medium">
                Popular only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm || filterPopular 
                ? "No products match your current filters." 
                : "Create your first product to get started."
              }
            </p>
            {!searchTerm && !filterPopular && (
              <Button onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{product.product_type}</p>
                  </div>
                  {product.is_popular && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(product.price)}
                    </p>
                    {product.original_price && product.original_price > product.price && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.original_price)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium">{product.quantity}</p>
                  </div>
                </div>

                {product.savings && (
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">
                      Save {formatCurrency(product.savings)}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openImageManager(product)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Images
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteConfirmation(product)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update the product information below.'
                : 'Create a new product for your catalog.'
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Fibre Elite Glow Essential" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Gut Health Supplement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="29.99"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="39.99"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="savings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Savings ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="10.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPopular"
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
                        Mark as Popular Product
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        Popular products are highlighted in the catalog
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
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Image Management Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Images - {selectedProduct?.product_name}
            </DialogTitle>
            <DialogDescription>
              Upload and manage product images for this product.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <ImageManager packageId={selectedProduct.id} isAdmin={true} />
          )}

          <DialogFooter>
            <Button onClick={() => setIsImageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductManagement;
