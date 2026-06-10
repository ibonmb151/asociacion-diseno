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
import { Suspense } from "react";
import { TrianglePanels } from "@/components/TrianglePanels";

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

/* ─── Stats ─── */

function StatsRow({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="bento-card flex items-center gap-4 p-5"
        >
          <div className="flex h-12 w-12 items-center justify-center bg-accent-light/50 text-accent">
            {stat.icon}
          </div>
          <div>
            <p className="font-heading text-2xl font-medium text-fg">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Stats Section (async) ─── */

async function StatsSection({ userId, role }: { userId: string; role: Role }) {
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

/* ─── Dashboard variants ─── */

function StudentDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Mi Perfil",    href: "/profile/edit", icon: <User className="h-10 w-10" />,          description: "Identidad" },
    { label: "Proyectos",    href: "/portfolio",    icon: <FolderOpen className="h-10 w-10" />,    description: "Portfolio" },
    { label: "Mi Portfolio", href: "/portfolio",    icon: <FileText className="h-10 w-10" />,      description: "Showcase",  offsetX: 24 },
    { label: "Foro",         href: "/forum",        icon: <MessageSquare className="h-10 w-10" />, description: "Comunidad" },
    { label: "Networking",   href: "/networking",   icon: <Users className="h-10 w-10" />,         description: "Red",       offsetX: 24 },
  ];

  return (
    <>
      {/* ── Full-viewport panel section ── */}
      <div style={{ height: "100vh" }}>
        <TrianglePanels links={quickLinks} />
      </div>

    </>
  );
}

async function CompanyDashboard({ user }: { user: SessionUser }) {
  const company = await prisma.company.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  const quickLinks = [
    { label: "Mi Perfil",       href: "/profile/edit",                                    icon: <User className="h-10 w-10" />,           description: "Identidad" },
    { label: "Pub. Necesidad",  href: company ? `/companies/${company.id}/needs/new` : "#", icon: <FileText className="h-10 w-10" />,       description: "Publicar" },
    { label: "Talentos",        href: "/students",                                         icon: <Search className="h-10 w-10" />,         description: "Buscar" },
    { label: "Mis Contactos",   href: "/networking",                                       icon: <HeartHandshake className="h-10 w-10" />, description: "Red" },
    { label: "Mensajes",        href: "/messages",                                         icon: <MessageSquare className="h-10 w-10" />,  description: "Inbox" },
  ];

  return (
    <>
      <div style={{ height: "100vh" }}>
        <TrianglePanels links={quickLinks} />
      </div>
    </>
  );
}

function AdminDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Usuarios",  href: "/admin/users",     icon: <Users className="h-10 w-10" />,      description: "Gestionar" },
    { label: "Proyectos", href: "/admin/projects",   icon: <FolderOpen className="h-10 w-10" />, description: "Revisar" },
    { label: "Empresas",  href: "/admin/companies",  icon: <Briefcase className="h-10 w-10" />,  description: "Gestionar" },
    { label: "Reportes",  href: "/admin/reports",    icon: <FileText className="h-10 w-10" />,   description: "Analizar" },
  ];

  return (
    <>
      <div style={{ height: "100vh" }}>
        <TrianglePanels links={quickLinks} />
      </div>
    </>
  );
}

/* ─── Page ─── */

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted">Inicia sesión para acceder al dashboard.</p>
      </main>
    );
  }

  const user = session.user as SessionUser;

  const roleComponents: Record<Role, React.ReactNode> = {
    STUDENT: <StudentDashboard user={user} />,
    COMPANY: <CompanyDashboard user={user} />,
    ADMIN: <AdminDashboard user={user} />,
  };

  return <>{roleComponents[user.role] ?? <p className="p-8 text-muted">Rol no reconocido.</p>}</>;
}
