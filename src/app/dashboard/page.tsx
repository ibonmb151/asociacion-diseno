import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  FolderOpen,
  Briefcase,
  Users,
  MessageSquare,
  Search,
  FileText,
  User,
  GraduationCap,
  HeartHandshake,
  Building2,
  Lightbulb,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { RecentOpportunities } from "@/components/recent-opportunities";

type Role = "STUDENT" | "COMPANY" | "ADMIN";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface QuickLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const studentQuickLinks: QuickLink[] = [
  { label: "Portfolio", href: "/portfolio", icon: <FolderOpen className="h-5 w-5" />, description: "Tus proyectos" },
  { label: "Foro", href: "/forum", icon: <MessageCircle className="h-5 w-5" />, description: "Discusiones" },
  { label: "Propuestas", href: "/proposals", icon: <Lightbulb className="h-5 w-5" />, description: "Colabora" },
  { label: "Empresas", href: "/companies", icon: <Building2 className="h-5 w-5" />, description: "Oportunidades" },
  { label: "Perfil", href: "/profile/edit", icon: <User className="h-5 w-5" />, description: "Tu espacio" },
];

const companyQuickLinks: QuickLink[] = [
  { label: "Publicar Necesidad", href: "#", icon: <FileText className="h-5 w-5" />, description: "Busca talento" },
  { label: "Estudiantes", href: "/students", icon: <GraduationCap className="h-5 w-5" />, description: "Descubre" },
  { label: "Propuestas", href: "/proposals", icon: <Lightbulb className="h-5 w-5" />, description: "Colabora" },
  { label: "Networking", href: "/networking", icon: <HeartHandshake className="h-5 w-5" />, description: "Conecta" },
  { label: "Perfil", href: "/profile/edit", icon: <User className="h-5 w-5" />, description: "Tu empresa" },
];

const adminQuickLinks: QuickLink[] = [
  { label: "Usuarios", href: "/admin/users", icon: <Users className="h-5 w-5" />, description: "Gestionar" },
  { label: "Proyectos", href: "/admin/projects", icon: <FolderOpen className="h-5 w-5" />, description: "Revisar" },
  { label: "Empresas", href: "/admin/companies", icon: <Briefcase className="h-5 w-5" />, description: "Administrar" },
  { label: "Reportes", href: "/admin/reports", icon: <FileText className="h-5 w-5" />, description: "Analítica" },
  { label: "Foro", href: "/forum", icon: <MessageSquare className="h-5 w-5" />, description: "Moderar" },
];

async function getCommunityStats() {
  const [students, companies, projects, forumPosts, proposals] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "COMPANY" } }),
    prisma.project.count({ where: { visible: true } }),
    prisma.forumPost.count(),
    prisma.proposal.count(),
  ]);
  return { students, companies, projects, forumPosts, proposals };
}

async function getRecentPosts() {
  return prisma.forumPost.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
  });
}

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { visible: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
}

async function getRecentProposals() {
  return prisma.proposal.findMany({
    where: { status: "open" },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
}

function QuickActionGrid({ links }: { links: QuickLink[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-5 text-center transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light/50 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
            {link.icon}
          </div>
          <span className="text-sm font-medium text-fg">{link.label}</span>
          <span className="text-xs text-muted">{link.description}</span>
        </Link>
      ))}
    </div>
  );
}

function StatPill({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-light/50 text-accent">
        {icon}
      </div>
      <div>
        <span className="font-heading text-lg font-semibold text-fg">{value}</span>
        <span className="ml-1.5 text-xs text-muted">{label}</span>
      </div>
    </div>
  );
}

function ForumCard({ post }: { post: { id: string; title: string; content: string; category: string | null; createdAt: Date; user: { name: string | null; image: string | null }; _count: { comments: number } } }) {
  return (
    <Link
      href={`/forum/${post.id}`}
      className="card group"
    >
      {post.category && (
        <span className="tag mb-2">{post.category}</span>
      )}
      <h4 className="font-heading text-base font-medium text-fg transition-colors group-hover:text-accent">
        {post.title}
      </h4>
      <p className="mt-1 line-clamp-2 text-sm text-muted">
        {post.content}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>{post.user.name ?? "Anónimo"}</span>
        <span aria-hidden="true">·</span>
        <span>{new Date(post.createdAt).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}</span>
        {post._count.comments > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span>{post._count.comments} comentarios</span>
          </>
        )}
      </div>
    </Link>
  );
}

function ProjectCard({ project }: { project: { id: string; title: string; description: string; tags: string[]; images: string[]; user: { name: string | null; image: string | null } } }) {
  return (
    <Link
      href={`/portfolio/${project.id}`}
      className="project-card group"
    >
      {project.images[0] ? (
        <img src={project.images[0]} alt={project.title} className="project-card-image" />
      ) : (
        <div className="project-card-image flex items-center justify-center bg-accent-light/30">
          <FolderOpen className="h-8 w-8 text-accent/40" />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-heading text-sm font-medium text-fg transition-colors group-hover:text-accent">
          {project.title}
        </h4>
        <p className="mt-1 line-clamp-2 text-xs text-muted">
          {project.description}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted">
          <span>{project.user.name ?? "Anónimo"}</span>
        </div>
        {project.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-accent-light/40 px-2 py-0.5 text-[10px] text-accent">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function ProposalCard({ proposal }: { proposal: { id: string; title: string; description: string; tags: string[]; category: string | null; user: { name: string | null; image: string | null } } }) {
  return (
    <Link
      href={`/proposals`}
      className="card group flex items-start gap-4"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-light/50 text-accent">
        <Lightbulb className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-heading text-sm font-medium text-fg transition-colors group-hover:text-accent">
            {proposal.title}
          </h4>
          {proposal.category && (
            <span className="tag text-[10px]">{proposal.category}</span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {proposal.description}
        </p>
        <div className="mt-2 text-xs text-muted">
          Por {proposal.user.name ?? "Anónimo"}
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="divider-accent" />
        <h2 className="font-heading text-lg font-medium text-fg">{title}</h2>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Ver todo <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted">Inicia sesión para acceder al dashboard.</p>
      </div>
    );
  }

  const user = session.user as SessionUser;

  const [stats, recentPosts, featuredProjects, recentProposals] = await Promise.all([
    getCommunityStats(),
    getRecentPosts(),
    getFeaturedProjects(),
    getRecentProposals(),
  ]);

  const quickLinks =
    user.role === "ADMIN" ? adminQuickLinks :
    user.role === "COMPANY" ? companyQuickLinks :
    studentQuickLinks;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Comunidad de Diseño Deusto</span>
        </div>
        <h1 className="mt-2 font-heading text-2xl font-medium text-fg sm:text-3xl">
          Bienvenido, {user.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {user.role === "STUDENT" ? "Comparte tu trabajo, conecta con empresas y crece como diseñador." :
           user.role === "COMPANY" ? "Encuentra talento, publica oportunidades y colabora con la comunidad." :
           "Gestiona la plataforma y la comunidad de diseño."}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <QuickActionGrid links={quickLinks} />
      </div>

      {/* Community Stats */}
      <div className="mb-12 flex flex-wrap gap-2">
        <StatPill label="estudiantes" value={stats.students} icon={<GraduationCap className="h-3.5 w-3.5" />} />
        <StatPill label="empresas" value={stats.companies} icon={<Building2 className="h-3.5 w-3.5" />} />
        <StatPill label="proyectos" value={stats.projects} icon={<FolderOpen className="h-3.5 w-3.5" />} />
        <StatPill label="debates" value={stats.forumPosts} icon={<MessageCircle className="h-3.5 w-3.5" />} />
        <StatPill label="propuestas" value={stats.proposals} icon={<Lightbulb className="h-3.5 w-3.5" />} />
      </div>

      {/* Forum */}
      {recentPosts.length > 0 && (
        <section className="mb-12">
          <SectionHeader title="Últimos debates" href="/forum" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {recentPosts.map((post) => (
              <ForumCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Projects + Opportunities */}
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        {featuredProjects.length > 0 && (
          <section>
            <SectionHeader title="Proyectos destacados" href="/portfolio" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {featuredProjects.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        <section>
          <RecentOpportunities />
        </section>
      </div>

      {/* Proposals */}
      {recentProposals.length > 0 && (
        <section className="mb-12">
          <SectionHeader title="Propuestas abiertas" href="/proposals" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recentProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
