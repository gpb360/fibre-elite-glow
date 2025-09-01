import { NextResponse } from 'next/server';
import { inventoryService } from '@/lib/inventory-service';
import { GlobalErrorHandler } from '@/lib/error-handler';
import { z } from 'zod';

// Validation schemas
const stockOperationSchema = z.object({
  packageId: z.string().uuid(),
  operation: z.enum(['add', 'subtract', 'set']),
  quantity: z.number().int().min(0),
});

const bulkUpdateSchema = z.object({
  operations: z.array(stockOperationSchema).min(1).max(50), // Limit bulk operations
});

export async function GET() {
  try {
    // Security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');

    const inventoryLevels = await inventoryService.getInventoryLevels();

    return NextResponse.json(
      {
        success: true,
        data: inventoryLevels,
        meta: {
          total: inventoryLevels.length,
          lowStockItems: inventoryLevels.filter(item => item.isLowStock).length,
        }
      },
      { headers }
    );
  } catch (error) {
    console.error('Error fetching inventory levels:', error);
    return GlobalErrorHandler.handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    // Security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');

    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405, headers }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400, headers }
      );
    }

    // Parse and validate request body
    let requestData;
    try {
      requestData = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers }
      );
    }

    // Validate against schema
    const validation = bulkUpdateSchema.safeParse(requestData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400, headers }
      );
    }

    const { operations } = validation.data;

    // Perform bulk stock update
    const result = await inventoryService.bulkUpdateStock(operations);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some operations failed',
          details: result.errors
        },
        { status: 400, headers }
      );
    }

    // Fetch updated inventory levels
    const updatedInventory = await inventoryService.getInventoryLevels();

    return NextResponse.json(
      {
        success: true,
        message: `Successfully updated ${operations.length} inventory operations`,
        data: updatedInventory,
        meta: {
          operationsProcessed: operations.length,
          errors: result.errors
        }
      },
      { headers }
    );
  } catch (error) {
    console.error('Error in inventory bulk update:', error);
    return GlobalErrorHandler.handleApiError(error);
  }
}