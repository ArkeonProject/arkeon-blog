/**
 * run-sql.ts
 * Ejecuta un archivo SQL directamente contra Supabase (PostgreSQL).
 *
 * Uso:
 *   pnpm run-sql sql/add-exam.sql
 *   pnpm run-sql sql/bypass-user-access.sql
 *
 * Requiere en .env.local:
 *   DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-eu-west-2.pooler.supabase.com:6543/postgres
 *
 * Obtén la URL en: Supabase Dashboard → Project Settings → Database
 *   → Connection string → Transaction pooler → URI
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...valueParts] = trimmed.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  Falta DATABASE_URL en .env.local');
  console.error('   Supabase Dashboard → Project Settings → Database → Connection string (Transaction pooler)');
  process.exit(1);
}

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('❌  Uso: pnpm run-sql <archivo.sql>');
  process.exit(1);
}

const sqlPath = resolve(process.cwd(), sqlFile);
const sql = readFileSync(sqlPath, 'utf-8');

const client = new Client({ connectionString: DATABASE_URL });

async function run() {
  await client.connect();
  console.log(`▶  Ejecutando ${sqlFile}...`);
  try {
    const result = await client.query(sql);
    const results = Array.isArray(result) ? result : [result];
    for (const r of results) {
      if (r.rows?.length) {
        console.table(r.rows);
      }
    }
    console.log('✅  Completado');
  } catch (err) {
    console.error('❌  Error:', (err as Error).message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
