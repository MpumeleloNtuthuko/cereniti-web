import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import { ApplicationForm } from "@/components/contractor/application-form";
import { ShieldCheck, Bus, Briefcase, Star } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ContractorJoinPage() {
  const supabase = await createClient();
  
  // 1. Get Logged In User
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Security: If no user, kick them to login
  if (!user || !user.email) {
    redirect("/login?next=/contractor/join");
  }

  // 3. Fetch Profile Data (Name & Phone)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-cereniti-50">
      <Navbar user={user} />
      
      {/* HEADER SECTION */}
      <div className="relative pt-32 pb-20 px-6 lg:px-12 border-b border-cereniti-200">
        <div className="container mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cereniti-500">
            Cereniti Guild
          </span>
          <h1 className="mt-6 font-serif text-5xl md:text-6xl text-cereniti-900 leading-[1.1]">
            We don&apos;t hire cleaners. <br />
            <span className="italic text-cereniti-500">We partner with Specialists.</span>
          </h1>
          <p className="mt-8 text-lg text-cereniti-600 leading-relaxed max-w-2xl font-serif">
            Cereniti is building the most respected home care network in the Western Cape. 
            We remove the stress of logistics, negotiations, and supplies, allowing you to focus purely on your craft.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Selling Points */}
          <div className="lg:col-span-7 space-y-16">
            
            <div className="bg-white p-8 border border-cereniti-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="h-32 w-32 text-cereniti-900" />
              </div>
              <h3 className="font-serif text-2xl text-cereniti-900 mb-2">The Financial Floor</h3>
              <p className="text-cereniti-500 text-sm mb-6 uppercase tracking-widest">Stability meets Opportunity</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-serif text-cereniti-900">35%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-cereniti-400 mt-1">Guaranteed Base</p>
                  <p className="text-sm text-cereniti-600 mt-3 leading-relaxed">
                    You earn a guaranteed base rate on every job, regardless of complexity. This is your safety net.
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-serif text-olive-500">+10%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-cereniti-400 mt-1">Excellence Bonus</p>
                  <p className="text-sm text-cereniti-600 mt-3 leading-relaxed">
                    Perform a 5-star reset and unlock an instant bonus. High performers significantly out-earn the market rate.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Us Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-cereniti-900 text-white flex items-center justify-center rounded-sm">
                  <Bus className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-xl text-cereniti-900">Private Logistics</h4>
                <p className="text-sm text-cereniti-600 leading-relaxed">
                  Stop walking to sites. We pick you up and drop you off. Arrive fresh and safe.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-cereniti-100 text-cereniti-900 flex items-center justify-center rounded-sm">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-xl text-cereniti-900">Professional Kit</h4>
                <p className="text-sm text-cereniti-600 leading-relaxed">
                  We provide Italian-grade equipment and sensory formulas. No more scrubbing with cheap bleach.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-cereniti-100 text-cereniti-900 flex items-center justify-center rounded-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-xl text-cereniti-900">Client Protection</h4>
                <p className="text-sm text-cereniti-600 leading-relaxed">
                  We vet clients as strictly as we vet staff. We do not tolerate abuse or scope creep.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-cereniti-100 text-cereniti-900 flex items-center justify-center rounded-sm">
                  <Star className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-xl text-cereniti-900">The Guild Badge</h4>
                <p className="text-sm text-cereniti-600 leading-relaxed">
                  Top-rated Specialists get priority access to Estate bookings where tips are higher.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white p-8 border border-cereniti-200 shadow-xl shadow-cereniti-900/5">
              <div className="mb-8 border-b border-cereniti-100 pb-6">
                <h3 className="font-serif text-2xl text-cereniti-900">Begin Application</h3>
                <p className="mt-2 text-sm text-cereniti-500">
                  Join the waiting list for the next intake.
                </p>
              </div>
              
              {/* PASS DATA TO FORM */}
              <ApplicationForm 
                userEmail={user.email} 
                userId={user.id} 
                userName={profile?.full_name || ""} 
                userPhone={profile?.phone || ""}
              />
              
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}