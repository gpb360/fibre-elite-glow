import { AuthSetupFixed } from '@/components/dev/AuthSetupFixed'
import { AuthTesterFixed } from '@/components/dev/AuthTesterFixed'

export default function AuthSetupFixedPage() {
  if (process.env.NODE_ENV !== 'development') {
    return <div>This page is only available in development mode.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Development Tools (Enhanced)</h1>
      
      <div className="space-y-8">
        <AuthSetupFixed />
        <AuthTesterFixed />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">🚀 Quick Fix for Authentication Error</h2>
        <p className="text-sm text-gray-700 mb-3">
          If you're seeing "Invalid login credentials" errors, follow these steps:
        </p>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Click "Test Supabase Connection" above to verify connectivity</li>
          <li>Click "Create Test Users" to set up test accounts in the database</li>
          <li>Click "Test Authentication" to verify the fix worked</li>
          <li>Use the provided test credentials in your sign-in forms</li>
        </ol>
        <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
          <p className="text-sm font-medium text-green-800">✅ Test Credentials Ready to Use:</p>
          <p className="text-sm text-green-700">Email: test@fibreeliteglow.com</p>
          <p className="text-sm text-green-700">Password: TestPassword123!</p>
        </div>
      </div>
    </div>
  )
}
