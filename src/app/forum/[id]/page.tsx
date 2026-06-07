import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { ArrowLeft, MessageCircle, Trash2, Send, Pin } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

interface PostPageProps {
  params: Promise<{ id: string }>;
}

/* ------------------------------------------------------------------ */
/*  Server Actions                                                     */
/* ------------------------------------------------------------------ */

async function addComment(postId: string, formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Debes iniciar sesión para comentar");
  }

  const content = formData.get("content") as string;
  if (!content || !content.trim()) {
    throw new Error("El comentario no puede estar vacío");
  }

  await prisma.forumComment.create({
    data: {
      content: content.trim(),
      postId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/forum/${postId}`);
}

async function deletePost(postId: string) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Debes iniciar sesión");
  }

  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    select: { userId: true },
  });

  if (!post) {
    throw new Error("Post no encontrado");
  }

  if (post.userId !== session.user.id) {
    throw new Error("No tienes permisos para eliminar este post");
  }

  await prisma.forumPost.delete({ where: { id: postId } });

  revalidatePath("/forum");
  redirect("/forum");
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getCategoryStyles(category: string | null): string {
  switch (category) {
    case "Discussion":
      return "bg-accent-light/30 text-accent";
    case "Feedback":
      return "bg-secondary-muted text-secondary";
    case "Resources":
      return "bg-success-bg text-success";
    case "General":
      return "bg-primary-50 text-muted";
    default:
      return "bg-primary-50 text-muted";
  }
}

/* ------------------------------------------------------------------ */
/*  Página de detalle de post                                          */
/*  Server Component                                                   */
/* ------------------------------------------------------------------ */

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const post = await prisma.forumPost.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const session = await auth();
  const isAuthor = session?.user?.id === post.userId;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Volver ── */}
      <Link
        href="/forum"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al foro
      </Link>

      {/* ── Post ── */}
      <article className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2">
          {post.pinned && (
            <span className="flex items-center gap-1 rounded-md bg-secondary-muted px-2.5 py-0.5 text-xs font-medium text-secondary">
              <Pin className="h-3.5 w-3.5" />
              Pinned
            </span>
          )}
          {post.category && (
            <span
              className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium ${getCategoryStyles(post.category)}`}
            >
              {post.category}
            </span>
          )}
        </div>

        {/* Título */}
        <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight text-fg sm:text-3xl">
          {post.title}
        </h1>

        {/* Autor y fecha */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>
            Por{" "}
            <span className="font-medium text-fg">
              {post.user.name ?? "Usuario"}
            </span>
          </span>
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post._count.comments}{" "}
            {post._count.comments === 1 ? "comentario" : "comentarios"}
          </span>
        </div>

        {/* Contenido */}
        <div className="prose prose-sm prose-primary mt-6 max-w-none whitespace-pre-wrap text-fg">
          {post.content}
        </div>

        {/* Acciones (solo autor) */}
        {isAuthor && (
          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
            <form action={deletePost.bind(null, post.id)}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger-bg"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar post
              </button>
            </form>
          </div>
        )}
      </article>

      {/* ── Sección de comentarios ── */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-medium text-fg">
          Comentarios ({post._count.comments})
        </h2>

        {/* Lista de comentarios */}
        <div className="mt-6 space-y-4">
          {post.comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-primary-50 py-16 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 text-sm text-muted">
                Aún no hay comentarios. ¡Sé el primero en responder!
              </p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-fg">
                    {comment.user.name ?? "Usuario"}
                  </span>
                  <span className="text-xs text-muted">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ── Formulario para añadir comentario (Server Action) ── */}
        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h3 className="text-base font-medium text-fg">
            Añadir comentario
          </h3>

          <form action={addComment.bind(null, post.id)} className="mt-4">
            <textarea
              name="content"
              rows={4}
              required
              placeholder="Escribe tu comentario…"
              className="w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />

            <div className="mt-3 flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                <Send className="h-4 w-4" />
                Publicar comentario
              </button>
            </div>

            <p className="mt-2 text-xs text-muted">
              Tu comentario será visible para todos los usuarios.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
