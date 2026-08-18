"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { ReviewSection, ReviewItem } from "@/components/candidate/ReviewSection";
import { createClient } from "@/lib/supabase/client";
import { sendCandidatureSubmissionEmail } from "@/actions/email-actions";
import type { ApplicationStatus } from "@/types/database";
import { AlertTriangle, FileCheck, Send } from "lucide-react";

export default function VerificationPage() {
  const router = useRouter();
  const t = useTranslations("candidaterVerification");
  const SITUATION_LABELS = t.raw("situationLabels") as Record<string, string>;
  const EDUCATION_LABELS = t.raw("educationLabels") as Record<string, string>;
  const SECTOR_LABELS = t.raw("sectorLabels") as Record<string, string>;
  const ACTIVITY_LABELS = t.raw("activityLabels") as Record<string, string>;
  const NEED_LABELS = t.raw("needLabels") as Record<string, string>;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [personal, setPersonal] = useState<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [motivation, setMotivation] = useState<Record<string, any>>({});
  const [userId, setUserId] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPersonal(JSON.parse(sessionStorage.getItem("candidater_personal") || "{}"));
    setProfile(JSON.parse(sessionStorage.getItem("candidater_profile") || "{}"));
    setProject(JSON.parse(sessionStorage.getItem("candidater_project") || "{}"));
    setMotivation(JSON.parse(sessionStorage.getItem("candidater_motivation") || "{}"));
    setUserId(sessionStorage.getItem("candidater_userId") || "");
  }, []);

  async function handleSubmit() {
    if (!consent) {
      setError(t("consentError"));
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("applications")
      .insert({
        user_id: userId,
        first_name: personal.first_name,
        last_name: personal.last_name,
        email: personal.email,
        phone: personal.phone,
        date_of_birth: personal.date_of_birth || null,
        district: personal.district,
        commune: personal.commune,
        address: personal.address || null,
        situation: profile.situation,
        education_level: profile.education_level,
        experience_professionnelle: profile.experience_professionnelle || null,
        experience_entrepreneuriale: profile.experience_entrepreneuriale || null,
        project_name: project.project_name,
        sector: project.sector,
        activity_type: project.activity_type,
        project_description: project.project_description,
        problem_identified: project.problem_identified,
        solution_proposed: project.solution_proposed,
        target_market: project.target_market,
        motivation: motivation.motivation,
        needs: motivation.needs,
        accomplishments: motivation.accomplishments,
        status: "submitted" as ApplicationStatus,
        consent: true,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Save uploaded documents metadata to the database
    const storedDocs = JSON.parse(sessionStorage.getItem("candidater_documents") || "[]") as Array<{
      document_type: string;
      file_name: string;
      file_path: string;
      file_size: number;
      mime_type: string;
    }>;

    if (storedDocs.length > 0) {
      const { error: docsError } = await supabase.from("application_documents").insert(
        storedDocs.map((doc) => ({
          application_id: data.id,
          document_type: doc.document_type,
          file_name: doc.file_name,
          file_path: doc.file_path,
          file_size: doc.file_size,
          mime_type: doc.mime_type,
        }))
      );

      if (docsError) {
        // Application saved, but document metadata failed — surface a soft warning
        setError(t("docsWarning"));
        setLoading(false);
        return;
      }
    }

    sessionStorage.removeItem("candidater_personal");
    sessionStorage.removeItem("candidater_profile");
    sessionStorage.removeItem("candidater_project");
    sessionStorage.removeItem("candidater_motivation");
    sessionStorage.removeItem("candidater_documents");
    sessionStorage.removeItem("candidater_userId");

    // Send confirmation email (fire-and-forget, non-blocking)
    sendCandidatureSubmissionEmail({
      email: personal.email || "",
      fullName: `${personal.first_name || ""} ${personal.last_name || ""}`.trim() || "Candidat",
      referenceNumber: data.reference_number,
      projectName: project.project_name || "",
    }).catch(() => {});

    router.push(`/candidater/confirmation?ref=${data.reference_number}`);
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="06"
        title={t("title")}
        subtitle={t("subtitle")}
      >
        <div className="space-y-4">
          <ReviewSection title={t("info")} onEdit={() => router.push("/candidater/informations")}>
            <ReviewItem label={t("labels.name")} value={`${personal.first_name || ""} ${personal.last_name || ""}`} />
            <ReviewItem label={t("labels.email")} value={personal.email || ""} />
            <ReviewItem label={t("labels.phone")} value={personal.phone || ""} />
            <ReviewItem label={t("labels.district")} value={personal.district || ""} />
            <ReviewItem label={t("labels.commune")} value={personal.commune || ""} />
          </ReviewSection>

          <ReviewSection title={t("profile")} onEdit={() => router.push("/candidater/profil")}>
            <ReviewItem label={t("labels.situation")} value={SITUATION_LABELS[profile.situation] || ""} />
            <ReviewItem label={t("labels.education")} value={EDUCATION_LABELS[profile.education_level] || ""} />
            {profile.experience_professionnelle && (
              <ReviewItem label={t("labels.experiencePro")} value={profile.experience_professionnelle} />
            )}
            {profile.experience_entrepreneuriale && (
              <ReviewItem label={t("labels.experienceEntrepreneurial")} value={profile.experience_entrepreneuriale} />
            )}
          </ReviewSection>

          <ReviewSection title={t("project")} onEdit={() => router.push("/candidater/projet")}>
            <ReviewItem label={t("labels.project")} value={project.project_name || ""} />
            <ReviewItem label={t("labels.sector")} value={SECTOR_LABELS[project.sector] || ""} />
            <ReviewItem label={t("labels.activity")} value={ACTIVITY_LABELS[project.activity_type] || ""} />
            <ReviewItem label={t("labels.description")} value={project.project_description || ""} />
          </ReviewSection>

          <ReviewSection title={t("motivation")} onEdit={() => router.push("/candidater/motivation")}>
            <ReviewItem label={t("labels.motivation")} value={motivation.motivation || ""} />
            <ReviewItem label={t("labels.needs")} value={(motivation.needs || []).map((n: string) => NEED_LABELS[n] || n)} />
            <ReviewItem label={t("labels.objectives")} value={motivation.accomplishments || ""} />
          </ReviewSection>

          <ReviewSection title={t("documents")}>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <FileCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>{t("documentsVerified")}</span>
            </div>
          </ReviewSection>

          <div className="rounded-xl glass p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-glass-border text-teal focus:ring-teal"
              />
              <span className="text-sm text-text-primary leading-relaxed">
                {t("consent")}
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-glass-border">
            <button
              onClick={() => router.push("/candidater/documents")}
              className="rounded-xl glass px-6 py-3 font-medium text-text-primary transition hover:bg-glass-bg-strong"
            >
              {t("previous")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !consent}
              className="flex items-center gap-2 rounded-xl bg-teal px-8 py-3 font-['Space_Grotesk'] font-bold text-on-void transition hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? t("submitting") : t("submit")}
              {!loading && <Send className="w-4 h-4" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </FormStepLayout>
    </CandidateLayout>
  );
}
