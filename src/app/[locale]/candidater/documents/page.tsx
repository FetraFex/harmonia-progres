"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { FileUploader } from "@/components/candidate/FileUploader";
import { createClient } from "@/lib/supabase/client";
import { FileText, IdCard, BookOpen, Briefcase, Check, Loader2, AlertTriangle } from "lucide-react";

const DOCUMENT_ICONS: Record<string, React.ElementType> = {
  id_card: IdCard,
  cv: BookOpen,
  project_presentation: FileText,
  business_plan: Briefcase,
};

interface StoredDocument {
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const t = useTranslations("candidaterDocuments");
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const uploadedCount = Object.values(files).filter(Boolean).length;
  const documentTypes = (t.raw("documentTypes") as { key: string; label: string }[]).map(
    (d) => ({ ...d, icon: DOCUMENT_ICONS[d.key], required: false })
  );

  async function handleNext() {
    setError(null);

    const userId = sessionStorage.getItem("candidater_userId") || "";
    if (!userId) {
      setError("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    const selectedEntries = Object.entries(files).filter(
      (entry): entry is [string, File] => entry[1] !== null
    );

    // No files selected — clear stored docs and continue
    if (selectedEntries.length === 0) {
      sessionStorage.removeItem("candidater_documents");
      router.push("/candidater/verification");
      return;
    }

    setUploading(true);

    const storedDocs: StoredDocument[] = [];
    for (const [docType, file] of selectedEntries) {
      // Sanitize filename and build a unique path: <userId>/<docType>/<timestamp>-<filename>
      const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
      const filePath = `${userId}/${docType}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("application-documents")
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setError(`Échec du téléversement de « ${file.name} ». ${uploadError.message}`);
        setUploading(false);
        return;
      }

      storedDocs.push({
        document_type: docType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      });
    }

    sessionStorage.setItem("candidater_documents", JSON.stringify(storedDocs));
    setUploading(false);
    router.push("/candidater/verification");
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="05"
        title={t("title")}
        assistance={
          <>
            <p>{t("assistance1")}</p>
            <p>{t("assistance2")}</p>
            <p className="text-xs text-text-muted mt-2">
              {t("count", { uploadedCount, total: documentTypes.length })}
            </p>
          </>
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-2">
              {t("sectionTitle")}
            </h3>
            <p className="text-sm text-text-muted mb-5">
              {t("sectionParagraph")}
            </p>

            <div className="space-y-5">
              {documentTypes.map((doc) => (
                <FileUploader
                  key={doc.key}
                  label={doc.label}
                  file={files[doc.key] || null}
                  onFileSelect={(f) => setFiles((prev) => ({ ...prev, [doc.key]: f }))}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-xl glass p-4 flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 shrink-0 rounded bg-teal/10 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-teal" strokeWidth={2} />
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t("info")}
            </p>
          </div>
        </div>

        <FormNavigation
          onBack="/candidater/motivation"
          onNext={handleNext}
          nextLabel={uploading ? t("uploading") : undefined}
          nextDisabled={uploading}
        />
        {uploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="w-4 h-4 text-teal animate-spin" />
            {t("uploadProgress")}
          </div>
        )}
      </FormStepLayout>
    </CandidateLayout>
  );
}
