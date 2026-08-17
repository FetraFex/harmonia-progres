"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { CheckCircle2, ArrowRight, Home, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "MIASA-2026-XXXX";
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <CandidateLayout>
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
            className="w-20 h-20 mx-auto rounded-full bg-teal/10 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-teal" strokeWidth={1.5} />
          </motion.div>

          <div>
            <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Candidature soumise
            </h1>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              Merci pour votre intérêt envers MIASA Jeunes Entrepreneurs.
              Votre dossier a été transmis à l&apos;équipe HARMONIA PROGRES.
            </p>
          </div>

          <div className="inline-flex flex-col items-center rounded-2xl glass px-8 py-6">
            <p className="text-xs text-text-muted mb-2">Votre numéro de référence</p>
            <div className="flex items-center gap-3">
              <p className="font-['JetBrains_Mono'] text-2xl font-bold text-teal">
                {ref}
              </p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-text-muted hover:text-teal hover:bg-teal/10 transition"
                title="Copier"
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
            Conservez ce numéro pour suivre l&apos;état de votre candidature.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/candidater/suivi"
              className="w-full sm:w-auto rounded-xl bg-teal px-8 py-4 font-['Space_Grotesk'] font-bold text-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] text-center flex items-center justify-center gap-2"
            >
              Suivre ma candidature
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto rounded-xl glass px-8 py-4 font-medium text-text-primary transition hover:bg-glass-bg-strong text-center flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" strokeWidth={1.5} />
              Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </CandidateLayout>
  );
}
