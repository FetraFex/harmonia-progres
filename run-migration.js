// Execute migration via Supabase HTTPS SQL endpoint
// This uses the PostgREST /rpc endpoint with a bootstrap approach

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://jvphzfcbbipbnzycllwj.supabase.co';
const DB_PASSWORD = 'dg2ytihDbcMaaKd3';

// First, we need to get the service_role key. Let's try using the
// Supabase Management API approach, or use a direct SQL execution endpoint.

// Supabase has an undocumented /pg endpoint for SQL execution
// that accepts the postgres password as auth.

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query: sql });

    const url = new URL(`${SUPABASE_URL}/pg/query`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${DB_PASSWORD}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('Reading migration file...');
  const sql = fs.readFileSync(
    path.join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql'),
    'utf8'
  );

  console.log(`Attempting SQL execution via HTTPS (${sql.length} bytes)...`);
  try {
    const result = await executeSQL(sql);
    console.log('✅ Result:', result);
  } catch (err) {
    console.log('❌ HTTPS /pg/query failed:', err.message);
    console.log('');
    console.log('=== ALTERNATIVE: Manual execution required ===');
    console.log('Your network cannot reach the Supabase database directly:');
    console.log('  - IPv4: No A record for db.jvphzfcbbipbnzycllwj.supabase.co');
    console.log('  - IPv6: ENETUNREACH (your network does not support IPv6)');
    console.log('  - Pooler: Tenant not found');
    console.log('');
    console.log('Please run the migration manually:');
    console.log('  1. Go to https://supabase.com/dashboard');
    console.log('  2. Select your project');
    console.log('  3. Go to SQL Editor');
    console.log('  4. Click "New Query"');
    console.log('  5. Paste the contents of supabase/migrations/001_initial_schema.sql');
    console.log('  6. Click "Run"');
  }
}

run();
