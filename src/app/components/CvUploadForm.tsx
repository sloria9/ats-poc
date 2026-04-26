"use client";

import { useState } from "react";
import type { CandidateExtract } from "../types/candidate";

type ParseCvResponse = {
  totalPages: number;
  candidate: CandidateExtract;
};

export function CvUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParseCvResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Seleccioná un archivo PDF.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No se pudo procesar el CV.");
        return;
      }

      setResult(data);
    } catch {
      setError("Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            CV en PDF
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Procesando..." : "Procesar CV"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Resultado de extracción
            </h2>
            <p className="text-sm text-gray-500">
              Páginas detectadas: {result.totalPages}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <EditableField
              label="Nombre"
              value={result.candidate.fullName ?? ""}
            />
            <EditableField
              label="Email"
              value={result.candidate.email ?? ""}
            />
            <EditableField
              label="Teléfono"
              value={result.candidate.phone ?? ""}
            />
            <EditableField
              label="Ubicación"
              value={result.candidate.location ?? ""}
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900">
              Skills técnicas detectadas
            </h3>
            <textarea
              defaultValue={result.candidate.technicalSkills.join(", ")}
              className="h-24 w-full rounded-lg border border-gray-300 p-3 text-sm"
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900">
              Skills blandas detectadas
            </h3>
            <textarea
              defaultValue={result.candidate.softSkills.join(", ")}
              className="h-24 w-full rounded-lg border border-gray-300 p-3 text-sm"
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900">
              Idiomas detectados
            </h3>
            <textarea
              defaultValue={result.candidate.languages.join(", ")}
              className="h-20 w-full rounded-lg border border-gray-300 p-3 text-sm"
            />
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900">
              JSON completo
            </h3>
            <pre className="max-h-96 overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
              {JSON.stringify(result.candidate, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900">
              Texto original extraído
            </h3>
            <textarea
              readOnly
              value={result.candidate.rawText}
              className="h-96 w-full rounded-lg border border-gray-300 p-3 text-sm"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function EditableField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        defaultValue={value}
        className="w-full rounded-lg border border-gray-300 p-3 text-sm"
      />
    </label>
  );
}