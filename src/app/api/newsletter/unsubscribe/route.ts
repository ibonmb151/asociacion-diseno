import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/*  GET  /api/newsletter/unsubscribe?token=...  (link del email)       */
/*  POST idem (List-Unsubscribe-Post One-Click de Gmail/Outlook)       */
/* ------------------------------------------------------------------ */

async function unsubscribe(token: string | null): Promise<boolean> {
  if (!token) return false;
  const result = await prisma.newsletterSubscriber.updateMany({
    where: { token },
    data: { active: false },
  });
  return result.count > 0;
}

function page(title: string, body: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:Georgia,serif;max-width:480px;margin:80px auto;text-align:center;color:#111;">
<h1 style="font-weight:normal;">${title}</h1><p style="font-family:Helvetica,sans-serif;color:#777;">${body}</p>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request: NextRequest) {
  try {
    const ok = await unsubscribe(new URL(request.url).searchParams.get("token"));
    return ok
      ? page("Baja completada", "No recibirás más El Semanal. Puedes volver cuando quieras desde la web.")
      : page("Enlace no válido", "Este enlace de baja no existe o ya fue usado.");
  } catch (error) {
    console.error("GET /api/newsletter/unsubscribe error:", error);
    return page("Error", "Inténtalo de nuevo más tarde.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const ok = await unsubscribe(new URL(request.url).searchParams.get("token"));
    return NextResponse.json({ ok });
  } catch (error) {
    console.error("POST /api/newsletter/unsubscribe error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
