'use client'

import { useClassDebug } from '@/hooks/use-class-debug'
import { ClassInspector, DebugDiv } from '@/components/dev/ClassInspector'

/**
 * Example component demonstrating different debugging approaches
 * Only visible in development mode
 */
export function DebuggingExample() {
  const heroRef = useClassDebug(
    'bg-gradient-to-b from-green-50 to-white py-16 md:py-24',
    'hero-section'
  )

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Tailwind Debugging Examples</h2>
      
      {/* Method 1: Using useClassDebug hook */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Method 1: useClassDebug Hook</h3>
        <div 
          ref={heroRef}
          className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24 rounded-lg"
        >
          <p className="text-center">Check console and data attributes for debug info</p>
        </div>
      </div>

      {/* Method 2: Using ClassInspector wrapper */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Method 2: ClassInspector Wrapper</h3>
        <ClassInspector 
          className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 rounded-lg"
          debugName="gradient-card"
          showInspector={true}
        >
          <p className="text-white text-center">Hover to see class overlay</p>
        </ClassInspector>
      </div>

      {/* Method 3: Using DebugDiv */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Method 3: DebugDiv Component</h3>
        <DebugDiv 
          className="bg-blue-100 border-2 border-blue-300 p-4 rounded-md"
          debugName="info-box"
        >
          <p>This div has debug attributes automatically added</p>
        </DebugDiv>
      </div>

      {/* Method 4: Complex responsive classes */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Method 4: Complex Responsive Classes</h3>
        <ClassInspector 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg"
          debugName="responsive-grid"
        >
          <div className="bg-white p-4 rounded shadow">Item 1</div>
          <div className="bg-white p-4 rounded shadow">Item 2</div>
          <div className="bg-white p-4 rounded shadow">Item 3</div>
        </ClassInspector>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">How to Debug:</h4>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• Open browser dev tools and inspect elements</li>
          <li>• Look for <code>data-tw-classes</code> attributes</li>
          <li>• Check the console for detailed class information</li>
          <li>• Hover over elements with ClassInspector to see overlays</li>
          <li>• Use the browser's search function to find specific classes</li>
        </ul>
      </div>
    </div>
  )
}
