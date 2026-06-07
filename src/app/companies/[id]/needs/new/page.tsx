"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const STATUS_OPTIONS = [
  { value: "open", label: "Abierta" },
  { value: "interviewing", label: "En proceso" },
  { value: "filled", label: "Cubierta" },
  { value: "closed", label: "Cerrada" },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function NewNeedPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [status, setStatus] = useState("open");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const skillsArray = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/companies/needs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          skills: skillsArray,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al publicar la necesidad");
      }

      setSuccess(true);
      router.refresh();

      setTimeout(() => {
        router.push(`/companies/${companyId}`);
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error inesperado",
      );
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light/30">
            <Plus className="h-8 w-8 text-accent" />
          </div>
          <h2 className="font-heading text-2xl font-medium tracking-tight text-fg">
            Necesidad Publicada
          </h2>
          <p className="mt-2 text-muted">
            Tu necesidad se ha publicado correctamente. Redirigiendo al perfil
            de la empresa...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/companies/${companyId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil de la empresa
      </Link>

      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Publicar Nueva Necesidad
        </h1>
        <p className="mt-1 text-muted">
          Describe qué tipo de talento o colaboración estás buscando.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-fg"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Buscamos diseñador UX/UI para proyecto web"
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-fg"
            >
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el proyecto, las responsabilidades, la duración estimada y cualquier otro detalle relevante..."
              className="mt-1.5 w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-fg"
            >
              Skills buscados{" "}
              <span className="text-muted">(separados por coma)</span>
            </label>
            <input
              id="skills"
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="UX Research, Figma, Design System, Prototyping"
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
            {skillsArray.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skillsArray.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-muted"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const newSkills = skillsArray.filter(
                          (s) => s !== skill,
                        );
                        setSkillsInput(newSkills.join(", "));
                      }}
                      className="text-muted hover:text-fg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-fg"
            >
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">
              Recomendamos &quot;Abierta&quot; para nuevas publicaciones.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href={`/companies/${companyId}`}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-fg hover:bg-primary-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              {saving ? "Publicando..." : "Publicar Necesidad"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
