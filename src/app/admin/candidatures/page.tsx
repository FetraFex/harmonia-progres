"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Application } from "@/types/database";

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

export default function AdminCandidaturesPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [page, setPage] = useState(0);
  const pageSize = 20;
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
    if (search) {
      const q = search.toLowerCase();
      return (
        a.reference_number.toLowerCase().includes(q) ||
        a.first_name.toLowerCase().includes(q) ||
        a.last_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.project_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="h-10 bg-white rounded-lg border border-[var(--border)] animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-lg border border-[var(--border)] animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)]">
            Candidatures
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {filtered.length} candidature{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Rechercher par nom, référence, projet..."
            className="w-full rounded-xl border border-[var(--border)] bg-white pl-10 pr-4 py-3 text-sm text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--black)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)]"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select
            value={filterSector}
            onChange={(e) => { setFilterSector(e.target.value); setPage(0); }}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--black)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)]"
          >
            <option value="all">Tous les secteurs</option>
            <option value="agriculture">Agriculture</option>
            <option value="artisanat">Artisanat</option>
            <option value="halieutique">Halieutique</option>
          </select>

          {(filterStatus !== "all" || filterSector !== "all" || search) && (
            <button
              onClick={() => { setFilterStatus("all"); setFilterSector("all"); setSearch(""); setPage(0); }}
              className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--black)] px-3 py-2"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/50">
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Référence</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Candidat</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Secteur</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">District</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Statut</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--text-muted)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3 font-['JetBrains_Mono'] text-xs">{app.reference_number}</td>
                    <td className="px-6 py-3">
                      <p className="font-medium">{app.first_name} {app.last_name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{app.email}</p>
                    </td>
                    <td className="px-6 py-3 capitalize">{app.sector}</td>
                    <td className="px-6 py-3 capitalize">{app.district}</td>
                    <td className="px-6 py-3 text-[var(--text-muted)]">
                      {new Date(app.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[app.status]?.color} ${STATUS_CONFIG[app.status]?.bg}`}>
                        {STATUS_CONFIG[app.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/admin/candidatures/${app.id}`} className="text-sm font-medium text-[var(--lime)] hover:underline">
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-muted)]">
                      Aucune candidature trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">
                Page {page + 1} sur {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-gray-50 disabled:opacity-40"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-gray-50 disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
