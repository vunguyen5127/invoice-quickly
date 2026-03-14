import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CRON_SECRET = process.env.CRON_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testCron() {
  console.log(`Testing cron job at ${APP_URL}/api/cron/keep-alive...`);
  
  if (!CRON_SECRET) {
    console.error('CRON_SECRET is missing in .env.local');
    return;
  }

  try {
    const response = await fetch(`${APP_URL}/api/cron/keep-alive`, {
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    });

    const status = response.status;
    const data = await response.json();

    console.log(`Response Status: ${status}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (status === 200) {
      console.log('✅ Cron job test successful!');
    } else {
      console.log('❌ Cron job test failed.');
    }
  } catch (error) {
    console.error('Error calling cron job:', error.message);
  }
}

testCron();
