"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { ShieldCheckIcon, HeartIcon } from "@/components/ui/Icons";

export function DonationCta() {
  const { ref, isRevealed } = useRevealOnScroll<HTMLDivElement>();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");

  const amounts = [20, 50, 100, 250];

  const handleDonate = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error("Veuillez saisir un montant valide.");
      return;
    }

    toast.success(
      `Merci ! Votre don de ${finalAmount.toLocaleString("fr-FR")} € est prêt. Transparence garantie à 100%.`,
      {
        description: "Un reçu fiscal automatisé a été simulé avec succès.",
      }
    );
  };

  return (
    <section
      id="donate"
      ref={ref}
      className="py-16 md:py-24 px-4 max-w-[1080px] mx-auto relative z-10 scroll-mt-24"
    >
      <div
        className={`glass-strong p-8 sm:p-12 md:p-16 rounded-[36px] border-glass-border-strong text-center shadow-2xl relative overflow-hidden transition-all duration-700 ${
          isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-coral/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-semibold text-coral uppercase tracking-wider">
            <HeartIcon className="w-4 h-4 text-coral" />
            <span>Objectif 2026</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            500 000 € pour ouvrir{" "}
            <span className="font-serif italic font-normal text-teal">4</span>{" "}
            nouveaux pays d&apos;intervention
          </h2>

          {/* Progress Bar Section */}
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full bg-void-2 rounded-full overflow-hidden p-0.5 border border-glass-border">
              <div
                className="h-full bg-gradient-to-r from-teal via-teal to-coral rounded-full transition-all duration-1000 ease-out"
                style={{ width: isRevealed ? "62%" : "0%" }}
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-medium text-text-secondary">
              <span>312 400 € collectés sur 500 000 €</span>
              <span className="text-teal font-bold">62 %</span>
            </div>
          </div>

          {/* Amount Selector Buttons */}
          <div className="pt-6 space-y-4">
            <label className="block text-xs font-mono font-semibold uppercase text-text-muted">
              Sélectionnez votre montant de don
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amounts.map((amt) => {
                const isSelected = selectedAmount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`py-3.5 px-4 rounded-2xl font-mono font-bold text-base transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal text-void shadow-lg shadow-teal/30 scale-105"
                        : "glass hover:glass-strong text-text-primary border-glass-border hover:border-teal/50"
                    }`}
                  >
                    {amt} €
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Action Button */}
          <div className="pt-4">
            <button
              onClick={handleDonate}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-teal text-void font-display font-bold text-base sm:text-lg hover:bg-teal/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal/25 cursor-pointer"
            >
              Faire un don de {customAmount ? customAmount : selectedAmount} €
            </button>
          </div>

          {/* Security & Deductibility Note */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-text-muted">
            <ShieldCheckIcon className="w-4 h-4 text-green" />
            <span>Paiement sécurisé · 66% déductible des impôts en France</span>
          </div>
        </div>
      </div>
    </section>
  );
}
