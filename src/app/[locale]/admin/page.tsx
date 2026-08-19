"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import type { Application, ApplicationStatusHistory } from "@/types/database";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Wheat,
  Palette,
  Fish,
  Building,
  TrendingUp,
  Users,
  ChevronRight,
  ExternalLink,
  MapPin,
  RefreshCw,
  ArrowRight,
  BarChart3,
  CircleDot,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "Nouveau", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
  submitted: { label: "Soumis", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  under_review: { label: "En évaluation", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  shortlisted: { label: "Présélectionné", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  interview: { label: "Entretien", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  accepted: { label: "Accepté", color: "text-teal", bg: "bg-green/10", border: "border-teal/30" },
  rejected: { label: "Non retenu", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  waitlisted: { label: "Liste d'attente", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  withdrawn: { label: "Retiré", color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};

const SECTOR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  artisanat: Palette,
  halieutique: Fish,
};

const PIPELINE_STAGES = [
  { key: "submitted", label: "Reçues", color: "bg-blue-500" },
  { key: "under_review", label: "En évaluation", color: "bg-amber-500" },
  { key: "shortlisted", label: "Présélectionnés", color: "bg-indigo-500" },
  { key: "interview", label: "Entretiens", color: "bg-purple-500" },
  { key: "accepted", label: "Acceptés", color: "bg-green" },
];

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentHistory, setRecentHistory] = useState<(ApplicationStatusHistory & { application?: Application })[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  async function loadApplications() {
    try {
      setLoading(true);
      const [appsRes, histRes] = await Promise.all([
        supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("application_status_history")
          .select("*, application:applications(id, first_name, last_name, reference_number)")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (!appsRes.error && appsRes.data) {
        setApplications(appsRes.data as Application[]);
      }
      if (!histRes.error && histRes.data) {
        setRecentHistory(histRes.data as (ApplicationStatusHistory & { application?: Application })[]);
      }
    } catch (err) {
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted" || a.status === "new").length,
    under_review: applications.filter((a) => a.status === "under_review" || a.status === "shortlisted" || a.status === "interview").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const sectorCounts = {
    agriculture: applications.filter((a) => a.sector === "agriculture").length,
    artisanat: applications.filter((a) => a.sector === "artisanat").length,
    halieutique: applications.filter((a) => a.sector === "halieutique").length,
  };

  const districtCounts = {
    manakara: applications.filter((a) => a.district === "manakara").length,
    vohipeno: applications.filter((a) => a.district === "vohipeno").length,
  };

  // Pipeline counts (only statuses that flow through the pipeline)
  const pipelineCounts = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: applications.filter((a) => a.status === stage.key).length,
  }));

  const maxPipeline = Math.max(...pipelineCounts.map((p) => p.count), 1);

  const recent = applications.slice(0, 5);

  const kpiCards = [
    {
      label: "Total Candidatures",
      value: stats.total,
      sub: "Dossiers enregistrés",
      icon: FileText,
      iconBg: "bg-green/10",
      iconColor: "text-teal",
      valueColor: "text-text-primary",
    },
    {
      label: "En attente",
      value: stats.submitted,
      sub: "À traiter en priorité",
      icon: Clock,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      valueColor: "text-blue-400",
    },
    {
      label: "En cours d'évaluation",
      value: stats.under_review,
      sub: "Examen ou entretien",
      icon: TrendingUp,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      valueColor: "text-amber-400",
    },
    {
      label: "Sélectionnés",
      value: stats.accepted,
      sub: "Retenus pour la cohorte",
      icon: CheckCircle2,
      iconBg: "bg-green/10",
      iconColor: "text-teal",
      valueColor: "text-teal",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
              Console d&apos;administration
            </span>
            <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
              Vue d&apos;ensemble
            </h1>
            <p className="mt-1.5 text-sm text-text-muted max-w-lg">
              Suivez l&apos;activité globale, les candidatures et la progression du programme en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadApplications}
              disabled={loading}
              className="rounded-xl glass px-4 py-2.5 text-xs font-semibold text-text-muted hover:text-text-primary transition flex items-center gap-2 border border-glass-border hover:border-glass-border-strong"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-teal" : ""}`} />
              <span>Actualiser</span>
            </button>
            <Link
              href="/admin/candidatures"
              className="rounded-xl bg-green px-5 py-2.5 text-xs font-bold text-on-void transition hover:scale-[1.02] hover:shadow-lg hover:shadow-green/20 flex items-center gap-2"
            >
              <span>Toutes les candidatures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, idx) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl glass p-6 border border-glass-border hover:border-glass-border-strong transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center ${kpi.iconColor} transition-transform group-hover:scale-110`}>
                  <kpi.icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
              </div>
              <p className={`font-['Space_Grotesk'] text-3xl font-bold ${kpi.valueColor} mt-3`}>
                {kpi.value}
              </p>
              <p className="text-[11px] text-text-muted mt-1.5">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl glass p-6 md:p-8 border border-glass-border"
        >
          <div className="flex items-center justify-between pb-5 border-b border-glass-border mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center text-teal">
                <BarChart3 className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                  Funnel de sélection
                </h2>
                <p className="text-[11px] text-text-muted">Progression des candidatures à travers les étapes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {pipelineCounts.map((stage, idx) => {
              const pct = maxPipeline > 0 ? Math.round((stage.count / maxPipeline) * 100) : 0;
              return (
                <div key={stage.key} className="text-center">
                  <div className="relative mx-auto w-full h-28 rounded-xl bg-void-2/60 border border-glass-border overflow-hidden mb-3">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + idx * 0.08, ease: "easeOut" }}
                      className={`absolute bottom-0 left-0 right-0 ${stage.color} opacity-25`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-['Space_Grotesk'] text-2xl font-bold text-text-primary">
                        {stage.count}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-text-muted leading-tight">{stage.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Sector & District Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sector distribution */}
          <div className="lg:col-span-2 rounded-2xl glass p-6 md:p-8 space-y-6 border border-glass-border">
            <div className="flex items-center justify-between pb-4 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center text-teal">
                  <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                    Répartition par secteur
                  </h2>
                  <p className="text-[11px] text-text-muted">Projets ventilés par filière économique</p>
                </div>
              </div>
              <span className="text-[10px] font-['JetBrains_Mono'] font-semibold px-2.5 py-1 rounded-full bg-void text-text-muted border border-glass-border">
                3 filières
              </span>
            </div>

            <div className="space-y-5">
              {Object.entries(sectorCounts).map(([sector, count]) => {
                const Icon = SECTOR_ICONS[sector] || Building;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={sector} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2.5 capitalize font-medium text-text-primary">
                        <Icon className="w-4 h-4 text-teal" strokeWidth={1.5} />
                        {sector}
                      </span>
                      <span className="text-xs font-['JetBrains_Mono'] text-text-muted">
                        <strong className="text-text-primary">{count}</strong> · {pct}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-void-2 rounded-full overflow-hidden border border-glass-border/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-teal/70 to-teal rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* District distribution */}
          <div className="rounded-2xl glass p-6 md:p-8 space-y-5 border border-glass-border">
            <div className="pb-4 border-b border-glass-border">
              <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal" />
                Zones géographiques
              </h2>
              <p className="text-[11px] text-text-muted mt-1">Origine des porteurs de projet</p>
            </div>

            <div className="space-y-3">
              {Object.entries(districtCounts).map(([district, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={district} className="p-3.5 rounded-xl bg-void-2/60 border border-glass-border flex items-center justify-between hover:border-glass-border-strong transition group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center text-teal">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </div>
                      <span className="capitalize text-sm font-medium text-text-primary">
                        {district}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-['Space_Grotesk'] font-bold text-text-primary text-sm">
                        {count}
                      </span>
                      <span className="text-[10px] text-text-muted block">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Recent Applications + Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
          {/* Recent Applications Table */}
          <div className="rounded-2xl glass overflow-hidden border border-glass-border">
            <div className="p-6 border-b border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center text-teal">
                  <FileText className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                    Candidatures récentes
                  </h2>
                  <p className="text-[11px] text-text-muted">Dernières soumissions</p>
                </div>
              </div>
              <Link
                href="/admin/candidatures"
                className="text-xs font-semibold text-teal hover:text-teal/80 transition flex items-center gap-1"
              >
                <span>Voir tout</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-glass-border bg-void-2/50 text-text-muted text-[10px] uppercase tracking-[0.15em] font-semibold">
                    <th className="text-left px-6 py-3.5">Réf.</th>
                    <th className="text-left px-6 py-3.5">Candidat</th>
                    <th className="text-left px-6 py-3.5 hidden md:table-cell">Projet</th>
                    <th className="text-left px-6 py-3.5 hidden lg:table-cell">Date</th>
                    <th className="text-left px-6 py-3.5">Statut</th>
                    <th className="text-right px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {recent.map((app) => {
                    const SectorIcon = SECTOR_ICONS[app.sector] || Building;
                    const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;

                    return (
                      <tr key={app.id} className="hover:bg-glass-bg transition group">
                        <td className="px-6 py-4 font-['JetBrains_Mono'] text-[11px] font-semibold text-teal">
                          {app.reference_number}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-text-primary text-xs">
                            {app.first_name} {app.last_name}
                          </p>
                          <p className="text-[11px] text-text-muted truncate max-w-[160px]">
                            {app.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="font-medium text-text-primary text-xs truncate max-w-[180px]">
                            {app.project_name}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-text-muted capitalize mt-0.5">
                            <SectorIcon className="w-3 h-3 text-teal/60" />
                            {app.sector}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell text-[11px] text-text-muted">
                          {new Date(app.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/candidatures/${app.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold glass text-text-primary hover:bg-green hover:text-on-void transition"
                          >
                            <span className="hidden sm:inline">Examiner</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                  {recent.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-text-muted text-xs">
                        Aucune candidature enregistrée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-2xl glass border border-glass-border overflow-hidden">
            <div className="p-6 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center text-teal">
                  <CircleDot className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] font-bold text-base text-text-primary">
                    Activité récente
                  </h2>
                  <p className="text-[11px] text-text-muted">Dernières modifications de statut</p>
                </div>
              </div>
            </div>

            <div className="p-4 max-h-[460px] overflow-y-auto">
              {recentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-text-muted">Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentHistory.map((entry, i) => {
                    const cfg = STATUS_CONFIG[entry.new_status] || STATUS_CONFIG.new;
                    const app = entry.application;
                    return (
                      <div key={entry.id} className="flex gap-3 py-2">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${cfg.bg}`} style={{ backgroundColor: "var(--teal)" }} />
                          {i < recentHistory.length - 1 && (
                            <div className="w-px flex-1 my-1 bg-glass-border" />
                          )}
                        </div>
                        <div className="pb-2 flex-1 min-w-0">
                          <p className="text-xs text-text-primary leading-snug">
                            <span className="font-semibold">{app ? `${app.first_name} ${app.last_name}` : "Un candidat"}</span>
                            <span className="text-text-muted"> → </span>
                            <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                          </p>
                          {app && (
                            <p className="text-[10px] text-teal/60 font-['JetBrains_Mono'] mt-0.5">
                              {app.reference_number}
                            </p>
                          )}
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
