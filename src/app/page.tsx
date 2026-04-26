import { CvUploadForm } from "@/app/components/CvUploadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto mb-8 max-w-5xl">
        <p className="mb-2 text-sm font-medium text-gray-500">
          ATS POC
        </p>

        <h1 className="text-3xl font-bold text-gray-900">
          Carga y parseo de CV
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Subí un CV en PDF para extraer texto plano y detectar datos básicos
          del candidato.
        </p>
      </div>

      <CvUploadForm />
    </main>
  );
}