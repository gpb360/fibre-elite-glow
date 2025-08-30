import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { GlobalErrorHandler, ErrorSanitizer } from '@/lib/error-handler'
import { emailSchema } from '@/lib/validation'

// Validation schema for confirm user request
const confirmUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format').min(1, 'User ID is required'),
  email: emailSchema,
});

export async function POST(request: NextRequest) {
  try {
    // Security headers
    const headers = new Headers();
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { 
          error: 'This endpoint is only available in development',
          code: 'ENVIRONMENT_RESTRICTION'
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    let requestBody: any;
    try {
      requestBody = await request.json();
    } catch (error) {
      console.error('Invalid JSON in confirm-user request:', error);
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: ErrorSanitizer.sanitizeMessage(error)
        },
        { status: 400 }
      );
    }

    // Comprehensive validation
    const validationResult = confirmUserSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Confirm user validation failed:', validationResult.error.errors);
      
      const errorMessages = validationResult.error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });
      
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errorMessages,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const { userId, email } = validationResult.data;

    // Environment variables validation
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing required Supabase environment variables');
      return NextResponse.json(
        {
          error: 'Server configuration error',
          code: 'CONFIGURATION_ERROR'
        },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (error) {
      console.error('Supabase error confirming user:', error);
      return NextResponse.json(
        {
          error: ErrorSanitizer.sanitizeMessage(error),
          code: 'SUPABASE_ERROR'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: {
        userId: data.user?.id,
        emailConfirmed: data.user?.email_confirmed_at ? true : false
      }
    });
    
  } catch (error) {
    console.error('Error in confirm-user endpoint:', error);
    return GlobalErrorHandler.handleApiError(error);
  }
}