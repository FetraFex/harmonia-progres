"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import type { Application } from "@/types/database";
import { SmoothInput } from "@/components/ui/SmoothInput";
import {
  Search,
  Filter,
  Download,
  Wheat,
  Palette,
  Fish,
  Building,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  MapPin,
  Clock,
  Users,
  Loader2,
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

export default function AdminCandidaturesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [page, setPage] = useState(0);
  const pageSize = 12;
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
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

  const filtered = applications.filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterSector !== "all" && a.sector !== filterSector) return false;
    if (filterDistrict !== "all" && a.district !== filterDistrict) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (a.reference_number || "").toLowerCase().includes(q) ||
        (a.first_name || "").toLowerCase().includes(q) ||
        (a.last_name || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q) ||
        (a.project_name || "").toLowerCase().includes(q) ||
        (a.commune || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // Status counts for the summary bar
  const statusCounts = Object.entries(STATUS_CONFIG)
    .map(([key, cfg]) => ({
      key,
      ...cfg,
      count: applications.filter((a) => a.status === key).length,
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  function exportCSV() {
    const headers = [
      "Référence",
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "District",
      "Commune",
      "Secteur",
      "Activité",
      "Projet",
      "Statut",
      "Date de soumission",
    ];

    const rows = filtered.map((a) => [
      `"${a.reference_number || ""}"`,
      `"${a.first_name || ""}"`,
      `"${a.last_name || ""}"`,
      `"${a.email || ""}"`,
      `"${a.phone || ""}"`,
      `"${a.district || ""}"`,
      `"${a.commune || ""}"`,
      `"${a.sector || ""}"`,
      `"${a.activity_type || ""}"`,
      `"${(a.project_name || "").replace(/"/g, '""')}"`,
      `"${a.status || ""}"`,
      `"${new Date(a.created_at).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `candidatures_harmonia_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
              Gestion des dossiers
            </span>
            <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
              Candidatures
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              Consultez, filtrez et traitez les <strong className="text-text-primary">{filtered.length}</strong> demandes déposées au programme MIASA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="rounded-xl glass px-4 py-2.5 text-xs font-semibold text-text-primary hover:bg-glass-bg-strong transition flex items-center gap-2 border border-glass-border disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-teal" />
              <span>Exporter CSV</span>
            </button>
            <Link
              href="/candidater"
              target="_blank"
              className="rounded-xl bg-green px-4 py-2.5 text-xs font-bold text-on-void transition hover:scale-[1.02] hover:shadow-lg hover:shadow-green/20 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle candidature</span>
            </Link>
          </div>
        </div>

        {/* Status Summary Bar */}
        {applications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setFilterStatus("all"); setPage(0); }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                filterStatus === "all"
                  ? "bg-green text-on-void border-teal"
                  : "bg-glass-bg text-text-muted border-glass-border hover:border-glass-border-strong hover:text-text-primary"
              }`}
            >
              Tous ({applications.length})
            </button>
            {statusCounts.map((s) => (
              <button
                key={s.key}
                onClick={() => { setFilterStatus(filterStatus === s.key ? "all" : s.key); setPage(0); }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                  filterStatus === s.key
                    ? `${s.bg} ${s.color} ${s.border}`
                    : "bg-glass-bg text-text-muted border-glass-border hover:border-glass-border-strong hover:text-text-primary"
                }`}
              >
                {s.label} ({s.count})
              </button>
            ))}
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="rounded-2xl glass p-5 space-y-4 border border-glass-border">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
            <SmoothInput
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Rechercher par référence, nom, email, projet, commune…"
              wrapperClassName="rounded-xl bg-void-2/60 border border-glass-border pl-10 pr-4 py-3"
              className="text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium pr-2">
              <Filter className="w-3.5 h-3.5 text-teal" />
              <span>Filtres :</span>
            </div>

            <select
              value={filterSector}
              onChange={(e) => {
                setFilterSector(e.target.value);
                setPage(0);
              }}
              className="rounded-xl bg-void-2 border border-glass-border px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="all">Tous les secteurs</option>
              <option value="agriculture">Agriculture</option>
              <option value="artisanat">Artisanat</option>
              <option value="halieutique">Halieutique</option>
            </select>

            <select
              value={filterDistrict}
              onChange={(e) => {
                setFilterDistrict(e.target.value);
                setPage(0);
              }}
              className="rounded-xl bg-void-2 border border-glass-border px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="all">Tous les districts</option>
              <option value="manakara">Manakara</option>
              <option value="vohipeno">Vohipeno</option>
            </select>

            {(filterStatus !== "all" || filterSector !== "all" || filterDistrict !== "all" || search) && (
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterSector("all");
                  setFilterDistrict("all");
                  setSearch("");
                  setPage(0);
                }}
                className="text-[11px] font-medium text-text-muted hover:text-teal px-3 py-2 flex items-center gap-1.5 transition ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="rounded-2xl glass p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-teal animate-spin mb-3" />
              <p className="text-sm text-text-muted">Chargement…</p>
            </div>
          ) : paged.length === 0 ? (
            <div className="rounded-2xl glass p-10 text-center">
              <p className="text-sm text-text-muted">Aucune candidature ne correspond à vos critères.</p>
            </div>
          ) : (
            paged.map((app, idx) => {
              const SectorIcon = SECTOR_ICONS[app.sector] || Building;
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="rounded-2xl glass p-5 border border-glass-border hover:border-teal/30 transition group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['JetBrains_Mono'] text-[10px] font-semibold text-teal">
                          {app.reference_number}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <h3 className="font-['Space_Grotesk'] font-bold text-sm text-text-primary group-hover:text-teal transition">
                        {app.first_name} {app.last_name}
                      </h3>
                    </div>
                    <Link
                      href={`/admin/candidatures/${app.id}`}
                      className="p-2 rounded-lg glass hover:bg-green hover:text-on-void text-text-muted transition shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                  <p className="text-xs text-text-primary font-medium truncate mb-2">{app.project_name}</p>
                  <div className="flex items-center gap-4 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <SectorIcon className="w-3 h-3 text-teal/60" />
                      <span className="capitalize">{app.sector}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal/60" />
                      <span className="capitalize">{app.commune || app.district}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(app.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-2xl glass overflow-hidden border border-glass-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass-border bg-void-2/50 text-text-muted text-[10px] uppercase tracking-[0.15em] font-semibold">
                  <th className="text-left px-6 py-4">Référence</th>
                  <th className="text-left px-6 py-4">Candidat</th>
                  <th className="text-left px-6 py-4">Projet & Secteur</th>
                  <th className="text-left px-6 py-4 hidden lg:table-cell">District / Commune</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Statut</th>
                  <th className="text-right px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {paged.map((app, idx) => {
                  const SectorIcon = SECTOR_ICONS[app.sector] || Building;
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;

                  return (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-glass-bg transition group"
                    >
                      <td className="px-6 py-4 font-['JetBrains_Mono'] text-[11px] font-semibold text-teal">
                        {app.reference_number}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-text-primary text-xs">
                          {app.first_name} {app.last_name}
                        </p>
                        <p className="text-[11px] text-text-muted truncate max-w-[180px]">
                          {app.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-text-primary text-xs truncate max-w-[200px]">
                          {app.project_name}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-text-muted capitalize mt-0.5">
                          <SectorIcon className="w-3 h-3 text-teal/60" />
                          {app.sector}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell text-xs">
                        <p className="text-text-primary font-medium capitalize">{app.district}</p>
                        <p className="text-text-muted text-[11px]">{app.commune || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-text-muted">
                        {new Date(app.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold glass text-text-primary hover:bg-green hover:text-on-void transition"
                        >
                          <span>Examiner</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}

                {paged.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-text-muted text-xs">
                      Aucune candidature ne correspond à vos critères de recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-glass-border flex items-center justify-between text-xs text-text-muted">
              <span>
                Affichage de {page * pageSize + 1} à{" "}
                {Math.min((page + 1) * pageSize, filtered.length)} sur {filtered.length} dossiers
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-lg glass text-text-primary hover:bg-glass-bg-strong disabled:opacity-40 flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Précédent</span>
                </button>
                <span className="px-2 font-['JetBrains_Mono'] font-medium text-text-primary text-[11px]">
                  {page + 1}/{totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg glass text-text-primary hover:bg-glass-bg-strong disabled:opacity-40 flex items-center gap-1 transition"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
