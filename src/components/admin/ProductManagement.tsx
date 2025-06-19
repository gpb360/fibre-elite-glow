
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const ProductManagement: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [productName, setProductName] = useState('');

  const handleActiveChange = (checked: boolean | 'indeterminate') => {
    setIsActive(checked === true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={handleActiveChange}
          />
          <Label htmlFor="isActive">Product is active</Label>
        </div>

        <Button>Save Product</Button>
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
