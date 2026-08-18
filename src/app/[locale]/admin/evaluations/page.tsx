"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import type { ApplicationEvaluation, Application } from "@/types/database";
import {
  Star,
  Calendar,
  ExternalLink,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  Loader2,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ArrowUpDown,
} from "lucide-react";

interface EvaluationWithApp extends ApplicationEvaluation {
  application?: Application;
}

type SortKey = "date" | "score" | "name";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<EvaluationWithApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [filterRecommendation, setFilterRecommendation] = useState<string>("all");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data: evals, error } = await supabase
        .from("application_evaluations")
        .select("*, application:applications(*)")
        .order("created_at", { ascending: false });

      if (!error && evals) {
        setEvaluations(evals as EvaluationWithApp[]);
      }
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const avgScore =
    evaluations.length > 0
      ? (
          evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) /
          evaluations.length
        ).toFixed(1)
      : "0";

  // Recommendation stats
  const recStats = {
    favorable: evaluations.filter((e) => e.recommendation === "Favorable" || e.recommendation === "Très favorable").length,
    reserved: evaluations.filter((e) => e.recommendation === "Réservé").length,
    unfavorable: evaluations.filter((e) => e.recommendation === "Défavorable").length,
  };

  // Filter & sort
  const filtered = evaluations
    .filter((e) => {
      if (filterRecommendation === "all") return true;
      if (filterRecommendation === "favorable") return e.recommendation === "Favorable" || e.recommendation === "Très favorable";
      if (filterRecommendation === "reserved") return e.recommendation === "Réservé";
      if (filterRecommendation === "unfavorable") return e.recommendation === "Défavorable";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      if (sortBy === "name") {
        const nameA = a.application ? `${a.application.first_name} ${a.application.last_name}` : "";
        const nameB = b.application ? `${b.application.first_name} ${b.application.last_name}` : "";
        return nameA.localeCompare(nameB);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
              Comité de sélection
            </span>
            <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
              Évaluations des projets
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              Consultez les notations et avis du jury sur les <strong className="text-text-primary">{evaluations.length}</strong> dossiers évalués.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-5 border border-glass-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">Score moyen</span>
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-text-primary">
              {avgScore} <span className="text-sm text-text-muted font-normal">/ 25</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl glass p-5 border border-glass-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">Favorables</span>
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                <ThumbsUp className="w-4 h-4" />
              </div>
            </div>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-teal">
              {recStats.favorable}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">Recommandés pour la cohorte</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass p-5 border border-glass-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">Réservés</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Minus className="w-4 h-4" />
              </div>
            </div>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-amber-400">
              {recStats.reserved}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">À approfondir</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl glass p-5 border border-glass-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">Défavorables</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <ThumbsDown className="w-4 h-4" />
              </div>
            </div>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-red-400">
              {recStats.unfavorable}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">Non retenus</p>
          </motion.div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-teal" />
            <span>Trier par :</span>
          </div>
          {[
            { key: "date" as SortKey, label: "Date" },
            { key: "score" as SortKey, label: "Score" },
            { key: "name" as SortKey, label: "Nom" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                sortBy === s.key
                  ? "bg-teal text-on-void border-teal"
                  : "bg-glass-bg text-text-muted border-glass-border hover:border-glass-border-strong hover:text-text-primary"
              }`}
            >
              {s.label}
            </button>
          ))}

          <div className="w-px h-5 bg-glass-border mx-1 hidden sm:block" />

          <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium">
            <span>Avis :</span>
          </div>
          {[
            { key: "all", label: "Tous" },
            { key: "favorable", label: "Favorables" },
            { key: "reserved", label: "Réservés" },
            { key: "unfavorable", label: "Défavorables" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterRecommendation(f.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                filterRecommendation === f.key
                  ? "bg-teal text-on-void border-teal"
                  : "bg-glass-bg text-text-muted border-glass-border hover:border-glass-border-strong hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Evaluation Cards */}
        {loading ? (
          <div className="rounded-2xl glass p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
            <p className="text-sm text-text-muted">Chargement des évaluations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl glass p-12 text-center space-y-4 border border-glass-border">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-teal/10 flex items-center justify-center text-teal">
              <Star className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-text-primary">
              {evaluations.length === 0 ? "Aucune évaluation enregistrée" : "Aucun résultat correspondant"}
            </h3>
            <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              {evaluations.length === 0
                ? "Pour évaluer un projet, ouvrez une candidature depuis l'onglet Candidatures et remplissez la grille de notation."
                : "Modifiez vos filtres pour afficher d'autres évaluations."}
            </p>
            {evaluations.length === 0 && (
              <div className="pt-2">
                <Link
                  href="/admin/candidatures"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-2.5 font-['Space_Grotesk'] font-bold text-on-void text-xs transition hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4" />
                  <span>Voir les candidatures</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((ev, idx) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="rounded-2xl glass p-6 space-y-4 border border-glass-border hover:border-teal/30 transition group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-glass-border">
                  <div className="min-w-0">
                    <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-teal block mb-1">
                      {ev.application?.reference_number || "DOSSIER"}
                    </span>
                    <h3 className="font-['Space_Grotesk'] font-bold text-sm text-text-primary">
                      {ev.application
                        ? `${ev.application.first_name} ${ev.application.last_name}`
                        : "Candidat"}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5 truncate max-w-[240px]">
                      {ev.application?.project_name || "Projet"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal/10 border border-teal/20 text-teal font-['Space_Grotesk'] font-bold text-sm">
                      <Award className="w-3.5 h-3.5" />
                      <span>{ev.score || 0}/25</span>
                    </div>
                    {ev.recommendation && (
                      <span className={`text-[10px] block mt-1.5 font-medium ${
                        ev.recommendation.includes("favorable") && !ev.recommendation.includes("Dé")
                          ? "text-teal"
                          : ev.recommendation === "Réservé"
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}>
                        {ev.recommendation}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  {[
                    { label: "Pertinence", val: ev.pertinence },
                    { label: "Faisabilité", val: ev.faisabilite },
                    { label: "Motivation", val: ev.motivation_score },
                    { label: "Potentiel", val: ev.potentiel_economique },
                    { label: "Impact", val: ev.impact_local },
                  ].map((c) => (
                    <div key={c.label} className="p-2 rounded-lg bg-void-2/60 border border-glass-border">
                      <span className="text-text-muted block leading-tight mb-1">{c.label}</span>
                      <span className="font-bold text-text-primary text-xs">{c.val ?? "—"}/5</span>
                    </div>
                  ))}
                </div>

                {/* Qualitative notes */}
                {(ev.strengths || ev.weaknesses) && (
                  <div className="space-y-1.5 text-[11px] bg-void-2/40 p-3.5 rounded-xl border border-glass-border">
                    {ev.strengths && (
                      <p>
                        <strong className="text-teal">Points forts : </strong>
                        <span className="text-text-muted">{ev.strengths}</span>
                      </p>
                    )}
                    {ev.weaknesses && (
                      <p>
                        <strong className="text-amber-400">Axes d&apos;amélioration : </strong>
                        <span className="text-text-muted">{ev.weaknesses}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(ev.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {ev.application_id && (
                    <Link
                      href={`/admin/candidatures/${ev.application_id}`}
                      className="text-teal hover:underline inline-flex items-center gap-1 font-medium transition"
                    >
                      <span>Voir le dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
