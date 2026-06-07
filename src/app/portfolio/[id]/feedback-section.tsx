"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Star, MessageSquare } from "lucide-react"

interface FeedbackItem {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
}

interface Props {
  projectId: string
  projectAuthorId: string
}

export function FeedbackSection({ projectId, projectAuthorId }: Props) {
  const { data: session } = useSession()
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/projects/${projectId}/feedback`)
      .then(r => r.json())
      .then(setFeedback)
      .catch(() => {})
  }, [projectId])

  const avgRating = feedback.length
    ? (feedback.reduce((a, b) => a + b.rating, 0) / feedback.length).toFixed(1)
    : null

  const canRate = session?.user?.id && session.user.id !== projectAuthorId
  const hasRated = feedback.some(f => f.user.id === session?.user?.id)

  async function handleSubmit() {
    if (!rating || !canRate || hasRated) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch(`/api/projects/${projectId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al enviar valoración")
      }
      const newFeedback = await res.json()
      setFeedback(prev => [newFeedback, ...prev])
      setRating(0)
      setComment("")
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al enviar valoración")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-light/30 text-accent">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h2 className="font-heading text-xl font-medium text-fg">Valoraciones</h2>
        </div>
        {avgRating && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${
                    s <= Math.round(Number(avgRating))
                      ? "fill-accent text-accent"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-fg">{avgRating}</span>
            <span className="text-sm text-muted">({feedback.length})</span>
          </div>
        )}
      </div>

      {/* Feedback form */}
      {canRate && !hasRated && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-fg">Tu valoración</label>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoveredStar(s)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(s)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-6 w-6 ${
                      s <= (hoveredStar || rating)
                        ? "fill-accent text-accent"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-fg">
              Comentario <span className="text-muted">(opcional)</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Comparte tu opinión sobre este proyecto..."
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>
          {error && (
            <p className="mb-3 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!rating || submitting}
              className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-surface hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Enviar valoración"}
            </button>
          </div>
        </div>
      )}

      {hasRated && (
        <p className="mt-4 text-sm text-muted">Ya has valorado este proyecto.</p>
      )}

      {/* Feedback list */}
      {feedback.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-primary-50 py-8 text-center">
          <p className="text-sm text-muted">Aún no hay valoraciones. ¡Sé el primero en valorar!</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {feedback.map(f => (
            <div
              key={f.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-xs font-medium text-fg">
                    {f.user.name?.charAt(0) ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-fg">{f.user.name}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= f.rating ? "fill-accent text-accent" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {f.comment && (
                <p className="mt-2 text-sm text-fg">{f.comment}</p>
              )}
              <p className="mt-1 text-xs text-muted">
                {new Date(f.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
