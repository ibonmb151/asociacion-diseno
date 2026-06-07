"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProjectActionsProps {
  projectId: string;
}

export function ProjectActions({ projectId }: ProjectActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este proyecto definitivamente?")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al eliminar el proyecto");
      }

      router.push("/portfolio");
      router.refresh();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error al eliminar el proyecto",
      );
    }
  };

  return (
    <div className="flex gap-2">
      <Link
        href={`/portfolio/${projectId}/edit`}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted hover:bg-primary-50"
      >
        <Pencil className="h-4 w-4" />
        Editar
      </Link>
      <button
        onClick={handleDelete}
        className="inline-flex items-center gap-1.5 rounded-md border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger-bg"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </button>
    </div>
  );
}
