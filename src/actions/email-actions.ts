"use server";

import { getResend, DEFAULT_FROM } from "@/lib/resend";

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  draft: "Brouillon",
  submitted: "Candidature reçue",
  under_review: "En évaluation",
  shortlisted: "Présélectionné",
  interview: "Entretien",
  accepted: "Accepté",
  rejected: "Non retenu",
  waitlisted: "Liste d'attente",
  withdrawn: "Retiré",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

function emailTemplate({
  title,
  subtitle,
  paragraphs,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle: string;
  paragraphs: string[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const cta = ctaLabel && ctaHref
    ? `<div style="margin: 28px 0; text-align: center;">
        <a href="${ctaHref}" style="display: inline-block; background-color: #0F766E; color: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
          ${ctaLabel}
        </a>
      </div>`
    : "";

  return `
    <div style="background-color: #FAFAF8; padding: 40px 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">
        <div style="background-color: #0F766E; padding: 24px 32px;">
          <p style="margin: 0; color: #FFFFFF; font-size: 18px; font-weight: 700;">Harmonia Progrès</p>
          <p style="margin: 4px 0 0; color: #99F6E4; font-size: 12px;">MIASA Jeunes Entrepreneurs</p>
        </div>
        <div style="padding: 32px;">
          <h1 style="margin: 0 0 8px; color: #0F172A; font-size: 20px; font-weight: 700;">${title}</h1>
          <p style="margin: 0 0 24px; color: #64748B; font-size: 14px;">${subtitle}</p>
          ${paragraphs.map((p) => `<p style="margin: 0 0 12px; color: #334155; font-size: 14px; line-height: 1.6;">${p}</p>`).join("")}
          ${cta}
          <p style="margin: 24px 0 0; color: #94A3B8; font-size: 12px; line-height: 1.6;">
            Cet email vous a été envoyé automatiquement par la plateforme Harmonia Progrès.<br/>
            Merci de ne pas y répondre.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendCandidatureStatusEmail({
  email,
  fullName,
  referenceNumber,
  projectName,
  status,
}: {
  email: string;
  fullName: string;
  referenceNumber: string;
  projectName: string;
  status: string;
}) {
  const label = statusLabel(status);

  const messageByStatus: Record<string, string> = {
    accepted: "Félicitations ! Votre candidature a été acceptée. Notre équipe vous contactera très prochainement pour la suite du processus.",
    rejected: "Nous vous remercions pour l'intérêt que vous avez porté au programme MIASA. Après un examen attentif, nous ne sommes malheureusement pas en mesure de retenir votre candidature cette année.",
    interview: "Excellente nouvelle ! Vous avez été retenu(e) pour un entretien. Notre équipe vous contactera pour convenir d'une date.",
    shortlisted: "Votre candidature a été présélectionnée ! Vous serez bientôt contacté(e) pour les prochaines étapes du processus.",
    under_review: "Votre candidature est actuellement en cours d'évaluation par notre comité de sélection.",
    waitlisted: "Votre candidature a été placée sur notre liste d'attente. Nous vous tiendrons informé(e) de toute évolution.",
    submitted: "Votre candidature a bien été reçue et enregistrée dans notre système.",
    default: `Le statut de votre candidature a été mis à jour : ${label}.`,
  };

  const message = messageByStatus[status] || messageByStatus.default;

  const { data, error } = await getResend().emails.send({
    from: DEFAULT_FROM,
    to: [email],
    subject: `MIASA — Candidature ${referenceNumber} : ${label}`,
    html: emailTemplate({
      title: `Statut de votre candidature : ${label}`,
      subtitle: `Référence : ${referenceNumber}`,
      paragraphs: [
        `Bonjour ${fullName},`,
        `Concernant votre projet « ${projectName} » :`,
        message,
      ],
      ctaLabel: "Suivre ma candidature",
      ctaHref: "https://harmonia-progres.vercel.app/candidater/suivi",
    }),
  });

  if (error) {
    console.error("Resend error (status email):", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function sendCandidatureSubmissionEmail({
  email,
  fullName,
  referenceNumber,
  projectName,
}: {
  email: string;
  fullName: string;
  referenceNumber: string;
  projectName: string;
}) {
  const { data, error } = await getResend().emails.send({
    from: DEFAULT_FROM,
    to: [email],
    subject: `MIASA — Candidature ${referenceNumber} confirmée`,
    html: emailTemplate({
      title: "Candidature soumise avec succès",
      subtitle: `Référence : ${referenceNumber}`,
      paragraphs: [
        `Bonjour ${fullName},`,
        `Votre candidature au programme MIASA Jeunes Entrepreneurs a bien été enregistrée.`,
        `Votre projet « ${projectName} » est maintenant en cours de traitement. Notre équipe l'examinera et vous tiendra informé(e) de son avancement.`,
        `Conservez précieusement votre numéro de référence : ${referenceNumber}.`,
      ],
      ctaLabel: "Suivre ma candidature",
      ctaHref: "https://harmonia-progres.vercel.app/candidater/suivi",
    }),
  });

  if (error) {
    console.error("Resend error (submission email):", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
