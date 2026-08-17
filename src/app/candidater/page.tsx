"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target, Handshake, TrendingUp, Users, MapPin } from "lucide-react";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";

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
    <CandidateLayout>
      <div className="flex flex-col lg:flex-row w-full lg:min-h-[calc(100vh-64px)]">
        <section className="flex-1 px-6 py-12 lg:py-8 flex flex-col justify-center max-w-3xl mx-auto lg:mx-0 lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-6 lg:pl-12 xl:pl-24"
          >
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              MIASA Jeunes Entrepreneurs
            </span>
            <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.05]">
              Votre projet peut devenir{" "}
              <span className="text-teal block mt-2">votre avenir.</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Rejoignez MIASA Jeunes Entrepreneurs et bénéficiez d&apos;un accompagnement
              pour transformer votre idée ou votre activité en une opportunité durable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3 lg:pl-12 xl:pl-24"
          >
            {locations.map((loc) => (
              <span
                key={loc}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal text-void text-xs font-bold tracking-wider"
              >
                <MapPin className="w-3 h-3" />
                {loc}
              </span>
            ))}
            {sectors.map((sec) => (
              <span
                key={sec}
                className="px-4 py-2 rounded-xl glass text-text-primary text-xs font-bold tracking-wider"
              >
                {sec}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:pl-12 xl:pl-24"
          >
            <Link
              href="/candidater/eligibilite"
              className="w-full sm:w-auto rounded-xl bg-teal px-8 py-4 font-['Space_Grotesk'] font-bold text-void text-lg transition hover:scale-[1.02] hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] text-center flex items-center justify-center gap-2"
            >
              Candidater
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/candidater/eligibilite"
              className="w-full sm:w-auto rounded-xl glass px-8 py-4 font-medium text-text-primary transition hover:bg-glass-bg-strong text-center"
            >
              Vérifier l'éligibilité
            </Link>
          </motion.div>
        </section>

        <section className="flex-1 px-6 py-12 lg:py-8 border-t lg:border-t-0 lg:border-l border-glass-border flex flex-col justify-center bg-void-2/30">
          <div className="max-w-2xl mx-auto lg:pr-12 xl:pr-24 w-full">
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-text-primary text-center lg:text-left mb-10">
              Ce que vous allez découvrir
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="rounded-2xl glass p-6 text-left space-y-4 hover:border-teal/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                    <b.icon className="w-6 h-6 text-teal" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-['Space_Grotesk'] font-bold text-sm tracking-wider text-text-primary mb-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </CandidateLayout>
  );
}
