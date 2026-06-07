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
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Pencil className="h-4 w-4" />
        Editar
      </Link>
      <button
        onClick={handleDelete}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </button>
    </div>
  );
}
