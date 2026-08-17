"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import type { Application, ApplicationStatus, Sector } from "@/types/database";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Brouillon", color: "text-gray-600", bg: "bg-gray-100" },
  submitted: { label: "Soumise", color: "text-blue-600", bg: "bg-blue-100" },
  under_review: { label: "En cours d'examen", color: "text-amber-600", bg: "bg-amber-100" },
  accepted: { label: "Acceptée", color: "text-green-600", bg: "bg-green-100" },
  rejected: { label: "Refusée", color: "text-red-600", bg: "bg-red-100" },
  waitlisted: { label: "Liste d'attente", color: "text-purple-600", bg: "bg-purple-100" },
};

const SECTORS: { value: Sector | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "artisanat", label: "Artisanat" },
  { value: "halieutique", label: "Halieutique" },
  { value: "agriculture", label: "Agriculture" },
];

const EDUCATION: Record<string, string> = {
  none: "Aucun",
  primary: "Primaire",
  secondary: "Secondaire",
  vocational: "Professionnel",
  bachelor: "Licence",
  master: "Master",
  other: "Autre",
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");
  const [filterSector, setFilterSector] = useState<Sector | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?next=/admin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/");
        return;
      }

      const { data } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      setApplications((data as Application[]) || []);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function updateStatus(id: string, status: ApplicationStatus) {
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("applications")
      .update({
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString() }
          : a
      )
    );
    setUpdating(false);
  }

  const filtered = applications.filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterSector !== "all" && a.sector !== filterSector) return false;
    return true;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    under_review: applications.filter((a) => a.status === "under_review").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  const selected = applications.find((a) => a.id === selectedId);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Chargement du tableau de bord...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-24">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)]">
              Tableau de bord admin
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Gestion des candidatures MIASA
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--black)]"
          >
            Retour au site
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Soumises" value={stats.submitted} color="text-blue-600" />
          <StatCard label="En examen" value={stats.under_review} color="text-amber-600" />
          <StatCard label="Acceptées" value={stats.accepted} color="text-green-600" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {(["all", "submitted", "under_review", "accepted", "rejected", "waitlisted"] as const).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterStatus === s
                      ? "bg-[var(--black)] text-white"
                      : "bg-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--black)]/10"
                  }`}
                >
                  {s === "all" ? "Tous" : STATUS_CONFIG[s].label}
                </button>
              )
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            {SECTORS.map((s) => (
              <button
                key={s.value}
                onClick={() => setFilterSector(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterSector === s.value
                    ? "bg-[var(--lime)] text-[var(--black)]"
                    : "bg-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--black)]/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] mb-4">
          {filtered.length} candidature{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Applications list */}
        <div className="space-y-3">
          {filtered.map((app) => {
            const st = STATUS_CONFIG[app.status];
            return (
              <button
                key={app.id}
                onClick={() => setSelectedId(app.id)}
                className={`w-full text-left rounded-xl border p-5 transition ${
                  selectedId === app.id
                    ? "border-[var(--lime)] bg-[var(--lime)]/5"
                    : "border-[var(--border)] bg-white hover:border-[var(--black)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-['JetBrains_Mono'] text-xs text-[var(--text-muted)]">
                      {app.reference_number}
                    </span>
                    <span className="font-medium text-[var(--black)]">
                      {app.first_name} {app.last_name}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color} ${st.bg}`}>
                    {st.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span>{app.project_name}</span>
                  <span className="capitalize">{app.sector}</span>
                  <span>{app.city}</span>
                  <span className="ml-auto text-xs">
                    {new Date(app.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20 px-4"
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--black)]">
                      {selected.first_name} {selected.last_name}
                    </h2>
                    <p className="font-['JetBrains_Mono'] text-sm text-[var(--text-muted)]">
                      {selected.reference_number}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-[var(--text-muted)] hover:text-[var(--black)] text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                  <div>
                    <span className="text-[var(--text-muted)]">Email</span>
                    <p className="font-medium">{selected.email}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Téléphone</span>
                    <p className="font-medium">{selected.phone}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Ville</span>
                    <p className="font-medium">{selected.city}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Secteur</span>
                    <p className="font-medium capitalize">{selected.sector}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Éducation</span>
                    <p className="font-medium">{EDUCATION[selected.education_level] || selected.education_level}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Entreprise existante</span>
                    <p className="font-medium">{selected.existing_business ? "Oui" : "Non"}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[var(--text-muted)] text-sm">Projet</span>
                  <h3 className="font-['Space_Grotesk'] font-bold text-[var(--black)]">
                    {selected.project_name}
                  </h3>
                  <p className="text-sm text-[var(--black)] mt-1 whitespace-pre-line">
                    {selected.project_description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-[var(--text-muted)] text-sm">Motivation</span>
                  <p className="text-sm text-[var(--black)] mt-1 whitespace-pre-line">
                    {selected.motivation}
                  </p>
                </div>

                {selected.expectations && (
                  <div className="mb-6">
                    <span className="text-[var(--text-muted)] text-sm">Attentes</span>
                    <p className="text-sm text-[var(--black)] mt-1 whitespace-pre-line">
                      {selected.expectations}
                    </p>
                  </div>
                )}

                {/* Status actions */}
                <div className="border-t border-[var(--border)] pt-6">
                  <p className="text-sm font-medium text-[var(--black)] mb-3">
                    Changer le statut
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["submitted", "under_review", "accepted", "rejected", "waitlisted"] as const
                    ).map((status) => (
                      <button
                        key={status}
                        disabled={updating || selected.status === status}
                        onClick={() => updateStatus(selected.id, status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 ${
                          selected.status === status
                            ? "bg-[var(--black)] text-white"
                            : `${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].color} hover:opacity-80`
                        }`}
                      >
                        {STATUS_CONFIG[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  color = "text-[var(--black)]",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4">
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p className={`font-['Space_Grotesk'] text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
