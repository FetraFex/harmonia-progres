"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { personalInfoSchema, type PersonalInfoData } from "@/types/schemas";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--black)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--lime)] focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-[var(--black)] mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

export default function InformationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { district: "manakara" },
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?next=/candidater/informations");
        return;
      }
      setUserId(user.id);
      if (user.email) setValue("email", user.email);
      if (user.user_metadata?.full_name) {
        const parts = user.user_metadata.full_name.split(" ");
        setValue("first_name", parts[0] || "");
        setValue("last_name", parts.slice(1).join(" ") || "");
      }
    }
    load();
  }, [supabase, router, setValue]);

  function onSubmit(data: PersonalInfoData) {
    sessionStorage.setItem("candidater_personal", JSON.stringify(data));
    sessionStorage.setItem("candidater_userId", userId || "");
    router.push("/candidater/profil");
  }

  return (
    <CandidateLayout>
      <FormStepLayout
        stepNumber="01"
        title="Parlez-nous de vous."
        assistance={
          <>
            <p>Ces informations nous permettent de mieux vous connaître et de vous recontacter concernant votre candidature.</p>
            <p>Toutes les données sont confidentielles et utilisées uniquement dans le cadre du programme.</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="first_name" className={labelClass}>Prénom *</label>
              <input id="first_name" {...register("first_name")} className={inputClass} />
              {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className={labelClass}>Nom *</label>
              <input id="last_name" {...register("last_name")} className={inputClass} />
              {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="date_of_birth" className={labelClass}>Date de naissance *</label>
            <input id="date_of_birth" type="date" {...register("date_of_birth")} className={inputClass} />
            {errors.date_of_birth && <p className={errorClass}>{errors.date_of_birth.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className={labelClass}>Téléphone *</label>
              <input id="phone" type="tel" {...register("phone")} className={inputClass} placeholder="+261..." />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email *</label>
              <input id="email" type="email" {...register("email")} className={inputClass} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="district" className={labelClass}>District *</label>
              <select id="district" {...register("district")} className={inputClass}>
                <option value="manakara">Manakara</option>
                <option value="vohipeno">Vohipeno</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="commune" className={labelClass}>Commune *</label>
              <input id="commune" {...register("commune")} className={inputClass} placeholder="Commune ou fokontany" />
              {errors.commune && <p className={errorClass}>{errors.commune.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>Adresse</label>
            <input id="address" {...register("address")} className={inputClass} placeholder="Quartier, rue..." />
          </div>

          <FormNavigation
            onBack="/candidater/eligibilite"
            onNext={handleSubmit(onSubmit)}
            nextLabel="Continuer"
          />
        </form>
      </FormStepLayout>
    </CandidateLayout>
  );
}
