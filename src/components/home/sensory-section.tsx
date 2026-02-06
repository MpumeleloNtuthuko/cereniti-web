"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function SensorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Force video playback on mount (Fixes "Not Playing" issues)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[110vh] overflow-hidden flex items-center justify-center bg-cereniti-900">
      
      {/* 1. THE CINEMATIC VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cereniti-900/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-noise opacity-20 z-20 mix-blend-overlay" />
        
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline // CRITICAL FOR IOS
          preload="auto"
          className="h-full w-full object-cover scale-110"
        >
          {/* LOCAL FILE REFERENCE */}
          <source src="/home/sensory.mp4" type="video/mp4" />
          
          {/* Fallback Image if video breaks */}
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070" 
            alt="Sensory Texture" 
            className="h-full w-full object-cover"
          />
        </video>
      </div>

      {/* 2. THE EDITORIAL CONTENT LAYER */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-30 container mx-auto px-6 text-center"
      >
        <div className="flex flex-col items-center">
          
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8 }}
             className="mb-8"
          >
            {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 shadow-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-olive-500 animate-pulse" />
              Sensory Architecture
            </span> */}
          </motion.div>

          <h2 className="max-w-5xl font-serif text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] text-white drop-shadow-2xl">
            Silence <br />
            <span className="italic font-light text-white/60">has a scent.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl text-left border-t border-white/10 pt-12">
             <div className="space-y-4">
               <h4 className="text-white font-serif text-xl">The Olfactory Void</h4>
               <p className="text-white/60 text-sm leading-7 font-light">
                 We rejected the industry standard of "Lemon Fresh" and "Pine." 
                 These are masks for uncleanliness. Cereniti uses proprietary 
                 <strong> bio-enzymatic formulas</strong> that neutralize odor at the molecular level.
               </p>
             </div>
             <div className="space-y-4">
               <h4 className="text-white font-serif text-xl">The Auditory Void</h4>
               <p className="text-white/60 text-sm leading-7 font-light">
                 Our equipment is selected for decibel suppression. We operate in the background, 
                 a presence felt but rarely heard. We restore your home to a frequency of 
                 <strong> absolute zero</strong>.
               </p>
             </div>
          </div>

        </div>
      </motion.div>

      {/* 3. SOUND TOGGLE */}
      <div className="absolute bottom-12 right-12 z-40">
        <button
          onClick={toggleAudio}
          className="group flex items-center justify-center h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-cereniti-900 transition-all duration-500"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cereniti-900 to-transparent z-20" />

    </section>
  );
}