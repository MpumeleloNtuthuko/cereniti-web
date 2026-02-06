import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // REFRESH SESSION
  // This updates the cookie if it's expired
  const { data: { user } } = await supabase.auth.getUser();

  // --- PROTECTED ROUTES LOGIC ---
  
  // 1. Protected Paths (Requires Login)
  const protectedPaths = ["/book", "/dashboard", "/admin", "/contractor/assessment"];
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    // Add ?next= so we can redirect back after login
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth Pages (Redirect if ALREADY Logged In)
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && user) {
    // Redirect to a neutral page to avoid loops
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}