import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { ContactButton } from "./contact-button";
import {
  Globe,
  LinkIcon,
  Mail,
  ExternalLink,
  Calendar,
  FolderOpen,
  GraduationCap,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  UI_UX: "UI / UX",
  GRAPHIC: "Diseño Gráfico",
  PRODUCT: "Diseño de Producto",
  INTERIOR: "Diseño de Interiores",
  FASHION: "Diseño de Moda",
  MOTION: "Motion Graphics",
  OTHER: "Otros",
};

async function getStudentProfile(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        studentProfile: {
          select: {
            skills: true,
            course: true,
            linkedin: true,
            website: true,
          },
        },
        projects: {
          where: { visible: true },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            tags: true,
            category: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) return null;

    // Only expose public profiles of STUDENTs
    // We check the role separately to only show student profiles
    return user;
  } catch {
    return null;
  }
}

async function getUserRole(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    return user?.role ?? null;
  } catch {
    return null;
  }
}

export default async function StudentProfilePage({ params }: PageProps) {
  const { id } = await params;

  const [student, role, session] = await Promise.all([
    getStudentProfile(id),
    getUserRole(id),
    auth(),
  ]);

  if (!student || role !== "STUDENT") {
    notFound();
  }

  const isCompany =
    session?.user && (session.user as { role?: string }).role === "COMPANY";

  const createdDate = (date: Date) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar — Profile Info */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Avatar */}
            <div className="mb-4 flex justify-center">
              {student.image ? (
                <img
                  src={student.image}
                  alt={student.name ?? "Usuario"}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-50"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                  {student.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h1>
{student.studentProfile?.course && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    {student.studentProfile.course}
                  </span>
                )}
            </div>

            {/* Bio */}
            {student.bio && (
              <p className="mt-4 text-center text-sm text-gray-600 leading-relaxed">
                {student.bio}
              </p>
            )}

            {/* Skills */}
            {student.studentProfile?.skills && student.studentProfile.skills.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {student.studentProfile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mt-5 space-y-2">
              {student.studentProfile?.linkedin && (
                <a
                  href={student.studentProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
              {student.studentProfile?.website && (
                <a
                  href={student.studentProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  <Globe className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
              <a
                href={`mailto:${student.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <Mail className="h-4 w-4" />
                {student.email}
              </a>
            </div>

            {/* Contact button for companies */}
            {isCompany && <ContactButton studentId={student.id} />}
          </div>
        </aside>

        {/* Main — Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <FolderOpen className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Proyectos
            </h2>
          </div>

          {student.projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-16">
              <FolderOpen className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">
                Este estudiante no ha publicado proyectos todavía.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {student.projects.map((project) => {
                const shortDesc =
                  project.description.length > 200
                    ? project.description.slice(0, 200) + "..."
                    : project.description;

                return (
                  <Link
                    key={project.id}
                    href={`/portfolio/${project.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                          {project.title}
                        </h3>
                        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          {project.category ? (CATEGORY_LABELS[project.category] ?? project.category) : "General"}
                        </span>
                      </div>
                      <span className="whitespace-nowrap text-xs text-gray-400">
                        {createdDate(project.createdAt)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {shortDesc}
                    </p>

                    {project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
