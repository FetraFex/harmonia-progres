import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in the environment");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender — replace with your verified domain once configured
// e.g. "Harmonia Progrès <no-reply@votre-domaine.mg>"
export const DEFAULT_FROM = "Harmonia Progrès <onboarding@resend.dev>";
