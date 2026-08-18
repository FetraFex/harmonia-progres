"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { sendCandidatureStatusEmail } from "@/actions/email-actions";
import { SmoothInput } from "@/components/ui/SmoothInput";
import type { Application, ApplicationStatusHistory, ApplicationDocument, ApplicationEvaluation } from "@/types/database";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  Star,
  FileText,
  Save,
  AlertTriangle,
  ChevronDown,
  Wheat,
  Palette,
  Fish,
  Loader2,
  Eye,
  X,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "Nouveau", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
  submitted: { label: "Soumis", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  under_review: { label: "En évaluation", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  shortlisted: { label: "Présélectionné", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  interview: { label: "Entretien", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  accepted: { label: "Accepté", color: "text-teal", bg: "bg-teal/10", border: "border-teal/30" },
  rejected: { label: "Non retenu", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  waitlisted: { label: "Liste d'attente", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  withdrawn: { label: "Retiré", color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};

const EDUCATION: Record<string, string> = {
  none: "Aucun diplôme",
  primary: "Primaire",
  secondary: "Secondaire",
  vocational: "Formation professionnelle",
  bachelor: "Licence / Bac+3",
  master: "Master / Bac+5",
  other: "Autre",
};

const SITUATION: Record<string, string> = {
  etudiant: "Étudiant",
  salarie: "Salarié",
  chomeur: "Sans emploi",
  independant: "Indépendant / Artisan / Pêcheur",
  retraite: "Retraité",
  autre: "Autre",
};

const SECTOR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  artisanat: Palette,
  halieutique: Fish,
};

export default function CandidatureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [application, setApplication] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [docUrls, setDocUrls] = useState<Record<string, string>>({});
  const [previewDoc, setPreviewDoc] = useState<{ doc: ApplicationDocument; url: string } | null>(null);
  const [evaluations, setEvaluations] = useState<ApplicationEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusReason, setStatusReason] = useState("");

  // Evaluation Form State
  const [evalScores, setEvalScores] = useState({
    pertinence: 4,
    faisabilite: 4,
    motivation_score: 4,
    potentiel_economique: 4,
    impact_local: 4,
  });
  const [evalStrengths, setEvalStrengths] = useState("");
  const [evalWeaknesses, setEvalWeaknesses] = useState("");
  const [evalRecommendation, setEvalRecommendation] = useState("Favorable");
  const [evalNotes, setEvalNotes] = useState("");
  const [evalSubmitting, setEvalSubmitting] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState(false);

  // Close preview on Escape key and lock body scroll while open
  useEffect(() => {
    if (!previewDoc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewDoc(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewDoc]);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: appData } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (!appData) {
        router.push("/admin/candidatures");
        return;
      }

      setApplication(appData as Application);

      const [histRes, docsRes, evalRes] = await Promise.all([
        supabase
          .from("application_status_history")
          .select("*")
          .eq("application_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("application_documents")
          .select("*")
          .eq("application_id", id),
        supabase
          .from("application_evaluations")
          .select("*")
          .eq("application_id", id)
          .order("created_at", { ascending: false }),
      ]);

      const docsData = (docsRes.data as ApplicationDocument[]) || [];
      setHistory((histRes.data as ApplicationStatusHistory[]) || []);
      setDocuments(docsData);
      setEvaluations((evalRes.data as ApplicationEvaluation[]) || []);

      // Generate signed URLs for each document (bucket is private)
      const urls: Record<string, string> = {};
      for (const doc of docsData) {
        const { data: signedData } = await supabase.storage
          .from("application-documents")
          .createSignedUrl(doc.file_path, 3600);
        if (signedData?.signedUrl) {
          urls[doc.id] = signedData.signedUrl;
        }
      }
      setDocUrls(urls);
      setLoading(false);
    }
    load();
  }, [id, router, supabase]);

  async function handleStatusChange(newStatus: string) {
    if (!application) return;

    if (newStatus === "rejected") {
      const confirmed = window.confirm(
        "Confirmez-vous le refus de cette candidature ?"
      );
      if (!confirmed) return;
    }

    setStatusDropdownOpen(false);
    setUpdating(true);

    const oldStatus = application.status;
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("applications")
      .update({
        status: newStatus,
        reviewed_by: user?.id ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    await supabase.from("application_status_history").insert({
      application_id: id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: user?.id ?? null,
      reason: statusReason || null,
    });

    setApplication((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus as Application["status"],
            reviewed_at: new Date().toISOString(),
          }
        : prev
    );

    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        application_id: id,
        old_status: oldStatus,
        new_status: newStatus as Application["status"],
        changed_by: user?.id ?? null,
        reason: statusReason || null,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setStatusReason("");
    setUpdating(false);

    // Notify the candidate by email (fire-and-forget, non-blocking)
    if (application.email && newStatus !== oldStatus) {
      sendCandidatureStatusEmail({
        email: application.email,
        fullName: `${application.first_name} ${application.last_name}`.trim() || "Candidat",
        referenceNumber: application.reference_number,
        projectName: application.project_name,
        status: newStatus,
      }).catch(() => {});
    }
  }

  async function handleSaveEvaluation(e: React.FormEvent) {
    e.preventDefault();
    setEvalSubmitting(true);
    setEvalSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const totalScore =
      evalScores.pertinence +
      evalScores.faisabilite +
      evalScores.motivation_score +
      evalScores.potentiel_economique +
      evalScores.impact_local;

    const newEvalPayload = {
      application_id: id,
      evaluator_id: user.id,
      score: totalScore,
      pertinence: evalScores.pertinence,
      faisabilite: evalScores.faisabilite,
      motivation_score: evalScores.motivation_score,
      potentiel_economique: evalScores.potentiel_economique,
      impact_local: evalScores.impact_local,
      strengths: evalStrengths || null,
      weaknesses: evalWeaknesses || null,
      recommendation: evalRecommendation || null,
      notes: evalNotes || null,
    };

    const { data, error } = await supabase
      .from("application_evaluations")
      .insert(newEvalPayload)
      .select()
      .single();

    if (!error && data) {
      setEvaluations((prev) => [data as ApplicationEvaluation, ...prev]);
      setEvalSuccess(true);
    }
    setEvalSubmitting(false);
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-8 h-8 text-teal animate-spin" />
          <p className="text-xs text-text-muted font-medium">Chargement du dossier…</p>
        </div>
      </AdminLayout>
    );
  }

  if (!application) return null;

  const currentConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.new;
  const SectorIcon = SECTOR_ICONS[application.sector] || Building;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Navigation & Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/admin/candidatures"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-teal transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la liste des candidatures</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-['JetBrains_Mono'] text-xs font-semibold px-2.5 py-1 rounded bg-void-2 text-teal border border-teal/20">
                  {application.reference_number}
                </span>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${currentConfig.bg} ${currentConfig.color} ${currentConfig.border}`}>
                  {currentConfig.label}
                </span>
              </div>
              <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
                {application.first_name} {application.last_name}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Calendar className="w-4 h-4 text-teal" />
              <span>
                Soumis le{" "}
                {new Date(application.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Candidate Dossier (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview Card */}
            <div className="rounded-2xl glass p-6 md:p-8 space-y-6 border border-glass-border">
              <div className="flex items-center justify-between pb-4 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                    <Target className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-['Space_Grotesk'] font-bold text-lg text-text-primary">
                      {application.project_name}
                    </h2>
                    <span className="text-xs text-text-muted flex items-center gap-1.5 capitalize mt-0.5">
                      <SectorIcon className="w-3.5 h-3.5 text-teal" />
                      {application.sector} — {application.activity_type.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">
                    Description du projet
                  </span>
                  <p className="text-text-primary leading-relaxed bg-void-2/60 p-4 rounded-xl border border-glass-border">
                    {application.project_description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-text-muted font-medium block mb-1">
                      Problème identifié
                    </span>
                    <p className="text-text-primary leading-relaxed bg-void-2/60 p-4 rounded-xl border border-glass-border text-xs">
                      {application.problem_identified}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted font-medium block mb-1">
                      Solution proposée
                    </span>
                    <p className="text-text-primary leading-relaxed bg-void-2/60 p-4 rounded-xl border border-glass-border text-xs">
                      {application.solution_proposed}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">
                    Marché cible & clients
                  </span>
                  <p className="text-text-primary leading-relaxed bg-void-2/60 p-4 rounded-xl border border-glass-border text-xs">
                    {application.target_market}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Card */}
              <div className="rounded-2xl glass p-6 space-y-4 border border-glass-border">
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2 pb-3 border-b border-glass-border">
                  <MapPin className="w-4 h-4 text-teal" />
                  Coordonnées
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-text-muted">Email :</span>
                    <p className="font-medium text-text-primary mt-0.5">{application.email}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">Téléphone :</span>
                    <p className="font-medium text-text-primary mt-0.5">{application.phone}</p>
                  </div>
                  <div>
                    <span className="text-text-muted">District & Commune :</span>
                    <p className="font-medium text-text-primary capitalize mt-0.5">
                      {application.district} — {application.commune || "Non précisé"}
                    </p>
                  </div>
                  {application.address && (
                    <div>
                      <span className="text-text-muted">Adresse :</span>
                      <p className="font-medium text-text-primary mt-0.5">{application.address}</p>
                    </div>
                  )}
                  {application.date_of_birth && (
                    <div>
                      <span className="text-text-muted">Date de naissance :</span>
                      <p className="font-medium text-text-primary mt-0.5">
                        {new Date(application.date_of_birth).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Background & Profile */}
              <div className="rounded-2xl glass p-6 space-y-4 border border-glass-border">
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2 pb-3 border-b border-glass-border">
                  <GraduationCap className="w-4 h-4 text-teal" />
                  Profil & Parcours
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-text-muted">Situation actuelle :</span>
                    <p className="font-medium text-text-primary mt-0.5">
                      {SITUATION[application.situation] || application.situation}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Niveau d&apos;études :</span>
                    <p className="font-medium text-text-primary mt-0.5">
                      {EDUCATION[application.education_level] || application.education_level}
                    </p>
                  </div>
                  {application.experience_professionnelle && (
                    <div>
                      <span className="text-text-muted">Expérience professionnelle :</span>
                      <p className="text-text-primary mt-0.5 bg-void-2/40 p-2.5 rounded-lg border border-glass-border">
                        {application.experience_professionnelle}
                      </p>
                    </div>
                  )}
                  {application.experience_entrepreneuriale && (
                    <div>
                      <span className="text-text-muted">Expérience entrepreneuriale :</span>
                      <p className="text-text-primary mt-0.5 bg-void-2/40 p-2.5 rounded-lg border border-glass-border">
                        {application.experience_entrepreneuriale}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Motivation & Needs */}
            <div className="rounded-2xl glass p-6 md:p-8 space-y-6 border border-glass-border">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2 pb-3 border-b border-glass-border">
                <Sparkles className="w-4 h-4 text-teal" />
                Motivation & Besoins exprimés
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-text-muted font-medium block mb-1">
                    Lettre de motivation & engagement
                  </span>
                  <p className="text-text-primary leading-relaxed bg-void-2/60 p-4 rounded-xl border border-glass-border text-xs">
                    {application.motivation}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-text-muted font-medium block mb-2">
                    Besoins prioritaires identifiés
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {application.needs && application.needs.length > 0 ? (
                      application.needs.map((n) => (
                        <span
                          key={n}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal/10 text-teal border border-teal/20 capitalize"
                        >
                          {n.replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-muted">Aucun besoin spécifique coché</span>
                    )}
                  </div>
                </div>

                {application.accomplishments && (
                  <div>
                    <span className="text-xs text-text-muted font-medium block mb-1">
                      Objectifs & Réalisations attendues
                    </span>
                    <p className="text-text-primary leading-relaxed bg-void-2/60 p-4 rounded-xl border border-glass-border text-xs">
                      {application.accomplishments}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* In-Page Evaluation Form */}
            <div className="rounded-2xl glass p-6 md:p-8 space-y-6 border border-teal/30 relative">
              <div className="flex items-center justify-between pb-4 border-b border-glass-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg text-text-primary">
                      Grille d&apos;évaluation
                    </h3>
                    <p className="text-xs text-text-muted">Attribuez une note de 1 à 5 sur chaque critère</p>
                  </div>
                </div>
                <span className="font-['Space_Grotesk'] font-bold text-lg text-teal">
                  Score :{" "}
                  {evalScores.pertinence +
                    evalScores.faisabilite +
                    evalScores.motivation_score +
                    evalScores.potentiel_economique +
                    evalScores.impact_local}{" "}
                  / 25
                </span>
              </div>

              {evalSuccess && (
                <div className="p-4 rounded-xl bg-teal/10 border border-teal/30 text-teal text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Évaluation enregistrée avec succès dans la base de données.</span>
                </div>
              )}

              <form onSubmit={handleSaveEvaluation} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "pertinence", label: "Pertinence du projet" },
                    { key: "faisabilite", label: "Faisabilité technique & financière" },
                    { key: "motivation_score", label: "Motivation du candidat" },
                    { key: "potentiel_economique", label: "Potentiel économique & marché" },
                    { key: "impact_local", label: "Impact local & création d'emplois" },
                  ].map((crit) => (
                    <div key={crit.key} className="p-3.5 rounded-xl bg-void-2/60 border border-glass-border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-text-primary">{crit.label}</span>
                        <span className="font-bold text-teal text-sm">
                          {evalScores[crit.key as keyof typeof evalScores]} / 5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={evalScores[crit.key as keyof typeof evalScores]}
                        onChange={(e) =>
                          setEvalScores((prev) => ({
                            ...prev,
                            [crit.key]: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full accent-teal cursor-pointer"
                      />
                    </div>
                  ))}

                  <div className="p-3.5 rounded-xl bg-void-2/60 border border-glass-border space-y-1.5">
                    <span className="font-medium text-text-primary block">Avis global</span>
                    <select
                      value={evalRecommendation}
                      onChange={(e) => setEvalRecommendation(e.target.value)}
                      className="w-full rounded-lg bg-void border border-glass-border p-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-teal"
                    >
                      <option value="Favorable">Favorable (Recommandé)</option>
                      <option value="Très favorable">Très favorable (Prioritaire)</option>
                      <option value="Réservé">Réservé (À approfondir)</option>
                      <option value="Défavorable">Défavorable (Non retenu)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-text-muted block mb-1">Points forts</label>
                    <textarea
                      rows={3}
                      value={evalStrengths}
                      onChange={(e) => setEvalStrengths(e.target.value)}
                      placeholder="Ex: Bonne maîtrise technique du secteur, fort ancrage local..."
                      className="w-full rounded-xl bg-void-2/60 border border-glass-border p-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-teal"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-text-muted block mb-1">Points d&apos;amélioration / Risques</label>
                    <textarea
                      rows={3}
                      value={evalWeaknesses}
                      onChange={(e) => setEvalWeaknesses(e.target.value)}
                      placeholder="Ex: Besoin d'accompagnement en gestion financière..."
                      className="w-full rounded-xl bg-void-2/60 border border-glass-border p-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-teal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={evalSubmitting}
                  className="w-full rounded-xl bg-teal px-6 py-3 font-['Space_Grotesk'] font-bold text-on-void text-sm transition hover:scale-[1.01] hover:shadow-lg hover:shadow-teal/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{evalSubmitting ? "Enregistrement..." : "Enregistrer cette évaluation"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar (1/3): Status & Audit Trail */}
          <div className="space-y-6">
            {/* Status Control Card */}
            <div className="rounded-2xl glass p-6 space-y-5 border border-glass-border">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary pb-3 border-b border-glass-border">
                Gestion du Statut
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Statut actuel :</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${currentConfig.bg} ${currentConfig.color} ${currentConfig.border}`}>
                  {currentConfig.label}
                </span>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-text-muted font-medium block">
                  Changer l&apos;état du dossier :
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    disabled={updating}
                    className="w-full rounded-xl bg-void-2 border border-glass-border p-3 text-xs font-medium text-text-primary flex items-center justify-between hover:border-teal transition disabled:opacity-50"
                  >
                    <span>Sélectionner un nouveau statut</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition ${statusDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {statusDropdownOpen && (
                    <div className="absolute z-20 mt-1.5 w-full rounded-xl bg-void-2 border border-glass-border shadow-2xl p-1.5 space-y-1">
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(key)}
                          disabled={key === application.status}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition ${
                            key === application.status
                              ? "bg-glass-bg-strong opacity-40 cursor-not-allowed text-text-muted"
                              : "hover:bg-glass-bg text-text-primary"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${cfg.bg} ${cfg.color}`} style={{ backgroundColor: "currentColor" }} />
                          <span>{cfg.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <SmoothInput
                  type="text"
                  placeholder="Motif / Commentaire (optionnel)"
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  wrapperClassName="rounded-xl bg-void-2 border border-glass-border px-3 py-2.5"
                  className="text-xs text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="rounded-2xl glass p-6 space-y-4 border border-glass-border">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2 pb-3 border-b border-glass-border">
                <FileText className="w-4 h-4 text-teal" />
                Pièces jointes ({documents.length})
              </h3>

              {documents.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  Aucun document téléversé pour ce dossier.
                </p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-void-2/60 border border-glass-border flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-medium text-text-primary truncate">{doc.file_name}</p>
                        <span className="text-[10px] text-text-muted uppercase font-['JetBrains_Mono']">
                          {doc.document_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {docUrls[doc.id] && (
                          <button
                            onClick={() => setPreviewDoc({ doc, url: docUrls[doc.id] })}
                            className="p-2 rounded-lg glass hover:bg-teal hover:text-on-void text-text-muted transition"
                            title="Aperçu"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={docUrls[doc.id] || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg glass hover:bg-teal hover:text-on-void text-text-muted transition"
                          title="Télécharger"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audit History Timeline */}
            <div className="rounded-2xl glass p-6 space-y-4 border border-glass-border">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2 pb-3 border-b border-glass-border">
                <Clock className="w-4 h-4 text-teal" />
                Historique des statuts
              </h3>

              {history.length === 0 ? (
                <p className="text-xs text-text-muted">Aucune modification enregistrée.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry, i) => {
                    const cfg = STATUS_CONFIG[entry.new_status] || STATUS_CONFIG.new;
                    return (
                      <div key={entry.id} className="flex gap-3 text-xs">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 ${cfg.bg} border ${cfg.border}`} style={{ backgroundColor: "currentColor" }} />
                          {i < history.length - 1 && (
                            <div className="w-px flex-1 my-1 bg-glass-border" />
                          )}
                        </div>
                        <div className="pb-3 flex-1">
                          <p className="font-semibold text-text-primary">{cfg.label}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {entry.reason && (
                            <p className="text-[11px] text-teal mt-1 italic">
                              &quot;{entry.reason}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-[100] bg-void/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setPreviewDoc(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Aperçu de ${previewDoc.doc.file_name}`}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-200">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {previewDoc.doc.file_name}
                </p>
                <span className="text-[10px] text-gray-500 uppercase font-['JetBrains_Mono']">
                  {previewDoc.doc.document_type}
                  {previewDoc.doc.mime_type ? ` • ${previewDoc.doc.mime_type}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto bg-gray-50 flex items-start justify-center p-4">
              {previewDoc.doc.mime_type?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDoc.url}
                  alt={previewDoc.doc.file_name}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                />
              ) : (
                <iframe
                  src={previewDoc.url}
                  title={previewDoc.doc.file_name}
                  className="w-full h-[75vh] rounded-lg bg-white border border-gray-200"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
