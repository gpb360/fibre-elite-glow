# 🔐 Authentication Troubleshooting Guide

## Overview

This guide helps you troubleshoot and resolve authentication issues in the Fibre Elite Glow Next.js application using Supabase Auth.

## Common Issues and Solutions

### 1. "Invalid login credentials" Error

**Symptoms:**
- Users get "AuthApiError: Invalid login credentials" when trying to sign in
- Error occurs even with correct email/password combinations

**Root Causes:**
- No users exist in the database
- Email/password mismatch
- User account not confirmed
- Typos in email address

**Solutions:**

#### A. Check if Users Exist
```typescript
// In browser console (development only)
await window.authDebugger.checkEmailExists('user@example.com')
```

#### B. Create Test Users
```typescript
// In browser console (development only)
await window.setupTestEnvironment()

// Or create a specific user
await window.createTestUser({
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
})
```

#### C. Use Pre-configured Test Credentials
```typescript
// Available test accounts (after running setupTestEnvironment)
const credentials = window.testCredentials
// Use: test@fibreeliteglow.com / TestPassword123!
```

### 2. Network Connection Issues

**Symptoms:**
- "Unable to connect to authentication service"
- Timeout errors
- Network-related error messages

**Solutions:**

#### A. Test Connection
```typescript
// In browser console
await window.authDebugger.testConnection()
```

#### B. Check Environment Variables
Verify your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://lyynavswxtzhsmwetgtn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### C. Verify Supabase Project Status
- Check if your Supabase project is active
- Ensure you're not hitting rate limits

### 3. Email Confirmation Issues

**Symptoms:**
- Users can sign up but can't sign in
- "Email not confirmed" errors

**Solutions:**

#### A. Check Email Confirmation Status
```sql
-- In Supabase SQL Editor
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'user@example.com';
```

#### B. Manually Confirm Email (Development)
```sql
-- In Supabase SQL Editor (DEVELOPMENT ONLY)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'user@example.com';
```

### 4. Rate Limiting Issues

**Symptoms:**
- "Too many requests" errors
- Temporary sign-in blocks

**Solutions:**

#### A. Wait and Retry
- Wait 5-10 minutes before attempting again
- Use the retry functionality in the enhanced SignIn component

#### B. Check Rate Limits (Admin)
```sql
-- Check current rate limit settings
SELECT * FROM auth.config WHERE parameter LIKE '%rate_limit%';
```

## Development Tools

### 1. Authentication Debugger

Access the auth debugger in browser console (development only):

```typescript
// Test connection
authDebugger.testConnection()

// Check if email exists
authDebugger.checkEmailExists('user@example.com')

// View debug logs
authDebugger.getLogs()

// Generate debug report
authDebugger.generateReport()

// Clear logs
authDebugger.clearLogs()
```

### 2. AuthTester Component

Add to your development pages:

```tsx
import { AuthTester } from '@/components/dev/AuthTester'

// In your development page
{process.env.NODE_ENV === 'development' && <AuthTester />}
```

### 3. Enhanced Error Handling

The improved SignIn component now provides:
- Detailed error messages with suggestions
- Retry functionality for failed attempts
- Visual feedback for different error types
- Password visibility toggle
- Email existence checking

## Testing Authentication Flow

### 1. Manual Testing Steps

1. **Test Sign Up:**
   ```
   Email: test-new@example.com
   Password: TestPassword123!
   ```

2. **Test Sign In:**
   ```
   Email: test@fibreeliteglow.com
   Password: TestPassword123!
   ```

3. **Test Invalid Credentials:**
   ```
   Email: nonexistent@example.com
   Password: wrongpassword
   ```

4. **Test Password Reset:**
   ```
   Email: test@fibreeliteglow.com
   ```

### 2. Automated Testing

Use the AuthTester component to run comprehensive tests:
- Connection testing
- Sign up flow
- Sign in flow
- Invalid credentials handling
- Password reset functionality

## Environment Setup

### 1. Development Environment

Ensure your `.env.local` file is properly configured:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lyynavswxtzhsmwetgtn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Supabase Project Configuration

Verify your Supabase project settings:
- Project is active and healthy
- Email authentication is enabled
- Site URL is set to your development URL
- Email templates are configured

## Debugging Checklist

When encountering authentication issues:

- [ ] Check if Supabase project is active
- [ ] Verify environment variables are set correctly
- [ ] Test network connection to Supabase
- [ ] Check if users exist in the database
- [ ] Verify email confirmation status
- [ ] Test with known good credentials
- [ ] Check browser console for detailed errors
- [ ] Use AuthTester component for comprehensive testing
- [ ] Generate and review debug report

## Support and Resources

### Development Tools
- Browser console auth debugger
- AuthTester component
- Test user creation utilities
- Comprehensive error handling

### Supabase Resources
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Auth API Reference](https://supabase.com/docs/reference/javascript/auth-api)

### Project-Specific
- Check `src/utils/auth-debug.ts` for debugging utilities
- Review `src/hooks/use-auth-error-handler.ts` for error handling
- Use `src/utils/create-test-user.ts` for test user management
