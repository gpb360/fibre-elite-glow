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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StorageService } from "@/lib/storage";
import { 
  MoreVertical, 
  Star, 
  Edit, 
  Trash2, 
  Download, 
  Eye,
  ArrowUp,
  ArrowDown,
  Loader2,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import ImageUpload from "./ImageUpload";

type ProductImage = Database['public']['Tables']['product_images']['Row'];

interface ImageManagerProps {
  packageId: string;
  isAdmin?: boolean;
}

export function ImageManager({ packageId, isAdmin = false }: ImageManagerProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editAltText, setEditAltText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('package_id', packageId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      setImages(data || []);
    } catch (error: any) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error loading images",
        description: error.message || "Failed to load images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [packageId]);

  const handleSetPrimary = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) {
        throw error;
      }

      await fetchImages();
      toast({
        title: "Primary image updated",
        description: "This image is now the primary product image.",
      });
    } catch (error: any) {
      console.error('Error setting primary image:', error);
      toast({
        title: "Error updating primary image",
        description: error.message || "Failed to update primary image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMoveImage = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    try {
      const currentImage = images[currentIndex];
      const swapImage = images[newIndex];

      // Swap sort orders
      await Promise.all([
        supabase
          .from('product_images')
          .update({ sort_order: swapImage.sort_order })
          .eq('id', currentImage.id),
        supabase
          .from('product_images')
          .update({ sort_order: currentImage.sort_order })
          .eq('id', swapImage.id)
      ]);

      await fetchImages();
      toast({
        title: "Image order updated",
        description: "Image position has been changed.",
      });
    } catch (error: any) {
      console.error('Error moving image:', error);
      toast({
        title: "Error updating image order",
        description: error.message || "Failed to update image order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditImage = (image: ProductImage) => {
    setSelectedImage(image);
    setEditAltText(image.alt_text || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedImage) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('product_images')
        .update({ alt_text: editAltText })
        .eq('id', selectedImage.id);

      if (error) {
        throw error;
      }

      await fetchImages();
      setIsEditDialogOpen(false);
      toast({
        title: "Image updated",
        description: "Image details have been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating image:', error);
      toast({
        title: "Error updating image",
        description: error.message || "Failed to update image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = (image: ProductImage) => {
    setSelectedImage(image);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedImage) return;

    setIsSubmitting(true);
    try {
      // Extract file path from URL
      const url = new URL(selectedImage.image_url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-2).join('/'); // Get last two parts (folder/filename)

      // Delete from storage
      await StorageService.deleteFile(filePath);

      // Delete from database
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', selectedImage.id);

      if (error) {
        throw error;
      }

      await fetchImages();
      setIsDeleteDialogOpen(false);
      toast({
        title: "Image deleted",
        description: "Image has been permanently deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error deleting image",
        description: error.message || "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewImage = (image: ProductImage) => {
    setSelectedImage(image);
    setIsViewDialogOpen(true);
  };

  const handleDownloadImage = async (image: ProductImage) => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.alt_text || 'product-image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading images...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Images</h2>
          <p className="text-gray-600">Manage product images and their display order</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowUpload(!showUpload)}>
            <Upload className="w-4 h-4 mr-2" />
            {showUpload ? 'Hide Upload' : 'Add Images'}
          </Button>
        )}
      </div>

      {/* Upload Section */}
      {isAdmin && showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              packageId={packageId}
              existingImages={images}
              onImagesUploaded={(newImages) => {
                setImages(newImages);
                setShowUpload(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-500 text-center mb-4">
              {isAdmin 
                ? "Upload some images to get started." 
                : "No product images available yet."
              }
            </p>
            {isAdmin && (
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Product image'}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => handleViewImage(image)}
                />
                
                {/* Primary Badge */}
                {image.is_primary && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Primary
                  </Badge>
                )}

                {/* Actions Menu */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewImage(image)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditImage(image)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!image.is_primary && (
                          <DropdownMenuItem onClick={() => handleSetPrimary(image.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            Set as Primary
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDownloadImage(image)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteImage(image)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Sort Controls */}
                {isAdmin && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleMoveImage(image.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleMoveImage(image.id, 'down')}
                      disabled={index === images.length - 1}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">
                  {image.alt_text || 'Untitled'}
                </p>
                <p className="text-xs text-gray-500">
                  Position: {image.sort_order + 1}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>
              Update the image details below.
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div>
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text || 'Product image'}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Alt Text</label>
                <Input
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="Describe this image..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage && (
            <div className="py-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || 'Product image'}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Image'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedImage?.alt_text || 'Product Image'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || 'Product image'}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Position:</span> {selectedImage.sort_order + 1}
                </div>
                <div>
                  <span className="font-medium">Primary:</span> {selectedImage.is_primary ? 'Yes' : 'No'}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Alt Text:</span> {selectedImage.alt_text || 'None'}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageManager;
