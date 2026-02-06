import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Initialize Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Setup Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // A. Update the Request cookies (So Server Components see the new session)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          
          // B. Update the Response cookies (So the Browser sees the new session)
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

  // 3. Refresh Session
  // This call is magic: it checks the token, refreshes it if needed, 
  // and triggers 'setAll' above to sync everything.
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Define Paths
  const path = request.nextUrl.pathname;
  
  // Protected Routes
  const isProtectedRoute = 
    path.startsWith("/book") || 
    path.startsWith("/dashboard") || 
    path.startsWith("/admin") ||
    path.startsWith("/contractor");

  // Auth Routes (Login/Register)
  const isAuthRoute = path === "/login" || path === "/register";

  // 5. REDIRECT LOGIC
  
  // A. Not Logged In -> Accessing Protected -> Go to Login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path); // Save where they wanted to go
    return NextResponse.redirect(loginUrl);
  }

  // B. Logged In -> Accessing Login/Register -> Go to Home
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 6. Return the updated response
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, videos, public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};