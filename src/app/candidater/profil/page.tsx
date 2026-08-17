"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { profileSchema, type ProfileData } from "@/types/schemas";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-[var(--black)] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

export default function ProfilPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  function onSubmit(data: ProfileData) {
    sessionStorage.setItem("candidater_profile", JSON.stringify(data));
    router.push("/candidater/projet");
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="02"
        title="Votre parcours"
        assistance={
          <>
            <p>Racontez-nous votre parcours. Il n&apos;est pas nécessaire d&apos;utiliser un vocabulaire technique.</p>
            <p>Ce que nous voulons comprendre : votre situation actuelle et votre expérience.</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="situation" className={labelClass}>Situation actuelle *</label>
            <select id="situation" {...register("situation")} className={inputClass}>
              <option value="">Sélectionnez...</option>
              <option value="etudiant">Étudiant(e)</option>
              <option value="salarie">Salarié(e)</option>
              <option value="chomeur">En recherche d&apos;emploi</option>
              <option value="independant">Indépendant(e)</option>
              <option value="retraite">Retraité(e)</option>
              <option value="autre">Autre</option>
            </select>
            {errors.situation && <p className={errorClass}>{errors.situation.message}</p>}
          </div>

          <div>
            <label htmlFor="education_level" className={labelClass}>Niveau d&apos;études *</label>
            <select id="education_level" {...register("education_level")} className={inputClass}>
              <option value="">Sélectionnez...</option>
              <option value="none">Aucun diplôme</option>
              <option value="primary">Primaire</option>
              <option value="secondary">Secondaire</option>
              <option value="vocational">Formation professionnelle</option>
              <option value="bachelor">Licence / Bachelor</option>
              <option value="master">Master</option>
              <option value="other">Autre</option>
            </select>
            {errors.education_level && <p className={errorClass}>{errors.education_level.message}</p>}
          </div>

          <div>
            <label htmlFor="experience_professionnelle" className={labelClass}>Expérience professionnelle</label>
            <textarea
              id="experience_professionnelle"
              {...register("experience_professionnelle")}
              rows={3}
              className={inputClass}
              placeholder="Décrivez brièvement votre expérience professionnelle..."
            />
          </div>

          <div>
            <label htmlFor="experience_entrepreneuriale" className={labelClass}>Expérience entrepreneuriale</label>
            <textarea
              id="experience_entrepreneuriale"
              {...register("experience_entrepreneuriale")}
              rows={3}
              className={inputClass}
              placeholder="Avez-vous déjà lancé un projet ou une activité ?"
            />
          </div>

          <FormNavigation
            onBack="/candidater/informations"
            onNext={handleSubmit(onSubmit)}
          />
        </form>
      </FormStepLayout>
    </CandidateLayout>
  );
}
