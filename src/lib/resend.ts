import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not defined in the environment");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Default sender — replace with your verified domain once configured
// e.g. "Harmonia Progrès <no-reply@votre-domaine.mg>"
export const DEFAULT_FROM = "Harmonia Progrès <onboarding@resend.dev>";
