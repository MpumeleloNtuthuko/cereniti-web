import { createClient } from "@/lib/supabase/server";
import { User, Smartphone, Mail, Shield } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-cereniti-900 mb-8">Account Settings</h1>

      <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-cereniti-100 bg-cereniti-50/50">
           <h2 className="font-bold text-cereniti-900 flex items-center gap-2">
             <Shield className="h-4 w-4 text-gold-600" /> Personal Details
           </h2>
        </div>
        
        <div className="p-6 space-y-6">
           <div className="grid gap-2">
              <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Full Name</label>
              <div className="flex items-center gap-3 p-3 border border-cereniti-200 rounded-lg bg-cereniti-50 text-cereniti-700">
                 <User className="h-4 w-4 text-cereniti-400" />
                 {profile?.full_name}
              </div>
           </div>

           <div className="grid gap-2">
              <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Email Address</label>
              <div className="flex items-center gap-3 p-3 border border-cereniti-200 rounded-lg bg-cereniti-50 text-cereniti-700">
                 <Mail className="h-4 w-4 text-cereniti-400" />
                 {profile?.email}
              </div>
           </div>

           <div className="grid gap-2">
              <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Mobile Number</label>
              <div className="flex items-center gap-3 p-3 border border-cereniti-200 rounded-lg bg-white text-cereniti-900">
                 <Smartphone className="h-4 w-4 text-cereniti-400" />
                 {/* In a real app, this would be an editable Input with a Server Action */}
                 {profile?.phone || "No phone linked"}
              </div>
              <p className="text-xs text-cereniti-400">To update details, please contact Concierge support.</p>
           </div>
        </div>
      </div>
    </div>
  );
}