import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { ArrowRight, Box, Diamond, Clock, Droplets, Wind, Star } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BookingSelectionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-cereniti-50 flex flex-col">
      <Navbar user={user} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 lg:py-32">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cereniti-500 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-cereniti-300"></span>
            Curate Your Standard
            <span className="h-px w-8 bg-cereniti-300"></span>
          </span>
          <h1 className="mt-6 font-serif text-4xl md:text-6xl text-cereniti-900 leading-tight">
            How do you wish to <br/> <span className="italic text-gold-600">live today?</span>
          </h1>
        </div>

        {/* COMPARISON GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-stretch">
          
          {/* --- OPTION 1: CLASSIC (The Foundation) --- */}
          <Link href="/book/classic" className="group flex flex-col relative bg-white border border-cereniti-200 rounded-xl p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:border-cereniti-300">
             
             {/* Header */}
             <div className="mb-8 border-b border-cereniti-100 pb-8">
               {/* Abstract Icon: Box (Structure/Order) */}
               <div className="h-12 w-12 rounded-lg bg-cereniti-50 border border-cereniti-200 flex items-center justify-center text-cereniti-600 mb-6 group-hover:bg-cereniti-100 transition-colors">
                 <Box className="h-5 w-5" strokeWidth={1.5} />
               </div>
               
               <h2 className="font-serif text-3xl text-cereniti-900 mb-3">Cereniti Classic</h2>
               <p className="text-sm text-cereniti-500 leading-relaxed">
                 The uncompromising standard of hygiene. Efficient, rigorous, and precise. Designed for the practical maintenance of your property assets.
               </p>
               
               <div className="mt-6 flex flex-wrap gap-2">
                  <Badge text="Routine Maintenance" />
                  <Badge text="Rental Turnover" />
               </div>
             </div>

             {/* Features */}
             <div className="flex-1 space-y-4 mb-10">
               <p className="text-xs font-bold uppercase tracking-widest text-cereniti-400 mb-4">The Standard Protocol</p>
               <Feature text="Guild-Vetted Specialists (Standard Tier)" />
               <Feature text="60-Point Digital Checklist" />
               <Feature text="Standard Eco-Friendly Chemistry" />
               <Feature text="Real-Time Status Tracking" />
               <Feature text="Earn 1x Loyalty Points" highlight />
             </div>

             {/* Footer */}
             <div className="mt-auto">
                <div className="w-full h-14 rounded-sm border border-cereniti-200 flex items-center justify-between px-6 text-xs font-bold uppercase tracking-widest text-cereniti-900 group-hover:bg-cereniti-50 transition-colors">
                  Select Classic <ArrowRight className="h-4 w-4" />
                </div>
             </div>
          </Link>

          {/* --- OPTION 2: RESERVE (The Upsell) --- */}
          <Link href="/book/reserve" className="group flex flex-col relative bg-[#1A1918] rounded-xl p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-900/20 transform lg:scale-105 z-10 border border-white/10">
             
             {/* Gold Accent Line */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-700 rounded-t-xl" />
             
             {/* Header */}
             <div className="mb-8 border-b border-white/10 pb-8">
               <div className="flex justify-between items-start">
                   {/* Abstract Icon: Diamond (Rarity/Value) */}
                   <div className="h-12 w-12 rounded-lg bg-gold-600/10 border border-gold-500/30 flex items-center justify-center text-gold-500 mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                     <Diamond className="h-5 w-5" strokeWidth={1.5} />
                   </div>
                   <span className="bg-white/5 text-gold-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold-500/20">
                      Signature Experience
                   </span>
               </div>

               <h2 className="font-serif text-4xl text-white mb-3">Cereniti Reserve</h2>
               <p className="text-sm text-[#A8A29E] leading-relaxed"> {/* Explicit text color for readability */}
                 The art of living. A sensory restoration protocol including lifestyle displacement, luxury finishes care, and aromatic staging.
               </p>

               <div className="mt-6 flex flex-wrap gap-2">
                  <Badge text="Sanctuary Reset" dark />
                  <Badge text="Post-Renovation" dark />
                  <Badge text="Event Prep" dark />
               </div>
             </div>

             {/* Features */}
             <div className="flex-1 space-y-4 mb-10">
               <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-4">The Luxury Inclusions</p>
               
               <Feature text="Senior Guild Specialists (Top 5%)" dark />
               <Feature text="pH-Neutral Marble & Stone Chemistry" dark icon={<Droplets className="h-3 w-3 text-gold-500" />} />
               <Feature text="Signature Scent & Linen Fold" dark icon={<Wind className="h-3 w-3 text-gold-500" />} />
               <Feature text="Priority Scheduling & Team Lock" dark icon={<Clock className="h-3 w-3 text-gold-500" />} />
               
               {/* The Big Selling Point */}
               <div className="p-4 rounded border border-gold-500/30 bg-gold-500/5 mt-4">
                  <div className="flex items-start gap-3">
                     <Star className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
                     <div>
                        <p className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">Displacement Protocol</p>
                        <p className="text-[#A8A29E] text-xs leading-relaxed">
                           Includes complimentary vouchers for Spas, Vineyards, and Dining partners to enjoy while we work.
                        </p>
                     </div>
                  </div>
               </div>
             </div>

             {/* Footer */}
             <div className="mt-auto">
                <div className="w-full h-14 rounded-sm bg-gold-600 flex items-center justify-between px-6 text-xs font-bold uppercase tracking-widest text-white group-hover:bg-gold-500 transition-colors shadow-lg shadow-gold-900/40">
                  Enter Reserve <ArrowRight className="h-4 w-4" />
                </div>
             </div>
          </Link>

        </div>
      </div>
    </main>
  );
}

// --- SUB COMPONENTS ---

function Feature({ text, dark, icon, highlight }: { text: string, dark?: boolean, icon?: React.ReactNode, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {icon ? icon : (
        <div className={`h-1.5 w-1.5 rounded-full ${dark ? 'bg-gold-500' : 'bg-cereniti-300'}`} />
      )}
      <span className={dark ? (highlight ? "text-gold-400 font-bold" : "text-[#E7E5E4]") : (highlight ? "text-gold-700 font-bold" : "text-cereniti-600")}>
        {text}
      </span>
    </div>
  );
}

function Badge({ text, dark }: { text: string, dark?: boolean }) {
  return (
    <span className={`text-[10px] px-2 py-1 rounded border ${dark ? 'bg-white/5 border-white/10 text-[#A8A29E]' : 'bg-cereniti-50 border-cereniti-100 text-cereniti-500'}`}>
       {text}
    </span>
  )
}