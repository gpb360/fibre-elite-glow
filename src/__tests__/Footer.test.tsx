
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Footer } from '@/components/Footer'

describe('Footer Component', () => {
  const renderFooter = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    return render(
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    )
  }

  it('renders without crashing', () => {
    renderFooter()
    expect(screen.getByText('La Belle Vie')).toBeInTheDocument()
  })

  it('contains all expected navigation links', () => {
    renderFooter()

    // Check Products section links
    expect(screen.getByText('Total Essential')).toBeInTheDocument()
    expect(screen.getByText('Total Essentiel Plus')).toBeInTheDocument()

    // Check Resources section links
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Health Blog')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByText('Testimonials')).toBeInTheDocument()

    // Check Company section links
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getAllByText('Privacy Policy')).toHaveLength(2) // One in main nav, one in footer
    expect(screen.getAllByText('Terms of Service')).toHaveLength(2) // One in main nav, one in footer
    expect(screen.getByText('Shipping Information')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
  })

  it('has correct Link components with proper to attributes', () => {
    renderFooter()
    
    // Check that links have correct href attributes (React Router DOM converts 'to' to 'href')
    const aboutLink = screen.getByRole('link', { name: 'About Us' })
    expect(aboutLink).toHaveAttribute('href', '/about')
    
    const faqLink = screen.getByRole('link', { name: 'FAQ' })
    expect(faqLink).toHaveAttribute('href', '/faq')
    
    const contactLink = screen.getByRole('link', { name: 'Contact Us' })
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('displays copyright information', () => {
    renderFooter()
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} La Belle Vie. All rights reserved.`)).toBeInTheDocument()
  })
})
