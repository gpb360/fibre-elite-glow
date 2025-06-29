
"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuthErrorHandler, useAuthPrerequisites } from "@/hooks/use-auth-error-handler";
import { supabase } from "@/integrations/supabase/client";
import { authDebugger } from "@/utils/auth-debug";
import { Loader2, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
}

export function SignIn({ isOpen, onClose, onSwitchToSignUp }: SignInProps) {
  const { toast } = useToast();
  const { errorState, handleAuthError, handleAuthSuccess, clearError, retryLastAction } = useAuthErrorHandler();
  const { validateCredentials } = useAuthPrerequisites();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Clear any previous errors
    clearError();

    // Validate credentials before attempting sign in
    const validation = validateCredentials(values.email, values.password);
    if (!validation.isValid) {
      handleAuthError(
        new Error(validation.errors.join(', ')),
        'Sign In',
        values.email,
        () => onSubmit(values)
      );
      return;
    }

    setIsLoading(true);

    try {
      // Test connection first in development
      if (process.env.NODE_ENV === 'development') {
        const connectionOk = await authDebugger.testConnection();
        if (!connectionOk) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection.');
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if user has a customer profile, create one if not
        const { data: profile, error: profileError } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { error: createError } = await supabase
            .from('customer_profiles')
            .insert({
              user_id: data.user.id,
              first_name: data.user.user_metadata?.first_name || '',
              last_name: data.user.user_metadata?.last_name || '',
              phone: data.user.user_metadata?.phone || '',
              marketing_consent: data.user.user_metadata?.marketing_consent || false,
              newsletter_subscription: data.user.user_metadata?.newsletter_subscription || false,
            });

          if (createError) {
            console.error('Profile creation error:', createError);
          }
        }

        handleAuthSuccess('Sign In', values.email, {
          userId: data.user.id,
          hasProfile: !profileError,
        });

        onClose();
        form.reset();
      }
    } catch (error: any) {
      handleAuthError(error, 'Sign In', values.email, () => onSubmit(values));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    const email = form.getValues('email');

    if (!email) {
      handleAuthError(
        new Error('Please enter your email address first.'),
        'Password Reset',
        undefined,
        handleForgotPassword
      );
      return;
    }

    setIsLoading(true);

    try {
      // Check if email exists first (in development)
      if (process.env.NODE_ENV === 'development') {
        setIsCheckingEmail(true);
        const emailExists = await authDebugger.checkEmailExists(email);
        setIsCheckingEmail(false);

        if (!emailExists) {
          throw new Error('No account found with this email address. Please check your email or sign up for a new account.');
        }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `/reset-password`,
      });

      if (error) {
        throw error;
      }

      setResetEmailSent(true);
      handleAuthSuccess('Password Reset', email);
    } catch (error: any) {
      handleAuthError(error, 'Password Reset', email, handleForgotPassword);
    } finally {
      setIsLoading(false);
      setIsCheckingEmail(false);
    }
  }

  const handleClose = () => {
    onClose();
    form.reset();
    setShowForgotPassword(false);
    setResetEmailSent(false);
    clearError();
  };

  if (resetEmailSent) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Check Your Email</DialogTitle>
            <DialogDescription>
              We've sent password reset instructions to your email address.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-center text-sm text-gray-600">
              Follow the link in the email to reset your password.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} variant="outline" className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Display */}
            {errorState.hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">{errorState.message}</p>
                    {errorState.suggestions.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Suggestions:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {errorState.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {errorState.canRetry && errorState.retryAction && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={retryLastAction}
                        className="mt-2"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (errorState.hasError) clearError();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errorState.hasError) clearError();
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-green-500"
                onClick={handleForgotPassword}
                disabled={isLoading || isCheckingEmail}
              >
                {isCheckingEmail ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Checking email...
                  </>
                ) : (
                  "Forgot password?"
                )}
              </Button>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                variant="premium"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </DialogFooter>

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-green-500"
                onClick={onSwitchToSignUp}
                type="button"
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SignIn;
