"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { motivationSchema, type MotivationData } from "@/types/schemas";
import { Check } from "lucide-react";

const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
const errorClass = "text-xs text-red-400 mt-1";

export default function MotivationPage() {
  const router = useRouter();
  const t = useTranslations("candidaterMotivation");
  const NEED_OPTIONS = t.raw("needOptions") as { value: string; label: string }[];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MotivationData>({
    resolver: zodResolver(motivationSchema),
    defaultValues: { needs: [] },
  });

  function onSubmit(data: MotivationData) {
    sessionStorage.setItem("candidater_motivation", JSON.stringify(data));
    router.push("/candidater/documents");
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="04"
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
              {t("motivation")}
            </h3>
            <div>
              <label htmlFor="motivation" className={labelClass}>
                {t("motivationLabel")}
              </label>
              <textarea
                id="motivation"
                {...register("motivation")}
                rows={5}
                className="w-full rounded-xl glass px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder={t("motivationPlaceholder")}
              />
              {errors.motivation && <p className={errorClass}>{errors.motivation.message}</p>}
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              {t("needs")}
            </h3>
            <div>
              <label className={labelClass}>{t("needsLabel")}</label>
              <Controller
                control={control}
                name="needs"
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {NEED_OPTIONS.map((need) => {
                      const isSelected = field.value.includes(need.value as typeof field.value[number]);
                      return (
                        <label
                          key={need.value}
                          className={`rounded-xl border p-3 cursor-pointer transition text-sm flex items-center gap-2 ${
                            isSelected
                              ? "border-teal bg-teal/5 font-medium"
                              : "border-glass-border hover:border-glass-border-strong"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const val = need.value as typeof field.value[number];
                              const newValue = field.value.includes(val)
                                ? field.value.filter((n) => n !== val)
                                : [...field.value, val];
                              field.onChange(newValue);
                            }}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-teal border-teal" : "border-glass-border"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-on-void" strokeWidth={3} />}
                          </div>
                          <span className="text-text-primary">{need.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              {errors.needs && <p className={errorClass}>{errors.needs.message}</p>}
            </div>
          </div>

          <div className="rounded-xl glass p-5">
            <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary mb-4">
              {t("objectives")}
            </h3>
            <div>
              <label htmlFor="accomplishments" className={labelClass}>
                {t("accomplishmentsLabel")}
              </label>
              <textarea
                id="accomplishments"
                {...register("accomplishments")}
                rows={4}
                className="w-full rounded-xl glass px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition text-sm"
                placeholder={t("accomplishmentsPlaceholder")}
              />
              {errors.accomplishments && <p className={errorClass}>{errors.accomplishments.message}</p>}
            </div>
          </div>

          <FormNavigation
            onBack="/candidater/projet"
            onNext={handleSubmit(onSubmit)}
          />
        </form>
      </FormStepLayout>
    </CandidateLayout>
  );
}
