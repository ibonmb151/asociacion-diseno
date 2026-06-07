import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { ProjectActions } from "./project-actions";
import { FeedbackSection } from "./feedback-section";

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
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mi portfolio
      </Link>

      <article className="rounded-lg border border-border bg-surface">
        {/* Header */}
        <div className="border-b border-border p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
                {project.title}
              </h1>
              <span className="inline-block rounded-md bg-accent-light/30 px-3 py-1 text-sm text-accent">
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
            <h2 className="font-heading text-xl font-medium text-fg">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-fg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Tags
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-6 border-t border-border pt-4 text-sm text-muted">
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
                  className="font-medium text-accent hover:text-accent-hover"
                >
                  {project.user.name}
                </Link>
              </div>
            </div>

            {!project.visible && (
              <span className="rounded-md bg-warning-bg px-2 py-0.5 text-warning font-medium">
                Borrador / No visible
              </span>
            )}
          </div>
        </div>
      </article>

      <div className="mt-12">
        <FeedbackSection projectId={project.id} projectAuthorId={project.userId} />
      </div>
    </main>
  );
}
