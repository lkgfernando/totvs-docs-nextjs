import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DocsClient from '@/components/DocsClient'
import Navbar from '@/components/Navbar'

export default async function Home() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={session.user.name || 'Usuário'} />
      <main className="flex-1">
        <DocsClient userId={session.user.id!} />
      </main>
    </div>
  )
}
