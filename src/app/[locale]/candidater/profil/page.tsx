"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { profileSchema, type ProfileData } from "@/types/schemas";
import { Briefcase, GraduationCap, BriefcaseBusiness, Lightbulb } from "lucide-react";

const inputClass =
  "w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm";
const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
const errorClass = "text-xs text-red-400 mt-1";

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />;
}

export default function ProfilPage() {
  const router = useRouter();
  const t = useTranslations("candidaterProfil");

  const situations = t.raw("situations") as { value: string; label: string }[];
  const educationLevels = t.raw("educationLevels") as { value: string; label: string }[];

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
        title={t("title")}
        assistance={
          <>
            <p>{t("assistance1")}</p>
            <p>{t("assistance2")}</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="situation" className={labelClass}>{t("situation")}</label>
            <div className="relative">
              <FieldIcon icon={Briefcase} />
              <select id="situation" {...register("situation")} className={inputClass}>
                <option value="">{t("selectPlaceholder")}</option>
                {situations.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            {errors.situation && <p className={errorClass}>{errors.situation.message}</p>}
          </div>

          <div>
            <label htmlFor="education_level" className={labelClass}>{t("educationLevel")}</label>
            <div className="relative">
              <FieldIcon icon={GraduationCap} />
              <select id="education_level" {...register("education_level")} className={inputClass}>
                <option value="">{t("selectPlaceholder")}</option>
                {educationLevels.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
            {errors.education_level && <p className={errorClass}>{errors.education_level.message}</p>}
          </div>

          <div>
            <label htmlFor="experience_professionnelle" className={labelClass}>{t("experiencePro")}</label>
            <div className="relative">
              <FieldIcon icon={BriefcaseBusiness} />
              <textarea
                id="experience_professionnelle"
                {...register("experience_professionnelle")}
                rows={3}
                className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder={t("experienceProPlaceholder")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="experience_entrepreneuriale" className={labelClass}>{t("experienceEntrepreneurial")}</label>
            <div className="relative">
              <FieldIcon icon={Lightbulb} />
              <textarea
                id="experience_entrepreneuriale"
                {...register("experience_entrepreneuriale")}
                rows={3}
                className="w-full rounded-xl glass px-4 py-3 pl-10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder={t("experienceEntrepreneurialPlaceholder")}
              />
            </div>
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
