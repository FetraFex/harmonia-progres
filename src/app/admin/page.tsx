"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
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

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
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

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "submitted").length,
    under_review: applications.filter((a) => a.status === "under_review").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  const sectorCounts = {
    agriculture: applications.filter((a) => a.sector === "agriculture").length,
    artisanat: applications.filter((a) => a.sector === "artisanat").length,
    halieutique: applications.filter((a) => a.sector === "halieutique").length,
  };

  const recent = applications.slice(0, 5);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)]">
            Vue d&apos;ensemble
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Suivez les candidatures et l&apos;activité du programme.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total candidatures", value: stats.total, color: "text-[var(--black)]" },
            { label: "Nouvelles", value: stats.new, color: "text-blue-600" },
            { label: "En évaluation", value: stats.under_review, color: "text-amber-600" },
            { label: "Acceptées", value: stats.accepted, color: "text-green-600" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-[var(--border)] p-5"
            >
              <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
              <p className={`font-['Space_Grotesk'] text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Sector breakdown */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)] mb-4">
            Candidatures par secteur
          </h2>
          <div className="space-y-3">
            {Object.entries(sectorCounts).map(([sector, count]) => {
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={sector}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-[var(--black)]">{sector}</span>
                    <span className="text-[var(--text-muted)]">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--lime)] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-['Space_Grotesk'] font-bold text-[var(--black)]">
              Candidatures récentes
            </h2>
            <Link href="/admin/candidatures" className="text-sm font-medium text-[var(--lime)] hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/50">
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Référence</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Candidat</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Secteur</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-[var(--text-muted)]">Statut</th>
                  <th className="text-right px-6 py-3 font-medium text-[var(--text-muted)]">Action</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/50 transition">
                    <td className="px-6 py-3 font-['JetBrains_Mono'] text-xs">{app.reference_number}</td>
                    <td className="px-6 py-3 font-medium">{app.first_name} {app.last_name}</td>
                    <td className="px-6 py-3 capitalize">{app.sector}</td>
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
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)]">
                      Aucune candidature pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
