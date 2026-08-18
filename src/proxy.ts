import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Refresh the Supabase session (sets auth cookies on the response)
  const supabaseResponse = await updateSession(request);

  // 2. Resolve the locale and route the request to the [locale] segment
  const intlResponse = intlMiddleware(request);

  // 3. Preserve the session cookies set by Supabase on the intl response
  const setCookie = supabaseResponse.headers.get("set-cookie");
  if (setCookie) {
    intlResponse.headers.set("set-cookie", setCookie);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
