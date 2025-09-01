// Inventory management service for stock tracking and order processing
import { supabaseAdmin } from '@/integrations/supabase/client';
import { OrderItem } from '@/types/order';

interface InventoryLevel {
  packageId: string;
  productName: string;
  productType: 'total_essential' | 'total_essential_plus';
  currentStock: number;
  isLowStock: boolean;
}

interface StockOperation {
  packageId: string;
  operation: 'add' | 'subtract' | 'set';
  quantity: number;
}

export class InventoryService {
  private static instance: InventoryService;
  private readonly LOW_STOCK_THRESHOLD = 5;

  private constructor() {}

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  async updateInventoryForOrder(orderItems: OrderItem[]): Promise<boolean> {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available for inventory update');
      return false;
    }

    try {
      for (const item of orderItems) {
        // Find package by name and product type
        const { data: packageData, error: findError } = await supabaseAdmin
          .from('packages')
          .select('id, stock_quantity, product_name')
          .eq('product_name', item.name)
          .eq('product_type', item.product_type || 'total_essential')
          .single();

        if (findError || !packageData) {
          console.warn(`Package not found for item: ${item.name} (${item.product_type})`);
          continue;
        }

        // Calculate new stock quantity
        const newStockQuantity = packageData.stock_quantity - item.quantity;

        // Update stock quantity
        const { error: updateError } = await supabaseAdmin
          .from('packages')
          .update({ 
            stock_quantity: Math.max(0, newStockQuantity),
            updated_at: new Date().toISOString()
          })
          .eq('id', packageData.id);

        if (updateError) {
          console.error(`Error updating inventory for ${item.name}:`, updateError);
          continue;
        }

        // Log inventory change
        console.log(`📦 Inventory Updated: ${item.name} - Reduced by ${item.quantity} (New stock: ${Math.max(0, newStockQuantity)})`);

        // Warning for low stock
        if (newStockQuantity <= this.LOW_STOCK_THRESHOLD) {
          console.warn(`⚠️  LOW STOCK WARNING: ${item.name} has ${Math.max(0, newStockQuantity)} units remaining`);
        }

        // Critical warning for out of stock
        if (newStockQuantity <= 0) {
          console.error(`🚨 OUT OF STOCK: ${item.name} is now out of stock!`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating inventory for order:', error);
      return false;
    }
  }

  async checkStockAvailability(orderItems: OrderItem[]): Promise<{ available: boolean; issues: string[] }> {
    if (!supabaseAdmin) {
      return { available: false, issues: ['Database unavailable'] };
    }

    const issues: string[] = [];

    try {
      for (const item of orderItems) {
        // Find package by name and product type
        const { data: packageData, error: findError } = await supabaseAdmin
          .from('packages')
          .select('id, stock_quantity, product_name, product_type')
          .eq('product_name', item.name)
          .eq('product_type', item.product_type || 'total_essential')
          .single();

        if (findError || !packageData) {
          issues.push(`Product "${item.name}" not found in inventory`);
          continue;
        }

        // Check if sufficient stock is available
        if (packageData.stock_quantity < item.quantity) {
          issues.push(`Insufficient stock for "${item.name}": ${item.quantity} requested, ${packageData.stock_quantity} available`);
        }
      }

      return {
        available: issues.length === 0,
        issues
      };
    } catch (error) {
      console.error('Error checking stock availability:', error);
      return { available: false, issues: ['Error checking inventory'] };
    }
  }

  async getInventoryLevels(): Promise<InventoryLevel[]> {
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available for inventory retrieval');
      return [];
    }

    try {
      const { data: packages, error } = await supabaseAdmin
        .from('packages')
        .select('id, product_name, product_type, stock_quantity')
        .eq('is_active', true)
        .order('product_name');

      if (error) {
        console.error('Error fetching inventory levels:', error);
        return [];
      }

      return packages.map(pkg => ({
        packageId: pkg.id,
        productName: pkg.product_name,
        productType: pkg.product_type as 'total_essential' | 'total_essential_plus',
        currentStock: pkg.stock_quantity,
        isLowStock: pkg.stock_quantity <= this.LOW_STOCK_THRESHOLD
      }));
    } catch (error) {
      console.error('Error getting inventory levels:', error);
      return [];
    }
  }

  async bulkUpdateStock(operations: StockOperation[]): Promise<{ success: boolean; errors: string[] }> {
    if (!supabaseAdmin) {
      return { success: false, errors: ['Database unavailable'] };
    }

    const errors: string[] = [];

    try {
      for (const operation of operations) {
        // Get current stock quantity
        const { data: packageData, error: findError } = await supabaseAdmin
          .from('packages')
          .select('id, stock_quantity, product_name')
          .eq('id', operation.packageId)
          .single();

        if (findError || !packageData) {
          errors.push(`Package not found: ${operation.packageId}`);
          continue;
        }

        // Calculate new stock quantity based on operation
        let newStockQuantity: number;
        switch (operation.operation) {
          case 'add':
            newStockQuantity = packageData.stock_quantity + operation.quantity;
            break;
          case 'subtract':
            newStockQuantity = Math.max(0, packageData.stock_quantity - operation.quantity);
            break;
          case 'set':
            newStockQuantity = Math.max(0, operation.quantity);
            break;
          default:
            errors.push(`Invalid operation: ${operation.operation}`);
            continue;
        }

        // Update stock quantity
        const { error: updateError } = await supabaseAdmin
          .from('packages')
          .update({ 
            stock_quantity: newStockQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', operation.packageId);

        if (updateError) {
          errors.push(`Error updating ${packageData.product_name}: ${updateError.message}`);
          continue;
        }

        // Log inventory change
        console.log(`📦 Inventory Updated: ${packageData.product_name} - ${operation.operation} ${operation.quantity} (New stock: ${newStockQuantity})`);

        // Warning for low stock
        if (newStockQuantity <= this.LOW_STOCK_THRESHOLD) {
          console.warn(`⚠️  LOW STOCK WARNING: ${packageData.product_name} has ${newStockQuantity} units remaining`);
        }
      }

      return {
        success: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Error in bulk stock update:', error);
      return { success: false, errors: ['Unexpected error during bulk update'] };
    }
  }
}

export const inventoryService = InventoryService.getInstance();