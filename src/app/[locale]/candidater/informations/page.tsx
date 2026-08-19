"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateLayout } from "@/components/candidate/CandidateLayout";
import { FormStepLayout } from "@/components/candidate/FormStepLayout";
import { FormNavigation } from "@/components/candidate/FormNavigation";
import { personalInfoSchema, type PersonalInfoData } from "@/types/schemas";
import { createClient } from "@/lib/supabase/client";
import { User, Phone, Mail, MapPin, Calendar, Home, ChevronDown } from "lucide-react";
import { SmoothInput } from "@/components/ui/SmoothInput";

const inputWrapperClass =
  "rounded-xl glass px-4 py-3 pl-10";
const inputClass = "text-sm text-text-primary placeholder:text-text-muted";
const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
const errorClass = "text-xs text-red-400 mt-1";

function FieldIcon({ icon: Icon }: { icon: React.ElementType }) {
  return <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" strokeWidth={1.5} />;
}

export default function InformationsPage() {
  const router = useRouter();
  const t = useTranslations("candidaterInformations");
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const districts = t.raw("districts") as { value: string; label: string }[];

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
        title={t("title")}
        assistance={
          <>
            <p>{t("assistance1")}</p>
            <p>{t("assistance2")}</p>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="first_name" className={labelClass}>{t("firstName")}</label>
              <div className="relative">
                <FieldIcon icon={User} />
                <SmoothInput id="first_name" {...register("first_name")} wrapperClassName={inputWrapperClass} className={inputClass} />
              </div>
              {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className={labelClass}>{t("lastName")}</label>
              <div className="relative">
                <FieldIcon icon={User} />
                <SmoothInput id="last_name" {...register("last_name")} wrapperClassName={inputWrapperClass} className={inputClass} />
              </div>
              {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="date_of_birth" className={labelClass}>{t("dateOfBirth")}</label>
            <div className="relative">
              <FieldIcon icon={Calendar} />
              <SmoothInput id="date_of_birth" type="date" {...register("date_of_birth")} wrapperClassName={inputWrapperClass} className={inputClass} />
            </div>
            {errors.date_of_birth && <p className={errorClass}>{errors.date_of_birth.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className={labelClass}>{t("phone")}</label>
              <div className="relative">
                <FieldIcon icon={Phone} />
                <SmoothInput id="phone" type="tel" {...register("phone")} wrapperClassName={inputWrapperClass} className={inputClass} placeholder="+261..." />
              </div>
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>{t("email")}</label>
              <div className="relative">
                <FieldIcon icon={Mail} />
                <SmoothInput id="email" type="email" {...register("email")} wrapperClassName={inputWrapperClass} className={inputClass} />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="district" className={labelClass}>{t("district")}</label>
              <div className="relative">
                <FieldIcon icon={MapPin} />
                <select id="district" {...register("district")} className={`${inputWrapperClass} ${inputClass} w-full appearance-none cursor-pointer pr-10`}>                  
                  {districts.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <label htmlFor="commune" className={labelClass}>{t("commune")}</label>
              <div className="relative">
                <FieldIcon icon={MapPin} />
                <SmoothInput id="commune" {...register("commune")} wrapperClassName={inputWrapperClass} className={inputClass} placeholder={t("communePlaceholder")} />
              </div>
              {errors.commune && <p className={errorClass}>{errors.commune.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>{t("address")}</label>
            <div className="relative">
              <FieldIcon icon={Home} />
              <SmoothInput id="address" {...register("address")} wrapperClassName={inputWrapperClass} className={inputClass} placeholder={t("addressPlaceholder")} />
            </div>
          </div>

          <FormNavigation
            onBack="/candidater"
            onNext={handleSubmit(onSubmit)}
          />
        </form>
      </FormStepLayout>
    </CandidateLayout>
  );
}
