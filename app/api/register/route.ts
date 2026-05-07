import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@vercel/postgres'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 12)
    await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hash})`

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
