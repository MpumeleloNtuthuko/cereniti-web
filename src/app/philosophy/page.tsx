"use client";

import { useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-provider"; // <--- Import Auth Hook
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote, Fingerprint, Microscope, Users, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PhilosophyPage() {
  // We get the logged-in user from the client-side context
  const { user } = useAuth();

  return (
    <main className="bg-cereniti-50 min-h-screen selection:bg-olive-900 selection:text-white">
      
      {/* 1. NAVBAR (Pass the user object so 'Member Login' works) */}
      <Navbar user={user} />

      {/* 2. PAGE SECTIONS */}
      <HeroSection />
      <ManifestoSection />
      <TheGuildSection />
      <TheScienceSection />
      <ClosingSection />
      
      {/* 3. FOOTER */}
      <Footer />
    </main>
  );
}

// --- SECTIONS ---

function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cereniti-50/60 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cereniti-50/20 to-cereniti-50 z-10" />
        <video 
          autoPlay muted loop playsInline 
          className="h-full w-full object-cover opacity-60"
        >
          <source src="/philosophy/curtains.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cereniti-500 block mb-6">
            The Philosophy
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-cereniti-900 leading-[0.95]">
            We do not clean. <br />
            <span className="italic text-olive-600">We restore.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-cereniti-600 font-serif max-w-2xl mx-auto leading-relaxed">
            Chaos in the home is chaos in the mind. Cereniti exists to eliminate the visual noise of modern life, returning your environment to a state of neutral calm.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ManifestoSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} className="py-24 lg:py-40 px-6 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl text-cereniti-900">The Architecture <br/> of Calm.</h2>
            <p className="text-cereniti-600 text-lg leading-relaxed">
              We believe that your physical environment is the scaffold of your emotional well-being. When a space is cluttered, the mind is frantic. When a space is pure, the mind is free.
            </p>
            <p className="text-cereniti-600 text-lg leading-relaxed">
              Our service is not a transaction of labor; it is a <strong>transfer of energy</strong>. We absorb the entropy of your home so you don&apos;t have to.
            </p>
          </div>

          <div className="pl-8 border-l-2 border-olive-500">
            <Quote className="h-8 w-8 text-olive-300 mb-4" />
            <p className="font-serif text-2xl text-cereniti-800 italic leading-normal">
              &quot;Luxury is not about adding more. It is about the discipline of taking away.&quot;
            </p>
          </div>
        </div>

        <div className="relative">
           <motion.div style={{ y }} className="relative z-10 aspect-[4/5] overflow-hidden rounded-sm">
             <Image 
               src="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=1760" 
               alt="Calm Interior"
               fill
               className="object-cover"
             />
           </motion.div>
           <div className="absolute -bottom-10 -left-10 w-full h-full border border-cereniti-200 z-0 hidden lg:block" />
        </div>

      </div>
    </section>
  );
}

function TheGuildSection() {
  return (
    <section className="bg-cereniti-900 text-cereniti-50 py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
         <video autoPlay muted loop playsInline className="h-full w-full object-cover grayscale">
            <source src="/philosophy/hands.mp4" type="video/mp4" />
         </video>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-cereniti-700 bg-cereniti-800/50 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-olive-300">
            <Users className="h-3 w-3" /> The Human Standard
          </div>
          
          <h2 className="font-serif text-5xl md:text-6xl text-white">
            Dignity in every detail.
          </h2>
          
          <p className="text-cereniti-300 text-lg leading-relaxed">
            In South Africa, the domestic cleaning industry has historically been defined by invisibility and undervaluation. Cereniti rejects this legacy.
          </p>
          
          <p className="text-cereniti-300 text-lg leading-relaxed">
            We are building a <strong>Guild of Specialists</strong>. Our partners are vetted professionals, uniformed in tailored attire, equipped with premium tools, and compensated above market rates. We trade in respect. When you book Cereniti, you are investing in an ecosystem of dignity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
           {[
             { title: "Vetting", icon: Fingerprint, text: "Criminal checks, psychometric evaluation, and practical exams." },
             { title: "Equipment", icon: Microscope, text: "Italian-made machinery and proprietary chemistry supplied by us." },
             { title: "Fair Trade", icon: HeartHandshake, text: "Commission structures that reward excellence, not hours." }
           ].map((item, i) => (
             <div key={i} className="bg-cereniti-800/50 backdrop-blur-sm p-8 rounded-xl border border-cereniti-700 hover:border-olive-500 transition-colors group">
               <item.icon className="h-8 w-8 text-cereniti-400 mb-6 group-hover:text-olive-400 transition-colors" />
               <h3 className="font-serif text-xl text-white mb-3">{item.title}</h3>
               <p className="text-cereniti-400 text-sm leading-relaxed">{item.text}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}

function TheScienceSection() {
  return (
    <section className="py-32 px-6 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        <div className="lg:col-span-5 order-2 lg:order-1 relative aspect-square">
           <Image 
             src="/philosophy/texture.jpg" 
             alt="Marble Texture"
             fill
             className="object-cover rounded-full"
           />
           <div className="absolute inset-0 rounded-full border-2 border-cereniti-200 scale-110 opacity-50" />
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-cereniti-500 mb-6">
             Methodology
           </span>
           <h2 className="font-serif text-4xl md:text-5xl text-cereniti-900 mb-8">
             The Science of <br/> Neutrality.
           </h2>
           
           <div className="space-y-8">
             <div className="flex gap-6">
               <span className="text-4xl font-serif text-olive-200">01</span>
               <div>
                 <h4 className="font-bold text-cereniti-900 uppercase tracking-wide text-sm">Olfactory Zero</h4>
                 <p className="text-cereniti-600 mt-2 text-sm leading-relaxed">
                   We do not mask odors with &quot;Spring Meadow&quot; sprays. We use bio-enzymes to neutralize bacteria at the source. The smell of a Cereniti home is the smell of nothing.
                 </p>
               </div>
             </div>

             <div className="flex gap-6">
               <span className="text-4xl font-serif text-olive-200">02</span>
               <div>
                 <h4 className="font-bold text-cereniti-900 uppercase tracking-wide text-sm">pH Balance</h4>
                 <p className="text-cereniti-600 mt-2 text-sm leading-relaxed">
                   Your Carrara marble and untreated oak require specific chemistry. We carry 7 distinct cleaning agents to ensure your luxury finishes are preserved, not just wiped.
                 </p>
               </div>
             </div>

             <div className="flex gap-6">
               <span className="text-4xl font-serif text-olive-200">03</span>
               <div>
                 <h4 className="font-bold text-cereniti-900 uppercase tracking-wide text-sm">Visual Silence</h4>
                 <p className="text-cereniti-600 mt-2 text-sm leading-relaxed">
                   We align knick-knacks at 90-degree angles. We fluff pillows to hotel standards. We reduce visual noise to create mental bandwidth.
                 </p>
               </div>
             </div>
           </div>
        </div>

      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="py-32 bg-cereniti-100 text-center px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="font-serif text-4xl md:text-6xl text-cereniti-900">
          Experience the <br/> Difference.
        </h2>
        <p className="text-cereniti-600 leading-relaxed">
          Cereniti is an invitation to live differently. To reclaim your time, your space, and your peace of mind.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/book">
            <Button className="bg-cereniti-900 text-white hover:bg-olive-900 h-14 px-8 rounded-none text-base w-full sm:w-auto">
              Book a Reset
            </Button>
          </Link>
          <Link href="/contractor/join">
            <Button variant="outline" className="border-cereniti-900 text-cereniti-900 hover:bg-white h-14 px-8 rounded-none text-base w-full sm:w-auto">
              Join the Guild
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}