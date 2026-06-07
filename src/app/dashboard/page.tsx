import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  FolderOpen,
  Briefcase,
  Users,
  MessageSquare,
  HeartHandshake,
  Search,
  FileText,
  User,
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

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
}

async function getStudentStats(userId: string) {
  const [projects, contactRequests] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.contactRequest.count({ where: { studentId: userId } }),
  ]);
  return { projects, contactRequests };
}

async function getCompanyStats(userId: string) {
  const [needs, contactRequests] = await Promise.all([
    prisma.companyNeed.count({ where: { companyId: userId } }),
    prisma.contactRequest.count({ where: { companyId: userId } }),
  ]);
  return { needs, contactRequests };
}

async function getAdminStats() {
  const [students, companies, projects] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "COMPANY" } }),
    prisma.project.count(),
  ]);
  return { students, companies, projects };
}

function QuickLinks({
  links,
}: {
  links: { label: string; href: string; icon: React.ElementType }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.label}
            href={link.href}
            className="bento-card flex flex-col items-center gap-3 p-6 text-center"
          >
            <Icon className="h-8 w-8 text-accent" />
            <span className="text-sm font-medium text-muted">
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function StatsRow({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="bento-card flex items-center gap-4 p-5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-light/50 text-accent">
            {stat.icon}
          </div>
          <div>
            <p className="font-heading text-2xl font-medium text-fg">
              {stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Dashboard variants ─── */

function StudentDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Mi Perfil", href: "/profile/edit", icon: User },
    { label: "Mis Proyectos", href: "/portfolio", icon: FolderOpen },
    { label: "Mi Portfolio", href: "/portfolio", icon: FileText },
    { label: "Foro", href: "/forum", icon: MessageSquare },
    { label: "Empresas", href: "/companies", icon: Briefcase },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Bienvenido, {user.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Gestiona tu perfil, proyectos y conexiones profesionales.
        </p>
      </div>

      <QuickLinks links={quickLinks} />
      <StatsSection userId={user.id} role="STUDENT" />
      <RecentOpportunities />
    </div>
  );
}

function CompanyDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Mi Perfil", href: "/profile/edit", icon: User },
    { label: "Publicar Necesidad", href: `/companies/${user.id}/needs/new`, icon: FileText },
    { label: "Buscar Talentos", href: "/students", icon: Search },
    { label: "Mis Contactos", href: "/networking", icon: HeartHandshake },
    { label: "Mensajes", href: "/messages", icon: MessageSquare },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Bienvenido, {user.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Encuentra talento, publica oportunidades y gestiona tu red de
          contactos.
        </p>
      </div>

      <QuickLinks links={quickLinks} />
      <StatsSection userId={user.id} role="COMPANY" />
    </div>
  );
}

function AdminDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Usuarios", href: "/admin/users", icon: Users },
    { label: "Proyectos", href: "/admin/projects", icon: FolderOpen },
    { label: "Empresas", href: "/admin/companies", icon: Briefcase },
    { label: "Reportes", href: "/admin/reports", icon: FileText },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Panel de Administración
        </h1>
        <p className="mt-1 text-sm text-muted">
          Bienvenido, {user.name}. Gestiona la plataforma.
        </p>
      </div>

      <QuickLinks links={quickLinks} />
      <StatsSection userId={user.id} role="ADMIN" />
    </div>
  );
}

/* ─── Stats ─── */

async function StatsSection({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  let stats: StatCard[] = [];

  if (role === "STUDENT") {
    const data = await getStudentStats(userId);
    stats = [
      { label: "Mis Proyectos", value: data.projects, icon: <FolderOpen className="h-6 w-6" />, href: "/portfolio" },
      { label: "Contactos", value: data.contactRequests, icon: <HeartHandshake className="h-6 w-6" />, href: "/networking" },
      { label: "Empresas", value: 0, icon: <Briefcase className="h-6 w-6" />, href: "/companies" },
      { label: "Foro", value: 0, icon: <MessageSquare className="h-6 w-6" />, href: "/forum" },
    ];
  } else if (role === "COMPANY") {
    const data = await getCompanyStats(userId);
    stats = [
      { label: "Necesidades", value: data.needs, icon: <FileText className="h-6 w-6" />, href: "/companies" },
      { label: "Contactos", value: data.contactRequests, icon: <HeartHandshake className="h-6 w-6" />, href: "/networking" },
      { label: "Estudiantes", value: 0, icon: <Users className="h-6 w-6" />, href: "/students" },
      { label: "Candidatos", value: 0, icon: <MessageSquare className="h-6 w-6" />, href: "/proposals" },
    ];
  } else {
    const data = await getAdminStats();
    stats = [
      { label: "Estudiantes", value: data.students, icon: <Users className="h-6 w-6" />, href: "/admin/users?role=STUDENT" },
      { label: "Empresas", value: data.companies, icon: <Briefcase className="h-6 w-6" />, href: "/admin/users?role=COMPANY" },
      { label: "Proyectos", value: data.projects, icon: <FolderOpen className="h-6 w-6" />, href: "/admin/projects" },
      { label: "Reportes", value: 0, icon: <FileText className="h-6 w-6" />, href: "/admin/reports" },
    ];
  }

  return <StatsRow stats={stats} />;
}

/* ─── Page ─── */

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

  const roleComponents: Record<Role, React.ReactNode> = {
    STUDENT: <StudentDashboard user={user} />,
    COMPANY: <CompanyDashboard user={user} />,
    ADMIN: <AdminDashboard user={user} />,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {roleComponents[user.role] ?? (
        <p className="text-muted">Rol no reconocido.</p>
      )}
    </main>
  );
}
