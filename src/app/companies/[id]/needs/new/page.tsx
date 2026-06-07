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

      // Redirect to company profile after a short delay
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

  // ── Success state ──────────────────────────────────────────────
  if (success) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Plus className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900">
            Necesidad Publicada
          </h2>
          <p className="mt-2 text-green-700">
            Tu necesidad se ha publicado correctamente. Redirigiendo al perfil
            de la empresa...
          </p>
        </div>
      </main>
    );
  }

  // ── Form ───────────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/companies/${companyId}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil de la empresa
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Publicar Nueva Necesidad
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Describe qué tipo de talento o colaboración estás buscando.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Skills (comma-separated tags) */}
          <div>
            <label
              htmlFor="skills"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Skills buscados{" "}
              <span className="text-gray-400">(separados por coma)</span>
            </label>
            <input
              id="skills"
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="UX Research, Figma, Design System, Prototyping"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {skillsArray.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skillsArray.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
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
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Recomendamos &quot;Abierta&quot; para nuevas publicaciones.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href={`/companies/${companyId}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
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
