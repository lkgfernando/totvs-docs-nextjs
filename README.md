# TOTVS Docs Hub

Central de links de documentação TOTVS/Protheus com autenticação de usuários.

## Stack
- **Next.js 14** (App Router)
- **NextAuth v5** (autenticação com JWT)
- **Vercel Postgres** (banco de dados)
- **Tailwind CSS**

## Deploy no Vercel

### 1. Criar banco de dados
1. Acesse [vercel.com](https://vercel.com) → seu projeto → **Storage**
2. Crie um **Postgres** database
3. Clique em **Connect to Project** — as variáveis de ambiente são configuradas automaticamente

### 2. Criar variável NEXTAUTH_SECRET
No painel Vercel → **Settings** → **Environment Variables**, adicione:
```
NEXTAUTH_SECRET = (gere com: openssl rand -base64 32)
```

### 3. Rodar migração do banco
Após o primeiro deploy, no terminal local:
```bash
npm install
cp .env.local.example .env.local
# Preencha .env.local com as variáveis do Vercel Storage
node lib/migrate.js
```

### 4. Desenvolvimento local
```bash
npm install
cp .env.local.example .env.local
# Preencha .env.local
npm run dev
```

## Funcionalidades
- Cadastro e login de usuários
- Cada usuário tem seus próprios links salvos no banco
- CRUD completo (adicionar, editar, excluir)
- Busca por título, URL e descrição
- Filtro por módulo TOTVS
- Ordenação (mais recente, mais antigo, A→Z)
- Estatísticas por módulo
- Exportar/Importar JSON
- Atalho Ctrl+N para adicionar link
