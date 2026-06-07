import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  FolderOpen,
  Briefcase,
  Users,
  MessageSquare,
  UserCheck,
  Search,
  HeartHandshake,
  FileText,
} from "lucide-react";
import Link from "next/link";

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
    prisma.project.count({ where: { userId: userId } }),
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

function StudentDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Mis Proyectos", href: "/portfolio", icon: FolderOpen },
    { label: "Mi Portfolio", href: "/portfolio", icon: FileText },
    { label: "Foro", href: "/forum", icon: MessageSquare },
    { label: "Empresas", href: "/companies", icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {user.name}
        </h1>
        <p className="mt-1 text-gray-500">
          Gestiona tu perfil, proyectos y conexiones profesionales.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Stats are loaded dynamically via a client component or we can inline them */}
      <StatsSection userId={user.id} role="STUDENT" />
    </div>
  );
}

function CompanyDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Publicar Necesidad", href: "/jobs/new", icon: FileText },
    { label: "Buscar Talentos", href: "/students", icon: Search },
    { label: "Mis Contactos", href: "/contacts", icon: HeartHandshake },
    { label: "Mensajes", href: "/messages", icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {user.name}
        </h1>
        <p className="mt-1 text-gray-500">
          Encuentra talento, publica oportunidades y gestiona tu red de
          contactos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      <StatsSection userId={user.id} role="COMPANY" />
    </div>
  );
}

function AdminDashboard({ user }: { user: SessionUser }) {
  const quickLinks = [
    { label: "Gestionar Usuarios", href: "/admin/users", icon: Users },
    { label: "Proyectos", href: "/admin/projects", icon: FolderOpen },
    { label: "Empresas", href: "/admin/companies", icon: Briefcase },
    { label: "Reportes", href: "/admin/reports", icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Panel de Administración
        </h1>
        <p className="mt-1 text-gray-500">
          Bienvenido, {user.name}. Gestiona la plataforma.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <Icon className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      <StatsSection userId={user.id} role="ADMIN" />
    </div>
  );
}

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
      {
        label: "Mis Proyectos",
        value: data.projects,
        icon: <FolderOpen className="h-6 w-6" />,
        href: "/portfolio",
      },
      {
        label: "Contactos",
        value: data.contactRequests,
        icon: <HeartHandshake className="h-6 w-6" />,
        href: "/networking",
      },
      {
        label: "Empresas",
        value: 0,
        icon: <Briefcase className="h-6 w-6" />,
        href: "/companies",
      },
      {
        label: "Foro",
        value: 0,
        icon: <MessageSquare className="h-6 w-6" />,
        href: "/forum",
      },
    ];
  } else if (role === "COMPANY") {
    const data = await getCompanyStats(userId);
    stats = [
      {
        label: "Necesidades",
        value: data.needs,
        icon: <FileText className="h-6 w-6" />,
        href: "/companies",
      },
      {
        label: "Contactos",
        value: data.contactRequests,
        icon: <HeartHandshake className="h-6 w-6" />,
        href: "/networking",
      },
      {
        label: "Estudiantes",
        value: 0,
        icon: <Users className="h-6 w-6" />,
        href: "/students",
      },
      {
        label: "Candidatos",
        value: 0,
        icon: <MessageSquare className="h-6 w-6" />,
        href: "/proposals",
      },
    ];
  } else {
    const data = await getAdminStats();
    stats = [
      {
        label: "Estudiantes",
        value: data.students,
        icon: <Users className="h-6 w-6" />,
        href: "/admin/users?role=STUDENT",
      },
      {
        label: "Empresas",
        value: data.companies,
        icon: <Briefcase className="h-6 w-6" />,
        href: "/admin/users?role=COMPANY",
      },
      {
        label: "Proyectos",
        value: data.projects,
        icon: <FolderOpen className="h-6 w-6" />,
        href: "/admin/projects",
      },
      {
        label: "Reportes",
        value: 0,
        icon: <FileText className="h-6 w-6" />,
        href: "/admin/reports",
      },
    ];
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Inicia sesión para acceder al dashboard.
        </p>
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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {roleComponents[user.role] ?? (
        <p className="text-gray-500">Rol no reconocido.</p>
      )}
    </main>
  );
}
