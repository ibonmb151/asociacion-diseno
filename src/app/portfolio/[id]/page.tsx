import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { Pencil, Trash2, ArrowLeft, Calendar, User } from "lucide-react";
import { ProjectActions } from "./project-actions";

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

async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return project;
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);
  const session = await auth();

  if (!project) {
    notFound();
  }

  const isAuthor = session?.user?.id === project.userId;
  const createdDate = new Date(project.createdAt).toLocaleDateString(
    "es-ES",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/portfolio"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mi portfolio
      </Link>

      <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {project.title}
              </h1>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {project.category ? (CATEGORY_LABELS[project.category] ?? project.category) : "General"}
              </span>
            </div>

            {isAuthor && (
              <ProjectActions projectId={project.id} />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6 sm:p-8">
          {/* Description */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Descripción
            </h2>
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{createdDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {project.user.image ? (
                  <img
                    src={project.user.image}
                    alt={project.user.name ?? "Usuario"}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <Link
                  href={`/students/${project.user.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {project.user.name}
                </Link>
              </div>
            </div>

            {!project.visible && (
              <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-700 font-medium">
                Borrador / No visible
              </span>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
