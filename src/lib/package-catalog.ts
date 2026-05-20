export type ProductPackage = {
  id: string;
  productName: string;
  productType: 'total_essential' | 'total_essential_plus';
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
  packageSize: string;
};

export const PRODUCT_PACKAGES: ProductPackage[] = [
  {
    id: 'total-essential-1-box',
    productName: 'Total Essential - 1 Box',
    productType: 'total_essential',
    price: 79.99,
    originalPrice: 89.99,
    savings: 10,
    image: '/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp',
    packageSize: '1 box (15 sachets)',
  },
  {
    id: 'total-essential-2-boxes',
    productName: 'Total Essential - 2 Boxes',
    productType: 'total_essential',
    price: 149.99,
    originalPrice: 179.98,
    savings: 29.99,
    image: '/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp',
    packageSize: '2 boxes (30 sachets)',
  },
  {
    id: 'total-essential-4-boxes',
    productName: 'Total Essential - 4 Boxes',
    productType: 'total_essential',
    price: 279.99,
    originalPrice: 359.96,
    savings: 79.97,
    image: '/lovable-uploads/webp/total-essential-fiber-supplement-bottle.webp',
    packageSize: '4 boxes (60 sachets)',
  },
  {
    id: 'total-essential-plus-1-box',
    productName: 'Total Essential Plus - 1 Box',
    productType: 'total_essential_plus',
    price: 84.99,
    originalPrice: 94.99,
    savings: 10,
    image: '/lovable-uploads/webp/total-essential-plus-fiber-superfruits-bottle.webp',
    packageSize: '1 box (15 sachets)',
  },
  {
    id: 'total-essential-plus-2-boxes',
    productName: 'Total Essential Plus - 2 Boxes',
    productType: 'total_essential_plus',
    price: 159.99,
    originalPrice: 189.98,
    savings: 29.99,
    image: '/lovable-uploads/webp/total-essential-plus-fiber-superfruits-bottle.webp',
    packageSize: '2 boxes (30 sachets)',
  },
  {
    id: 'total-essential-plus-4-boxes',
    productName: 'Total Essential Plus - 4 Boxes',
    productType: 'total_essential_plus',
    price: 299.99,
    originalPrice: 379.96,
    savings: 79.97,
    image: '/lovable-uploads/webp/total-essential-plus-fiber-superfruits-bottle.webp',
    packageSize: '4 boxes (60 sachets)',
  },
];

export function getProductPackage(id: string): ProductPackage | undefined {
  return PRODUCT_PACKAGES.find((item) => item.id === id);
}
