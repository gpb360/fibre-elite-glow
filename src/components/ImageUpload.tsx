import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { StorageService } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ProductImage = Database['public']['Tables']['product_images']['Row'];

interface ImageUploadProps {
  packageId: string;
  onImagesUploaded?: (images: ProductImage[]) => void;
  maxImages?: number;
  existingImages?: ProductImage[];
}

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  id: string;
}

export function ImageUpload({ 
  packageId, 
  onImagesUploaded, 
  maxImages = 10,
  existingImages = []
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const totalImages = existingImages.length + uploadingFiles.length + fileArray.length;

    if (totalImages > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed. You can upload ${maxImages - existingImages.length - uploadingFiles.length} more.`,
        variant: "destructive",
      });
      return;
    }

    // Validate files
    const validFiles = fileArray.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format.`,
          variant: "destructive",
        });
        return false;
      }

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Create uploading file objects
    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading',
      id: Math.random().toString(36).substring(2, 15),
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Start uploads
    newUploadingFiles.forEach(uploadingFile => {
      uploadFile(uploadingFile);
    });
  }, [packageId, maxImages, existingImages.length, uploadingFiles.length]);

  const uploadFile = async (uploadingFile: UploadingFile) => {
    try {
      // Compress image before upload
      const compressedFile = await StorageService.compressImage(uploadingFile.file);
      
      // Generate unique file path
      const filePath = StorageService.generateFilePath(packageId, uploadingFile.file.name);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 200);

      // Upload to Supabase Storage
      const uploadResult = await StorageService.uploadFile(compressedFile, filePath);

      clearInterval(progressInterval);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Save to database
      const { data: imageData, error: dbError } = await supabase
        .from('product_images')
        .insert({
          package_id: packageId,
          image_url: uploadResult.url!,
          alt_text: uploadingFile.file.name.split('.')[0],
          sort_order: existingImages.length + uploadingFiles.filter(f => f.status === 'success').length,
          is_primary: existingImages.length === 0 && uploadingFiles.filter(f => f.status === 'success').length === 0,
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Update status to success
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === uploadingFile.id 
            ? { ...f, progress: 100, status: 'success' }
            : f
        )
      );

      // Notify parent component
      if (onImagesUploaded) {
        const allImages = [...existingImages, imageData];
        onImagesUploaded(allImages);
      }

      toast({
        title: "Image uploaded",
        description: "Image has been successfully uploaded.",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === uploadingFile.id 
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );

      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const canUploadMore = existingImages.length + uploadingFiles.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Product Images
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-500 text-center">
              Supports JPEG, PNG, WebP, and GIF up to 5MB each
              <br />
              Maximum {maxImages} images ({maxImages - existingImages.length - uploadingFiles.length} remaining)
            </p>
            <Button variant="outline" className="mt-4">
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Images
            </Button>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploading Images</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {uploadingFiles.map((uploadingFile) => (
              <Card key={uploadingFile.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={uploadingFile.preview}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeUploadingFile(uploadingFile.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  
                  {/* Status Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    {uploadingFile.status === 'uploading' && (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    )}
                    {uploadingFile.status === 'success' && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                    {uploadingFile.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {uploadingFile.file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(uploadingFile.file.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                    
                    {uploadingFile.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={uploadingFile.progress} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {uploadingFile.progress}% uploaded
                        </p>
                      </div>
                    )}
                    
                    {uploadingFile.status === 'success' && (
                      <p className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Upload complete
                      </p>
                    )}
                    
                    {uploadingFile.status === 'error' && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {uploadingFile.error || 'Upload failed'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images Preview */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Current Images</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {existingImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Product image'}
                    className="w-full h-32 object-cover"
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Primary
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">
                    {image.alt_text || 'Product image'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Sort order: {image.sort_order}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {(existingImages.length > 0 || uploadingFiles.length > 0) && (
        <div className="text-sm text-gray-600">
          {existingImages.length} existing images, {uploadingFiles.filter(f => f.status === 'success').length} uploaded, {uploadingFiles.filter(f => f.status === 'uploading').length} uploading
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
