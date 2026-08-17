"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { ReviewSection, ReviewItem } from "@/components/candidate/ReviewSection";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationStatus } from "@/types/database";

const SITUATION_LABELS: Record<string, string> = {
  etudiant: "Étudiant(e)",
  salarie: "Salarié(e)",
  chomeur: "En recherche d'emploi",
  independant: "Indépendant(e)",
  retraite: "Retraité(e)",
  autre: "Autre",
};

const EDUCATION_LABELS: Record<string, string> = {
  none: "Aucun diplôme",
  primary: "Primaire",
  secondary: "Secondaire",
  vocational: "Formation professionnelle",
  bachelor: "Licence / Bachelor",
  master: "Master",
  other: "Autre",
};

const SECTOR_LABELS: Record<string, string> = {
  agriculture: "Agriculture",
  artisanat: "Artisanat",
  halieutique: "Halieutique",
};

const ACTIVITY_LABELS: Record<string, string> = {
  riziculture: "Riziculture",
  maraichage: "Maraîchage",
  transformation_agri: "Transformation",
  elevage: "Élevage",
  vannerie: "Vannerie",
  raphia: "Raphia",
  nattes: "Nattes",
  paniers: "Paniers",
  peche: "Pêche",
  transformation_hal: "Transformation",
  conservation: "Conservation",
  commercialisation: "Commercialisation",
  autre: "Autre",
};

const NEED_LABELS: Record<string, string> = {
  formation: "Formation",
  equipement: "Équipement",
  financement: "Financement",
  accompagnement: "Accompagnement",
  marketing: "Marketing",
  acces_marche: "Accès au marché",
  mentorat: "Mentorat",
};

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const supabase = createClient();

  const personal = JSON.parse(sessionStorage.getItem("candidater_personal") || "{}");
  const profile = JSON.parse(sessionStorage.getItem("candidater_profile") || "{}");
  const project = JSON.parse(sessionStorage.getItem("candidater_project") || "{}");
  const motivation = JSON.parse(sessionStorage.getItem("candidater_motivation") || "{}");
  const userId = sessionStorage.getItem("candidater_userId") || "";

  async function handleSubmit() {
    if (!consent) {
      setError("Vous devez accepter les conditions pour soumettre votre candidature.");
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

    // Clear form data from session
    sessionStorage.removeItem("candidater_personal");
    sessionStorage.removeItem("candidater_profile");
    sessionStorage.removeItem("candidater_project");
    sessionStorage.removeItem("candidater_motivation");
    sessionStorage.removeItem("candidater_documents");
    sessionStorage.removeItem("candidater_userId");

    router.push(`/candidater/confirmation?ref=${data.reference_number}`);
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="06"
        title="Vérifiez votre candidature"
        subtitle="Relisez chaque section avant de soumettre."
      >
        <div className="space-y-4">
          <ReviewSection title="Vos informations" onEdit={() => router.push("/candidater/informations")}>
            <ReviewItem label="Nom" value={`${personal.first_name || ""} ${personal.last_name || ""}`} />
            <ReviewItem label="Email" value={personal.email || ""} />
            <ReviewItem label="Téléphone" value={personal.phone || ""} />
            <ReviewItem label="District" value={personal.district || ""} />
            <ReviewItem label="Commune" value={personal.commune || ""} />
          </ReviewSection>

          <ReviewSection title="Votre parcours" onEdit={() => router.push("/candidater/profil")}>
            <ReviewItem label="Situation" value={SITUATION_LABELS[profile.situation] || ""} />
            <ReviewItem label="Éducation" value={EDUCATION_LABELS[profile.education_level] || ""} />
            {profile.experience_professionnelle && (
              <ReviewItem label="Expérience pro" value={profile.experience_professionnelle} />
            )}
            {profile.experience_entrepreneuriale && (
              <ReviewItem label="Expérience entrepreneuriale" value={profile.experience_entrepreneuriale} />
            )}
          </ReviewSection>

          <ReviewSection title="Votre projet" onEdit={() => router.push("/candidater/projet")}>
            <ReviewItem label="Projet" value={project.project_name || ""} />
            <ReviewItem label="Secteur" value={SECTOR_LABELS[project.sector] || ""} />
            <ReviewItem label="Activité" value={ACTIVITY_LABELS[project.activity_type] || ""} />
            <ReviewItem label="Description" value={project.project_description || ""} />
          </ReviewSection>

          <ReviewSection title="Votre motivation" onEdit={() => router.push("/candidater/motivation")}>
            <ReviewItem label="Motivation" value={motivation.motivation || ""} />
            <ReviewItem label="Besoins" value={(motivation.needs || []).map((n: string) => NEED_LABELS[n] || n)} />
            <ReviewItem label="Objectifs" value={motivation.accomplishments || ""} />
          </ReviewSection>

          <ReviewSection title="Documents">
            <ReviewItem label="Documents joints" value="Voir la section documents" />
          </ReviewSection>

          {/* Consent */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-[var(--border)] text-[var(--lime)] focus:ring-[var(--lime)]"
              />
              <span className="text-sm text-[var(--black)] leading-relaxed">
                Je certifie que les informations fournies sont exactes et j&apos;accepte que
                mes informations soient utilisées dans le cadre de la gestion de ma candidature
                au programme MIASA Jeunes Entrepreneurs.
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => router.push("/candidater/documents")}
              className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-[var(--black)] transition hover:bg-gray-50"
            >
              Précédent
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !consent}
              className="rounded-xl bg-[var(--black)] px-8 py-3 font-['Space_Grotesk'] font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi de votre candidature..." : "Soumettre ma candidature"}
            </button>
          </div>
        </div>
      </FormStepLayout>
    </CandidateLayout>
  );
}
