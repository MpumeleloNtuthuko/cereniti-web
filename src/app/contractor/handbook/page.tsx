import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, ShieldCheck, Gem, UserCheck, Microscope, AlertTriangle, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HandbookPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-cereniti-50 selection:bg-gold-900 selection:text-white">
      <Navbar user={user} />
      
      {/* HEADER */}
      <div className="bg-cereniti-900 text-cereniti-50 pt-32 pb-20 px-6 lg:px-12">
         <div className="container mx-auto max-w-4xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500">
               Official Guild Curriculum
            </span>
            <h1 className="mt-6 font-serif text-4xl md:text-6xl text-white leading-tight">
               The Standard of <span className="italic text-cereniti-400">Excellence.</span>
            </h1>
            <p className="mt-6 text-lg text-cereniti-300 leading-relaxed max-w-2xl mx-auto">
               This is your textbook. The Assessment you are about to take tests your ethics, chemistry knowledge, and situational intelligence. 
               Study this page. There are no second chances.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 py-16 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 hidden lg:block">
           <div className="sticky top-32 space-y-4 border-l border-cereniti-200 pl-6">
              <p className="text-xs font-bold uppercase tracking-widest text-cereniti-400 mb-4">Modules</p>
              <a href="#mindset" className="block text-sm text-cereniti-600 hover:text-gold-600 transition-colors">1. The Mindset</a>
              <a href="#integrity" className="block text-sm text-cereniti-600 hover:text-gold-600 transition-colors">2. Integrity & Ethics</a>
              <a href="#chemistry" className="block text-sm text-cereniti-600 hover:text-gold-600 transition-colors">3. Advanced Chemistry</a>
              <a href="#materials" className="block text-sm text-cereniti-600 hover:text-gold-600 transition-colors">4. Material Care</a>
              <a href="#situational" className="block text-sm text-cereniti-600 hover:text-gold-600 transition-colors">5. Situational Logic</a>
           </div>
        </div>

        {/* CONTENT */}
        <div className="lg:col-span-9 space-y-20 max-w-3xl">
           
           {/* SECTION 1: MINDSET */}
           <section id="mindset" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                    <UserCheck className="h-5 w-5" />
                 </div>
                 <h2 className="font-serif text-3xl text-cereniti-900">1. The Mindset</h2>
              </div>
              <div className="prose prose-stone text-cereniti-600 leading-7">
                 <p>
                    We do not sell "cleaning." We sell <strong>restoration</strong>. 
                    A room is not finished when it is clean; it is finished when it feels calm.
                 </p>
                 <ul className="list-disc pl-5 space-y-2 mt-4">
                    <li><strong>Symmetry:</strong> Chairs must be tucked parallel. Curtains hung evenly. Rugs centered.</li>
                    <li><strong>Invisibility:</strong> You leave no trace. No wet floors. No moved personal items.</li>
                    <li><strong>The "Hotel Fold":</strong> Toilet paper points. Towels tri-folded. Bed corners hospital-tucked.</li>
                 </ul>
              </div>
           </section>

           <div className="h-px w-full bg-cereniti-200" />

           {/* SECTION 2: INTEGRITY */}
           <section id="integrity" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center text-cereniti-600">
                    <ShieldCheck className="h-5 w-5" />
                 </div>
                 <h2 className="font-serif text-3xl text-cereniti-900">2. Integrity Protocols</h2>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-r-lg">
                 <h4 className="font-bold text-red-800 flex items-center gap-2 text-sm uppercase tracking-widest mb-2">
                    <AlertTriangle className="h-4 w-4" /> Zero Tolerance
                 </h4>
                 <p className="text-red-900 text-sm">
                    Hiding a mistake is grounds for immediate dismissal. Reporting a mistake is grounds for training. We value honesty above perfection.
                 </p>
              </div>
              <div className="space-y-4 text-sm text-cereniti-700">
                 <p><strong>The Breakage Rule:</strong> If you break something, photograph it immediately, message Ops, and leave a handwritten note for the client. Never hide it.</p>
                 <p><strong>The "Found Item" Rule:</strong> Jewelry, cash, or devices found under beds/sofas must be placed on the nearest elevated surface (bedside table) on a tissue. Never put it in your pocket "for safekeeping."</p>
                 <p><strong>The Gift Rule:</strong> You may not accept cash tips or gifts directly to avoid policy violations. If a client insists, accept graciously but report it to Admin immediately for transparency.</p>
              </div>
           </section>

           <div className="h-px w-full bg-cereniti-200" />

           {/* SECTION 3: CHEMISTRY */}
           <section id="chemistry" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center text-cereniti-600">
                    <Microscope className="h-5 w-5" />
                 </div>
                 <h2 className="font-serif text-3xl text-cereniti-900">3. Lethal & Safe Chemistry</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-cereniti-200">
                    <h4 className="font-bold text-cereniti-900 mb-3">Forbidden Mixes</h4>
                    <ul className="text-sm text-cereniti-600 space-y-2">
                       <li>❌ <strong>Bleach + Ammonia:</strong> Creates deadly Chloramine gas. (Note: Urine contains ammonia).</li>
                       <li>❌ <strong>Acid + Stone:</strong> Vinegar or Lemon Juice dissolves Marble/Travertine.</li>
                    </ul>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-cereniti-200">
                    <h4 className="font-bold text-cereniti-900 mb-3">Color Coding</h4>
                    <ul className="text-sm text-cereniti-600 space-y-2">
                       <li>🔴 <strong>Red:</strong> High Risk (Toilets, Bidets).</li>
                       <li>🟡 <strong>Yellow:</strong> Bathroom Sinks, Showers.</li>
                       <li>🟢 <strong>Green:</strong> Kitchen & Food Prep.</li>
                       <li>🔵 <strong>Blue:</strong> General Dusting, Glass.</li>
                    </ul>
                 </div>
              </div>
           </section>

           {/* SECTION 4: MATERIAL CARE */}
           <section id="materials" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center text-cereniti-600">
                    <Gem className="h-5 w-5" />
                 </div>
                 <h2 className="font-serif text-3xl text-cereniti-900">4. Luxury Material Care</h2>
              </div>
              <ul className="space-y-4 text-cereniti-700 leading-7">
                 <li><strong>OLED Screens:</strong> Never spray liquid directly. Use a dry optical microfiber. Water damages the pixels.</li>
                 <li><strong>Marble / Travertine:</strong> Porous stones. Use ONLY pH-Neutral stone cleaner. Acid (Viakal/Vinegar) etches the surface permanently.</li>
                 <li><strong>Raw Wood:</strong> Never use wet cloths. Water rings destroy varnish. If a ring exists, report it; do not try to fix it with home remedies (mayonnaise/ash) unless trained.</li>
                 <li><strong>Persian Rugs:</strong> If a liquid spills, BLOT with a dry white towel. Never rub; rubbing destroys the fibers.</li>
              </ul>
           </section>

           {/* SECTION 5: SITUATIONAL */}
           <section id="situational" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center text-cereniti-600">
                    <BrainCircuit className="h-5 w-5" />
                 </div>
                 <h2 className="font-serif text-3xl text-cereniti-900">5. Situational Logic</h2>
              </div>
              <div className="space-y-4 text-cereniti-700">
                 <p><strong>The "Invisible" Rule:</strong> If a client enters a room you are cleaning, you leave that room immediately and quietly. Return when they are gone.</p>
                 <p><strong>Access Issues:</strong> If a gate code fails, wait 15 minutes. Call Ops Support. Do not harass the client or jump fences.</p>
                 <p><strong>Aggressive Pets:</strong> Safety first. Do not enter a room with an aggressive animal. Clean around it and notify Admin.</p>
              </div>
           </section>

           {/* CTA */}
           <div className="bg-cereniti-900 text-white p-10 rounded-2xl text-center mt-16 shadow-2xl">
              <h3 className="font-serif text-3xl mb-4">Are you ready?</h3>
              <p className="text-cereniti-300 text-sm mb-8 max-w-lg mx-auto">
                 The assessment contains 20 questions based on this handbook. 
                 It checks for consistency, honesty, and technical knowledge.
              </p>
              
              <Link href="/contractor/join">
                 <Button className="bg-gold-600 text-cereniti-900 hover:bg-white hover:text-cereniti-900 font-bold uppercase tracking-widest px-10 h-14 text-lg">
                    Start Application <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
              </Link>
           </div>

        </div>
      </div>
      
      <Footer />
    </main>
  );
}