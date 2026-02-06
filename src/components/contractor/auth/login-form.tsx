"use client";

import { useActionState } from "react";
import { login } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500">Email Address</label>
        <input 
          name="email"
          type="email" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none"
          placeholder="name@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500">Password</label>
        <input 
          name="password"
          type="password" 
          required
          className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-cereniti-900 text-white h-12"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "Sign In"}
        </Button>
        {state?.error && (
          <p className="text-xs text-red-500 mt-4 text-center bg-red-50 p-2 rounded">
            {typeof state.error === 'string' ? state.error : "Please check your details."}
          </p>
        )}
      </div>
    </form>
  );
}