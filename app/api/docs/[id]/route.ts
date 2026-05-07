import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@vercel/postgres'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { title, url, description, category } = await req.json()

  const result = await sql`
    UPDATE docs
    SET title = ${title}, url = ${url}, description = ${description || ''},
        category = ${category || 'Outros'}, updated_at = NOW()
    WHERE id = ${params.id} AND user_id = ${session.user.id}
    RETURNING *
  `

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const result = await sql`
    DELETE FROM docs WHERE id = ${params.id} AND user_id = ${session.user.id} RETURNING id
  `

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
