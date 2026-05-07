import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'newest'

  const sql = getDb()
  const userId = session.user.id
  let rows: any[]

  if (search && category) {
    const like = `%${search}%`
    rows = await sql`
      SELECT * FROM docs
      WHERE user_id = ${userId} AND category = ${category}
        AND (title ILIKE ${like} OR url ILIKE ${like} OR description ILIKE ${like})
    `
  } else if (search) {
    const like = `%${search}%`
    rows = await sql`
      SELECT * FROM docs
      WHERE user_id = ${userId}
        AND (title ILIKE ${like} OR url ILIKE ${like} OR description ILIKE ${like})
    `
  } else if (category) {
    rows = await sql`SELECT * FROM docs WHERE user_id = ${userId} AND category = ${category}`
  } else {
    rows = await sql`SELECT * FROM docs WHERE user_id = ${userId}`
  }

  rows.sort((a, b) => {
    if (sort === 'az') return String(a.title).localeCompare(String(b.title))
    if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  const { title, url, description, category } = await req.json()

  if (!title || !url) {
    return NextResponse.json({ error: 'Título e URL são obrigatórios.' }, { status: 400 })
  }

  const sql = getDb()
  const rows = await sql`
    INSERT INTO docs (user_id, title, url, description, category)
    VALUES (${session.user.id}, ${title}, ${url}, ${description || ''}, ${category || 'Outros'})
    RETURNING *
  `

  return NextResponse.json(rows[0], { status: 201 })
}
