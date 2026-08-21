"use server";

import { readFileSync } from "fs";
import { join } from "path";
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

const GREEN_LIME = "#8ec41e";
const SITE_URL = "https://harmonia-progres.org";

// Read and encode logo once at module load for CID inline embedding
const LOGO_BUFFER = readFileSync(
  join(process.cwd(), "public/images/logo/logo-transparent-light.png")
);
const LOGO_BASE64 = LOGO_BUFFER.toString("base64");
const LOGO_CID = "harmonia-logo";

function emailTemplate({
  title,
  subtitle,
  htmlBody,
  paragraphs,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  subtitle: string;
  htmlBody?: string;
  paragraphs?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const cta =
    ctaLabel && ctaHref
      ? `<div style="margin: 28px 0; text-align: center;">
        <a href="${ctaHref}" style="display: inline-block; background-color: ${GREEN_LIME}; color: #04211d; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
          ${ctaLabel}
        </a>
      </div>`
      : "";

  const bodyContent = htmlBody
    ? htmlBody
    : paragraphs
      ? paragraphs
          .map(
            (p) =>
              `<p style="margin: 0 0 12px; color: #334155; font-size: 14px; line-height: 1.6;">${p}</p>`
          )
          .join("")
      : "";

  return `
    <div style="background-color: #FAFAF8; padding: 40px 20px; font-family: Arial, sans-serif;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0;">
        <div style="background-color: #f0f9e8; padding: 20px 32px; text-align: center;">
          <img src="cid:${LOGO_CID}" alt="Harmonia Progrès" width="140" style="display: inline-block; height: auto;" />
        </div>
        <div style="padding: 32px;">
          <h1 style="margin: 0 0 8px; color: #0F172A; font-size: 20px; font-weight: 700;">${title}</h1>
          <p style="margin: 0 0 24px; color: #64748B; font-size: 14px;">${subtitle}</p>
          ${bodyContent}
          ${cta}
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
          <p style="margin: 0; color: #94A3B8; font-size: 12px; line-height: 1.6; text-align: center;">
            Cet email vous a été envoyé automatiquement par la plateforme <a href="${SITE_URL}" style="color: #64748B;">Harmonia Progrès</a>.<br/>
            Merci de ne pas y répondre.
          </p>
        </div>
      </div>
    </div>
  `;
}

/** Shared logo attachment — contentId triggers CID inline display in Resend */
const logoAttachment = {
  filename: "logo.png",
  content: LOGO_BASE64,
  contentId: LOGO_CID,
};

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
    accepted:
      "Félicitations ! Votre candidature a été acceptée. Notre équipe vous contactera très prochainement pour la suite du processus.",
    rejected:
      "Nous vous remercions pour l'intérêt que vous avez porté au programme Harmonia Progrès. Après un examen attentif, nous ne sommes malheureusement pas en mesure de retenir votre candidature cette année.",
    interview:
      "Excellente nouvelle ! Vous avez été retenu(e) pour un entretien. Notre équipe vous contactera pour convenir d'une date.",
    shortlisted:
      "Votre candidature a été présélectionnée ! Vous serez bientôt contacté(e) pour les prochaines étapes du processus.",
    under_review:
      "Votre candidature est actuellement en cours d'évaluation par notre comité de sélection.",
    waitlisted:
      "Votre candidature a été placée sur notre liste d'attente. Nous vous tiendrons informé(e) de toute évolution.",
    submitted:
      "Votre candidature a bien été reçue et enregistrée dans notre système.",
    default: `Le statut de votre candidature a été mis à jour : ${label}.`,
  };

  const message = messageByStatus[status] || messageByStatus.default;

  const { data, error } = await getResend().emails.send({
    from: DEFAULT_FROM,
    to: [email],
    subject: `Harmonia Progrès — Candidature ${referenceNumber} : ${label}`,
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
    attachments: [logoAttachment],
  });

  if (error) {
    console.error("Resend error (status email):", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function sendRecruitmentEmail({
  email,
  fullName,
  referenceNumber,
  projectName,
  customMessage,
}: {
  email: string;
  fullName: string;
  referenceNumber: string;
  projectName: string;
  customMessage: string;
}) {
  const { data, error } = await getResend().emails.send({
    from: DEFAULT_FROM,
    to: [email],
    subject: `Félicitations — Votre candidature a été retenue`,
    html: emailTemplate({
      title: "Félicitations — Votre candidature a été retenue",
      subtitle: `Référence : ${referenceNumber}`,
      htmlBody: `
          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Bonjour <strong style="color: #0F172A;">${fullName}</strong>,</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Nous avons le plaisir de vous informer que votre candidature au programme d'accompagnement de <strong style="color: ${GREEN_LIME};">HARMONIA PROGRÈS</strong> a été retenue. Votre projet « <strong style="color: #0F172A;">${projectName}</strong> » a été sélectionné par notre comité.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Nous vous adressons toutes nos félicitations pour cette sélection et vous remercions pour l'intérêt que vous avez porté à notre initiative.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">D'une durée de <strong style="color: #0F172A;">24 mois</strong>, le programme a pour ambition d'accompagner les jeunes entrepreneurs dans la structuration et le développement de leurs activités, tout en favorisant les relations durables avec les producteurs et acteurs locaux des filières <strong style="color: #0F172A;">agricoles, halieutiques, d'élevage et artisanales</strong>.</p>

          <h2 style="margin: 24px 0 12px; color: #0F172A; font-size: 17px; font-weight: 700;">Les principales composantes du programme</h2>

          <p style="margin: 0 0 10px; color: #334155; font-size: 14px; line-height: 1.7;"><strong style="color: #0F172A;">1. Identification et sélection</strong><br/>Identification des jeunes porteurs de projets et sélection des profils présentant un potentiel entrepreneurial et un réel ancrage dans les activités locales.</p>

          <p style="margin: 0 0 10px; color: #334155; font-size: 14px; line-height: 1.7;"><strong style="color: #0F172A;">2. Formation</strong><br/>Renforcement de vos compétences à travers des formations adaptées à l'entrepreneuriat, à la gestion, à la commercialisation et au développement de votre activité.</p>

          <p style="margin: 0 0 10px; color: #334155; font-size: 14px; line-height: 1.7;"><strong style="color: #0F172A;">3. Incubation</strong><br/>Un accompagnement personnalisé pour structurer votre projet, améliorer votre modèle économique et développer une activité viable et durable.</p>

          <p style="margin: 0 0 10px; color: #334155; font-size: 14px; line-height: 1.7;"><strong style="color: #0F172A;">4. Appui et financement</strong><br/>Mise à disposition d'un accompagnement technique et, selon les conditions et critères du programme, d'un appui permettant de contribuer au développement et à la consolidation de votre activité.</p>

          <p style="margin: 0 0 10px; color: #334155; font-size: 14px; line-height: 1.7;"><strong style="color: #0F172A;">5. Accès au marché</strong><br/>Création de liens avec les agriculteurs, éleveurs, pêcheurs, artisans et autres producteurs locaux afin de faciliter l'accès aux produits, développer des partenariats et créer de nouvelles opportunités commerciales.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;"><strong style="color: #0F172A;">6. Suivi-évaluation</strong><br/>Un suivi régulier de votre progression, de vos résultats et des difficultés rencontrées afin de vous accompagner dans la durée et de mesurer l'impact du programme.</p>

          <h2 style="margin: 24px 0 12px; color: #0F172A; font-size: 17px; font-weight: 700;">Une dynamique fondée sur la collaboration</h2>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Au-delà de l'accompagnement individuel, l'initiative vise à créer un véritable réseau entre <strong style="color: #0F172A;">jeunes entrepreneurs et producteurs locaux</strong>.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">L'objectif est de favoriser la collecte, la valorisation et la commercialisation des produits <strong style="color: #0F172A;">agricoles, halieutiques, d'élevage et artisanaux</strong>, tout en créant des opportunités économiques durables pour les communautés locales.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Nous vous invitons à rester attentif(ve) aux prochaines communications de notre équipe concernant les <strong style="color: ${GREEN_LIME};">prochaines étapes de votre intégration au programme</strong>, notamment les modalités de démarrage, les séances de formation et les démarches administratives nécessaires.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Encore toutes nos félicitations pour votre sélection.</p>

          <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">Nous sommes heureux de vous compter parmi les bénéficiaires de cette initiative et vous souhaitons pleine réussite dans cette nouvelle étape de votre parcours entrepreneurial.</p>

          <p style="margin: 24px 0 0; color: #334155; font-size: 14px; line-height: 1.7;">Cordialement,<br/><strong style="color: #0F172A;">L'équipe HARMONIA PROGRÈS</strong><br/><em style="color: ${GREEN_LIME};">Accompagner les jeunes, valoriser les ressources locales, construire un avenir durable.</em></p>

          <p style="margin: 24px 0 0; color: #94A3B8; font-size: 12px; line-height: 1.5;">Votre numéro de référence : <strong style="color: #64748B;">${referenceNumber}</strong>. Conservez-le précieusement — il vous sera demandé pour toute correspondance future.</p>
      `,
    }),
    attachments: [logoAttachment],
  });

  if (error) {
    console.error("Resend error (recruitment email):", error);
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
    subject: `Harmonia Progrès — Candidature ${referenceNumber} confirmée`,
    html: emailTemplate({
      title: "Candidature soumise avec succès",
      subtitle: `Référence : ${referenceNumber}`,
      paragraphs: [
        `Bonjour ${fullName},`,
        `Votre candidature au programme Harmonia Progrès a bien été enregistrée.`,
        `Votre projet « ${projectName} » est maintenant en cours de traitement. Notre équipe l'examinera et vous tiendra informé(e) de son avancement.`,
        `Conservez précieusement votre numéro de référence : ${referenceNumber}.`,
      ],
      ctaLabel: "Suivre ma candidature",
      ctaHref: "https://harmonia-progres.vercel.app/candidater/suivi",
    }),
    attachments: [logoAttachment],
  });

  if (error) {
    console.error("Resend error (submission email):", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
