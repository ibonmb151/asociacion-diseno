"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Modal                                                             */
/* ------------------------------------------------------------------ */

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
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;
    const name = target.name;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg/50 p-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-fg">
            {isEditing ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-primary-50 hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-danger-bg p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-fg">
              Título
            </label>
            <input
              id="title" name="title" type="text" required
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-fg">
              Descripción
            </label>
            <textarea
              id="description" name="description" required rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium text-fg">
              Tags <span className="text-muted">(separados por coma)</span>
            </label>
            <input
              id="tags" name="tags" type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="branding, identidad visual, figma"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-fg">
              Categoría
            </label>
            <select
              id="category" name="category"
              value={form.category} onChange={handleChange}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="visible" name="visible" type="checkbox"
              checked={form.visible} onChange={handleChange}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
            />
            <label htmlFor="visible" className="text-sm text-fg">
              Proyecto visible en mi perfil público
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-primary-50"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={saving}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Guardando..." : isEditing ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function PortfolioPage() {
  const router = useRouter();
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-md bg-danger-bg p-4 text-sm text-danger">{error}</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
            Mi Portfolio
          </h1>
          <p className="mt-1 text-sm text-muted">
            Gestiona tus proyectos y muestra tu trabajo.
          </p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20">
          <svg className="mb-4 h-12 w-12 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M2 6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v1M4 10h16l-1.78 5.33A2 2 0 0116.28 17H7.72a2 2 0 01-1.94-1.33L4 10z" />
          </svg>
          <p className="text-lg font-medium text-muted">No tienes proyectos todavía</p>
          <p className="mt-1 text-sm text-muted">Crea tu primer proyecto para mostrar tu trabajo.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-surface hover:bg-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Crear Proyecto
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={() => { setEditingProject(project); setModalOpen(true); }}
            onDelete={() => handleDelete(project.id)}
          />
        ))}
      </div>

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

/* ------------------------------------------------------------------ */
/*  Project Card                                                      */
/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const shortDescription =
    project.description.length > 120
      ? project.description.slice(0, 120) + "..."
      : project.description;

  const createdDate = new Date(project.createdAt).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="bento-card group flex flex-col">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <Link
          href={`/portfolio/${project.id}`}
          className="font-heading text-lg font-semibold text-fg hover:text-accent"
        >
          {project.title}
        </Link>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button onClick={onEdit} className="rounded-md p-1.5 text-muted hover:bg-primary-50 hover:text-accent" title="Editar">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="rounded-md p-1.5 text-muted hover:bg-danger-bg hover:text-danger" title="Eliminar">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">{shortDescription}</p>

      {/* Category badge */}
      <div className="mb-3">
        <span className="inline-block rounded-md bg-accent-light/30 px-2.5 py-0.5 text-xs font-medium text-accent">
          {CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category}
        </span>
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
        <span>{createdDate}</span>
        {!project.visible && (
          <span className="rounded-md bg-warning-bg px-1.5 py-0.5 text-warning">
            Oculto
          </span>
        )}
      </div>
    </div>
  );
}
