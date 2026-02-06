import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form"; // We'll create this next
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT: The Brand Atmosphere */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-cereniti-900 text-cereniti-50">
        <div className="z-10">
          <Link href="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="z-10 relative">
          <h1 className="font-serif text-6xl leading-none">
            Welcome to <br />
            <span className="italic text-cereniti-500">The Guild.</span>
          </h1>
          <p className="mt-6 max-w-sm text-cereniti-400 leading-relaxed">
            Access your contractor profile, manage your applications, and view your schedule.
          </p>
        </div>

        {/* Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* RIGHT: The Access Form */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-cereniti-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-3xl text-cereniti-900">Member Access</h2>
            <p className="mt-2 text-sm text-cereniti-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-cereniti-900 font-medium border-b border-cereniti-900 pb-0.5">
                Apply for Access
              </Link>
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}