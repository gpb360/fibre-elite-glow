// Build timestamp to force cache invalidation
// Generated: ${new Date().toISOString()}
// This ensures Netlify picks up latest environment variables

export const BUILD_TIMESTAMP = '${new Date().toISOString()}';

// Force environment variable refresh
console.log('🔄 Environment variables at build time:');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');