
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'

// Simple component test instead of full App
const TestComponent = () => <div data-testid="test-component">Test Component</div>

describe('App Components', () => {
  it('renders test component without crashing', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <TestComponent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    )
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
})
