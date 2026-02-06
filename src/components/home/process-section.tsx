"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: 1,
    title: "Deployment",
    subtitle: "Logistics & Access",
    icon: MapPin,
    description: "We do not rely on public infrastructure. Our specialists arrive in unmarked, company-owned shuttles from our secure depot. We manage gate codes, keys, and alarm protocols with military-grade discretion.",
    specs: ["Geo-fenced Arrival", "Uniform Inspection", "Kit Verification"],
    image: "/home/logistics.jpg" // <--- LOCAL FILE
  },
  {
    id: 2,
    title: "Execution",
    subtitle: "The 40-Point Reset",
    icon: ShieldCheck,
    description: "Cleaning is subjective; Protocols are absolute. We follow a strict systematic flow—top-to-bottom, wet-to-dry. We use color-coded microfiber to prevent cross-contamination and pH-neutral formulas to protect natural stone.",
    specs: ["Color-Coded Hygiene", "Noise Suppression", "Surface Protection"],
    image: "/home/execution.jpg" // <--- LOCAL FILE
  },
  {
    id: 3,
    title: "Handover",
    subtitle: "Digital Verification",
    icon: CheckCircle2,
    description: "Trust is good; proof is better. Before departing, your specialist uploads timestamped 'After' imagery to your dashboard. We lock up, arm the perimeter, and vanish. You return to silence.",
    specs: ["Photo Uploads", "Perimeter Check", "Key Return"],
    image: "/home/handover.jpg" // <--- LOCAL FILE
  }
];

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="bg-cereniti-900 py-24 lg:py-32 text-white relative overflow-hidden">
      
      {/* BACKGROUND NOISE TEXTURE */}
      <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 h-full">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cereniti-400">
              03 — The System
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-white">
              Operational <br /> <span className="text-olive-500 italic">Protocol.</span>
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] uppercase tracking-widest text-cereniti-500">
              Status: Active
            </p>
            <p className="text-[10px] uppercase tracking-widest text-cereniti-500">
              Region: Western Cape
            </p>
          </div>
        </div>

        {/* THE ACCORDION */}
        <div className="flex flex-col lg:flex-row gap-2 h-[800px] lg:h-[600px]">
          {STEPS.map((step) => {
            const isActive = activeStep === step.id;
            
            return (
              <motion.div
                key={step.id}
                onHoverStart={() => setActiveStep(step.id)}
                onClick={() => setActiveStep(step.id)} // For mobile touch
                className={cn(
                  "relative flex-1 cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-cereniti-950 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                  isActive ? "lg:flex-[3]" : "lg:flex-1"
                )}
              >
                {/* BACKGROUND IMAGE (Reveals on Active) */}
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  isActive ? "opacity-40" : "opacity-0"
                )}>
                  <Image 
                    src={step.image} 
                    alt={step.title}
                    fill
                    className="object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cereniti-950 via-cereniti-950/80 to-transparent" />
                </div>

                {/* CONTENT CONTAINER */}
                <div className="relative h-full flex flex-col justify-between p-8 lg:p-10 z-10">
                  
                  {/* TOP: Number & Icon */}
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "font-serif text-4xl transition-colors duration-500",
                      isActive ? "text-white" : "text-cereniti-700"
                    )}>
                      0{step.id}
                    </span>
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border transition-all duration-500",
                      isActive ? "border-olive-500 bg-olive-500 text-white" : "border-white/10 text-cereniti-500"
                    )}>
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* BOTTOM: Title & Details */}
                  <div className="mt-auto">
                    <motion.div layout>
                      <h3 className={cn(
                        "font-serif text-3xl mb-2 transition-colors duration-300",
                        isActive ? "text-white" : "text-cereniti-400"
                      )}>
                        {step.title}
                      </h3>
                      <p className={cn(
                        "text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                        isActive ? "text-olive-400" : "text-cereniti-600"
                      )}>
                        {step.subtitle}
                      </p>
                    </motion.div>

                    {/* EXPANDED CONTENT (Only visible when active) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: 20 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 10 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <div className="pt-6 border-t border-white/10 mt-6">
                            <p className="text-cereniti-300 leading-relaxed text-sm md:text-base max-w-lg">
                              {step.description}
                            </p>
                            
                            {/* Technical Specs List */}
                            <div className="mt-6 flex flex-wrap gap-3">
                              {step.specs.map((spec, i) => (
                                <span key={i} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-wider text-cereniti-400">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ACTIVE INDICATOR LINE */}
                  <motion.div 
                    className={cn(
                      "absolute bg-olive-500 transition-all duration-500",
                      "hidden lg:block left-0 top-0 bottom-0 w-1",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <motion.div 
                    className={cn(
                      "absolute bg-olive-500 transition-all duration-500",
                      "lg:hidden left-0 right-0 bottom-0 h-1",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}