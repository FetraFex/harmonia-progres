"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import type { ApplicationEvaluation } from "@/types/database";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<ApplicationEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin/login"); return; }

      const { data } = await supabase
        .from("application_evaluations")
        .select("*")
        .order("created_at", { ascending: false });

      setEvaluations((data as ApplicationEvaluation[]) || []);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-[var(--border)] animate-pulse" />
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
            Évaluations
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {evaluations.length} évaluation{evaluations.length !== 1 ? "s" : ""}
          </p>
        </div>

        {evaluations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center text-[var(--text-muted)]">
            Aucune évaluation pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {evaluations.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-[var(--border)] p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['JetBrains_Mono'] text-xs text-[var(--text-muted)]">
                    {ev.application_id.slice(0, 8)}...
                  </span>
                  <span className="font-['Space_Grotesk'] font-bold text-[var(--black)]">
                    {ev.score}/25
                  </span>
                </div>
                {ev.strengths && (
                  <p className="text-sm text-[var(--black)] mb-1">
                    <span className="text-[var(--text-muted)]">Points forts : </span>
                    {ev.strengths}
                  </p>
                )}
                {ev.recommendation && (
                  <p className="text-sm text-[var(--text-muted)]">
                    Recommandation : {ev.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
