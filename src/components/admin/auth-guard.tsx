"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // Client-side helper

export function AdminAuthGuard() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to Auth Changes (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // 1. If logged out anywhere, kick immediately
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
        return;
      }

      // 2. If account switched, verify role again (Client-side check)
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role !== 'admin') {
          router.push('/'); // Kick non-admins out if they managed to login
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return null; 
}