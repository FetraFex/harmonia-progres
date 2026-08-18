import { z } from "zod";

export const eligibilitySchema = z.object({
  district: z.enum(["manakara", "vohipeno"], {
    message: "Veuillez sélectionner un district",
  }),
  sector: z.enum(["artisanat", "halieutique", "agriculture"], {
    message: "Veuillez sélectionner un secteur",
  }),
  isProjectHolder: z.enum(["oui", "non"], {
    message: "Veuillez répondre à cette question",
  }),
});

export type EligibilityData = z.infer<typeof eligibilitySchema>;

export const personalInfoSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  date_of_birth: z.string().min(1, "La date de naissance est requise"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  district: z.enum(["manakara", "vohipeno"]),
  commune: z.string().min(2, "La commune est requise"),
  address: z.string().optional(),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

export const profileSchema = z.object({
  situation: z.enum(["etudiant", "salarie", "chomeur", "independant", "retraite", "autre"], {
    message: "Veuillez sélectionner votre situation",
  }),
  education_level: z.enum(["none", "primary", "secondary", "vocational", "bachelor", "master", "other"], {
    message: "Veuillez sélectionner votre niveau d'études",
  }),
  experience_professionnelle: z.string().optional(),
  experience_entrepreneuriale: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export const projectSchema = z.object({
  project_name: z.string().min(2, "Le nom du projet est requis"),
  sector: z.enum(["artisanat", "halieutique", "agriculture"]),
  activity_type: z.string().min(1, "Le type d'activité est requis"),
  project_description: z.string().min(20, "Décrivez votre projet en au moins 20 caractères"),
  problem_identified: z.string().min(10, "Décrivez le problème identifié"),
  solution_proposed: z.string().min(10, "Décrivez votre solution proposée"),
  target_market: z.string().min(10, "Décrivez votre marché cible"),
});

export type ProjectData = z.infer<typeof projectSchema>;

export const motivationSchema = z.object({
  motivation: z.string().min(20, "Décrivez votre motivation en au moins 20 caractères"),
  needs: z.array(z.enum(["formation", "equipement", "financement", "accompagnement", "marketing", "acces_marche", "mentorat"])).min(1, "Sélectionnez au moins un besoin"),
  accomplishments: z.string().min(10, "Décrivez ce que vous souhaitez accomplir"),
});

export type MotivationData = z.infer<typeof motivationSchema>;

export const consentSchema = z.object({
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour continuer" }),
  }),
});

export type ConsentData = z.infer<typeof consentSchema>;

export const trackingSchema = z.object({
  reference: z.string().min(1, "Le numéro de référence est requis"),
  email: z.string().email("Adresse email invalide"),
});

export type TrackingData = z.infer<typeof trackingSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

export const evaluationSchema = z.object({
  pertinence: z.number().min(1).max(5),
  faisabilite: z.number().min(1).max(5),
  motivation_score: z.number().min(1).max(5),
  potentiel_economique: z.number().min(1).max(5),
  impact_local: z.number().min(1).max(5),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendation: z.string().optional(),
  notes: z.string().optional(),
});

export type EvaluationData = z.infer<typeof evaluationSchema>;

export const statusChangeSchema = z.object({
  status: z.enum(["new", "under_review", "shortlisted", "interview", "accepted", "rejected", "waitlisted", "withdrawn"]),
  reason: z.string().optional(),
});

export type StatusChangeData = z.infer<typeof statusChangeSchema>;

export const ACTIVITY_TYPES: Record<string, { value: string; label: string }[]> = {
  agriculture: [
    { value: "riziculture", label: "Riziculture" },
    { value: "maraichage", label: "Maraîchage" },
    { value: "transformation_agri", label: "Transformation" },
    { value: "elevage", label: "Élevage" },
    { value: "autre", label: "Autre" },
  ],
  artisanat: [
    { value: "vannerie", label: "Vannerie" },
    { value: "raphia", label: "Raphia" },
    { value: "nattes", label: "Nattes" },
    { value: "paniers", label: "Paniers" },
    { value: "autre", label: "Autre" },
  ],
  halieutique: [
    { value: "peche", label: "Pêche" },
    { value: "transformation_hal", label: "Transformation" },
    { value: "conservation", label: "Conservation" },
    { value: "commercialisation", label: "Commercialisation" },
    { value: "autre", label: "Autre" },
  ],
};

export const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  submitted: "Soumis",
  under_review: "En évaluation",
  shortlisted: "Présélectionné",
  interview: "Entretien",
  accepted: "Accepté",
  rejected: "Non retenu",
  waitlisted: "Liste d'attente",
  withdrawn: "Retiré",
};
