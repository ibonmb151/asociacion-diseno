import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: Props) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams()
    for (const [key, val] of Object.entries(searchParams)) {
      if (val) params.set(key, val)
    }
    params.set("page", String(page))
    return `${basePath}?${params.toString()}`
  }

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 pt-8">
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-fg hover:bg-primary-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-muted opacity-50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${
              p === currentPage
                ? "bg-accent text-white"
                : "text-fg hover:bg-primary-50"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-fg hover:bg-primary-50"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm text-muted opacity-50 cursor-not-allowed">
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = []
  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total)
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total)
  }
  return pages
}
