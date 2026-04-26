import { CvUploadForm } from "@/app/components/CvUploadForm";
import { FileText } from "lucide-react"; // Agrega este import

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header de sección con ícono */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-medium text-slate-900 mb-2">
            Carga y parseo de CV
          </h1>
          <p className="text-base text-slate-600">
            Subí un CV en PDF para extraer texto plano y detectar datos básicos del candidato.
          </p>
        </div>

        <CvUploadForm />
      </div>
    </main>
  );
}