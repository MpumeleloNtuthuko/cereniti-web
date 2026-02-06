"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Wine, Coffee, Sparkles, Wind, Ticket, Palette, Club } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative z-20">
      <div className="container mx-auto px-4 lg:px-12">
        
        {/* HEADER - Mobile Optimized */}
        <div className="mb-12 lg:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-600 flex items-center gap-3">
              <span className="w-8 h-px bg-gold-600"></span>
              The Lifestyle Architecture
            </span>
            <h2 className="mt-6 font-serif text-4xl md:text-7xl text-cereniti-900 leading-[1.0]">
              The Displacement <br />
              <span className="italic text-cereniti-400">Protocol.</span>
            </h2>
          </div>
          
          <div className="lg:col-span-4">
             <p className="text-sm text-cereniti-600 leading-7 font-light">
               The ultimate luxury is absence. We do not just clean your home; we buy back your time. 
               While we restore your sanctuary, we invite you to vanish into a curated selection of sensory experiences.
             </p>
          </div>
        </div>

        {/* CINEMATIC BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 lg:h-[600px]">
          
          {/* CARD 1: SOMATIC RESTORATION (Video) - Main Focus */}
          {/* Mobile: Full Width, Tall. Desktop: 8 Cols. */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-2xl bg-cereniti-900 h-[500px] lg:h-full">
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-90 lg:opacity-80 lg:group-hover:opacity-60 transition-opacity duration-700" />
               <video 
                 autoPlay muted loop playsInline 
                 className="h-full w-full object-cover opacity-90 lg:group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
               >
                 <source src="/home/spa.mp4" type="video/mp4" />
               </video>
            </div>
            
            {/* Floating Tag */}
            <div className="absolute top-6 left-6 z-20">
               <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-[0.2em]">
                 <Sparkles className="h-3 w-3 text-gold-400" /> Tier 1 Inclusion
               </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 z-20 transform lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
               <h3 className="text-3xl md:text-4xl font-serif text-white mb-3">Somatic Restoration</h3>
               {/* Mobile: Always Visible. Desktop: Visible on Hover. */}
               <p className="text-[#E7E5E4] text-sm md:text-base max-w-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                 A full-body reset. Deep tissue massage, aromatherapy, or hydrotherapy sessions arranged at our partner wellness sanctuaries. You return aligned; your home returns pristine.
               </p>
            </div>
          </div>

          {/* RIGHT COLUMN STACK */}
          {/* Mobile: Stacked below. Desktop: 4 Cols. */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6 h-full">
            
            {/* CARD 2: MORNING RITUAL */}
            <div className="relative group overflow-hidden rounded-2xl bg-cereniti-100 flex-1 min-h-[250px]">
                <Image 
                  src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1742&auto=format&fit=crop"
                  alt="Artisan Coffee"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 lg:bg-black/40 lg:group-hover:bg-black/20 transition-colors duration-500 z-10" />
                
                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-serif text-white">The Morning Ritual</h3>
                      <Coffee className="h-4 w-4 text-white opacity-80" />
                   </div>
                   <p className="text-xs text-white/90 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 lg:transform lg:translate-y-2 lg:group-hover:translate-y-0">
                     Artisan roast and patisserie selection at a quiet, curated locale.
                   </p>
                </div>
            </div>

            {/* CARD 3: EVENING VINTAGE */}
            <div className="relative group overflow-hidden rounded-2xl bg-cereniti-100 flex-1 min-h-[250px]">
                <Image 
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1740&auto=format&fit=crop"
                  alt="Wine Tasting"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 lg:bg-black/40 lg:group-hover:bg-black/20 transition-colors duration-500 z-10" />

                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-serif text-white">The Evening Vintage</h3>
                      <Wine className="h-4 w-4 text-white opacity-80" />
                   </div>
                   <p className="text-xs text-white/90 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 lg:transform lg:translate-y-2 lg:group-hover:translate-y-0">
                     Private tasting flights in garden settings. Decompress while we detail.
                   </p>
                </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CTA BAR with "MORE" INDICATOR */}
        <div className="mt-4 lg:mt-6 flex flex-col gap-4">
           
           {/* The "More" Indicator Strip */}
           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 px-4 text-cereniti-400 text-[10px] font-bold uppercase tracking-widest">
              <span>Also Includes many more complimentaries</span>
           </div>

           {/* The Main Action */}
           <Link href="/book" className="block">
             <div className="bg-[#1A1918] rounded-xl p-6 lg:p-8 flex items-center justify-between group cursor-pointer hover:bg-black transition-colors shadow-xl shadow-cereniti-900/10">
                <div>
                   <h4 className="text-white font-serif text-xl lg:text-2xl">Access the Gilded Circle</h4>
                   <p className="text-cereniti-400 text-xs mt-1">Unlock these benefits with Reserve bookings.</p>
                </div>
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all text-white">
                    <ArrowUpRight className="h-5 w-5" />
                </div>
             </div>
           </Link>
        </div>

      </div>
    </section>
  );
}