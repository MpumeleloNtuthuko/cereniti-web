import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT: The Brand Atmosphere (Dark Mode) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-cereniti-900 text-cereniti-50">
        <div className="z-10">
          <Link href="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <ArrowLeft className="h-4 w-4" /> Return Home
          </Link>
        </div>

        <div className="z-10 relative">
          <h1 className="font-serif text-6xl leading-none">
            Begin your <br />
            <span className="italic text-cereniti-500">Legacy.</span>
          </h1>
          <p className="mt-6 max-w-sm text-cereniti-400 leading-relaxed">
            Join the guild of specialists. Access premium equipment, vetted clients, and guaranteed payments.
          </p>
        </div>

        {/* Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
      </div>

      {/* RIGHT: The Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-cereniti-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-3xl text-cereniti-900">Apply for Access</h2>
            <p className="mt-2 text-sm text-cereniti-500">
              Already a member?{" "}
              <Link href="/login" className="text-cereniti-900 font-medium border-b border-cereniti-900 pb-0.5 hover:text-olive-500 hover:border-olive-500 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}