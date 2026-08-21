import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, just run intl middleware
  if (!supabaseUrl || !supabaseKey) {
    return intlMiddleware(request);
  }

  // 1. Refresh the Supabase session
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Admin route protection — check session + role before any page renders
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = /\/admin(\/|$)/.test(pathname);
  const isAdminLogin = /\/admin\/login(\/|$)/.test(pathname);

  if (isAdminRoute && !isAdminLogin) {
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the user has an admin or evaluator role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "evaluator")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Resolve the locale and route the request to the [locale] segment
  const intlResponse = intlMiddleware(request);

  // 3. Copy ALL Supabase cookies to the intl response individually
  //    (Set-Cookie is a special header that can't be bulk-copied)
  for (const cookie of supabaseResponse.cookies.getAll()) {
    intlResponse.cookies.set(cookie.name, cookie.value);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|mp3|wav|ogg|woff2?|ttf|otf|eot)$).*)",
  ],
};
