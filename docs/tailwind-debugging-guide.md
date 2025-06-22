# Tailwind CSS Debugging Guide

## Why You See Compiled CSS Instead of Class Names

Next.js compiles and optimizes your CSS for performance. This means:
- Tailwind classes get processed into optimized CSS
- Class names may be transformed or combined
- Browser dev tools show the final compiled CSS, not original classes

## Solutions Implemented

### 1. Enhanced Next.js Configuration
- Added CSS source maps for better debugging
- Enabled webpack optimizations for development

### 2. PostCSS Configuration
- Preserves class names in development mode
- Better source mapping

### 3. Development Utilities

#### Class Inspector Utility
```typescript
import { classInspector } from '@/utils/dev-class-inspector'

// Debug specific classes
classInspector.debugClasses('bg-gradient-to-b from-green-50 to-white py-16 md:py-24')

// Find elements by pattern
const gradientElements = classInspector.findElementsByTailwindPattern('bg-gradient')
```

#### React Hook for Debugging
```typescript
import { useClassDebug } from '@/hooks/use-class-debug'

function MyComponent() {
  const debugRef = useClassDebug('bg-gradient-to-b from-green-50 to-white py-16 md:py-24', 'hero-section')
  
  return <div ref={debugRef} className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
    Content
  </div>
}
```

#### Development Component Wrapper
```typescript
import { ClassInspector, DebugDiv } from '@/components/dev/ClassInspector'

// Option 1: Wrapper component
<ClassInspector className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24" debugName="hero">
  <div>Content</div>
</ClassInspector>

// Option 2: Debug div
<DebugDiv className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24" debugName="hero">
  Content
</DebugDiv>
```

## Browser Debugging Tips

### 1. Use Data Attributes
All development utilities add `data-tw-classes` attributes to elements:
```html
<div data-tw-classes="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
```

### 2. Console Debugging
Open browser console to see detailed class information when using debug utilities.

### 3. Element Inspector
Hover over elements wrapped with `ClassInspector` to see original classes.

### 4. Browser Extensions
Install these helpful extensions:
- **Tailwind CSS IntelliSense** (VS Code)
- **Tailwind CSS Devtools** (Browser extension)
- **React Developer Tools**

## VS Code Setup

### 1. Install Extensions
- Tailwind CSS IntelliSense
- PostCSS Language Support
- CSS Peek

### 2. VS Code Settings
Add to your `.vscode/settings.json`:
```json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["className\\s*=\\s*['\"]([^'\"]*)['\"]"]
  ]
}
```

## Production vs Development

### Development Mode
- Source maps enabled
- Class names preserved where possible
- Debug utilities active
- Console logging enabled

### Production Mode
- Optimized CSS output
- Minified class names
- Debug utilities disabled
- No console logging

## Common Debugging Scenarios

### 1. Finding Gradient Classes
```typescript
// Find all gradient backgrounds
const gradients = classInspector.findElementsByTailwindPattern('bg-gradient')
console.log('Gradient elements:', gradients)
```

### 2. Debugging Responsive Classes
```typescript
// Debug responsive breakpoints
classInspector.debugClasses('py-16 md:py-24 lg:py-32')
```

### 3. Complex Class Combinations
```typescript
import { cn } from '@/hooks/use-class-debug'

const complexClasses = cn(
  'bg-gradient-to-b from-green-50 to-white',
  'py-16 md:py-24',
  'container mx-auto',
  isActive && 'shadow-premium'
)
```

## Troubleshooting

### Classes Not Showing
1. Check if you're in development mode
2. Verify PostCSS configuration
3. Clear Next.js cache: `rm -rf .next`
4. Restart development server

### Source Maps Not Working
1. Check Next.js configuration
2. Verify webpack settings
3. Clear browser cache
4. Check browser dev tools settings

### Performance Issues
1. Debug utilities only run in development
2. Production builds exclude all debugging code
3. Use `NODE_ENV=production` for production builds
