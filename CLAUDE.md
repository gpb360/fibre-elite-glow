# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
La Belle Vie is a comprehensive Next.js 15 e-commerce platform for health supplements, featuring:
- **Products**: Two main products (total-essential, total-essential-plus) with detailed pages
- **Payments**: Full Stripe integration with checkout sessions and webhooks
- **Authentication**: Supabase Auth with customer profiles and order management
- **Content Management**: Ingredient pages, video marketing, and SEO optimization
- **Email System**: Customer order confirmations and admin notifications via Resend

## Technology Stack

**Core Framework**: Next.js 15.1.6 with App Router, React 18.3.1, TypeScript
**Package Manager**: pnpm 8.15.0 (required - see package.json engines)
**Styling**: Tailwind CSS 3.4.11 with custom brand colors (green/purple themes)
**UI Components**: Radix UI with shadcn/ui configuration (50+ components in src/components/ui/)
**Database**: Supabase PostgreSQL with comprehensive schema
**Payments**: Stripe 18.2.1 with test mode support
**Email**: Resend integration for transactional emails
**Testing**: Playwright 1.55.0 for end-to-end testing
**Animations**: Framer Motion 12.7.4

## Development Commands

```bash
# Core Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint (warnings only, no errors block build)

# Testing
pnpm test             # Run Playwright tests headless
pnpm test:headed      # Run Playwright tests with UI

# Environment & Database Setup
pnpm setup:secrets    # Configure Supabase secrets
pnpm validate:env     # Validate environment variables
pnpm verify:db        # Verify database schema
pnpm db:migrate       # Run database migrations

# Performance & Analysis
pnpm perf:audit       # Performance audit
pnpm perf:build       # Build with performance analysis
pnpm analyze          # Bundle analysis
```

## Architecture & Key Patterns

### Project Structure
```
app/                          # Next.js App Router
├── api/                      # API routes (Stripe, webhooks, auth)
├── checkout/                 # Checkout flow pages
├── products/                 # Product pages (total-essential, total-essential-plus)
├── ingredients/              # Ingredient detail pages
└── account/                  # User account management

src/
├── components/
│   ├── ui/                   # Base Radix/ui components (50+)
│   └── pages/                # Page-specific components
├── contexts/                 # AuthContext, CartContext
├── integrations/supabase/    # Supabase client and types
├── lib/                      # Utilities (stripe.ts, email-service.ts)
└── hooks/                    # Custom React hooks

tests/                        # Playwright test files
scripts/                      # Setup and utility scripts (30+ scripts)
supabase/                     # Database schema and migrations
```

### Database Architecture
- **Product Types**: Enum-based (total_essential, total_essential_plus)
- **Order Management**: Full order lifecycle with status tracking
- **Customer Profiles**: Linked to Supabase Auth users
- **Schema**: Comprehensive e-commerce schema in `supabase/database-schema.sql`

### Authentication Flow
- **PKCE Flow**: Secure authentication with Supabase Auth
- **Session Management**: Auto-refresh with proper security
- **Profile System**: Customer profiles linked to authenticated users
- **Admin Access**: Service-role key for privileged operations

### Payment Integration
- **Stripe Checkout**: Server-side sessions with client-side elements
- **Test Mode**: Automatic test mode detection with warnings
- **Webhooks**: Full webhook handling for payment confirmations
- **Security**: Proper key management and CSRF protection

### Email System
- **Customer Emails**: Order confirmations with shipping addresses
- **Admin Notifications**: Sent to admin@lbve.ca with complete order details
- **Templates**: HTML and text formats with brand styling
- **Integration**: Resend service with reliable delivery

## Component Patterns

### UI Components
- **Base Components**: All Radix/ui components in `src/components/ui/`
- **Path Aliases**: Use `@/components/ui/ComponentName` for imports
- **Styling**: Tailwind classes with custom brand colors (green-500, purple-500)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for transitions and micro-interactions

### State Management
- **AuthContext**: Global authentication state and user profiles
- **CartContext**: Shopping cart with persistent storage
- **Local State**: React useState for component-specific state
- **Server State**: Supabase queries for data fetching

### Styling Guidelines
- **Brand Colors**: Use `green-500` (#9ED458) and `purple-500` (#B075B3) for primary actions
- **Typography**: Inter font family with responsive sizing
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Animations**: Custom animations defined in tailwind.config.ts (slide-up, shimmer)

## Development Workflow

### Before Making Changes
1. Run `pnpm lint` to check for linting issues
2. Run `pnpm test` to ensure existing tests pass
3. Run `pnpm build` to verify production build succeeds

### Environment Setup
- **Required Variables**: Supabase URL/keys, Stripe keys, Resend API key
- **Setup Scripts**: Use `pnpm setup:secrets` and `pnpm validate:env`
- **Test Mode**: Ensure test environment variables are properly configured

### Database Changes
1. Update `supabase/database-schema.sql`
2. Run `pnpm db:migrate` to apply changes
3. Update TypeScript types in `src/integrations/supabase/types.ts`
4. Test with `pnpm verify:db`

### Adding Features
- **Components**: Follow existing patterns in `src/components/`
- **API Routes**: Place in `app/api/` with proper error handling
- **Pages**: Use App Router structure in `app/`
- **Tests**: Add Playwright tests in `tests/` directory

## Critical Implementation Details

### Security
- **CSRF Protection**: 64-character hex tokens for form submissions
- **Key Management**: Server-side secrets never exposed to client
- **Authentication**: Proper session validation and auto-refresh
- **Input Validation**: Zod schemas for all form inputs

### Performance Optimizations
- **Image Optimization**: WebP/AVIF formats with caching headers
- **Bundle Analysis**: Use `pnpm analyze` for bundle optimization
- **Caching**: Enhanced headers for static assets and API responses
- **Code Splitting**: Automatic with Next.js App Router

### Testing Strategy
- **E2E Tests**: Playwright covering checkout flow, authentication, UI
- **Test Files**: Organized by feature in `tests/` directory
- **CI/CD**: Tests run automatically on PR creation
- **Test Data**: Use `pnpm validate:test-data` to verify test setup

## Common Issues & Solutions

### Build Issues
- **TypeScript**: Temporarily ignored during build (see next.config.js)
- **Image Imports**: Use proper domains in next.config.js
- **Module Resolution**: Path aliases configured for `@/*` → `src/*`

### Stripe Integration
- **Test Mode**: Automatically detects test vs production keys
- **Webhooks**: Ensure proper endpoint configuration in Stripe dashboard
- **Error Handling**: Comprehensive error recovery in checkout flow

### Database Connection
- **Local Development**: Use Supabase local development environment
- **Migrations**: Run scripts in `scripts/` for database setup
- **Type Safety**: Generated types from Supabase schema

This codebase follows modern Next.js best practices with comprehensive e-commerce functionality, robust authentication, and extensive testing infrastructure.
