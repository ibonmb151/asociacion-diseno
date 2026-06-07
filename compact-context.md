# Contexto Compacto - Asociación de Diseño

## Stack
- **Next.js 16.2.7** (App Router, Turbopack), **TypeScript**, **Tailwind v4**
- **Prisma v7.8.0** (ORM), **Neon PostgreSQL** (prod), **pg** local (dev on port 51214)
- **NextAuth v5.0.0-beta.31** (credentials + Google), JWT, PrismaAdapter, Edge proxy en `src/proxy.ts`
- **framer-motion**, **lucide-react** (≥0.400), **bcryptjs**
- **Playfair Display** (headings) + **Inter** (body) via next/font

## Diseño: Warm Editorial
- Paleta: terracotta (`#A85A3A`) + forest (`#3A5A3A`) + off-white (`#F5F0EB`)
- Tokens CSS: `bg`, `surface`, `fg`, `accent`, `accent-hover`, `accent-light`, `secondary`, `muted`, `border`, `success`, `danger`, `warning` + variantes `-bg`
- Anti-AI-slop: sin índigo, sin blobs/waves, sin emoji icons, sin gradient hero, max 2 accent/screen
- Componentes UI: `Button`, `Input`, `Badge` en `src/components/ui/`
- Layout: bento cards (`bento-card`), whitespace generoso, fadeUp animations

## Schema (13 modelos)
User → StudentProfile (1:1), Project (1:N), ForumPost (1:N), ForumComment (1:N), Proposal (1:N), ContactRequest (1:N), Feedback (1:N)
Company (user_id FK a User, no extiende User), CompanyNeed (1:N)
NextAuth: Account, Session, VerificationToken

## Rutas (32)
- **Auth**: `/login`, `/register`, `/api/auth/[...nextauth]`, `/api/auth/register`
- **Dashboard**: `/dashboard` (per-role: STUDENT/COMPANY/ADMIN)
- **Portfolio**: `/portfolio`, `/portfolio/[id]`, `/api/projects`, `/api/projects/[id]`, `/api/projects/[id]/feedback`
- **Forum**: `/forum`, `/forum/[id]`, `/forum/new`, `/api/forum`, `/api/forum/[id]`, `/api/forum/[id]/comments`
- **Proposals**: `/proposals`, `/proposals/new`, `/api/proposals`, `/api/proposals/[id]`
- **Companies**: `/companies`, `/companies/[id]`, `/companies/[id]/needs/new`, `/api/companies`, `/api/companies/needs`, `/api/companies/needs/[id]`
- **Students**: `/students`, `/students/[id]`, `/api/students`
- **Networking**: `/networking` (both students & companies)
- **API**: `/api/contact`, `/api/contact/[id]`
- **Profile**: `/profile/edit`, `/api/profile`

## Auth
- `src/auth/auth.ts`: NextAuth v5.0.0-beta.31, credentials + Google, JWT con `id` + `role`
- Session returns: `{ id, name, email, role }`
- Proxy edge en `src/proxy.ts` (renombrado de middleware.ts, cookie-based sin Prisma)
- **Login: server component** con POST nativo (sin JS cliente); CSRF token obtenido server-side desde `/api/auth/csrf`
- **CompanyID ≠ UserID**: Company tiene user_id FK, lookup por email via `prisma.company.findUnique({ where: { email } })`
- **NEXTAUTH_URL no debe estar en .env**: NextAuth auto-detecta URL por headers en cada entorno
- **Cookie de sesión**: `next-auth.session-token` (HTTP) / `__Secure-next-auth.session-token` (HTTPS)
- Register: `POST /api/auth/register` body `{ name, email, password, role, description? }`

## PrismaClient
- `src/lib/prisma.ts`: singleton con `@prisma/adapter-pg` + `pg.Pool`
- Generado en `src/generated/prisma/` (no `node_modules/.prisma`)

## Feedback (sesión 2-3)
- Modelo `Feedback` con `@@unique([projectId, userId])`, rating 1-5, comment opcional
- API: `GET/POST /api/projects/[id]/feedback`
- Componente cliente: `FeedbackSection` en portfolio detail
- Sin self-feedback, max 1 feedback por usuario por proyecto

## Oportunidades (sesión 2)
- `RecentOpportunities` component en student dashboard
- Muestra últimas 5 company needs abiertas
- Enlace a /companies para ver todas

## Paginación (sesión 2)
- Componente `Pagination` reutilizable con URL searchParams
- Forum: 10/page, Proposals: 10/page, Companies: 12/page, Students: 12/page
- Server-side Prisma skip/take

## Perfil editable (sesión 2)
- Ruta `/profile/edit` con formulario según role
- STUDENT: nombre, bio, curso, skills, linkedin, website
- COMPANY: nombre, descripción, sector, ubicación, website
- API `GET/PATCH /api/profile`

## Fixes (sesión 3)
- **Login rewriting**: de client component con form.submit() → server component con <form> HTML nativo + CSRF server-side
- **NEXTAUTH_URL eliminado**: estaba hardcodeado a http://localhost:3000 causando cookies no-seguras en Vercel HTTPS
- **Proxy cookie detection**: soporte para `next-auth.session-token`, `__Secure-next-auth.session-token`, `__Host-next-auth.session-token`

## Deploy
- Repo: `ibonmb151/asociacion-diseno` → GitHub → Vercel auto-deploy
- Neon PostgreSQL en Vercel
- Build: `npm run build` (sin errores, 32 rutas)

## Pendiente
- Uploadthing (imágenes): instalado pero no configurado (requiere API keys en .env)
- Recuperación de contraseña
- Tests automatizados
