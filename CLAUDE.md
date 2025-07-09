# CLAUDE.md - Project Instructions

## Project Overview
This is a Next.js e-commerce application for Fibre Elite Glow, a health supplement company. The project includes:
- Product pages for fiber supplements
- Stripe payment integration
- Supabase authentication and database
- Video marketing content
- Ingredient detail pages
- Shopping cart and checkout functionality

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI with custom components
- **Database**: Supabase
- **Payments**: Stripe
- **Authentication**: Supabase Auth
- **Testing**: Playwright
- **Package Manager**: pnpm (based on pnpm-lock.yaml)

## Key Commands
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run Playwright tests
pnpm test:headed      # Run Playwright tests with UI
```

## Project Structure
- `app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/contexts/` - React contexts (Auth, Cart)
- `src/integrations/supabase/` - Supabase client and types
- `src/lib/` - Utility functions and configurations
- `public/` - Static assets and marketing videos
- `tests/` - Playwright test files
- `scripts/` - Setup and utility scripts

## Important Files
- `middleware.ts` - Next.js middleware for auth
- `components.json` - Shadcn/ui configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `database-schema.sql` - Database schema
- `complete-database-setup.sql` - Complete database setup

## Development Guidelines
1. **Components**: Use existing UI components from `src/components/ui/`
2. **Styling**: Follow Tailwind CSS patterns used throughout the project
3. **Testing**: Write Playwright tests for new features
4. **Database**: Use Supabase client from `src/integrations/supabase/`
5. **Authentication**: Use AuthContext and Supabase Auth
6. **Payments**: Use Stripe integration in `src/lib/stripe.ts`

## Before Making Changes
1. Always run `pnpm lint` to check for linting issues
2. Run `pnpm test` to ensure tests pass
3. Check that the build succeeds with `pnpm build`

## Common Tasks
- **Adding new components**: Place in `src/components/` and follow existing patterns
- **Creating pages**: Use App Router in `app/` directory
- **Database changes**: Update schema and run migrations
- **Adding tests**: Create in `tests/` directory using Playwright
- **Styling**: Use Tailwind classes and follow existing component patterns

## Environment Setup
The project uses environment variables for:
- Supabase configuration
- Stripe API keys
- Database connections

Check the setup scripts in `scripts/` for configuration guidance.