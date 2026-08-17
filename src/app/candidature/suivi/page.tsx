"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import type { Application, ApplicationStatusHistory } from "@/types/database";

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Brouillon", color: "text-gray-600", bg: "bg-gray-100" },
  submitted: { label: "Soumise", color: "text-blue-600", bg: "bg-blue-100" },
  under_review: { label: "En cours d'examen", color: "text-amber-600", bg: "bg-amber-100" },
  accepted: { label: "Acceptée", color: "text-green-600", bg: "bg-green-100" },
  rejected: { label: "Refusée", color: "text-red-600", bg: "bg-red-100" },
  waitlisted: { label: "Liste d'attente", color: "text-purple-600", bg: "bg-purple-100" },
};

export default function ApplicationTrackingPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?next=/candidature/suivi");
        return;
      }

      const { data } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setApplications((data as Application[]) || []);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  useEffect(() => {
    if (!selectedId) return;
    async function loadHistory() {
      const { data } = await supabase
        .from("application_status_history")
        .select("*")
        .eq("application_id", selectedId)
        .order("created_at", { ascending: false });

      setHistory((data as ApplicationStatusHistory[]) || []);
    }
    loadHistory();
  }, [selectedId, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Chargement...</div>
      </main>
    );
  }

  const selected = applications.find((a) => a.id === selectedId);

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-24">
      <div className="border-b border-[var(--border)] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="font-['Space_Grotesk'] text-xl font-bold">
            <span className="text-[var(--black)]">H</span>
            <span className="text-[var(--lime)]">ARMONIA</span>
          </Link>
          <Link
            href="/candidature"
            className="text-sm font-medium text-[var(--lime)] hover:underline"
          >
            Nouvelle candidature
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8">
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[var(--black)] mb-2">
          Suivi de candidature
        </h1>
        <p className="text-[var(--text-muted)] mb-8">
          Consultez l&apos;état de vos candidatures au programme MIASA.
        </p>

        {applications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] mb-6">
              Vous n&apos;avez pas encore de candidature.
            </p>
            <Link
              href="/candidature"
              className="inline-block rounded-xl bg-[var(--lime)] px-8 py-3 font-['Space_Grotesk'] font-bold text-[var(--black)] transition hover:scale-[1.02]"
            >
              Postuler maintenant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Application list */}
            <div className="space-y-3">
              {applications.map((app) => {
                const st = STATUS_CONFIG[app.status];
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      selectedId === app.id
                        ? "border-[var(--lime)] bg-[var(--lime)]/5"
                        : "border-[var(--border)] bg-white hover:border-[var(--black)]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-['JetBrains_Mono'] text-xs text-[var(--text-muted)]">
                        {app.reference_number}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color} ${st.bg}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="font-medium text-[var(--black)] text-sm">
                      {app.project_name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {new Date(app.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Detail view */}
            <div className="lg:col-span-2">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[var(--border)] bg-white p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--black)]">
                        {selected.project_name}
                      </h2>
                      <p className="font-['JetBrains_Mono'] text-sm text-[var(--text-muted)]">
                        {selected.reference_number}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_CONFIG[selected.status].color} ${STATUS_CONFIG[selected.status].bg}`}
                    >
                      {STATUS_CONFIG[selected.status].label}
                    </span>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[var(--text-muted)]">Secteur</span>
                        <p className="font-medium text-[var(--black)] capitalize">
                          {selected.sector}
                        </p>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)]">Ville</span>
                        <p className="font-medium text-[var(--black)]">{selected.city}</p>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)]">Soumise le</span>
                        <p className="font-medium text-[var(--black)]">
                          {new Date(selected.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {selected.reviewed_at && (
                        <div>
                          <span className="text-[var(--text-muted)]">Examinée le</span>
                          <p className="font-medium text-[var(--black)]">
                            {new Date(selected.reviewed_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      )}
                    </div>

                    {selected.admin_notes && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                        <span className="text-xs font-medium text-amber-700">Note de l&apos;administration</span>
                        <p className="text-sm text-amber-800 mt-1">{selected.admin_notes}</p>
                      </div>
                    )}

                    {history.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-3">
                          Historique
                        </h3>
                        <div className="space-y-3">
                          {history.map((h) => (
                            <div key={h.id} className="flex items-start gap-3 text-sm">
                              <div className="mt-1 h-2 w-2 rounded-full bg-[var(--lime)] shrink-0" />
                              <div>
                                <p className="text-[var(--black)]">
                                  {h.old_status
                                    ? `${STATUS_CONFIG[h.old_status].label} → ${STATUS_CONFIG[h.new_status].label}`
                                    : `Statut : ${STATUS_CONFIG[h.new_status].label}`}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                  {new Date(h.created_at).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--border)] bg-white p-12 text-center text-[var(--text-muted)]">
                  Sélectionnez une candidature pour voir les détails
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
