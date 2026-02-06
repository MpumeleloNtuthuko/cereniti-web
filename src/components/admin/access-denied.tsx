import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cereniti-50 p-6">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Icon */}
        <div className="mx-auto h-24 w-24 rounded-full bg-cereniti-100 flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-cereniti-900" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl text-cereniti-900">
            Restricted Frequency.
          </h1>
          <p className="text-cereniti-500 leading-relaxed text-sm">
            Your identity token does not have Command Clearance. This attempt has been logged.
          </p>
        </div>

        {/* Action */}
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-cereniti-900 text-white hover:bg-olive-900 w-full h-12">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Sanctuary
            </Button>
          </Link>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-cereniti-300 pt-8">
          Error 403: Forbidden
        </p>
      </div>
    </div>
  );
}