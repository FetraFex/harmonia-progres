"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Empowering Manakara&apos;s Entrepreneurs
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl"
          >
            Building a Thriving Future for{" "}
            <span className="text-primary">Local Entrepreneurship</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-text-secondary"
          >
            Harmonia Progres supports young entrepreneurs, artisans, and fishermen
            in Manakara through training, technical assistance, networking, and
            access to financing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <ButtonLink href="/programs" size="lg">
              Explore Our Programs
            </ButtonLink>
            <ButtonLink href="/donate" variant="accent" size="lg">
              Support Our Mission
            </ButtonLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
