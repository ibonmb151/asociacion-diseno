"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"

interface StudentData {
  name: string
  bio: string
  course: string
  skills: string[]
  linkedin: string
  website: string
}

interface CompanyData {
  name: string
  description: string
  sector: string
  location: string
  website: string
  logo: string
}

export default function EditProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const role = (session?.user as { role?: string } | undefined)?.role

  const [student, setStudent] = useState<StudentData>({
    name: "", bio: "", course: "", skills: [], linkedin: "", website: "",
  })
  const [company, setCompany] = useState<CompanyData>({
    name: "", description: "", sector: "", location: "", website: "", logo: "",
  })
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.error) return
        if (role === "STUDENT") {
          setStudent({
            name: data.name ?? "",
            bio: data.bio ?? "",
            course: data.studentProfile?.course ?? "",
            skills: data.studentProfile?.skills ?? [],
            linkedin: data.studentProfile?.linkedin ?? "",
            website: data.studentProfile?.website ?? "",
          })
        } else if (role === "COMPANY") {
          setCompany({
            name: data.name ?? "",
            description: data.description ?? "",
            sector: data.sector ?? "",
            location: data.location ?? "",
            website: data.website ?? "",
            logo: data.logo ?? "",
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [role])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const body = role === "STUDENT" ? student : company
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al guardar")
      }
      setSuccess(true)
      await update()
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  function addSkill() {
    const s = skillInput.trim()
    if (s && !student.skills.includes(s)) {
      setStudent(prev => ({ ...prev, skills: [...prev.skills, s] }))
    }
    setSkillInput("")
  }

  function removeSkill(skill: string) {
    setStudent(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Editar Perfil
        </h1>
        <p className="mt-1 text-muted">
          {role === "STUDENT"
            ? "Actualiza tu información personal y profesional."
            : "Actualiza la información de tu empresa."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-success-bg px-4 py-3 text-sm text-success">
              Perfil actualizado correctamente. Redirigiendo…
            </div>
          )}

          {/* ── Common fields ── */}
          <div>
            <label className="block text-sm font-medium text-fg">Nombre</label>
            <input
              type="text"
              value={role === "STUDENT" ? student.name : company.name}
              onChange={e => role === "STUDENT"
                ? setStudent(prev => ({ ...prev, name: e.target.value }))
                : setCompany(prev => ({ ...prev, name: e.target.value }))
              }
              required
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          {/* ── Student fields ── */}
          {role === "STUDENT" && (
            <>
              <div>
                <label className="block text-sm font-medium text-fg">Bio</label>
                <textarea
                  value={student.bio}
                  onChange={e => setStudent(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg">Curso</label>
                <input
                  type="text"
                  value={student.course}
                  onChange={e => setStudent(prev => ({ ...prev, course: e.target.value }))}
                  placeholder="e.g., 3rd Year Design"
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg">Skills</label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
                    placeholder="Añadir skill…"
                    className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    disabled={!skillInput.trim()}
                    className="rounded-md bg-accent-light/30 px-4 py-2 text-sm font-medium text-accent hover:bg-accent-light disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {student.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {student.skills.map(s => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 text-xs text-muted"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
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
                <label className="block text-sm font-medium text-fg">LinkedIn</label>
                <input
                  type="url"
                  value={student.linkedin}
                  onChange={e => setStudent(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg">Website / Portfolio</label>
                <input
                  type="url"
                  value={student.website}
                  onChange={e => setStudent(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>
            </>
          )}

          {/* ── Company fields ── */}
          {role === "COMPANY" && (
            <>
              <div>
                <label className="block text-sm font-medium text-fg">Descripción</label>
                <textarea
                  value={company.description}
                  onChange={e => setCompany(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg">Sector</label>
                <input
                  type="text"
                  value={company.sector}
                  onChange={e => setCompany(prev => ({ ...prev, sector: e.target.value }))}
                  placeholder="e.g., Tech, Design, Fashion"
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg">Ubicación</label>
                <input
                  type="text"
                  value={company.location}
                  onChange={e => setCompany(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Bilbao, Spain"
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fg">Website</label>
                <input
                  type="url"
                  value={company.website}
                  onChange={e => setCompany(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>
            </>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/dashboard"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-fg hover:bg-primary-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-surface hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
