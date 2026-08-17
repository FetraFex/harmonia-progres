"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Application, ApplicationStatusHistory } from "@/types/database";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Nouveau", color: "text-gray-600", bg: "bg-gray-100" },
  submitted: { label: "Soumis", color: "text-blue-600", bg: "bg-blue-100" },
  under_review: { label: "En évaluation", color: "text-amber-600", bg: "bg-amber-100" },
  shortlisted: { label: "Présélectionné", color: "text-indigo-600", bg: "bg-indigo-100" },
  interview: { label: "Entretien", color: "text-purple-600", bg: "bg-purple-100" },
  accepted: { label: "Accepté", color: "text-green-600", bg: "bg-green-100" },
  rejected: { label: "Non retenu", color: "text-red-600", bg: "bg-red-100" },
  waitlisted: { label: "Liste d'attente", color: "text-orange-600", bg: "bg-orange-100" },
  withdrawn: { label: "Retiré", color: "text-gray-600", bg: "bg-gray-100" },
};

const EDUCATION: Record<string, string> = {
  none: "Aucun",
  primary: "Primaire",
  secondary: "Secondaire",
  vocational: "Professionnel",
  bachelor: "Licence",
  master: "Master",
  other: "Autre",
};

const SITUATION: Record<string, string> = {
  etudiant: "Étudiant",
  salarie: "Salarié",
  chomeur: "Chômeur",
  independant: "Indépendant",
  retraite: "Retraité",
  autre: "Autre",
};

export default function CandidatureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [application, setApplication] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

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

      const { data: histData } = await supabase
        .from("application_status_history")
        .select("*")
        .eq("application_id", id)
        .order("created_at", { ascending: false });

      setHistory((histData as ApplicationStatusHistory[]) || []);
      setLoading(false);
    }
    load();
  }, [id, router, supabase]);

  async function handleStatusChange(newStatus: string) {
    if (!application) return;

    if (newStatus === "rejected") {
      const confirmed = window.confirm(
        "Êtes-vous sûr de vouloir refuser cette candidature ? Cette action est irréversible."
      );
      if (!confirmed) return;
    }

    setStatusDropdownOpen(false);
    setUpdating(true);

    const oldStatus = application.status;

    await supabase
      .from("applications")
      .update({
        status: newStatus,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    await supabase.from("application_status_history").insert({
      application_id: id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: (await supabase.auth.getUser()).data.user?.id ?? null,
      reason: null,
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
        changed_by: null,
        reason: null,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setUpdating(false);
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 w-48 bg-white rounded-lg border border-[var(--border)] animate-pulse" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
            <div className="h-64 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!application) return null;

  const currentConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.new;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back link + header */}
        <div>
          <button
            onClick={() => router.push("/admin/candidatures")}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--black)] mb-2 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux candidatures
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)]">
              {application.first_name} {application.last_name}
            </h1>
            <span className="font-['JetBrains_Mono'] text-xs text-[var(--text-muted)]">
              {application.reference_number}
            </span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info */}
            <section className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Nom complet</p>
                  <p className="text-[var(--black)] font-medium">{application.first_name} {application.last_name}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Email</p>
                  <p className="text-[var(--black)]">{application.email}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Téléphone</p>
                  <p className="text-[var(--black)]">{application.phone}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Date de naissance</p>
                  <p className="text-[var(--black)]">
                    {application.date_of_birth
                      ? new Date(application.date_of_birth).toLocaleDateString("fr-FR")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">District</p>
                  <p className="text-[var(--black)] capitalize">{application.district}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Commune</p>
                  <p className="text-[var(--black)]">{application.commune}</p>
                </div>
                {application.address && (
                  <div className="sm:col-span-2">
                    <p className="text-[var(--text-muted)] mb-0.5">Adresse</p>
                    <p className="text-[var(--black)]">{application.address}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Education / Profile */}
            <section className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
                Éducation & profil
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Situation actuelle</p>
                  <p className="text-[var(--black)]">{SITUATION[application.situation] || application.situation}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Niveau d&apos;étude</p>
                  <p className="text-[var(--black)]">{EDUCATION[application.education_level] || application.education_level}</p>
                </div>
                {application.experience_professionnelle && (
                  <div className="sm:col-span-2">
                    <p className="text-[var(--text-muted)] mb-0.5">Expérience professionnelle</p>
                    <p className="text-[var(--black)]">{application.experience_professionnelle}</p>
                  </div>
                )}
                {application.experience_entrepreneuriale && (
                  <div className="sm:col-span-2">
                    <p className="text-[var(--text-muted)] mb-0.5">Expérience entrepreneuriale</p>
                    <p className="text-[var(--black)]">{application.experience_entrepreneuriale}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Project */}
            <section className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
                Projet
              </h2>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[var(--text-muted)] mb-0.5">Nom du projet</p>
                    <p className="text-[var(--black)] font-medium">{application.project_name}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)] mb-0.5">Secteur</p>
                    <p className="text-[var(--black)] capitalize">{application.sector}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-muted)] mb-0.5">Type d&apos;activité</p>
                    <p className="text-[var(--black)] capitalize">{application.activity_type.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Description du projet</p>
                  <p className="text-[var(--black)]">{application.project_description}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Problème identifié</p>
                  <p className="text-[var(--black)]">{application.problem_identified}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Solution proposée</p>
                  <p className="text-[var(--black)]">{application.solution_proposed}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Marché cible</p>
                  <p className="text-[var(--black)]">{application.target_market}</p>
                </div>
              </div>
            </section>

            {/* Motivation */}
            <section className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
                Motivation
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Motivation</p>
                  <p className="text-[var(--black)]">{application.motivation}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Besoins</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {application.needs.map((need) => (
                      <span
                        key={need}
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--black)]"
                      >
                        {need.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] mb-0.5">Réalisations</p>
                  <p className="text-[var(--black)]">{application.accomplishments}</p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT — 1/3 */}
          <div className="space-y-6">
            {/* Status card */}
            <section className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
                Statut
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${currentConfig.color} ${currentConfig.bg}`}>
                  {currentConfig.label}
                </span>
                {application.reviewed_at && (
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(application.reviewed_at).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>

              {/* Status change dropdown */}
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  disabled={updating}
                  className="w-full text-left rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--black)] hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-between"
                >
                  <span>Changer le statut</span>
                  <svg className={`w-4 h-4 text-[var(--text-muted)] transition ${statusDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {statusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-[var(--border)] shadow-lg py-1">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        disabled={key === application.status}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition ${
                          key === application.status ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.bg} ${cfg.color}`} style={{ backgroundColor: "currentColor" }} />
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Status history timeline */}
            <section className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
                Historique
              </h2>

              {history.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">Aucun historique disponible.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => {
                    const cfg = STATUS_CONFIG[entry.new_status] || STATUS_CONFIG.new;
                    return (
                      <div key={entry.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${cfg.bg}`} />
                          <div className="w-px flex-1 bg-[var(--border)]" />
                        </div>
                        <div className="pb-4 flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--black)]">
                            {cfg.label}
                          </p>
                          {entry.old_status && (
                            <p className="text-xs text-[var(--text-muted)]">
                              {STATUS_CONFIG[entry.old_status]?.label || entry.old_status} → {cfg.label}
                            </p>
                          )}
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {entry.reason && (
                            <p className="text-xs text-[var(--text-muted)] mt-1 italic">
                              {entry.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
