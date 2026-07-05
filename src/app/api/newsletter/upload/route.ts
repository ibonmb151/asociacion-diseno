import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { extractMetaFromPdf } from "@/lib/newsletter";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/* ------------------------------------------------------------------ */
/*  POST /api/newsletter/upload                                        */
/*  FormData: { pdf: File }                                            */
/*  Requiere rol REDACTOR o ADMIN.                                     */
/*  Guarda el PDF en disco, extrae titular/resumen con IA y crea la    */
/*  edición como borrador (sentAt = null).                             */
/* ------------------------------------------------------------------ */

const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!session?.user?.id || (role !== "REDACTOR" && role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("pdf");

    if (!(file instanceof File) || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Sube un archivo PDF válido" },
        { status: 400 },
      );
    }
    if (file.size > MAX_PDF_BYTES) {
      return NextResponse.json(
        { error: "El PDF supera el límite de 25 MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Número de la nueva edición
    const last = await prisma.newsletterEdition.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const number = (last?.number ?? 0) + 1;

    // Guardar PDF en disco (filosofía VPS: storage local; migrable a S3)
    const dir = path.join(process.cwd(), "public", "uploads", "newsletter");
    await mkdir(dir, { recursive: true });
    const filename = `edicion-${number}.pdf`;
    await writeFile(path.join(dir, filename), buffer);
    const pdfUrl = `/uploads/newsletter/${filename}`;

    // IA propone titular y resumen (vacíos si no hay API key)
    let meta = { title: "", summary: "" };
    try {
      meta = await extractMetaFromPdf(buffer.toString("base64"));
    } catch (err) {
      console.error("Extracción IA falló, el redactor escribirá a mano:", err);
    }

    const edition = await prisma.newsletterEdition.create({
      data: {
        number,
        title: meta.title || `El Semanal Nº ${number}`,
        summary: meta.summary,
        pdfUrl,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ edition, aiGenerated: Boolean(meta.title) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/newsletter/upload error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
