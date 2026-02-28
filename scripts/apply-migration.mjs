import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env.local parser
function getDbUrl() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/DATABASE_URL=["']?(.*?)["']?(\s|$)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const dbUrl = getDbUrl();
  if (!dbUrl) {
    console.error('❌ Could not find DATABASE_URL in .env.local');
    process.exit(1);
  }

  console.log('🚀 Connecting to database...');
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected.');

    // 1. Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // 2. Get applied migrations
    const { rows: applied } = await client.query('SELECT name FROM _migrations');
    const appliedSet = new Set(applied.map(r => r.name));

    // 3. Read migration directory
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    let ran = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`- Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`🧪 Running ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ Applied ${file}`);
        ran++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed ${file}:`, err.message);
        throw err;
      }
    }

    if (ran === 0) {
      console.log('✨ Database is already up to date.');
    } else {
      console.log(`🎉 Successfully applied ${ran} migration(s).`);
    }

  } catch (err) {
    console.error('❌ Migration process failed:', err.message);
  } finally {
    await client.end();
  }
}

run();
