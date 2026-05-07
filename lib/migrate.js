// Run: node lib/migrate.js
require('dotenv').config({ path: '.env.local' })
const { neon } = require('@neondatabase/serverless')

async function migrate() {
  const sql = neon(process.env.DATABASE_URL)
  console.log('Running migrations...')

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('✓ users table')

  await sql`
    CREATE TABLE IF NOT EXISTS docs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      url TEXT NOT NULL,
      description TEXT,
      category VARCHAR(100) DEFAULT 'Outros',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('✓ docs table')

  await sql`CREATE INDEX IF NOT EXISTS idx_docs_user_id ON docs(user_id)`
  console.log('✓ indexes')

  console.log('Migration complete!')
  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
