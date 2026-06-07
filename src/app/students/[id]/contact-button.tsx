"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface ContactButtonProps {
  studentId: string;
}

export function ContactButton({ studentId }: ContactButtonProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const handleContact = async () => {
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: studentId,
          subject: "Interés en tu perfil",
          body: "Hola, vi tu perfil en la plataforma y me gustaría contactar contigo.",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al enviar mensaje");
      }

      router.push("/messages");
      router.refresh();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Error al enviar el mensaje",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={sending}
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-surface hover:bg-accent-hover disabled:opacity-50"
    >
      <Send className="h-4 w-4" />
      {sending ? "Enviando..." : "Contactar"}
    </button>
  );
}
