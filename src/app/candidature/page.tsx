"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import type { ApplicationStatus, Sector, EducationLevel } from "@/types/database";

interface FormStep {
  id: string;
  label: string;
  icon: string;
}

const STEPS: FormStep[] = [
  { id: "personal", label: "Informations personnelles", icon: "👤" },
  { id: "education", label: "Parcours", icon: "🎓" },
  { id: "project", label: "Projet entrepreneurial", icon: "💡" },
  { id: "motivation", label: "Motivation", icon: "🔥" },
  { id: "documents", label: "Documents", icon: "📄" },
  { id: "review", label: "Vérification", icon: "✅" },
];

const SECTORS: { value: Sector; label: string }[] = [
  { value: "artisanat", label: "Artisanat" },
  { value: "halieutique", label: "Halieutique" },
  { value: "agriculture", label: "Agriculture" },
];

const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: "none", label: "Aucun diplôme" },
  { value: "primary", label: "Primaire" },
  { value: "secondary", label: "Secondaire" },
  { value: "vocational", label: "Formation professionnelle" },
  { value: "bachelor", label: "Licence / Bachelor" },
  { value: "master", label: "Master" },
  { value: "other", label: "Autre" },
];

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition";

const labelClass = "block text-sm font-medium text-[var(--black)] mb-1.5";

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    region: "Fitovinany",
    education_level: "secondary" as EducationLevel,
    education_institution: "",
    education_field: "",
    project_name: "",
    project_description: "",
    sector: "agriculture" as Sector,
    project_stage: "",
    existing_business: false,
    business_name: "",
    motivation: "",
    expectations: "",
  });

  const [files, setFiles] = useState<{
    cv: File | null;
    business_plan: File | null;
    id_card: File | null;
  }>({ cv: null, business_plan: null, id_card: null });

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?next=/candidature");
        return;
      }
      setUserId(user.id);
      setForm((prev) => ({
        ...prev,
        email: user.email || "",
        first_name: user.user_metadata?.full_name?.split(" ")[0] || "",
        last_name: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
      }));
      setCheckingAuth(false);
    }
    checkAuth();
  }, [supabase, router]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return (
          form.first_name.length > 0 &&
          form.last_name.length > 0 &&
          form.email.length > 0 &&
          form.phone.length > 0 &&
          form.city.length > 0
        );
      case 1:
        return form.education_level.length > 0;
      case 2:
        return (
          form.project_name.length > 0 &&
          form.project_description.length > 0 &&
          form.sector.length > 0
        );
      case 3:
        return form.motivation.length > 0;
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        user_id: userId!,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        address: form.address || null,
        city: form.city,
        region: form.region,
        education_level: form.education_level,
        education_institution: form.education_institution || null,
        education_field: form.education_field || null,
        project_name: form.project_name,
        project_description: form.project_description,
        sector: form.sector,
        project_stage: form.project_stage || null,
        existing_business: form.existing_business,
        business_name: form.business_name || null,
        motivation: form.motivation,
        expectations: form.expectations || null,
        status: "submitted",
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Upload documents
    const docTypes = ["cv", "business_plan", "id_card"] as const;
    for (const docType of docTypes) {
      const file = files[docType];
      if (!file) continue;

      const filePath = `${application.id}/${docType}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("application-documents")
        .upload(filePath, file);

      if (!uploadError) {
        await supabase.from("application_documents").insert({
          application_id: application.id,
          document_type: docType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        });
      }
    }

    setReferenceNumber(application.reference_number);
    setSuccess(true);
    setLoading(false);
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Chargement...</div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          <div className="mb-6 text-6xl">🎉</div>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[var(--black)] mb-4">
            Candidature envoyée !
          </h1>
          <p className="text-[var(--text-muted)] mb-4">
            Votre numéro de référence :
          </p>
          <p className="font-['JetBrains_Mono'] text-2xl font-bold text-[var(--lime)] bg-[var(--black)] rounded-xl px-6 py-4 mb-8">
            {referenceNumber}
          </p>
          <p className="text-[var(--text-muted)] mb-8">
            Conservez ce numéro pour suivre l&apos;état de votre candidature.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/candidature/suivi"
              className="rounded-xl bg-[var(--lime)] px-6 py-3 font-['Space_Grotesk'] font-bold text-[var(--black)] transition hover:scale-[1.02]"
            >
              Suivre ma candidature
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-[var(--black)] transition hover:bg-[var(--border)]"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="font-['Space_Grotesk'] text-xl font-bold">
            <span className="text-[var(--black)]">H</span>
            <span className="text-[var(--lime)]">ARMONIA</span>
          </Link>
          <span className="text-sm text-[var(--text-muted)]">
            Candidature MIASA
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Step indicators */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => i < currentStep && setCurrentStep(i)}
              disabled={i > currentStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                i === currentStep
                  ? "bg-[var(--lime)] text-[var(--black)]"
                  : i < currentStep
                    ? "bg-[var(--black)] text-white cursor-pointer"
                    : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Step 0: Personal */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)] mb-6">
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="first_name" className={labelClass}>Prénom *</label>
                    <input
                      id="first_name"
                      type="text"
                      required
                      value={form.first_name}
                      onChange={(e) => updateField("first_name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className={labelClass}>Nom *</label>
                    <input
                      id="last_name"
                      type="text"
                      required
                      value={form.last_name}
                      onChange={(e) => updateField("last_name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className={labelClass}>Téléphone *</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClass}
                      placeholder="+261..."
                    />
                  </div>
                  <div>
                    <label htmlFor="date_of_birth" className={labelClass}>Date de naissance</label>
                    <input
                      id="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={(e) => updateField("date_of_birth", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="gender" className={labelClass}>Genre</label>
                    <select
                      id="gender"
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Non précisé</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="city" className={labelClass}>Ville *</label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={inputClass}
                      placeholder="Manakara, Vohipeno..."
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>Adresse</label>
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={inputClass}
                    placeholder="Quartier, rue..."
                  />
                </div>
              </div>
            )}

            {/* Step 1: Education */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)] mb-6">
                  Parcours académique
                </h2>
                <div>
                  <label htmlFor="education_level" className={labelClass}>Niveau d&apos;études *</label>
                  <select
                    id="education_level"
                    value={form.education_level}
                    onChange={(e) => updateField("education_level", e.target.value)}
                    className={inputClass}
                  >
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>
                        {lvl.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="education_institution" className={labelClass}>Institution</label>
                  <input
                    id="education_institution"
                    type="text"
                    value={form.education_institution}
                    onChange={(e) => updateField("education_institution", e.target.value)}
                    className={inputClass}
                    placeholder="Université, lycée..."
                  />
                </div>
                <div>
                  <label htmlFor="education_field" className={labelClass}>Domaine d&apos;étude</label>
                  <input
                    id="education_field"
                    type="text"
                    value={form.education_field}
                    onChange={(e) => updateField("education_field", e.target.value)}
                    className={inputClass}
                    placeholder="Agriculture, gestion, informatique..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Project */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)] mb-6">
                  Votre projet entrepreneurial
                </h2>
                <div>
                  <label htmlFor="project_name" className={labelClass}>Nom du projet *</label>
                  <input
                    id="project_name"
                    type="text"
                    required
                    value={form.project_name}
                    onChange={(e) => updateField("project_name", e.target.value)}
                    className={inputClass}
                    placeholder="Ex: Transformation de vanille bio"
                  />
                </div>
                <div>
                  <label htmlFor="sector" className={labelClass}>Secteur *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {SECTORS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => updateField("sector", s.value)}
                        className={`rounded-xl border-2 p-4 text-center font-medium transition ${
                          form.sector === s.value
                            ? "border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--black)]"
                            : "border-[var(--border)] bg-white text-[var(--text-muted)] hover:border-[var(--black)]"
                        }`}
                      >
                        {s.value === "artisanat" && "🎨"}
                        {s.value === "halieutique" && "🐟"}
                        {s.value === "agriculture" && "🌾"}
                        <span className="block mt-1 text-sm">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="project_description" className={labelClass}>
                    Description du projet *
                  </label>
                  <textarea
                    id="project_description"
                    required
                    rows={5}
                    value={form.project_description}
                    onChange={(e) => updateField("project_description", e.target.value)}
                    className={inputClass}
                    placeholder="Décrivez votre projet, sa vision, son impact potentiel..."
                  />
                </div>
                <div>
                  <label htmlFor="project_stage" className={labelClass}>Étape actuelle</label>
                  <select
                    id="project_stage"
                    value={form.project_stage}
                    onChange={(e) => updateField("project_stage", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="idea">Idée</option>
                    <option value="prototype">Prototype / MVP</option>
                    <option value="early">Début d&apos;activité</option>
                    <option value="growing">En croissance</option>
                    <option value="established">Établi</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="existing_business"
                    type="checkbox"
                    checked={form.existing_business}
                    onChange={(e) => updateField("existing_business", e.target.checked)}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--lime)] focus:ring-[var(--lime)]"
                  />
                  <label htmlFor="existing_business" className="text-sm text-[var(--black)]">
                    J&apos;ai déjà une entreprise en activité
                  </label>
                </div>
                {form.existing_business && (
                  <div>
                    <label htmlFor="business_name" className={labelClass}>Nom de l&apos;entreprise</label>
                    <input
                      id="business_name"
                      type="text"
                      value={form.business_name}
                      onChange={(e) => updateField("business_name", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Motivation */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)] mb-6">
                  Votre motivation
                </h2>
                <div>
                  <label htmlFor="motivation" className={labelClass}>
                    Pourquoi souhaitez-vous rejoindre ce programme ? *
                  </label>
                  <textarea
                    id="motivation"
                    required
                    rows={6}
                    value={form.motivation}
                    onChange={(e) => updateField("motivation", e.target.value)}
                    className={inputClass}
                    placeholder="Partagez votre motivation, vos objectifs, ce que vous espérez accomplir..."
                  />
                </div>
                <div>
                  <label htmlFor="expectations" className={labelClass}>
                    Qu&apos;attendez-vous du programme ?
                  </label>
                  <textarea
                    id="expectations"
                    rows={4}
                    value={form.expectations}
                    onChange={(e) => updateField("expectations", e.target.value)}
                    className={inputClass}
                    placeholder="Formation, mentorat, financement, réseau..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)] mb-6">
                  Documents
                </h2>
                <p className="text-[var(--text-muted)] text-sm mb-4">
                  Ces documents ne sont pas obligatoires mais recommandés pour renforcer votre candidature.
                </p>
                {([
                  { key: "cv", label: "Curriculum Vitae (CV)", accept: ".pdf,.doc,.docx" },
                  { key: "business_plan", label: "Plan d&apos;affaires", accept: ".pdf,.doc,.docx" },
                  { key: "id_card", label: "Pièce d&apos;identité", accept: ".pdf,.jpg,.jpeg,.png" },
                ] as const).map((doc) => (
                  <div key={doc.key}>
                    <label className={labelClass}>{doc.label}</label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor={`file-${doc.key}`}
                        className="flex-1 rounded-xl border-2 border-dashed border-[var(--border)] bg-white px-6 py-4 text-center cursor-pointer hover:border-[var(--lime)] transition"
                      >
                        <span className="text-sm text-[var(--text-muted)]">
                          {files[doc.key]
                            ? files[doc.key]!.name
                            : "Glissez un fichier ou cliquez pour parcourir"}
                        </span>
                        <input
                          id={`file-${doc.key}`}
                          type="file"
                          accept={doc.accept}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFiles((prev) => ({ ...prev, [doc.key]: file }));
                          }}
                        />
                      </label>
                      {files[doc.key] && (
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => ({ ...prev, [doc.key]: null }))}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Retirer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)] mb-6">
                  Vérifiez votre candidature
                </h2>
                <ReviewSection title="👤 Informations personnelles">
                  <ReviewItem label="Nom" value={`${form.first_name} ${form.last_name}`} />
                  <ReviewItem label="Email" value={form.email} />
                  <ReviewItem label="Téléphone" value={form.phone} />
                  <ReviewItem label="Ville" value={form.city} />
                  {form.date_of_birth && <ReviewItem label="Naissance" value={form.date_of_birth} />}
                </ReviewSection>
                <ReviewSection title="🎓 Parcours">
                  <ReviewItem
                    label="Niveau"
                    value={EDUCATION_LEVELS.find((l) => l.value === form.education_level)?.label || ""}
                  />
                  {form.education_institution && (
                    <ReviewItem label="Institution" value={form.education_institution} />
                  )}
                  {form.education_field && (
                    <ReviewItem label="Domaine" value={form.education_field} />
                  )}
                </ReviewSection>
                <ReviewSection title="💡 Projet">
                  <ReviewItem label="Projet" value={form.project_name} />
                  <ReviewItem
                    label="Secteur"
                    value={SECTORS.find((s) => s.value === form.sector)?.label || ""}
                  />
                  <ReviewItem label="Description" value={form.project_description} />
                  {form.project_stage && (
                    <ReviewItem label="Étape" value={form.project_stage} />
                  )}
                  {form.existing_business && (
                    <ReviewItem label="Entreprise existante" value={form.business_name || "Oui"} />
                  )}
                </ReviewSection>
                <ReviewSection title="🔥 Motivation">
                  <ReviewItem label="Motivation" value={form.motivation} />
                  {form.expectations && <ReviewItem label="Attentes" value={form.expectations} />}
                </ReviewSection>
                <ReviewSection title="📄 Documents">
                  {(["cv", "business_plan", "id_card"] as const).map((k) => (
                    <ReviewItem
                      key={k}
                      label={k === "cv" ? "CV" : k === "business_plan" ? "Plan d'affaires" : "Pièce d'identité"}
                      value={files[k]?.name || "Non fourni"}
                    />
                  ))}
                </ReviewSection>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
            className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-[var(--black)] transition hover:bg-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
              className="rounded-xl bg-[var(--lime)] px-6 py-3 font-['Space_Grotesk'] font-bold text-[var(--black)] transition hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-[var(--black)] px-8 py-3 font-['Space_Grotesk'] font-bold text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <h3 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--black)] font-medium text-right">{value}</span>
    </div>
  );
}
