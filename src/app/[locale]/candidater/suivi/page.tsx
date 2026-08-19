"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import type { Application, ApplicationStatusHistory } from "@/types/database";
import { Search, Hash, Mail, ArrowLeft, Building, Wheat, Fish, Palette, Check } from "lucide-react";
import { Input } from "@/components/ui/SmoothInput";

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  new: { color: "text-text-muted", bg: "bg-glass-bg-strong0/10" },
  submitted: { color: "text-blue-400", bg: "bg-blue-500/10" },
  under_review: { color: "text-amber-400", bg: "bg-amber-500/10" },
  shortlisted: { color: "text-indigo-400", bg: "bg-indigo-500/10" },
  interview: { color: "text-purple-400", bg: "bg-purple-500/10" },
  accepted: { color: "text-teal", bg: "bg-green/10" },
  rejected: { color: "text-red-400", bg: "bg-red-500/10" },
  waitlisted: { color: "text-orange-400", bg: "bg-orange-500/10" },
  withdrawn: { color: "text-text-muted", bg: "bg-glass-bg-strong0/10" },
};

const SECTOR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  artisanat: Palette,
  halieutique: Fish,
};

export default function SuiviPage() {
  const t = useTranslations("candidaterSuivi");
  const statusLabels = t.raw("statuses") as Record<string, string>;
  const TIMELINE_STEPS = t.raw("timeline") as { status: string; label: string }[];
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState(false);
  const supabase = createClient();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("applications")
      .select("*")
      .eq("reference_number", reference.toUpperCase())
      .eq("email", email)
      .single();

    if (queryError || !data) {
      setError(t("notFound"));
      setLoading(false);
      return;
    }

    setApplication(data as Application);

    const { data: hist } = await supabase
      .from("application_status_history")
      .select("*")
      .eq("application_id", data.id)
      .order("created_at", { ascending: false });

    setHistory((hist as ApplicationStatusHistory[]) || []);
    setFound(true);
    setLoading(false);
  }

  const currentIdx = application
    ? TIMELINE_STEPS.findIndex((s) => s.status === application.status)
    : -1;

  const SectorIcon = application ? (SECTOR_ICONS[application.sector] || Building) : Building;

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-text-primary mb-2">
          {t("title")}
        </h1>
        <p className="text-text-muted mb-10">
          {t("subtitle")}
        </p>

        {!found ? (
          <form onSubmit={handleSearch} className="space-y-5 max-w-md">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-start gap-3">
                <Search className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-text-primary mb-1.5">
                {t("referenceLabel")}
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <Input
                  id="reference"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="HP-2026-XXXX"
                  required
                  wrapperClassName="rounded-xl glass px-4 py-3 pl-10"
                  className="font-['JetBrains_Mono'] text-sm text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-track" className="block text-sm font-medium text-text-primary mb-1.5">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />
                <Input
                  id="email-track"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  wrapperClassName="rounded-xl glass px-4 py-3 pl-10"
                  className="text-sm text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green px-6 py-3 font-['Space_Grotesk'] font-bold text-on-void transition hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? t("searching") : t("search")}
              {!loading && <Search className="w-4 h-4" strokeWidth={2} />}
            </button>
          </form>
        ) : application && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="rounded-2xl glass p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-['JetBrains_Mono'] text-sm text-text-muted">
                    {application.reference_number}
                  </p>
                  <h2 className="font-['Space_Grotesk'] text-xl font-bold text-text-primary">
                    {application.first_name} {application.last_name}
                  </h2>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_COLORS[application.status]?.color} ${STATUS_COLORS[application.status]?.bg}`}>
                  {statusLabels[application.status] || application.status}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <SectorIcon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{t("sector")}<strong className="text-text-primary capitalize">{application.sector}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4" strokeWidth={1.5} />
                  <span>{t("city")}<strong className="text-text-primary">{application.commune || application.district}</strong></span>
                </span>
              </div>
            </div>

            <div className="rounded-2xl glass p-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-text-primary mb-6">
                {t("progress")}
              </h3>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                            isCurrent
                              ? "bg-green ring-4 ring-teal/20"
                              : isDone
                                ? "bg-green"
                                : "bg-glass-border"
                          }`}
                        />
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-px flex-1 my-1 ${isDone ? "bg-green" : "bg-glass-border"}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${isCurrent ? "text-text-primary" : isDone ? "text-text-primary" : "text-text-muted"}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => { setFound(false); setApplication(null); setHistory([]); }}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              {t("searchAnother")}
            </button>
          </motion.div>
        )}
      </div>
    </CandidateLayout>
  );
}
