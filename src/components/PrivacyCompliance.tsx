import React, { useState } from 'react';
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Download, 
  Trash2, 
  Shield, 
  FileText, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  Eye,
  Lock
} from "lucide-react";

export function PrivacyCompliance() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [exportedData, setExportedData] = useState<any>(null);

  const handleDataExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      // Fetch all user data
      const [profileData, addressesData, ordersData] = await Promise.all([
        supabase.from('customer_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('addresses').select('*').eq('user_id', user.id),
        supabase.from('orders').select(`
          *,
          order_items (
            *,
            packages (*)
          )
        `).eq('user_id', user.id)
      ]);

      const userData = {
        user_info: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        profile: profileData.data,
        addresses: addressesData.data || [],
        orders: ordersData.data || [],
        export_date: new Date().toISOString(),
        export_type: 'GDPR_Data_Export'
      };

      setExportedData(userData);
      setShowDataDialog(true);

      toast({
        title: "Data export ready",
        description: "Your personal data has been compiled and is ready for download.",
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error.message || "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadData = () => {
    if (!exportedData) return;

    const dataStr = JSON.stringify(exportedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fibre-elite-glow-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download started",
      description: "Your data export file is being downloaded.",
    });
  };

  const handleAccountDeletion = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Delete user data in order (due to foreign key constraints)
      await Promise.all([
        supabase.from('order_items').delete().in('order_id', 
          (await supabase.from('orders').select('id').eq('user_id', user.id)).data?.map(o => o.id) || []
        ),
        supabase.from('addresses').delete().eq('user_id', user.id),
        supabase.from('customer_profiles').delete().eq('user_id', user.id),
      ]);

      await supabase.from('orders').delete().eq('user_id', user.id);

      // Note: In production, you'd typically mark the account for deletion
      // rather than immediately deleting the auth user, as this requires admin privileges
      toast({
        title: "Account deletion requested",
        description: "Your account deletion request has been submitted. You will receive confirmation within 24 hours.",
      });

      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error('Deletion error:', error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to process deletion request. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-gray-500">Please sign in to access privacy settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Privacy & Data Protection</h2>
          <p className="text-gray-600">Manage your personal data and privacy settings</p>
        </div>
      </div>

      {/* GDPR Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Your Data Rights</span>
          </CardTitle>
          <CardDescription>
            Under GDPR and other privacy laws, you have the following rights regarding your personal data:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Right to Access
              </h4>
              <p className="text-sm text-gray-600">
                You can request a copy of all personal data we hold about you.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Right to Rectification
              </h4>
              <p className="text-sm text-gray-600">
                You can update or correct your personal information at any time.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                Right to Erasure
              </h4>
              <p className="text-sm text-gray-600">
                You can request deletion of your personal data under certain conditions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Right to Portability
              </h4>
              <p className="text-sm text-gray-600">
                You can export your data in a machine-readable format.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Your Data</CardTitle>
          <CardDescription>
            Download a complete copy of all your personal data stored in our system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What's included in your export:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Profile information and preferences</li>
              <li>• Shipping and billing addresses</li>
              <li>• Order history and purchase details</li>
              <li>• Account settings and communication preferences</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleDataExport} 
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export My Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Delete Your Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-2">Before you delete your account:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• All your personal data will be permanently deleted</li>
                  <li>• Your order history will be removed</li>
                  <li>• You will lose access to any active subscriptions</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete My Account
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Policy & Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Information</CardTitle>
          <CardDescription>
            Learn more about how we protect and use your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              View Privacy Policy
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Contact Data Protection Officer
            </Button>
          </div>
          
          <Separator />
          
          <div className="text-sm text-gray-600">
            <p>
              If you have any questions about your privacy rights or how we handle your data, 
              please contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@fibreeliteglow.com" className="text-green-600 hover:underline">
                privacy@fibreeliteglow.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Export Dialog */}
      <Dialog open={showDataDialog} onOpenChange={setShowDataDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Your Data Export is Ready</DialogTitle>
            <DialogDescription>
              We've compiled all your personal data. You can download it as a JSON file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Export Complete</h4>
                  <p className="text-sm text-green-800">
                    Your data has been successfully compiled and is ready for download.
                  </p>
                </div>
              </div>
            </div>
            
            {exportedData && (
              <div className="text-sm text-gray-600">
                <p><strong>Export includes:</strong></p>
                <ul className="mt-2 space-y-1">
                  <li>• Profile data: {exportedData.profile ? 'Included' : 'None'}</li>
                  <li>• Addresses: {exportedData.addresses?.length || 0} records</li>
                  <li>• Orders: {exportedData.orders?.length || 0} records</li>
                  <li>• Export date: {new Date(exportedData.export_date).toLocaleString()}</li>
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDataDialog(false)}>
              Close
            </Button>
            <Button onClick={downloadData}>
              <Download className="mr-2 h-4 w-4" />
              Download Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Deletion Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-700">Delete Your Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-2">This will delete:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Your profile and personal information</li>
                    <li>• All saved addresses</li>
                    <li>• Complete order history</li>
                    <li>• Account preferences and settings</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Are you absolutely sure you want to delete your account? This action is permanent and cannot be reversed.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleAccountDeletion}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PrivacyCompliance;
