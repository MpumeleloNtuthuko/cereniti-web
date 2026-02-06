import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";
import { User, Video, Diamond, Fingerprint, Eye, Ear, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InterviewPrepPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cereniti-50">
      <Navbar user={user} />
      
      {/* 1. HERO: THE GRAVITAS */}
      <div className="bg-cereniti-900 text-white pt-32 pb-24 px-6 lg:px-12 relative overflow-hidden">
         {/* Background Texture */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
         
         <div className="container mx-auto max-w-4xl text-center relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500 border border-gold-500/30 px-4 py-1.5 rounded-full">
               Phase 2: The Character Audit
            </span>
            <h1 className="mt-8 font-serif text-4xl md:text-6xl lg:text-7xl leading-tight">
               We do not interview cleaners. <br />
               <span className="text-cereniti-400 italic">We audit Specialists.</span>
            </h1>
            <p className="mt-8 text-lg text-cereniti-300 leading-relaxed max-w-2xl mx-auto">
               You have passed the technical screen. Now we evaluate your presence. 
               Cereniti serves the most private sanctuaries in South Africa. 
               We are looking for the traits that cannot be taught: Discretion, Integrity, and The Eye.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 py-20 lg:px-12 max-w-6xl">
         
         {/* 2. THE 4 PILLARS OF CERENITI DNA */}
         <div className="mb-20">
            <h2 className="font-serif text-3xl text-cereniti-900 mb-10 text-center">The Cereniti DNA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Pillar 1 */}
               <div className="bg-white p-8 rounded-xl border border-cereniti-200 hover:border-gold-500/50 transition-colors group">
                  <div className="h-12 w-12 bg-cereniti-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                     <Eye className="h-6 w-6 text-cereniti-900 group-hover:text-gold-600" />
                  </div>
                  <h3 className="font-serif text-xl text-cereniti-900 mb-3">The Forensic Eye</h3>
                  <p className="text-sm text-cereniti-600 leading-relaxed">
                     A Specialist sees what others ignore. The dust on the skirting board. The smudge on the tap. The misalignment of a rug. We value an obsession with detail. During the interview, we will test your ability to spot imperfection.
                  </p>
               </div>

               {/* Pillar 2 */}
               <div className="bg-white p-8 rounded-xl border border-cereniti-200 hover:border-gold-500/50 transition-colors group">
                  <div className="h-12 w-12 bg-cereniti-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                     <Ear className="h-6 w-6 text-cereniti-900 group-hover:text-gold-600" />
                  </div>
                  <h3 className="font-serif text-xl text-cereniti-900 mb-3">Radical Discretion</h3>
                  <p className="text-sm text-cereniti-600 leading-relaxed">
                     Our clients value privacy above all else. A Specialist is a ghost—present in their work, absent in their footprint. We look for individuals who understand the power of silence and confidentiality.
                  </p>
               </div>

               {/* Pillar 3 */}
               <div className="bg-white p-8 rounded-xl border border-cereniti-200 hover:border-gold-500/50 transition-colors group">
                  <div className="h-12 w-12 bg-cereniti-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                     <Diamond className="h-6 w-6 text-cereniti-900 group-hover:text-gold-600" />
                  </div>
                  <h3 className="font-serif text-xl text-cereniti-900 mb-3">Material Intelligence</h3>
                  <p className="text-sm text-cereniti-600 leading-relaxed">
                     Luxury homes are filled with sensitive materials: marble, raw silk, untreated wood. A Specialist knows the chemistry of care. We do not scrub; we preserve. We will evaluate your respect for high-value assets.
                  </p>
               </div>

               {/* Pillar 4 */}
               <div className="bg-white p-8 rounded-xl border border-cereniti-200 hover:border-gold-500/50 transition-colors group">
                  <div className="h-12 w-12 bg-cereniti-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                     <ShieldCheck className="h-6 w-6 text-cereniti-900 group-hover:text-gold-600" />
                  </div>
                  <h3 className="font-serif text-xl text-cereniti-900 mb-3">Absolute Ownership</h3>
                  <p className="text-sm text-cereniti-600 leading-relaxed">
                     When you step into a home, you become its temporary curator. You do not wait for instructions; you identify problems and solve them. We recruit leaders, not followers.
                  </p>
               </div>

            </div>
         </div>

         <div className="h-px w-full bg-cereniti-200 my-16" />

         {/* 3. THE DIGITAL STAGE (Video Etiquette) */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 mb-2 block">The Medium</span>
               <h2 className="font-serif text-3xl md:text-4xl text-cereniti-900 mb-6">The Digital Stage.</h2>
               <p className="text-cereniti-600 text-sm leading-relaxed mb-6">
                  Your video interview is not a casual chat. It is a demonstration of your standards. 
                  How you present yourself on screen tells us how you will present yourself in a client's foyer.
               </p>
               <div className="space-y-4">
                  <div className="flex items-start gap-4">
                     <Video className="h-5 w-5 text-cereniti-900 mt-1 shrink-0" />
                     <div>
                        <h4 className="font-bold text-sm text-cereniti-900">Your Environment</h4>
                        <p className="text-xs text-cereniti-500">Ensure your background is neutral, tidy, and silent. Chaos in your background suggests chaos in your work.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <User className="h-5 w-5 text-cereniti-900 mt-1 shrink-0" />
                     <div>
                        <h4 className="font-bold text-sm text-cereniti-900">Your Presentation</h4>
                        <p className="text-xs text-cereniti-500">Wear a plain Black or White top. Grooming must be immaculate. No hats, no distractions.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <Zap className="h-5 w-5 text-cereniti-900 mt-1 shrink-0" />
                     <div>
                        <h4 className="font-bold text-sm text-cereniti-900">Your Connection</h4>
                        <p className="text-xs text-cereniti-500">Test your connection, camera, and microphone 15 minutes prior. Technical failure is a preparation failure.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-7 bg-cereniti-900 rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
               {/* Deco Element */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/20 blur-3xl rounded-full" />
               
               <Fingerprint className="h-16 w-16 text-white/20 mx-auto mb-6" />
               <h3 className="font-serif text-2xl text-white mb-4">Identity Verification</h3>
               <p className="text-cereniti-300 text-sm leading-relaxed mb-8">
                  Security is the foundation of our brand. Please have your <strong>Original South African ID or Passport</strong> ready to display to the camera at the start of the call.
               </p>
               <div className="inline-block px-4 py-2 border border-white/20 rounded text-xs text-cereniti-400 uppercase tracking-widest">
                  Zero Tolerance Policy
               </div>
            </div>

         </div>

         {/* 4. FOOTER CTA */}
         <div className="mt-24 text-center">
            <p className="text-cereniti-500 text-sm mb-6">
               If you are ready to embody these standards, we look forward to meeting you.
            </p>
            <Link href="/contractor/handbook">
               <Button variant="outline" className="h-14 px-8 border-cereniti-300 text-cereniti-600 hover:text-cereniti-900 hover:bg-cereniti-50">
                  Review Guild Handbook
               </Button>
            </Link>
         </div>

      </div>
      <Footer />
    </main>
  );
}