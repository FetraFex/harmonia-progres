"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { FileUploader } from "@/components/candidate/FileUploader";
import { FileText, IdCard, BookOpen, Briefcase, Check } from "lucide-react";

const DOCUMENT_TYPES = [
  { key: "id_card", label: "Pièce d'identité", icon: IdCard, required: false },
  { key: "cv", label: "Curriculum Vitae (CV)", icon: BookOpen, required: false },
  { key: "project_presentation", label: "Présentation du projet", icon: FileText, required: false },
  { key: "business_plan", label: "Business plan", icon: Briefcase, required: false },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const uploadedCount = Object.values(files).filter(Boolean).length;

  function handleNext() {
    sessionStorage.setItem("candidater_documents", JSON.stringify(
      Object.fromEntries(
        Object.entries(files).filter(([, v]) => v !== null).map(([k, v]) => [k, v!.name])
      )
    ));
    router.push("/candidater/verification");
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="05"
        title="Vos documents"
        assistance={
          <>
            <p>Ces documents ne sont pas tous obligatoires, mais ils renforcent votre candidature.</p>
            <p>Formats acceptés : PDF, JPG, PNG. Taille maximale : 5 Mo par fichier.</p>
            <p className="text-xs text-text-muted mt-2">
              {uploadedCount} sur {DOCUMENT_TYPES.length} document(s) téléchargé(s).
            </p>
          </>
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-2">
              Documents à téléverser
            </h3>
            <p className="text-sm text-text-muted mb-5">
              Téléversez les documents que vous souhaitez joindre à votre candidature.
            </p>

            <div className="space-y-5">
              {DOCUMENT_TYPES.map((doc) => (
                <FileUploader
                  key={doc.key}
                  label={doc.label}
                  file={files[doc.key] || null}
                  onFileSelect={(f) => setFiles((prev) => ({ ...prev, [doc.key]: f }))}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl glass p-4 flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 shrink-0 rounded bg-teal/10 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-teal" strokeWidth={2} />
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Aucun document n&apos;est obligatoire pour soumettre votre candidature.
              Vous pourrez en ajouter plus tard si nécessaire.
            </p>
          </div>
        </div>

        <FormNavigation
          onBack="/candidater/motivation"
          onNext={handleNext}
        />
      </FormStepLayout>
    </CandidateLayout>
  );
}
