export const SITE = {
  name: "Harmonia Progres",
  tagline: "Supporting Local Entrepreneurship in Manakara",
  description:
    "Harmonia Progres supports local entrepreneurship in Manakara, Madagascar through training, technical assistance, networking, and access to financing.",
  url: "https://harmonia-progres.org",
  email: "contact@harmonia-progres.org",
  phone: "+261 20 00 000 00",
  address: "Manakara, Fitovinany Region, Madagascar",
  social: {
    facebook: "https://facebook.com/harmoniaprogres",
    linkedin: "https://linkedin.com/company/harmoniaprogres",
    instagram: "https://instagram.com/harmoniaprogres",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/partners", label: "Partners" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
] as const;
