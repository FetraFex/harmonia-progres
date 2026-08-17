"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { MapPin, Wheat, Fish, Palette, CheckCircle2 } from "lucide-react";

interface EligibilityAnswer {
  district: string;
  sector: string;
  isProjectHolder: string;
}

const questions = [
  {
    key: "district" as keyof EligibilityAnswer,
    question: "Dans quel district résidez-vous ?",
    options: [
      { value: "manakara", label: "Manakara", icon: MapPin },
      { value: "vohipeno", label: "Vohipeno", icon: MapPin },
      { value: "autre", label: "Autre", icon: MapPin },
    ],
  },
  {
    key: "sector" as keyof EligibilityAnswer,
    question: "Votre projet concerne-t-il l'un des secteurs suivants ?",
    options: [
      { value: "agriculture", label: "Agriculture", icon: Wheat },
      { value: "artisanat", label: "Artisanat", icon: Palette },
      { value: "halieutique", label: "Halieutique", icon: Fish },
    ],
  },
  {
    key: "isProjectHolder" as keyof EligibilityAnswer,
    question: "Êtes-vous actuellement porteur d'un projet ou d'une activité ?",
    options: [
      { value: "oui", label: "Oui", icon: CheckCircle2 },
      { value: "non", label: "Non", icon: CheckCircle2 },
    ],
  },
];

export default function EligibilitePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EligibilityAnswer>({
    district: "",
    sector: "",
    isProjectHolder: "",
  });
  const router = useRouter();

  const current = questions[step];
  const isEligible =
    (answers.district === "manakara" || answers.district === "vohipeno") &&
    answers.sector !== "" &&
    answers.isProjectHolder === "oui";

  const isNotEligible =
    (answers.district === "autre" || answers.sector === "") && step === 2;

  function handleSelect(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setTimeout(() => {
      if (step < 2) setStep(step + 1);
    }, 300);
  }

  return (
    <CandidateLayout>
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            {questions.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i <= step ? "bg-[var(--lime)]" : ""
                  }`}
                  style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-['JetBrains_Mono'] uppercase tracking-widest">
            Étape {step + 1} sur 3
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step < 3 ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--black)] mb-8">
                {current.question}
              </h1>
              <div className="space-y-3">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left rounded-xl border-2 p-5 flex items-center gap-4 transition ${
                      answers[current.key] === opt.value
                        ? "border-[var(--lime)] bg-[var(--lime)]/5"
                        : "border-[var(--border)] bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      answers[current.key] === opt.value
                        ? "bg-[var(--lime)]/10"
                        : "bg-gray-50"
                    }`}>
                      <opt.icon className="w-5 h-5 text-[var(--black)]" strokeWidth={1.5} />
                    </div>
                    <span className="font-medium text-[var(--black)]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : isNotEligible ? (
            <motion.div
              key="not-eligible"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[var(--text-muted)]" strokeWidth={1.5} />
              </div>
              <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--black)] mb-4">
                Merci pour votre intérêt
              </h1>
              <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-8">
                Les critères actuels du programme sont limités à certaines zones et
                certains secteurs d&apos;intervention. Nous vous encourageons à suivre
                nos actualités pour de futures opportunités.
              </p>
              <Link
                href="/"
                className="rounded-xl border border-[var(--border)] bg-white px-8 py-3 font-medium text-[var(--black)] transition hover:bg-gray-50"
              >
                Retour au site
              </Link>
            </motion.div>
          ) : isEligible ? (
            <motion.div
              key="eligible"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--lime)]/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[var(--black)]" strokeWidth={1.5} />
              </div>
              <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--black)] mb-4">
                Vous pouvez commencer votre candidature.
              </h1>
              <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed mb-8">
                Vous êtes éligible pour le programme MIASA Jeunes Entrepreneurs.
                Complétez votre candidature en quelques étapes simples.
              </p>
              <Link
                href="/candidater/informations"
                className="rounded-xl bg-[var(--lime)] px-8 py-4 font-['Space_Grotesk'] font-bold text-[var(--black)] text-lg transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                Commencer
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {step > 0 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-8 text-sm text-[var(--text-muted)] hover:text-[var(--black)] transition"
          >
            Précédent
          </button>
        )}
      </div>
    </CandidateLayout>
  );
}
