import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TOTVS Docs Hub',
  description: 'Central de links de documentação TOTVS/Protheus',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
