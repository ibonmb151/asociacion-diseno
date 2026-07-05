"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileUp,
  Loader2,
  Mail,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

interface Edition {
  id: string;
  number: number;
  title: string;
  summary: string;
  pdfUrl: string;
  sentAt: string | null;
  createdAt: string;
  author?: { id: string; name: string | null };
}

export default function NewsletterDashboardPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isRedactor = role === "REDACTOR" || role === "ADMIN";

  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Borrador en edición (titular/resumen retocables)
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSummary, setDraftSummary] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (res.ok) setEditions(data.editions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const draft = editions.find((e) => !e.sentAt) ?? null;

  useEffect(() => {
    if (draft) {
      setDraftTitle(draft.title);
      setDraftSummary(draft.summary);
    }
  }, [draft?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setNotice(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const res = await fetch("/api/newsletter/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al subir el PDF");
      } else {
        setNotice(
          data.aiGenerated
            ? "PDF subido. La IA ha propuesto titular y resumen — revísalos antes de enviar."
            : "PDF subido. Escribe titular y resumen antes de enviar.",
        );
        await load();
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function saveDraft(): Promise<boolean> {
    if (!draft) return false;
    const res = await fetch(`/api/newsletter/${draft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: draftTitle, summary: draftSummary }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
      return false;
    }
    await load();
    return true;
  }

  async function handleSend(test: boolean) {
    if (!draft) return;
    setError(null);
    setNotice(null);
    if (!draftTitle.trim() || !draftSummary.trim()) {
      setError("Completa titular y resumen antes de enviar");
      return;
    }
    if (!test && !confirm(`¿Enviar El Semanal Nº ${draft.number} a toda la audiencia?`)) {
      return;
    }
    setSending(test ? "test" : "real");
    try {
      if (!(await saveDraft())) return;
      const res = await fetch(`/api/newsletter/${draft.id}/send${test ? "?test=1" : ""}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al enviar");
      } else if (test) {
        setNotice(`Prueba enviada a ${data.to}. Revisa tu bandeja.`);
      } else {
        setNotice(`✅ Enviada a ${data.sent} suscriptores.`);
        await load();
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSending(null);
    }
  }

  async function handleDeleteDraft() {
    if (!draft || !confirm("¿Borrar este borrador y su PDF de la lista?")) return;
    const res = await fetch(`/api/newsletter/${draft.id}`, { method: "DELETE" });
    if (res.ok) {
      setNotice("Borrador eliminado.");
      await load();
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!isRedactor) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl text-fg">El Semanal</h1>
        <p className="mt-2 text-muted">
          Necesitas el rol de redactor para gestionar la newsletter.
        </p>
        <Link href="/dashboard" className="mt-6 inline-block text-sm text-accent hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
            El Semanal — Panel del redactor
          </h1>
          <p className="mt-1 text-muted">
            Sube el PDF de la edición, retoca el email y envíalo el domingo.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-danger-bg px-4 py-3 text-sm text-danger">{error}</div>
      )}
      {notice && (
        <div className="mt-6 bg-success-bg px-4 py-3 text-sm text-success">{notice}</div>
      )}

      {/* ─── Paso 1: subir PDF (si no hay borrador) ─── */}
      {!draft && (
        <label className="mt-8 flex cursor-pointer flex-col items-center gap-3 border border-dashed border-border bg-surface px-6 py-14 text-center hover:border-accent">
          <FileUp className="h-8 w-8 text-muted" />
          <span className="font-heading text-lg text-fg">
            {uploading ? "Subiendo y analizando con IA…" : "Sube el PDF de la nueva edición"}
          </span>
          <span className="text-sm text-muted">
            La IA propondrá titular y resumen que podrás retocar
          </span>
          {uploading && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}

      {/* ─── Paso 2: retocar y enviar (si hay borrador) ─── */}
      {draft && (
        <div className="mt-8 border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-fg">
              Borrador — Nº {draft.number}
            </h2>
            <div className="flex items-center gap-3">
              <a
                href={draft.pdfUrl}
                target="_blank"
                className="text-sm text-accent hover:underline"
              >
                Ver PDF
              </a>
              <button
                onClick={handleDeleteDraft}
                className="text-muted hover:text-danger"
                title="Borrar borrador"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="nl-title" className="flex items-center gap-1.5 text-sm font-medium text-fg">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Titular del email
              </label>
              <input
                id="nl-title"
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="mt-1.5 w-full border border-border bg-bg px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="nl-summary" className="block text-sm font-medium text-fg">
                Resumen (2-4 frases)
              </label>
              <textarea
                id="nl-summary"
                rows={4}
                value={draftSummary}
                onChange={(e) => setDraftSummary(e.target.value)}
                className="mt-1.5 w-full border border-border bg-bg px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Preview del email */}
          <div className="mt-6 border border-border bg-bg p-5">
            <div className="text-[10px] uppercase tracking-widest text-muted">
              Vista previa del email
            </div>
            <div className="mt-3 border-b-2 border-fg pb-2">
              <div className="text-[10px] uppercase tracking-widest text-muted">
                Deusto Design Association
              </div>
              <div className="font-heading text-2xl text-fg">
                El Semanal <span className="text-accent">— Nº {draft.number}</span>
              </div>
            </div>
            <div className="mt-3 font-heading text-lg text-fg">
              {draftTitle || "(sin titular)"}
            </div>
            <p className="mt-2 text-sm text-muted">{draftSummary || "(sin resumen)"}</p>
            <div className="mt-4 inline-block bg-accent px-4 py-2 text-xs uppercase tracking-wider text-white">
              Leer la edición →
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => handleSend(true)}
              disabled={sending !== null}
              className="inline-flex items-center gap-2 border border-border bg-bg px-4 py-2.5 text-sm text-fg hover:border-accent disabled:opacity-50"
            >
              {sending === "test" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Enviarme una prueba
            </button>
            <button
              onClick={() => handleSend(false)}
              disabled={sending !== null}
              className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {sending === "real" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar a toda la audiencia
            </button>
          </div>
        </div>
      )}

      {/* ─── Ediciones enviadas ─── */}
      <div className="mt-12">
        <h2 className="font-heading text-xl text-fg">Ediciones enviadas</h2>
        {editions.filter((e) => e.sentAt).length === 0 ? (
          <p className="mt-3 text-sm text-muted">Todavía ninguna. La primera está cerca.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border border-border">
            {editions
              .filter((e) => e.sentAt)
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between bg-surface px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <div>
                      <span className="text-sm font-medium text-fg">
                        Nº {e.number} — {e.title}
                      </span>
                      <span className="ml-2 text-xs text-muted">
                        {new Date(e.sentAt!).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/newsletter/${e.number}`}
                    className="text-sm text-accent hover:underline"
                  >
                    Ver
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
