"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target, Handshake, TrendingUp, Users, MapPin } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "FORMATION",
    description: "Développez vos compétences entrepreneuriales et techniques.",
  },
  {
    icon: Handshake,
    title: "ACCOMPAGNEMENT",
    description: "Bénéficiez d'un suivi adapté à votre projet.",
  },
  {
    icon: TrendingUp,
    title: "OPPORTUNITÉS",
    description: "Accédez à des ressources et opportunités pour développer votre activité.",
  },
  {
    icon: Users,
    title: "RÉSEAU",
    description: "Construisez des relations avec d'autres acteurs économiques de votre territoire.",
  },
];

const locations = ["MANAKARA", "VOHIPENO", "FITOVINANY"];
const sectors = ["AGRICULTURE", "ARTISANAT", "HALIEUTIQUE"];

export default function CandidaterPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            MIASA Jeunes Entrepreneurs
          </span>
          <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--black)] leading-[1.05]">
            Votre projet peut devenir{" "}
            <span className="text-[var(--lime)]">votre avenir.</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Rejoignez MIASA Jeunes Entrepreneurs et bénéficiez d&apos;un accompagnement
            pour transformer votre idée ou votre activité en une opportunité durable.
          </p>
        </motion.div>

        {/* Locations & Sectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {locations.map((loc) => (
            <span
              key={loc}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--black)] text-white text-xs font-bold tracking-wider"
            >
              <MapPin className="w-3 h-3" />
              {loc}
            </span>
          ))}
          {sectors.map((sec) => (
            <span
              key={sec}
              className="px-4 py-2 rounded-xl border border-[var(--border)] bg-white text-[var(--black)] text-xs font-bold tracking-wider"
            >
              {sec}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/candidater/eligibilite"
            className="w-full sm:w-auto rounded-xl bg-[var(--lime)] px-8 py-4 font-['Space_Grotesk'] font-bold text-[var(--black)] text-lg transition hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] text-center flex items-center justify-center gap-2"
          >
            Commencer ma candidature
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/candidater/eligibilite"
            className="w-full sm:w-auto rounded-xl border border-[var(--border)] bg-white px-8 py-4 font-medium text-[var(--black)] transition hover:bg-gray-50 text-center"
          >
            Vérifier mon éligibilité
          </Link>
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--black)] text-center mb-12">
            Ce que vous allez découvrir
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center space-y-3 hover:border-[var(--lime)] transition-colors"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--lime)]/10 flex items-center justify-center">
                  <b.icon className="w-6 h-6 text-[var(--black)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-sm tracking-wider text-[var(--black)]">
                  {b.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
