"use client";

import { useActionState } from "react";
import { updatePassword } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cereniti-50 p-6">
      <div className="w-full max-w-md bg-white border border-cereniti-200 p-8 rounded-2xl shadow-sm">
        
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-cereniti-100 text-cereniti-900 rounded-full flex items-center justify-center mx-auto mb-4">
             <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-3xl text-cereniti-900">Set New Password</h1>
          <p className="text-cereniti-500 text-sm mt-2">
            Please choose a strong password to secure your account.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">New Password</label>
            <input 
              name="password"
              type="password" 
              required
              minLength={6}
              className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              required
              minLength={6}
              className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-cereniti-900 text-white hover:bg-gold-600 h-12 text-sm uppercase tracking-widest"
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Update Password"}
          </Button>

          {state?.error && (
            <p className="text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}