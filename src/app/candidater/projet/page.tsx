"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { projectSchema, type ProjectData, ACTIVITY_TYPES } from "@/types/schemas";
import { Wheat, Palette, Fish, Sprout, PenTool, Anchor, ShoppingBag } from "lucide-react";

const inputClass =
  "w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm";
const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
const errorClass = "text-xs text-red-400 mt-1";

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />;
}

const SECTOR_ICONS: Record<string, React.ElementType> = {
  agriculture: Wheat,
  artisanat: Palette,
  halieutique: Fish,
};

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              Identité du projet
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="project_name" className={labelClass}>Nom du projet *</label>
                <div className="relative">
                  <FieldIcon icon={Sprout} />
                  <input id="project_name" {...register("project_name")} className={inputClass} placeholder="Ex: Transformation de vanille bio" />
                </div>
                {errors.project_name && <p className={errorClass}>{errors.project_name.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              Secteur d&apos;activité
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(["agriculture", "artisanat", "halieutique"] as const).map((s) => {
                const Icon = SECTOR_ICONS[s];
                return (
                  <label
                    key={s}
                    className={`rounded-xl border-2 p-4 text-center cursor-pointer transition ${
                      watchedSector === s
                        ? "border-teal bg-teal/5"
                        : "border-glass-border hover:border-glass-border-strong"
                    }`}
                  >
                    <input type="radio" value={s} {...register("sector")} className="sr-only" />
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-glass-bg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-text-primary capitalize">{s}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              Type d&apos;activité
            </h3>
            <div>
              <label htmlFor="activity_type" className={labelClass}>Sélectionnez votre activité *</label>
              <div className="relative">
                <FieldIcon icon={Sprout} />
                <select id="activity_type" {...register("activity_type")} className={inputClass}>
                  <option value="">Sélectionnez...</option>
                  {activities.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
              {errors.activity_type && <p className={errorClass}>{errors.activity_type.message}</p>}
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              Description
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="project_description" className={labelClass}>Décrivez votre projet *</label>
                <textarea
                  id="project_description"
                  {...register("project_description")}
                  rows={4}
                  className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                  placeholder="Décrivez votre projet en quelques lignes..."
                />
                {errors.project_description && <p className={errorClass}>{errors.project_description.message}</p>}
              </div>

              <div>
                <label htmlFor="problem_identified" className={labelClass}>Problème identifié *</label>
                <div className="relative">
                  <FieldIcon icon={Anchor} />
                  <textarea
                    id="problem_identified"
                    {...register("problem_identified")}
                    rows={3}
                    className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                    placeholder="Quel problème cherchez-vous à résoudre ?"
                  />
                </div>
                {errors.problem_identified && <p className={errorClass}>{errors.problem_identified.message}</p>}
              </div>

              <div>
                <label htmlFor="solution_proposed" className={labelClass}>Solution proposée *</label>
                <div className="relative">
                  <FieldIcon icon={PenTool} />
                  <textarea
                    id="solution_proposed"
                    {...register("solution_proposed")}
                    rows={3}
                    className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                    placeholder="Comment votre projet résout ce problème ?"
                  />
                </div>
                {errors.solution_proposed && <p className={errorClass}>{errors.solution_proposed.message}</p>}
              </div>

              <div>
                <label htmlFor="target_market" className={labelClass}>Marché cible *</label>
                <div className="relative">
                  <FieldIcon icon={ShoppingBag} />
                  <textarea
                    id="target_market"
                    {...register("target_market")}
                    rows={3}
                    className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                    placeholder="À qui s'adresse votre produit ou service ?"
                  />
                </div>
                {errors.target_market && <p className={errorClass}>{errors.target_market.message}</p>}
              </div>
            </div>
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
