'use client'

import { signOut } from 'next-auth/react'
import { LogOut, BookOpen } from 'lucide-react'

interface Props {
  userName: string
}

export default function Navbar({ userName }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#e8622a' }}
            >
              <BookOpen size={18} color="white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">TOTVS</span>
              <span className="font-normal text-gray-500 text-lg leading-none"> Docs Hub</span>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Olá, <span className="font-medium text-gray-800">{userName}</span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
