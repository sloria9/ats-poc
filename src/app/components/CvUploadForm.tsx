"use client";

import { useState } from "react";
import type { CandidateExtract } from "../types/candidate";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";

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
    <section className="bg-white rounded-2xl shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-base font-medium text-slate-700 mb-2">
            <Upload className="w-4 h-4" />
            CV en PDF <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Procesando..." : "Procesar CV"}
        </button>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 px-8 py-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-800 mb-1">Error al procesar</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </form>

      {result && (
        <div className="mt-12 space-y-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-medium text-slate-900">
                Resultado de extracción
              </h2>
              <p className="text-sm text-slate-600">
                Páginas detectadas: {result.totalPages}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <EditableField label="Nombre" value={result.candidate.fullName ?? ""} />
            <EditableField label="Email" value={result.candidate.email ?? ""} />
            <EditableField label="Teléfono" value={result.candidate.phone ?? ""} />
            <EditableField label="Ubicación" value={result.candidate.location ?? ""} />
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Skills técnicas detectadas
            </h3>
            <textarea
              defaultValue={result.candidate.technicalSkills.join(", ")}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors h-24"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Skills blandas detectadas
            </h3>
            <textarea
              defaultValue={result.candidate.softSkills.join(", ")}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors h-24"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Idiomas detectados
            </h3>
            <textarea
              defaultValue={result.candidate.languages.join(", ")}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors h-20"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              JSON completo
            </h3>
            <pre className="max-h-96 overflow-auto rounded-lg bg-slate-50 p-4 text-xs border-2 border-slate-200">
              {JSON.stringify(result.candidate, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Texto original extraído
            </h3>
            <textarea
              readOnly
              value={result.candidate.rawText}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 h-96"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function EditableField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-base font-medium text-slate-700 mb-2 block">
        {label}
      </span>
      <input
        defaultValue={value}
        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
      />
    </label>
  );
}