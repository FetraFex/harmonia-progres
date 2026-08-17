"use client";

import { useState } from "react";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import type { Application, ApplicationStatusHistory } from "@/types/database";
import { Search, Hash, Mail, ArrowLeft, Building, Wheat, Fish, Palette, Check } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Nouveau", color: "text-gray-600", bg: "bg-gray-100" },
  submitted: { label: "Candidature reçue", color: "text-blue-600", bg: "bg-blue-100" },
  under_review: { label: "En évaluation", color: "text-amber-600", bg: "bg-amber-100" },
  shortlisted: { label: "Présélectionné", color: "text-indigo-600", bg: "bg-indigo-100" },
  interview: { label: "Entretien", color: "text-purple-600", bg: "bg-purple-100" },
  accepted: { label: "Accepté", color: "text-green-600", bg: "bg-green-100" },
  rejected: { label: "Non retenu", color: "text-red-600", bg: "bg-red-100" },
  waitlisted: { label: "Liste d'attente", color: "text-orange-600", bg: "bg-orange-100" },
  withdrawn: { label: "Retiré", color: "text-gray-600", bg: "bg-gray-100" },
};

const TIMELINE_STEPS = [
  { status: "submitted", label: "Candidature reçue" },
  { status: "under_review", label: "Vérification administrative" },
  { status: "shortlisted", label: "Évaluation" },
  { status: "interview", label: "Entretien" },
  { status: "accepted", label: "Sélection" },
];

const SECTOR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  artisanat: Palette,
  halieutique: Fish,
};

export default function SuiviPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState(false);
  const supabase = createClient();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("applications")
      .select("*")
      .eq("reference_number", reference.toUpperCase())
      .eq("email", email)
      .single();

    if (queryError || !data) {
      setError("Aucune candidature trouvée. Vérifiez votre référence et votre email.");
      setLoading(false);
      return;
    }

    setApplication(data as Application);

    const { data: hist } = await supabase
      .from("application_status_history")
      .select("*")
      .eq("application_id", data.id)
      .order("created_at", { ascending: false });

    setHistory((hist as ApplicationStatusHistory[]) || []);
    setFound(true);
    setLoading(false);
  }

  const currentIdx = application
    ? TIMELINE_STEPS.findIndex((s) => s.status === application.status)
    : -1;

  const SectorIcon = application ? (SECTOR_ICONS[application.sector] || Building) : Building;

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[var(--black)] mb-2">
          Suivi de candidature
        </h1>
        <p className="text-[var(--text-muted)] mb-10">
          Consultez l&apos;état de votre candidature au programme MIASA.
        </p>

        {!found ? (
          <form onSubmit={handleSearch} className="space-y-5 max-w-md">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-3">
                <Search className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-[var(--black)] mb-1.5">
                Référence de candidature
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                <input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="HP-2026-XXXX"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 pl-10 font-['JetBrains_Mono'] text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-track" className="block text-sm font-medium text-[var(--black)] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
                <input
                  id="email-track"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 pl-10 text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--lime)] px-6 py-3 font-['Space_Grotesk'] font-bold text-[var(--black)] transition hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Recherche..." : "Consulter ma candidature"}
              {!loading && <Search className="w-4 h-4" strokeWidth={2} />}
            </button>
          </form>
        ) : application && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-['JetBrains_Mono'] text-sm text-[var(--text-muted)]">
                    {application.reference_number}
                  </p>
                  <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--black)]">
                    {application.first_name} {application.last_name}
                  </h2>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_CONFIG[application.status]?.color} ${STATUS_CONFIG[application.status]?.bg}`}>
                  {STATUS_CONFIG[application.status]?.label}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <SectorIcon className="w-4 h-4" strokeWidth={1.5} />
                  <span>Secteur: <strong className="text-[var(--black)] capitalize">{application.sector}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4" strokeWidth={1.5} />
                  <span>Ville: <strong className="text-[var(--black)]">{application.commune || application.district}</strong></span>
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-6">
                Progression
              </h3>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                            isCurrent
                              ? "bg-[var(--lime)] ring-4 ring-[var(--lime)]/20"
                              : isDone
                                ? "bg-[var(--lime)]"
                                : "bg-gray-200"
                          }`}
                        />
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-px flex-1 my-1 ${isDone ? "bg-[var(--lime)]" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${isCurrent ? "text-[var(--black)]" : isDone ? "text-[var(--black)]" : "text-[var(--text-muted)]"}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => { setFound(false); setApplication(null); setHistory([]); }}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--black)] transition"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Rechercher une autre candidature
            </button>
          </motion.div>
        )}
      </div>
    </CandidateLayout>
  );
}
