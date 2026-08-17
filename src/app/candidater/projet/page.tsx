"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { projectSchema, type ProjectData, ACTIVITY_TYPES } from "@/types/schemas";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-[var(--black)] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

export default function ProjetPage() {
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { sector: "agriculture" },
  });

  const watchedSector = watch("sector");

  function onSubmit(data: ProjectData) {
    sessionStorage.setItem("candidater_project", JSON.stringify(data));
    router.push("/candidater/motivation");
  }

  const activities = ACTIVITY_TYPES[watchedSector] || [];

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="03"
        title="Votre projet"
        assistance={
          <>
            <p>Décrivez votre projet simplement. Nous voulons comprendre :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Ce que vous voulez créer ou développer</li>
              <li>Pourquoi c&apos;est important pour vous</li>
              <li>À qui cela profitera</li>
            </ul>
            <p>Pas besoin de business plan détaillé — juste une vision claire.</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="project_name" className={labelClass}>Nom du projet *</label>
            <input id="project_name" {...register("project_name")} className={inputClass} placeholder="Ex: Transformation de vanille bio" />
            {errors.project_name && <p className={errorClass}>{errors.project_name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Secteur *</label>
            <div className="grid grid-cols-3 gap-3">
              {(["agriculture", "artisanat", "halieutique"] as const).map((s) => (
                <label
                  key={s}
                  className={`rounded-xl border-2 p-4 text-center cursor-pointer transition ${
                    watchedSector === s
                      ? "border-[var(--lime)] bg-[var(--lime)]/5"
                      : "border-[var(--border)] bg-white hover:border-[var(--black)]"
                  }`}
                >
                  <input type="radio" value={s} {...register("sector")} className="sr-only" />
                  <span className="text-2xl block mb-1">
                    {s === "agriculture" ? "🌾" : s === "artisanat" ? "🎨" : "🐟"}
                  </span>
                  <span className="text-sm font-medium text-[var(--black)] capitalize">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="activity_type" className={labelClass}>Type d&apos;activité *</label>
            <select id="activity_type" {...register("activity_type")} className={inputClass}>
              <option value="">Sélectionnez...</option>
              {activities.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            {errors.activity_type && <p className={errorClass}>{errors.activity_type.message}</p>}
          </div>

          <div>
            <label htmlFor="project_description" className={labelClass}>Description du projet *</label>
            <textarea
              id="project_description"
              {...register("project_description")}
              rows={4}
              className={inputClass}
              placeholder="Décrivez votre projet en quelques lignes..."
            />
            {errors.project_description && <p className={errorClass}>{errors.project_description.message}</p>}
          </div>

          <div>
            <label htmlFor="problem_identified" className={labelClass}>Problème identifié *</label>
            <textarea
              id="problem_identified"
              {...register("problem_identified")}
              rows={3}
              className={inputClass}
              placeholder="Quel problème cherchez-vous à résoudre ?"
            />
            {errors.problem_identified && <p className={errorClass}>{errors.problem_identified.message}</p>}
          </div>

          <div>
            <label htmlFor="solution_proposed" className={labelClass}>Solution proposée *</label>
            <textarea
              id="solution_proposed"
              {...register("solution_proposed")}
              rows={3}
              className={inputClass}
              placeholder="Comment votre projet résout ce problème ?"
            />
            {errors.solution_proposed && <p className={errorClass}>{errors.solution_proposed.message}</p>}
          </div>

          <div>
            <label htmlFor="target_market" className={labelClass}>Marché cible *</label>
            <textarea
              id="target_market"
              {...register("target_market")}
              rows={3}
              className={inputClass}
              placeholder="À qui s'adresse votre produit ou service ?"
            />
            {errors.target_market && <p className={errorClass}>{errors.target_market.message}</p>}
          </div>

          <FormNavigation
            onBack="/candidater/profil"
            onNext={handleSubmit(onSubmit)}
          />
        </form>
      </FormStepLayout>
    </CandidateLayout>
  );
}
