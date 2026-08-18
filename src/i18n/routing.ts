import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // French stays at unprefixed URLs, Malagasy is served under /mg
  locales: ["fr", "mg"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
});
