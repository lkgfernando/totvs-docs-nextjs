import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@vercel/postgres'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'newest'

  let rows

  if (search && category) {
    const like = `%${search}%`
    rows = await sql`
      SELECT * FROM docs
      WHERE user_id = ${session.user.id}
        AND category = ${category}
        AND (title ILIKE ${like} OR url ILIKE ${like} OR description ILIKE ${like})
      ORDER BY ${sort === 'oldest' ? sql`created_at ASC` : sort === 'az' ? sql`title ASC` : sql`created_at DESC`}
    `
  } else if (search) {
    const like = `%${search}%`
    rows = await sql`
      SELECT * FROM docs
      WHERE user_id = ${session.user.id}
        AND (title ILIKE ${like} OR url ILIKE ${like} OR description ILIKE ${like})
      ORDER BY ${sort === 'oldest' ? sql`created_at ASC` : sort === 'az' ? sql`title ASC` : sql`created_at DESC`}
    `
  } else if (category) {
    rows = await sql`
      SELECT * FROM docs
      WHERE user_id = ${session.user.id} AND category = ${category}
      ORDER BY ${sort === 'oldest' ? sql`created_at ASC` : sort === 'az' ? sql`title ASC` : sql`created_at DESC`}
    `
  } else {
    rows = await sql`
      SELECT * FROM docs
      WHERE user_id = ${session.user.id}
      ORDER BY ${sort === 'oldest' ? sql`created_at ASC` : sort === 'az' ? sql`title ASC` : sql`created_at DESC`}
    `
  }

  return NextResponse.json(rows.rows)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { title, url, description, category } = await req.json()

  if (!title || !url) {
    return NextResponse.json({ error: 'Título e URL são obrigatórios.' }, { status: 400 })
  }

  const result = await sql`
    INSERT INTO docs (user_id, title, url, description, category)
    VALUES (${session.user.id}, ${title}, ${url}, ${description || ''}, ${category || 'Outros'})
    RETURNING *
  `

  return NextResponse.json(result.rows[0], { status: 201 })
}
