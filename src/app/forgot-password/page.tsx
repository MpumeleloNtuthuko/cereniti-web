"use client";

import { useActionState } from "react";
import { forgotPassword } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cereniti-50 p-6">
      <div className="w-full max-w-md bg-white border border-cereniti-200 p-8 rounded-2xl shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center text-xs text-cereniti-400 hover:text-cereniti-900 mb-6 transition-colors">
            <ArrowLeft className="h-3 w-3 mr-1" /> Back to Login
          </Link>
          <h1 className="font-serif text-3xl text-cereniti-900">Recovery</h1>
          <p className="text-cereniti-500 text-sm mt-2">
            Enter the email associated with your account to receive a secure reset link.
          </p>
        </div>

        {/* Success State */}
        {state?.success ? (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl text-center">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-emerald-800 font-bold text-sm uppercase tracking-wider mb-1">Check your Email</h3>
            <p className="text-emerald-700 text-sm leading-relaxed">
              We have sent a secure link to your inbox. It will expire in 1 hour.
            </p>
          </div>
        ) : (
          /* Form */
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full border-b border-cereniti-300 bg-transparent py-2 text-cereniti-900 focus:border-cereniti-900 focus:outline-none transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-cereniti-900 text-white hover:bg-gold-600 h-12 text-sm uppercase tracking-widest"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
            </Button>

            {state?.error && (
              <p className="text-xs text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">
                {state.error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}