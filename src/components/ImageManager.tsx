
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ImageManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // Add upload logic here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name}
          </div>
        )}

        <Button onClick={handleUpload} disabled={!selectedFile}>
          Upload Image
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImageManager;
