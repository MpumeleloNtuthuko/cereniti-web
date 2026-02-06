"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Diamond, Check } from "lucide-react";

export function TierSelectorSection() {
  return (
    <section className="py-24 bg-cereniti-50">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cereniti-400">
            The Collections
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-cereniti-900 leading-tight">
            Precision or <span className="italic text-gold-600">Poetry?</span>
          </h2>
          <p className="mt-6 text-cereniti-500 leading-relaxed">
            We have separated our service into two distinct standards. 
            One creates order; the other creates peace.
          </p>
        </div>

        {/* DUAL CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* 1. CLASSIC CARD (Light) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative bg-white border border-cereniti-200 p-10 lg:p-14 rounded-2xl hover:shadow-xl transition-all duration-500"
          >
            <div className="h-14 w-14 bg-cereniti-50 rounded-xl flex items-center justify-center text-cereniti-600 mb-8 group-hover:bg-cereniti-100 transition-colors">
               <Box className="h-6 w-6" strokeWidth={1.5} />
            </div>
            
            <h3 className="font-serif text-3xl text-cereniti-900 mb-4">Cereniti Classic</h3>
            <p className="text-cereniti-500 leading-relaxed mb-8 min-h-[4rem]">
              The uncompromising standard of hygiene. Efficient, rigorous, and precise. Designed for property maintenance and rental turnovers.
            </p>

            <div className="space-y-4 mb-10">
               <Feature text="60-Point Clinical Checklist" />
               <Feature text="Standard Eco-Chemistry" />
               <Feature text="Real-Time Status Tracking" />
               <Feature text="Earn Loyalty Points" highlight />
            </div>

            <Link href="/book/classic" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-cereniti-900 group-hover:text-gold-600 transition-colors border-b border-cereniti-200 pb-1 hover:border-gold-600">
               Select Standard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          {/* 2. RESERVE CARD (Dark) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-[#1A1918] p-10 lg:p-14 rounded-2xl shadow-2xl shadow-cereniti-900/20 overflow-hidden border border-white/5"
          >
            {/* Gold Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-gold-700" />
            
            <div className="h-14 w-14 bg-white/5 rounded-xl flex items-center justify-center text-gold-500 mb-8 border border-white/10 group-hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.15)]">
               <Diamond className="h-6 w-6" strokeWidth={1.5} />
            </div>
            
            <h3 className="font-serif text-3xl text-white mb-4">Cereniti Reserve</h3>
            {/* Fixed Text Color: Warm Grey for readability against black */}
            <p className="text-[#A8A29E] leading-relaxed mb-8 min-h-[4rem]">
              The art of living. A sensory protocol that includes lifestyle displacement, luxury finishes care, and aromatic staging.
            </p>

            <div className="space-y-4 mb-10">
               <Feature text="Senior Guild Specialists (Top 5%)" dark />
               <Feature text="pH-Neutral Marble & Stone Care" dark />
               <Feature text="Signature Scent & Linen Fold" dark />
               <Feature text="Complimentary Spa & Dining" dark highlight />
            </div>

            <Link href="/book/reserve" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white group-hover:text-gold-400 transition-colors border-b border-white/20 pb-1 hover:border-gold-400">
               Select Luxury <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// --- SUB COMPONENT (With Color Fixes) ---
function Feature({ text, dark, highlight }: { text: string, dark?: boolean, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-gold-900/30 text-gold-500' : 'bg-cereniti-100 text-cereniti-400'}`}>
         <Check className="h-2.5 w-2.5" />
      </div>
      <span className={
        // LOGIC: If Dark Mode -> Use White (#E7E5E4) or Gold. If Light Mode -> Use Grey or Gold.
        dark 
          ? (highlight ? "text-gold-400 font-bold" : "text-[#E7E5E4]") 
          : (highlight ? "text-gold-700 font-bold" : "text-cereniti-600")
      }>
        {text}
      </span>
    </div>
  );
}