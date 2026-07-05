import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

/* ────────────────────────────────────────────────────────────
   EL SEMANAL — helpers de la newsletter de la asociación
   Flujo: redactor sube PDF → IA extrae titular/resumen →
   redactor retoca y pulsa Enviar → email a socios + suscriptores
   con link a la edición alojada en /newsletter/[numero].
   ──────────────────────────────────────────────────────────── */

export const NEWSLETTER_NAME = "El Semanal";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3003";
// Resend exige dominio verificado; onboarding@resend.dev sirve para pruebas
// (solo entrega al propio email de la cuenta Resend).
const FROM = process.env.NEWSLETTER_FROM ?? `${NEWSLETTER_NAME} <onboarding@resend.dev>`;

/* ─── Extracción con IA ─── */

export interface ExtractedMeta {
  title: string;
  summary: string;
}

/**
 * Envía el PDF a Claude y devuelve titular + resumen propuestos.
 * Si no hay ANTHROPIC_API_KEY devuelve campos vacíos y el redactor
 * los escribe a mano (degradación sin bloqueo).
 */
export async function extractMetaFromPdf(pdfBase64: string): Promise<ExtractedMeta> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { title: "", summary: "" };
  }

  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Titular breve y atractivo de la edición, en castellano",
            },
            summary: {
              type: "string",
              description:
                "Resumen de 2-4 frases del contenido de la edición, en castellano, tono cercano",
            },
          },
          required: ["title", "summary"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
          },
          {
            type: "text",
            text: `Este PDF es una edición de "${NEWSLETTER_NAME}", la newsletter semanal de la Deusto Design Association (asociación de diseño universitaria). Sus secciones habituales: vida de la asociación, noticias de diseño, portfolio destacado y herramienta de la semana. Extrae un titular y un resumen para el email que invita a leerla.`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return { title: "", summary: "" };
  }
  try {
    const parsed = JSON.parse(textBlock.text) as ExtractedMeta;
    return { title: parsed.title ?? "", summary: parsed.summary ?? "" };
  } catch {
    return { title: "", summary: "" };
  }
}

/* ─── HTML del email ─── */

export function buildEmailHtml(edition: {
  number: number;
  title: string;
  summary: string;
}): string {
  const url = `${BASE_URL}/newsletter/${edition.number}`;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e5e5e5;">
        <tr><td style="padding:32px 40px 24px;border-bottom:2px solid #111111;">
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#777777;">Deusto Design Association</div>
          <div style="font-size:34px;color:#111111;margin-top:6px;">${NEWSLETTER_NAME} <span style="color:#c8102e;">— Nº ${edition.number}</span></div>
        </td></tr>
        <tr><td style="padding:32px 40px 8px;">
          <h1 style="margin:0;font-size:26px;line-height:1.25;color:#111111;font-weight:normal;">${escapeHtml(edition.title)}</h1>
        </td></tr>
        <tr><td style="padding:16px 40px 8px;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#444444;">${escapeHtml(edition.summary)}</p>
        </td></tr>
        <tr><td style="padding:28px 40px 36px;">
          <a href="${url}" style="display:inline-block;background:#c8102e;color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:14px;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 28px;">Leer la edición →</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #e5e5e5;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#777777;line-height:1.6;">
            Recibes esto por ser parte de la comunidad de diseño de Deusto.
            <a href="{{{UNSUB_URL}}}" style="color:#777777;">Darse de baja</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── Envío ─── */

/**
 * Vuelca los emails de todos los usuarios de la plataforma a la tabla
 * de suscriptores (source=member) sin tocar los que ya existen.
 * Así los socios reciben El Semanal automáticamente y las bajas se respetan.
 */
export async function syncMembersToSubscribers(): Promise<void> {
  const users = await prisma.user.findMany({ select: { email: true } });
  if (users.length === 0) return;
  await prisma.newsletterSubscriber.createMany({
    data: users.map((u) => ({ email: u.email.toLowerCase(), source: "member" })),
    skipDuplicates: true,
  });
}

export interface SendResult {
  sent: number;
  failed: number;
}

/**
 * Envía una edición a todos los suscriptores activos vía Resend.
 * El caller debe comprobar idempotencia (sentAt) antes de llamar.
 */
export async function sendEditionToAudience(edition: {
  number: number;
  title: string;
  summary: string;
}): Promise<SendResult> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no configurada");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  await syncMembersToSubscribers();
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
  });

  const html = buildEmailHtml(edition);
  const subject = `${NEWSLETTER_NAME} Nº ${edition.number} — ${edition.title}`;

  let sent = 0;
  let failed = 0;

  // Resend batch admite hasta 100 emails por llamada
  const CHUNK = 100;
  for (let i = 0; i < subscribers.length; i += CHUNK) {
    const chunk = subscribers.slice(i, i + CHUNK);
    const { error } = await resend.batch.send(
      chunk.map((sub) => {
        const unsubUrl = `${BASE_URL}/api/newsletter/unsubscribe?token=${sub.token}`;
        return {
          from: FROM,
          to: [sub.email],
          subject,
          html: html.replace("{{{UNSUB_URL}}}", unsubUrl),
          headers: {
            "List-Unsubscribe": `<${unsubUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        };
      }),
    );
    if (error) {
      failed += chunk.length;
      console.error("Resend batch error:", error);
    } else {
      sent += chunk.length;
    }
  }

  return { sent, failed };
}

/** Envío de prueba de una edición a un solo email (el del redactor). */
export async function sendTestEmail(
  edition: { number: number; title: string; summary: string },
  to: string,
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no configurada");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = buildEmailHtml(edition).replace("{{{UNSUB_URL}}}", `${BASE_URL}/newsletter`);
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `[PRUEBA] ${NEWSLETTER_NAME} Nº ${edition.number} — ${edition.title}`,
    html,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

/** Email de recordatorio a los redactores (sábado/domingo si no se ha enviado). */
export async function sendReminderToRedactores(): Promise<number> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no configurada");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const redactores = await prisma.user.findMany({
    where: { role: { in: ["REDACTOR", "ADMIN"] } },
    select: { email: true, name: true },
  });
  if (redactores.length === 0) return 0;

  const draft = await prisma.newsletterEdition.findFirst({
    where: { sentAt: null },
    orderBy: { number: "desc" },
  });

  const body = draft
    ? `Tienes la edición Nº ${draft.number} ("${draft.title}") subida pero SIN ENVIAR. Entra al panel y pulsa Enviar: ${BASE_URL}/dashboard/newsletter`
    : `Aún no hay edición de esta semana. Sube el PDF y envíala desde el panel: ${BASE_URL}/dashboard/newsletter`;

  const { error } = await resend.batch.send(
    redactores.map((r) => ({
      from: FROM,
      to: [r.email],
      subject: `⏰ Recordatorio: ${NEWSLETTER_NAME} de este domingo`,
      html: `<p>Hola${r.name ? ` ${r.name}` : ""},</p><p>${body}</p><p>— ${NEWSLETTER_NAME}, Deusto Design Association</p>`,
    })),
  );
  if (error) throw new Error(`Resend: ${error.message}`);
  return redactores.length;
}

/** ¿Se ha enviado ya una edición en los últimos N días? */
export async function sentWithinDays(days: number): Promise<boolean> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const count = await prisma.newsletterEdition.count({
    where: { sentAt: { gte: since } },
  });
  return count > 0;
}
