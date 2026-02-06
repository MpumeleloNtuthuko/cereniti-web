"use client";

import { useActionState, useState } from "react";
import { signup } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, null);
  const [role, setRole] = useState<"client" | "contractor">("client");

  return (
    <form action={formAction} className="space-y-6">
      
      {/* 1. ROLE SELECTOR */}
      <div className="grid grid-cols-2 gap-4 p-1 bg-cereniti-100 rounded-lg">
        <input type="hidden" name="role" value={role} />
        
        <button
          type="button"
          onClick={() => setRole("client")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all duration-300",
            role === "client" 
              ? "bg-white text-cereniti-900 shadow-sm" 
              : "text-cereniti-500 hover:text-cereniti-900"
          )}
        >
          <User className="h-4 w-4" />
          I am a Client
        </button>

        <button
          type="button"
          onClick={() => setRole("contractor")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all duration-300",
            role === "contractor" 
              ? "bg-cereniti-900 text-white shadow-sm" 
              : "text-cereniti-500 hover:text-cereniti-900"
          )}
        >
          <Briefcase className="h-4 w-4" />
          I am a Specialist
        </button>
      </div>

      {/* 2. FULL NAME */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500">Full Name</label>
        <input 
          name="fullName"
          type="text" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors"
          placeholder="e.g. Michelle Thompson"
        />
      </div>

      {/* 3. PHONE NUMBER (NEW) */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500">Mobile Number</label>
        <input 
          name="phone"
          type="tel" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors"
          placeholder="082 123 4567"
        />
      </div>

      {/* 4. EMAIL */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500">Email Address</label>
        <input 
          name="email"
          type="email" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors"
          placeholder="name@example.com"
        />
      </div>

      {/* 5. PASSWORD */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500">Create Password</label>
        <input 
          name="password"
          type="password" 
          required
          minLength={6}
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors"
          placeholder="Min 6 characters"
        />
      </div>

      <div className="pt-4 space-y-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-cereniti-900 text-white hover:bg-cereniti-800 h-12"
        >
          {isPending ? <Loader2 className="animate-spin" /> : role === "contractor" ? "Create Specialist Account" : "Create Member Account"}
        </Button>
        
        {state?.error && (
          <div className="text-xs text-red-500 text-center bg-red-50 p-3 rounded font-medium border border-red-200">
            {typeof state.error === 'string' ? state.error : "Please check your details."}
          </div>
        )}

        <p className="text-center text-xs text-cereniti-500">
          By joining, you agree to the <Link href="/legal/terms" className="underline">Terms of Service</Link>.
        </p>
      </div>
    </form>
  );
}