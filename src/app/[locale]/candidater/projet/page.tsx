"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { projectSchema, type ProjectData, ACTIVITY_TYPES } from "@/types/schemas";
import { Wheat, Palette, Fish, Sprout, PenTool, Anchor, ShoppingBag, ChevronDown } from "lucide-react";
import { SmoothInput } from "@/components/ui/SmoothInput";

const inputWrapperClass =
  "rounded-xl glass px-4 py-3 pl-10";
const inputClass = "text-sm text-text-primary placeholder:text-text-muted";
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
  const t = useTranslations("candidaterProjet");
  const tVerif = useTranslations("candidaterVerification");
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
  const sectors = t.raw("sectors") as { value: string; label: string }[];
  const activityLabels = tVerif.raw("activityLabels") as Record<string, string>;

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="03"
        title={t("title")}
        assistance={
          <>
            <p>{t("assistance1")}</p>
            <ul className="list-disc list-inside space-y-1">
              {t.raw("assistanceItems").map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>{t("assistance2")}</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              {t("identity")}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="project_name" className={labelClass}>{t("projectName")}</label>
                <div className="relative">
                  <FieldIcon icon={Sprout} />
                  <SmoothInput id="project_name" {...register("project_name")} wrapperClassName={inputWrapperClass} className={inputClass} placeholder={t("projectNamePlaceholder")} />
                </div>
                {errors.project_name && <p className={errorClass}>{errors.project_name.message}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              {t("sector")}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {sectors.map((s) => {
                const Icon = SECTOR_ICONS[s.value];
                return (
                  <label
                    key={s.value}
                    className={`rounded-xl border p-4 text-center cursor-pointer transition ${
                      watchedSector === s.value
                        ? "border-teal bg-green/5"
                        : "border-glass-border hover:border-glass-border-strong"
                    }`}
                  >
                    <input type="radio" value={s.value} {...register("sector")} className="sr-only" />
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-glass-bg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-text-primary">{s.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              {t("activityType")}
            </h3>
            <div>
              <label htmlFor="activity_type" className={labelClass}>{t("selectActivity")}</label>
              <div className="relative">
                <FieldIcon icon={Sprout} />
                <select id="activity_type" {...register("activity_type")} className={`${inputWrapperClass} ${inputClass} w-full appearance-none cursor-pointer pr-10`}>                  
                  <option value="">{t("selectPlaceholder")}</option>
                  {activities.map((a) => (
                    <option key={a.value} value={a.value}>{activityLabels[a.value] || a.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" strokeWidth={1.5} />
              </div>
              {errors.activity_type && <p className={errorClass}>{errors.activity_type.message}</p>}
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              {t("description")}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="project_description" className={labelClass}>{t("projectDescription")}</label>
                <textarea
                  id="project_description"
                  {...register("project_description")}
                  rows={4}
                  className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                  placeholder={t("projectDescriptionPlaceholder")}
                />
                {errors.project_description && <p className={errorClass}>{errors.project_description.message}</p>}
              </div>

              <div>
                <label htmlFor="problem_identified" className={labelClass}>{t("problemIdentified")}</label>
                <div className="relative">
                  <FieldIcon icon={Anchor} />
                  <textarea
                    id="problem_identified"
                    {...register("problem_identified")}
                    rows={3}
                    className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                    placeholder={t("problemIdentifiedPlaceholder")}
                  />
                </div>
                {errors.problem_identified && <p className={errorClass}>{errors.problem_identified.message}</p>}
              </div>

              <div>
                <label htmlFor="solution_proposed" className={labelClass}>{t("solutionProposed")}</label>
                <div className="relative">
                  <FieldIcon icon={PenTool} />
                  <textarea
                    id="solution_proposed"
                    {...register("solution_proposed")}
                    rows={3}
                    className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                    placeholder={t("solutionProposedPlaceholder")}
                  />
                </div>
                {errors.solution_proposed && <p className={errorClass}>{errors.solution_proposed.message}</p>}
              </div>

              <div>
                <label htmlFor="target_market" className={labelClass}>{t("targetMarket")}</label>
                <div className="relative">
                  <FieldIcon icon={ShoppingBag} />
                  <textarea
                    id="target_market"
                    {...register("target_market")}
                    rows={3}
                    className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                    placeholder={t("targetMarketPlaceholder")}
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
