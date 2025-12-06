const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const DEFAULT_URL = 'https://lbve.venomappdevelopment.com';

function checkHealth(url) {
    console.log(`\n🔍 Checking health endpoint at: ${url}/api/health\n`);

    https.get(`${url}/api/health`, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                if (res.statusCode !== 200) {
                    console.error(`❌ Request failed with status code: ${res.statusCode}`);
                    console.error('Response:', data);
                    return;
                }

                const health = JSON.parse(data);
                console.log('📋 Health Check Results:');
                console.log('------------------------');

                const env = health.environment || {};
                const services = health.services || {};

                // Check Node Environment
                if (env.nodeEnv === 'production') {
                    console.log('✅ NODE_ENV is production');
                } else {
                    console.log(`⚠️  NODE_ENV is "${env.nodeEnv}" (Expected: production)`);
                }

                // Check Stripe Test Mode
                if (env.stripeTestMode === 'true') {
                    console.log('❌ NEXT_PUBLIC_STRIPE_TEST_MODE is "true"');
                    console.log('   -> This is why you are still in Sandbox mode.');
                    console.log('   -> Action: Set NEXT_PUBLIC_STRIPE_TEST_MODE to "false" in Netlify.');
                } else if (env.stripeTestMode === 'false') {
                    console.log('✅ NEXT_PUBLIC_STRIPE_TEST_MODE is "false"');
                } else {
                    console.log(`⚠️  NEXT_PUBLIC_STRIPE_TEST_MODE is "${env.stripeTestMode}"`);
                }

                // Check Keys presence
                console.log(`\n🔑 Key Configuration:`);
                console.log(`   Stripe Publishable: ${env.hasStripePublishable ? '✅ Present' : '❌ Missing'}`);
                console.log(`   Stripe Secret:      ${env.hasStripeSecret ? '✅ Present' : '❌ Missing'}`);
                console.log(`   Webhook Secret:     ${env.hasWebhookSecret ? '✅ Present' : '❌ Missing'}`);
                console.log(`   Supabase URL:       ${env.hasSupabaseUrl ? '✅ Present' : '❌ Missing'}`);

                console.log(`\n🏥 Service Status:`);
                console.log(`   Stripe:   ${services.stripe}`);
                console.log(`   Supabase: ${services.supabase}`);

            } catch (e) {
                console.error('❌ Failed to parse response:', e.message);
                console.error('Raw response:', data);
            }
        });

    }).on('error', (err) => {
        console.error('❌ Error making request:', err.message);
    });
}

rl.question(`Enter production base URL (default: ${DEFAULT_URL}): `, (answer) => {
    const url = answer.trim() || DEFAULT_URL;
    checkHealth(url);
    rl.close();
});
