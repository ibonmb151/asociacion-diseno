# Contexto Compacto - Asociación de Diseño

## Stack
- **Next.js 16.2.7** (App Router, Turbopack), **TypeScript**, **Tailwind v4**
- **Prisma v7.8.0** (ORM), **Neon PostgreSQL** (prod), **pg** local (dev on port 51214)
- **NextAuth v5** (credentials + Google), JWT, PrismaAdapter, Edge middleware (próximamente proxy.ts)
- **framer-motion**, **lucide-react** (≥0.400), **bcryptjs**
- **Playfair Display** (headings) + **Inter** (body) via next/font

## Diseño: Warm Editorial
- Paleta: terracotta (`#A85A3A`) + forest (`#3A5A3A`) + off-white (`#F5F0EB`)
- Tokens CSS: `bg`, `surface`, `fg`, `accent`, `accent-hover`, `accent-light`, `secondary`, `muted`, `border`, `success`, `danger`, `warning` + variantes `-bg`
- Anti-AI-slop: sin índigo, sin blobs/waves, sin emoji icons, sin gradient hero, max 2 accent/screen
- Componentes UI: `Button`, `Input`, `Badge` en `src/components/ui/`
- Layout: bento cards (`bento-card`), whitespace generoso, fadeUp animations

## Schema (12 modelos + Feedback)
User → StudentProfile (1:1), Project (1:N), ForumPost (1:N), ForumComment (1:N), Proposal (1:N), ContactRequest (1:N), Feedback (1:N)
Company (User extends via same id), CompanyNeed (1:N)
NextAuth: Account, Session, VerificationToken

## Rutas (31)
- **Auth**: `/login`, `/register`, `/api/auth/[...nextauth]`, `/api/auth/register`
- **Dashboard**: `/dashboard` (per-role: STUDENT/COMPANY/ADMIN)
- **Portfolio**: `/portfolio`, `/portfolio/[id]`, `/api/projects`, `/api/projects/[id]`, `/api/projects/[id]/feedback`
- **Forum**: `/forum`, `/forum/[id]`, `/forum/new`, `/api/forum`, `/api/forum/[id]`, `/api/forum/[id]/comments`
- **Proposals**: `/proposals`, `/proposals/new`, `/api/proposals`, `/api/proposals/[id]`
- **Companies**: `/companies`, `/companies/[id]`, `/companies/[id]/needs/new`, `/api/companies`, `/api/companies/needs`, `/api/companies/needs/[id]`
- **Students**: `/students`, `/students/[id]`, `/api/students`
- **Networking**: `/networking` (both students & companies)
- **API**: `/api/contact`, `/api/contact/[id]`

## Auth
- `src/auth/auth.ts`: NextAuth v5, credentials + Google, JWT with `id` + `role`
- Session returns: `{ id, name, email, role }`
- Edge middleware in `src/middleware.ts` (cookie-based, no Prisma)
- Register: `POST /api/auth/register` body `{ name, email, password, role, description? }`

## PrismaClient
- `src/lib/prisma.ts`: singleton con `@prisma/adapter-pg` + `pg.Pool`
- Generado en `src/generated/prisma/` (no `node_modules/.prisma`)

## Feedback (NUEVO - sesión 2)
- Modelo `Feedback` con `@@unique([projectId, userId])`, rating 1-5, comment opcional
- API: `GET/POST /api/projects/[id]/feedback`
- Componente cliente: `FeedbackSection` en portfolio detail
- Sin self-feedback, max 1 feedback por usuario por proyecto

## Oportunidades (NUEVO - sesión 2)
- `RecentOpportunities` component en student dashboard
- Muestra últimas 5 company needs abiertas
- Enlace a /companies para ver todas

## Deploy
- Repo: `ibonmb151/asociacion-diseno` → GitHub → Vercel auto-deploy
- Neon PostgreSQL en Vercel
- Build: `npm run build` (actualmente pasa sin errores, 31 rutas)

## Pendiente
- Uploadthing (imágenes): instalado pero no configurado (requiere API keys en .env)
- Paginación en listados
- Recuperación de contraseña
- Migrar middleware.ts → proxy.ts (Next.js 16 deprecación)
- Tests automatizados
