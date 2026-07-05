"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error ?? "No se pudo completar el alta");
      } else {
        setState("done");
        setMessage("¡Dentro! El próximo domingo te llega la primera.");
        setEmail("");
      }
    } catch {
      setState("error");
      setMessage("Error de conexión. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex max-w-md gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="whitespace-nowrap bg-accent px-5 py-3 text-xs uppercase tracking-wider text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {state === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Suscribirme"
          )}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${state === "error" ? "text-danger" : "text-success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
