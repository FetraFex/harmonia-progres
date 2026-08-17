"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";

export default function ParametresPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--black)]">
            Paramètres
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Configuration de l&apos;administration.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center text-[var(--text-muted)]">
          Paramètres à configurer.
        </div>
      </div>
    </AdminLayout>
  );
}
