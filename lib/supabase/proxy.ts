import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveAuthContext } from "@/lib/auth/authorization";
import { getProtectedRoutePolicy } from "@/lib/auth/route-policy";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const pathname = request.nextUrl.pathname;
  const policy = getProtectedRoutePolicy(pathname);

  if (!policy) {
    return response;
  }

  if (!data?.claims) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";

    return NextResponse.redirect(loginUrl);
  }

  try {
    const context = await resolveAuthContext(
      supabase,
      data.claims.sub,
    );

    if (context.role !== policy.role) {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = "/unauthorized";
      unauthorizedUrl.search = "";

      return NextResponse.redirect(unauthorizedUrl);
    }
  } catch {
    const unauthorizedUrl = request.nextUrl.clone();
    unauthorizedUrl.pathname = "/unauthorized";
    unauthorizedUrl.search = "";

    return NextResponse.redirect(unauthorizedUrl);
  }

  return response;
}
