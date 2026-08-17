"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || "MIASA-2026-XXXX";

  return (
    <CandidateLayout>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-[var(--lime)] flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-[var(--black)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-[var(--black)] mb-4">
            Votre candidature a bien été reçue.
          </h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-8">
            Merci pour votre intérêt envers MIASA Jeunes Entrepreneurs. Votre dossier a été
            transmis à l&apos;équipe HARMONIA PROGRES.
          </p>

          {/* Reference */}
          <div className="inline-block rounded-2xl bg-[var(--black)] px-8 py-6 mb-8">
            <p className="text-xs text-gray-400 mb-2">Votre référence</p>
            <p className="font-['JetBrains_Mono'] text-2xl font-bold text-[var(--lime)]">
              {ref}
            </p>
          </div>

          <p className="text-sm text-[var(--text-muted)] mb-10">
            Conservez ce numéro pour suivre l&apos;état de votre candidature.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/candidater/suivi"
              className="w-full sm:w-auto rounded-xl bg-[var(--lime)] px-8 py-4 font-['Space_Grotesk'] font-bold text-[var(--black)] text-lg transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] text-center"
            >
              Suivre ma candidature
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto rounded-xl border border-[var(--border)] bg-white px-8 py-4 font-medium text-[var(--black)] transition hover:bg-gray-50 text-center"
            >
              Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </CandidateLayout>
  );
}
