import { NextResponse } from "next/server";
import { extractCvText } from "../../lib/extractCvText";
import { parseCvData } from "../../lib/parseCvData";

export const runtime = "nodejs";

type UploadedFormData = {
  get(name: string): File | string | null;
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo." },
        { status: 400 }
      );
    }

    const formData = (await request.formData()) as unknown as UploadedFormData;
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo." },
        { status: 400 }
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "El archivo debe ser un PDF." },
        { status: 400 }
      );
    }

    const maxSizeInMb = 5;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: `El archivo no puede superar los ${maxSizeInMb} MB.` },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const { text, totalPages } = await extractCvText(buffer);

    if (!text) {
      return NextResponse.json(
        {
          error:
            "No se pudo extraer texto del PDF. Puede ser un archivo escaneado o una imagen.",
        },
        { status: 422 }
      );
    }

    const candidate = parseCvData(text);

    return NextResponse.json({
      totalPages,
      candidate,
    });
  } catch (error) {
    console.error("Error parsing CV:", error);

    return NextResponse.json(
      { error: "Ocurrió un error procesando el CV." },
      { status: 500 }
    );
  }
}
