"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { motivationSchema, type MotivationData } from "@/types/schemas";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-[var(--black)] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

const NEED_OPTIONS = [
  { value: "formation", label: "Formation" },
  { value: "equipement", label: "Équipement" },
  { value: "financement", label: "Financement" },
  { value: "accompagnement", label: "Accompagnement" },
  { value: "marketing", label: "Marketing" },
  { value: "acces_marche", label: "Accès au marché" },
  { value: "mentorat", label: "Mentorat" },
] as const;

export default function MotivationPage() {
  const router = useRouter();

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
        title="Pourquoi ce projet ?"
        assistance={
          <>
            <p>Cette étape est la plus importante. Nous voulons comprendre :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pourquoi vous souhaitez rejoindre le programme</li>
              <li>De quoi avez-vous besoin pour réussir</li>
              <li>Ce que vous comptez accomplir</li>
            </ul>
            <p>Soyez honnête — il n&apos;y a pas de mauvaise réponse.</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="motivation" className={labelClass}>
              Pourquoi souhaitez-vous participer au programme ? *
            </label>
            <textarea
              id="motivation"
              {...register("motivation")}
              rows={5}
              className={inputClass}
              placeholder="Partagez votre motivation, vos objectifs..."
            />
            {errors.motivation && <p className={errorClass}>{errors.motivation.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Quels sont vos principaux besoins ? *</label>
            <Controller
              control={control}
              name="needs"
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NEED_OPTIONS.map((need) => (
                    <label
                      key={need.value}
                      className={`rounded-xl border-2 p-3 text-center cursor-pointer transition text-sm ${
                        field.value.includes(need.value as typeof field.value[number])
                          ? "border-[var(--lime)] bg-[var(--lime)]/5 font-medium"
                          : "border-[var(--border)] bg-white hover:border-[var(--black)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={field.value.includes(need.value as typeof field.value[number])}
                        onChange={() => {
                          const val = need.value as typeof field.value[number];
                          const newValue = field.value.includes(val)
                            ? field.value.filter((n) => n !== val)
                            : [...field.value, val];
                          field.onChange(newValue);
                        }}
                        className="sr-only"
                      />
                      {need.label}
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.needs && <p className={errorClass}>{errors.needs.message}</p>}
          </div>

          <div>
            <label htmlFor="accomplishments" className={labelClass}>
              Que souhaitez-vous accomplir avec votre projet ? *
            </label>
            <textarea
              id="accomplishments"
              {...register("accomplishments")}
              rows={4}
              className={inputClass}
              placeholder="Décrivez votre vision d'avenir..."
            />
            {errors.accomplishments && <p className={errorClass}>{errors.accomplishments.message}</p>}
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
