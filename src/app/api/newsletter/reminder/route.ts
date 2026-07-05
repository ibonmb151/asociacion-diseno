import { NextRequest, NextResponse } from "next/server";
import { sendReminderToRedactores, sentWithinDays } from "@/lib/newsletter";

/* ------------------------------------------------------------------ */
/*  GET /api/newsletter/reminder?key=NEWSLETTER_CRON_SECRET            */
/*  Pensado para cron-job.org: sábado 10:00 y domingo 10:00.           */
/*  Si NO se ha enviado edición en los últimos 6 días → recordatorio   */
/*  por email a todos los REDACTOR/ADMIN. Si ya se envió, no hace nada.*/
/*  (Mismo patrón de disparador externo que InTerms.)                  */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.NEWSLETTER_CRON_SECRET;
    const key = new URL(request.url).searchParams.get("key");

    if (!secret || key !== secret) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (await sentWithinDays(6)) {
      return NextResponse.json({ ok: true, action: "none", reason: "edición ya enviada esta semana" });
    }

    const notified = await sendReminderToRedactores();
    return NextResponse.json({ ok: true, action: "reminder", notified });
  } catch (error) {
    console.error("GET /api/newsletter/reminder error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
