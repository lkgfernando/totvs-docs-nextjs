import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { id } = await params
  const { title, url, description, category } = await req.json()
  const sql = getDb()

  const rows = await sql`
    UPDATE docs
    SET title = ${title}, url = ${url}, description = ${description || ''},
        category = ${category || 'Outros'}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING *
  `

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  }

  return NextResponse.json(rows[0])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { id } = await params
  const sql = getDb()
  const rows = await sql`
    DELETE FROM docs WHERE id = ${id} AND user_id = ${session.user.id} RETURNING id
  `

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
