
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package } from '@/hooks/usePackages';

interface PackageSelectorProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  variant?: 'green' | 'purple';
}

export function PackageSelector({ 
  packages, 
  selectedPackage, 
  onSelectPackage,
  variant = 'green' 
}: PackageSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Choose Your Package</h3>
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            className={cn(
              "relative border-2 rounded-lg p-4 cursor-pointer transition-all",
              selectedPackage?.id === pkg.id
                ? variant === 'green' 
                  ? "border-green-500 bg-green-50" 
                  : "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300",
              pkg.is_popular && "ring-2 ring-offset-2",
              pkg.is_popular && variant === 'green' && "ring-green-400",
              pkg.is_popular && variant === 'purple' && "ring-purple-400"
            )}
            onClick={() => onSelectPackage(pkg)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {pkg.is_popular && (
              <div className={cn(
                "absolute -top-3 left-4 px-3 py-1 text-xs font-medium text-white rounded-full",
                variant === 'green' ? "bg-green-500" : "bg-purple-500"
              )}>
                Most Popular
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-lg">
                      {pkg.quantity} Box{pkg.quantity > 1 ? 'es' : ''}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {pkg.quantity * 15} sachets total
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ${pkg.price}
                    </div>
                    {pkg.savings && pkg.savings > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        ${pkg.original_price}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    ${(pkg.price / pkg.quantity).toFixed(2)} per box
                  </div>
                  {pkg.savings && pkg.savings > 0 && (
                    <div className={cn(
                      "text-sm font-medium",
                      variant === 'green' ? "text-green-600" : "text-purple-600"
                    )}>
                      Save ${pkg.savings}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPackage?.id === pkg.id
                    ? variant === 'green'
                      ? "border-green-500 bg-green-500"
                      : "border-purple-500 bg-purple-500"
                    : "border-gray-300"
                )}>
                  {selectedPackage?.id === pkg.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
