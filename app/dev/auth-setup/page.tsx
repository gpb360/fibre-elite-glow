import { AuthSetup } from '@/components/dev/AuthSetup'
import { AuthTester } from '@/components/dev/AuthTester'

export default function AuthSetupPage() {
  if (process.env.NODE_ENV !== 'development') {
    return <div>This page is only available in development mode.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Development Tools</h1>
      
      <div className="space-y-8">
        <AuthSetup />
        <AuthTester />
      </div>
    </div>
  )
}
