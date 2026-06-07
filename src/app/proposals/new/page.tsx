"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Send, X } from "lucide-react";

const CATEGORIES = [
  "Collaboration",
  "Project Idea",
  "Event",
  "General",
] as const;

export default function NewProposalPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("General");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleAddTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  }

  function handleRemoveTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al crear la propuesta");
        setSubmitting(false);
        return;
      }

      router.push("/proposals");
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/proposals"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a propuestas
      </Link>

      <div>
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Nueva Propuesta
        </h1>
        <p className="mt-1 text-muted">
          Propón una idea, colaboración o evento para la comunidad.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-fg"
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Taller de Design Thinking para principiantes"
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-fg"
            >
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-fg"
            >
              Descripción
            </label>
            <textarea
              id="description"
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica tu propuesta en detalle. ¿Qué objetivo tiene? ¿Quién puede participar? ¿Qué recursos se necesitan?"
              className="mt-1.5 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fg">
              Tags
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Ej: diseño, taller, UX"
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="rounded-md bg-accent-light/30 px-4 py-2 text-sm font-medium text-accent hover:bg-accent-light disabled:opacity-50"
              >
                Añadir
              </button>
            </div>

            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted hover:text-fg"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-muted">
              Presiona Enter o haz clic en &quot;Añadir&quot; para agregar un tag.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? "Creando…" : "Crear Propuesta"}
            </button>

            <Link
              href="/proposals"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-fg hover:bg-primary-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
