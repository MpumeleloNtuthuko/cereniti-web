"use client";

import { useActionState } from "react";
import { login } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // <--- Import Link

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);
  const searchParams = useSearchParams();
  
  // Capture the destination
  const next = searchParams.get("next"); 

  return (
    <form action={formAction} className="space-y-6">
      
      {/* Hidden Input passes the intention to the server action */}
      <input type="hidden" name="next" value={next || ""} />

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Email Address</label>
        <input 
          name="email"
          type="email" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors placeholder:text-cereniti-300"
          placeholder="name@example.com"
        />
      </div>

      <div className="space-y-2">
        {/* Flex container to hold Label and Forgot Link on the same line */}
        <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Password</label>
            <Link 
                href="/forgot-password" 
                className="text-xs text-cereniti-400 hover:text-gold-600 transition-colors italic"
            >
                Forgot Password?
            </Link>
        </div>
        <input 
          name="password"
          type="password" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors placeholder:text-cereniti-300"
          placeholder="••••••••"
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-cereniti-900 text-white hover:bg-gold-600 h-12 transition-all duration-500 shadow-lg shadow-cereniti-900/10"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
        {state?.error && (
          <p className="text-xs text-red-500 mt-4 text-center bg-red-50 p-2 rounded border border-red-100 font-medium">
            {typeof state.error === 'string' ? state.error : "Please check your details."}
          </p>
        )}
      </div>
    </form>
  );
}