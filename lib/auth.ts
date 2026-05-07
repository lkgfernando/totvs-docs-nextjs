import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const sql = neon(process.env.DATABASE_URL!)
        const rows = await sql`SELECT * FROM users WHERE email = ${credentials.email as string}`
        const user = rows[0]
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password as string)
        if (!valid) return null

        return { id: String(user.id), name: user.name as string, email: user.email as string, role: user.role as string }
      },
    }),
  ],
})
