"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { FileUploader } from "@/components/candidate/FileUploader";

const DOCUMENT_TYPES = [
  { key: "id_card", label: "Pièce d'identité" },
  { key: "cv", label: "Curriculum Vitae (CV)" },
  { key: "project_presentation", label: "Présentation du projet" },
  { key: "business_plan", label: "Business plan" },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [files, setFiles] = useState<Record<string, File | null>>({});

  function handleNext() {
    sessionStorage.setItem("candidater_documents", JSON.stringify(
      Object.fromEntries(
        Object.entries(files).filter(([, v]) => v !== null).map(([k, v]) => [k, v!.name])
      )
    ));
    // Store actual files in sessionStorage as data URLs (for small files)
    // In production, upload to Supabase Storage on submit
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
          </>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-[var(--text-muted)]">
            Téléversez les documents que vous souhaitez joindre à votre candidature.
          </p>

          {DOCUMENT_TYPES.map((doc) => (
            <FileUploader
              key={doc.key}
              label={doc.label}
              file={files[doc.key] || null}
              onFileSelect={(f) => setFiles((prev) => ({ ...prev, [doc.key]: f }))}
            />
          ))}
        </div>

        <FormNavigation
          onBack="/candidater/motivation"
          onNext={handleNext}
        />
      </FormStepLayout>
    </CandidateLayout>
  );
}
