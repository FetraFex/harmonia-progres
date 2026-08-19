"use client";

import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { CheckCircle2, ArrowRight, User, Copy, Check } from "lucide-react";
import { Suspense, useState } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("candidaterConfirmation");
  const ref = searchParams.get("ref") || "HARMONIA-2026-XXXX";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-full bg-green/10 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-teal" strokeWidth={1.5} />
        </motion.div>

        <div>
          <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t("title")}
          </h1>
          <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
            {t("paragraph")}
          </p>
        </div>

        <div className="inline-flex flex-col items-center rounded-2xl glass px-8 py-6">
          <p className="text-xs text-text-muted mb-2">{t("referenceLabel")}</p>
          <div className="flex items-center gap-3">
            <p className="font-['JetBrains_Mono'] text-2xl font-bold text-teal">
              {ref}
            </p>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-text-muted hover:text-teal hover:bg-green/10 transition"
              title={t("copy")}
            >
              {copied ? (
                <Check className="w-4 h-4 text-teal" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-text-muted">
          {t("keep")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/candidater/suivi"
            className="w-full sm:w-auto rounded-xl bg-green px-8 py-4 font-['Space_Grotesk'] font-bold text-on-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-green/20 active:scale-[0.98] text-center flex items-center justify-center gap-2"
          >
            {t("track")}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/account"
            className="w-full sm:w-auto rounded-xl glass px-8 py-4 font-medium text-text-primary transition hover:bg-glass-bg-strong text-center flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" strokeWidth={1.5} />
            {t("backToAccount")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmationFallback() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
      <div className="space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-green/10 flex items-center justify-center animate-pulse" />
        <div className="space-y-3">
          <div className="h-8 w-64 bg-glass-bg rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-80 bg-glass-bg rounded mx-auto animate-pulse" />
        </div>
        <div className="inline-flex flex-col items-center rounded-2xl glass px-8 py-6">
          <div className="h-8 w-48 bg-glass-bg rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <CandidateLayout>
      <Suspense fallback={<ConfirmationFallback />}>
        <ConfirmationContent />
      </Suspense>
    </CandidateLayout>
  );
}
