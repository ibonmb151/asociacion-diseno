"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

interface StudentSearchProps {
  initialQuery: string;
}

export function StudentSearch({ initialQuery }: StudentSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        router.push(`/students?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/students");
      }
    },
    [value, router],
  );

  const handleClear = useCallback(() => {
    setValue("");
    router.push("/students");
  }, [router]);

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar por nombre o skill..."
          className="w-full rounded-md border border-border bg-surface px-3 py-2 pl-10 pr-10 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
}
