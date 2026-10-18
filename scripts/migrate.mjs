import { neon } from '@neondatabase/serverless'
import { readFile } from 'node:fs/promises'
import nextEnv from '@next/env'

nextEnv.loadEnvConfig(process.cwd())
if (!process.env.DATABASE_URL)
  throw new Error('Configura DATABASE_URL en .env.local antes de ejecutar la migración.')
const sql = neon(process.env.DATABASE_URL)
const migration = await readFile(new URL('../db/001_initial.sql', import.meta.url), 'utf8')
const statements = migration
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)
await sql.transaction(statements.map((statement) => sql.query(statement)))
console.log('Migración completada: tablas e índices listos.')
