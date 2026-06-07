import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { ArrowLeft, MessageCircle, Trash2, Send } from "lucide-react";

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
      return "bg-primary-100 text-primary-700";
    case "Feedback":
      return "bg-secondary/10 text-secondary-dark";
    case "Resources":
      return "bg-success/10 text-success";
    case "General":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
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
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al foro
      </Link>

      {/* ── Post ── */}
      <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2">
          {post.pinned && (
            <span className="flex items-center gap-1 rounded-md bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary-dark">
              📌 Pinned
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
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          {post.title}
        </h1>

        {/* Autor y fecha */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>
            Por{" "}
            <span className="font-medium text-foreground">
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
        <div className="prose prose-sm prose-primary mt-6 max-w-none whitespace-pre-wrap text-foreground">
          {post.content}
        </div>

        {/* Acciones (solo autor) */}
        {isAuthor && (
          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
            <form action={deletePost.bind(null, post.id)}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive transition-colors hover:text-red-600"
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
        <h2 className="text-xl font-bold text-primary">
          Comentarios ({post._count.comments})
        </h2>

        {/* Lista de comentarios */}
        <div className="mt-6 space-y-4">
          {post.comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-6 py-12 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                Aún no hay comentarios. ¡Sé el primero en responder!
              </p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary-100"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {comment.user.name ?? "Usuario"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ── Formulario para añadir comentario (Server Action) ── */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-primary">
            Añadir comentario
          </h3>

          <form action={addComment.bind(null, post.id)} className="mt-4">
            <textarea
              name="content"
              rows={4}
              required
              placeholder="Escribe tu comentario…"
              className="w-full resize-y rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />

            <div className="mt-3 flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-light active:scale-[0.98]"
              >
                <Send className="h-4 w-4" />
                Publicar comentario
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Tu comentario será visible para todos los usuarios.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
