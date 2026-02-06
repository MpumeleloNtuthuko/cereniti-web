import { Navbar } from "@/components/layout/navbar";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { BenefitsSection } from "@/components/home/benefits-section";
import { TransformationSection } from "@/components/home/transformation-section";
import { SensorySection } from "@/components/home/sensory-section";
import { ProtectedLink } from "@/components/ui/protected-link";
import { ServicesSection } from "@/components/home/services-section";
import { ProcessSection } from "@/components/home/process-section";
import { TierSelectorSection } from "@/components/home/tier-selector-section"; // <--- NEW IMPORT

export default async function Home() {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="relative min-h-screen w-full selection:bg-gold-900 selection:text-white">
      {/* 1. Global Texture Overlay */}
      <div className="bg-noise" />

      <Navbar user={user} />

      {/* --- HERO SECTION --- */}
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Technical/Manifesto (3 cols) */}
        <div className="relative z-20 flex flex-col justify-end px-6 pb-12 pt-32 lg:col-span-4 lg:px-12 lg:pb-24">
          <div className="space-y-8">
            {/* The Trust Badge */}
            <div className="flex items-center gap-3 border-b border-cereniti-900/10 pb-6">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border border-white bg-cereniti-200" /> 
                ))}
              </div>
              <div className="text-xs font-medium tracking-wide uppercase text-cereniti-500">
                <span className="text-cereniti-900 font-bold">4.9/5.0</span> Trust Score
              </div>
            </div>

            {/* The Philosophy Text */}
            <p className="font-sans text-sm leading-relaxed text-cereniti-500 max-w-xs">
              <strong className="text-cereniti-900 block mb-2">Manifesto 001</strong>
              Cleaning is not a chore; it is the restoration of order. We do not just clean spaces; we clarify minds. Designed for the private individual.
            </p>

            {/* Unique "Scroll" indicator */}
            <div className="hidden lg:block pt-12">
              <div className="h-px w-12 bg-cereniti-900" />
              <span className="mt-2 block text-[10px] uppercase tracking-widest text-cereniti-900">
                Scroll for context
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Visual Hook (9 cols) */}
        <div className="relative flex flex-col justify-center px-6 lg:col-span-8 lg:px-24">
          
          {/* Background Image (Abstract Interior) */}
          <div className="absolute inset-0 z-0 overflow-hidden lg:left-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cereniti-50 via-cereniti-50/80 to-transparent z-10" />
            {/* Using a high-end architectural Unsplash image */}
            <Image 
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
              alt="Cereniti Atmosphere"
              fill
              className="object-cover opacity-80"
              priority
            />
          </div>

          {/* The Content Layer */}
          <div className="relative z-20 pt-20 lg:pt-0">
            <h1 className="font-serif text-6xl font-normal leading-[0.95] text-cereniti-900 md:text-8xl lg:text-[7rem]">
              <span className="block">Silence</span>
              <span className="block italic text-cereniti-500 ml-12">in the</span>
              <span className="block">Chaos.</span>
            </h1>
            
            <div className="mt-12 flex flex-wrap gap-6">
              <ProtectedLink href="/book">
                <Button className="h-14 bg-cereniti-900 px-8 text-base font-medium text-white hover:bg-gold-600 transition-all duration-500 rounded-none">
                  Book an Experience
                </Button>
              </ProtectedLink>
              
              {/* PROTECTED */}
              <ProtectedLink href="/contractor/join">
                <Button variant="outline" className="h-14 border-cereniti-900 text-cereniti-900 px-8 text-base font-medium hover:bg-cereniti-100 rounded-none group">
                  Apply as Specialist
                  <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </ProtectedLink>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Footer Detail */}
      <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
         <span className="text-[10px] uppercase tracking-widest text-cereniti-900 opacity-40 mix-blend-multiply">
           System V1.0 — Paarl
         </span>
      </div>

      {/* --- SECTIONS FLOW --- */}
      
      {/* 1. The Fork in the Road (Classic vs Reserve) */}
      <TierSelectorSection />

      {/* 2. Detailed Service Menu */}
      <ServicesSection />
      
      {/* 3. How We Work */}
      <ProcessSection />
      
      {/* 4. Before / After Slider */}
      <TransformationSection />
      
      {/* 5. Lifestyle / Displacement Benefits */}
      <BenefitsSection />
      
      {/* 6. Cinematic Video End */}
      <SensorySection />
      
      {/* 7. Footer */}
      <Footer />
    </main>
  );
}