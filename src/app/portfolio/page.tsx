"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, ArrowUpRight } from "lucide-react";

/* ─── Types ─── */

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  visible: boolean;
  createdAt: string;
  userId: string;
  user: { id: string; name: string };
}

interface ProjectFormData {
  title: string;
  description: string;
  tags: string;
  category: string;
  visible: boolean;
}

const DEFAULT_FORM: ProjectFormData = {
  title: "",
  description: "",
  tags: "",
  category: "UI_UX",
  visible: true,
};

const CATEGORIES = [
  { value: "UI_UX", label: "UI / UX" },
  { value: "GRAPHIC", label: "Diseño Gráfico" },
  { value: "PRODUCT", label: "Diseño de Producto" },
  { value: "INTERIOR", label: "Diseño de Interiores" },
  { value: "FASHION", label: "Diseño de Moda" },
  { value: "MOTION", label: "Motion Graphics" },
  { value: "OTHER", label: "Otros" },
];

/* Category → subtle bg tint (editorial, desaturated) */
const CATEGORY_BG: Record<string, string> = {
  UI_UX:     "#EDEEF2",
  GRAPHIC:   "#F2EDEA",
  PRODUCT:   "#EEEEEE",
  INTERIOR:  "#EAEFEB",
  FASHION:   "#F2EAED",
  MOTION:    "#EDEAF2",
  OTHER:     "#F0F0F0",
};

/* ─── Modal ─── */

function ProjectFormModal({
  project,
  onClose,
  onSave,
}: {
  project?: Project | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const isEditing = !!project;
  const [form, setForm] = useState<ProjectFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        description: project.description,
        tags: project.tags.join(", "),
        category: project.category,
        visible: project.visible,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      category: form.category,
      visible: form.visible,
    };

    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al guardar el proyecto");
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg/60 p-4">
      <div className="w-full max-w-lg border border-border bg-bg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-heading text-xl font-normal tracking-tight text-fg">
            {isEditing ? "Editar proyecto" : "Nuevo proyecto"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-fg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="border-b border-danger/20 bg-danger-bg px-6 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted">
              Título
            </label>
            <input
              name="title" type="text" required
              value={form.title} onChange={handleChange}
              className="w-full border border-border bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:border-fg focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted">
              Descripción
            </label>
            <textarea
              name="description" required rows={4}
              value={form.description} onChange={handleChange}
              className="w-full border border-border bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:border-fg focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted">
              Tags <span className="normal-case">(separados por coma)</span>
            </label>
            <input
              name="tags" type="text"
              value={form.tags} onChange={handleChange}
              placeholder="branding, figma, identidad"
              className="w-full border border-border bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:border-fg focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted">
              Categoría
            </label>
            <select
              name="category"
              value={form.category} onChange={handleChange}
              className="w-full border border-border bg-surface px-4 py-2.5 text-sm text-fg focus:border-fg focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              id="visible" name="visible" type="checkbox"
              checked={form.visible} onChange={handleChange}
              className="h-4 w-4 border-border accent-fg"
            />
            <label htmlFor="visible" className="text-sm text-muted">
              Visible en mi perfil público
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button" onClick={onClose}
              className="border border-border px-5 py-2 text-sm font-medium text-fg hover:border-fg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={saving}
              className="border border-fg bg-fg px-5 py-2 text-sm font-medium text-bg hover:bg-transparent hover:text-fg transition-colors disabled:opacity-40"
            >
              {saving ? "Guardando..." : isEditing ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Project Card ─── */

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const bgColor = CATEGORY_BG[project.category] ?? "#EEEEEE";
  const categoryLabel = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;
  const initials = project.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="group flex flex-col">
      {/* Visual block */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Category label top-left */}
        <span className="absolute left-4 top-4 font-body text-[0.65rem] font-medium uppercase tracking-widest text-fg/40">
          {categoryLabel}
        </span>

        {/* Center initials */}
        <div className="flex h-full items-center justify-center">
          <span className="font-heading text-[5rem] font-normal leading-none tracking-tight text-fg/10 select-none">
            {initials}
          </span>
        </div>

        {/* Hidden badge */}
        {!project.visible && (
          <span className="absolute right-4 top-4 border border-warning bg-warning-bg px-2 py-0.5 text-xs text-warning">
            Borrador
          </span>
        )}

        {/* Edit / Delete on hover */}
        <div className="absolute right-3 bottom-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center bg-bg/90 text-fg hover:bg-bg transition-colors"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center bg-bg/90 text-accent hover:bg-bg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Below visual — title + action */}
      <div className="flex items-start justify-between border-b border-border pt-3 pb-4">
        <div className="flex-1 pr-4">
          <p className="font-heading text-base font-normal leading-tight tracking-tight text-fg">
            {project.title}
          </p>
          {project.tags.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              {project.tags.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>
        <Link
          href={`/portfolio/${project.id}`}
          className="group/btn flex items-center gap-1 border border-border px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:border-fg flex-shrink-0"
        >
          Ver
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Error al cargar proyectos");
      const data = await res.json();
      setProjects(data.projects ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto definitivamente?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al eliminar");
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center py-32">
          <div className="h-6 w-6 animate-spin border-2 border-fg border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="border border-danger/20 bg-danger-bg p-4 text-sm text-danger">{error}</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-8 mb-10">
        <div>
          <p className="editorial-eyebrow mb-2">Portfolio</p>
          <h1 className="font-heading text-4xl font-normal tracking-tight text-fg">
            Mis proyectos
          </h1>
        </div>
        <button
          onClick={() => { setEditingProject(null); setModalOpen(true); }}
          className="flex items-center gap-2 border border-fg bg-fg px-5 py-2.5 text-sm font-medium text-bg hover:bg-transparent hover:text-fg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo proyecto
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center border border-dashed border-border py-32">
          <p className="font-heading text-2xl font-normal text-muted">Sin proyectos todavía</p>
          <p className="mt-2 text-sm text-muted">Crea tu primer proyecto.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-8 border border-fg bg-fg px-6 py-2.5 text-sm font-medium text-bg hover:bg-transparent hover:text-fg transition-colors"
          >
            Crear proyecto
          </button>
        </div>
      )}

      {/* Grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => { setEditingProject(project); setModalOpen(true); }}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => { setModalOpen(false); setEditingProject(null); }}
          onSave={() => { setModalOpen(false); setEditingProject(null); fetchProjects(); }}
        />
      )}
    </main>
  );
}
