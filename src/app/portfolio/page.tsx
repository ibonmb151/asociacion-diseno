"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, FolderOpen, Palette, Clock } from "lucide-react";

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

function getCategoryGradient(category: string): string {
  switch (category) {
    case "UI_UX": return "from-accent/20 to-secondary/20";
    case "GRAPHIC": return "from-secondary/20 to-accent/20";
    case "PRODUCT": return "from-accent/20 to-accent-light";
    case "MOTION": return "from-secondary-muted to-accent/20";
    default: return "from-accent-light/50 to-secondary-muted";
  }
}

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fg/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-fg">
            {isEditing ? "Editar proyecto" : "Nuevo proyecto"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-accent-light hover:text-fg"
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
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-fg">Título</label>
            <input
              id="title" name="title" type="text" required
              value={form.title} onChange={handleChange}
              className="search-input pl-3"
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-fg">Descripción</label>
            <textarea
              id="description" name="description" required rows={4}
              value={form.description} onChange={handleChange}
              className="search-input pl-3 resize-none"
            />
          </div>
          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium text-fg">
              Tags <span className="text-muted">(separados por coma)</span>
            </label>
            <input
              id="tags" name="tags" type="text"
              value={form.tags} onChange={handleChange}
              placeholder="branding, identidad visual, figma"
              className="search-input pl-3"
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-fg">Categoría</label>
            <select
              id="category" name="category"
              value={form.category} onChange={handleChange}
              className="select-input w-full"
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
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
    project.description.length > 100
      ? project.description.slice(0, 100) + "..."
      : project.description;

  const createdDate = new Date(project.createdAt).toLocaleDateString("es-ES", {
    year: "numeric", month: "short",
  });

  const categoryLabel = CATEGORIES.find((c) => c.value === project.category)?.label ?? project.category;

  return (
    <div className="project-card group">
      {/* Image area */}
      <Link href={`/portfolio/${project.id}`}>
        <div className={`flex aspect-[4/3] items-center justify-center rounded-t-xl bg-gradient-to-br ${getCategoryGradient(project.category)}`}>
          <Palette className="h-14 w-14 text-accent/30 transition-transform group-hover:scale-110" />
        </div>
      </Link>

      <div className="p-5">
        {/* Category + visibility */}
        <div className="flex items-center justify-between">
          <span className="tag text-[10px]">{categoryLabel}</span>
          {!project.visible && (
            <span className="rounded-md bg-warning-bg px-2 py-0.5 text-[10px] font-medium text-warning">
              Oculto
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/portfolio/${project.id}`}
          className="mt-3 block font-heading text-base font-semibold leading-snug text-fg transition-colors hover:text-accent"
        >
          {project.title}
        </Link>

        <p className="mt-1.5 text-sm leading-relaxed text-muted">{shortDescription}</p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-accent-light/30 px-2 py-0.5 text-[11px] text-accent">
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[11px] text-muted">+{project.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="h-3 w-3" />
            {createdDate}
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="rounded-md p-1.5 text-muted transition-colors hover:bg-accent-light hover:text-accent"
              title="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger-bg hover:text-danger"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Editorial header */}
      <div className="page-header mb-2">
        <span className="page-header-eyebrow">Proyectos</span>
        <h1 className="font-heading text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Portfolio
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
          Comparte tu trabajo con la comunidad. Cada proyecto es una 
          oportunidad para recibir feedback, inspirar a otros y construir 
          tu identidad profesional.
        </p>
      </div>

      {/* Action bar */}
      <div className="mb-10 flex items-center justify-between border-b border-border pb-5">
        <p className="text-sm text-muted">
          {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
        </p>
        <button
          onClick={() => { setEditingProject(null); setModalOpen(true); }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Nuevo proyecto
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="empty-state">
          <FolderOpen className="h-12 w-12 text-border" />
          <p className="mt-4 text-lg font-medium text-muted">No tienes proyectos todavía</p>
          <p className="mt-1 text-sm text-muted">Crea tu primer proyecto para mostrar tu trabajo a la comunidad.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary mt-6"
          >
            <Plus className="h-4 w-4" />
            Crear proyecto
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
