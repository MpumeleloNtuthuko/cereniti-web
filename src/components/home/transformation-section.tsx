"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import Image from "next/image";

export function TransformationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  // Motion values for fluid physics
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 30 }); // Luxury dampening
  
  // We'll calculate the percentage of the reveal based on drag
  const widthPercentage = useTransform(springX, (value) => {
    if (!containerRef.current) return "50%";
    const width = containerRef.current.offsetWidth;
    // Clamp between 0% and 100%
    const p = Math.max(0, Math.min(100, (value / width) * 100));
    return `${p}%`;
  });

  // Handle Drag Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    x.set(offsetX);
  };
  
  // Touch support for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.touches[0].clientX - rect.left;
    x.set(offsetX);
  };

  // Set initial position to center on load
  useEffect(() => {
    if (containerRef.current) {
      x.set(containerRef.current.offsetWidth / 2);
    }
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-cereniti-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: The Narrative */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cereniti-500">
                04 — The Evidence
              </span>
              <h2 className="mt-6 font-serif text-5xl text-cereniti-900 leading-[1.1]">
                Restoring <br />
                <span className="italic text-olive-600">Equilibrium.</span>
              </h2>
            </div>
            
            <p className="text-lg text-cereniti-600 leading-relaxed font-serif">
              A clean room is not just about the absence of dirt. It is about the presence of light, the symmetry of lines, and the reset of energy.
            </p>

            <div className="border-l-2 border-cereniti-200 pl-6 space-y-4">
               <div>
                  <h4 className="font-bold text-cereniti-900 text-sm uppercase tracking-wider">Before</h4>
                  <p className="text-sm text-cereniti-500 mt-1">Lived-in texture. Visual noise. Mental clutter.</p>
               </div>
               <div>
                  <h4 className="font-bold text-cereniti-900 text-sm uppercase tracking-wider">After</h4>
                  <p className="text-sm text-cereniti-500 mt-1">Hotel-grade tension. Sensory calm. A blank canvas.</p>
               </div>
            </div>
          </div>

          {/* RIGHT: The Interactive Slider */}
          <div className="lg:col-span-7">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] rounded-sm overflow-hidden cursor-crosshair group shadow-2xl shadow-cereniti-900/10 border-4 border-white"
            >
              
              {/* IMAGE 1: THE CHAOS (Underneath) */}
              <div className="absolute inset-0">
                <Image
                   src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop"
                   alt="Before Cleaning"
                   fill
                   className="object-cover grayscale-[20%] contrast-125"
                />
                <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">
                  Life
                </div>
              </div>

              {/* IMAGE 2: THE ORDER (Overlay, masked by width) */}
              <motion.div 
                style={{ width: widthPercentage }}
                className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-white/50 bg-cereniti-900"
              >
                {/* 
                   We use a fixed width container inside the resizing container 
                   to prevent the image from squishing. 
                */}
                <div className="relative w-[200%] h-full"> 
                   {/* Note: In a real implementation, we calculate parent width precisely, 
                       but w-[200%] ensures it covers enough space for the visual trick. 
                   */}
                   <Image
                      src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop"
                      alt="After Cleaning"
                      fill
                      className="object-cover object-left" // Anchor to left
                   />
                </div>
                <div className="absolute top-6 left-6 bg-olive-900/80 backdrop-blur-md px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">
                  Sanctuary
                </div>
              </motion.div>

              {/* THE HANDLE (The Golden Thread) */}
              <motion.div 
                 style={{ left: widthPercentage }}
                 className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 flex items-center justify-center -ml-0.5 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                 <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                    <MoveHorizontal className="h-5 w-5 text-cereniti-900" />
                 </div>
              </motion.div>

            </div>
            
            <p className="text-center text-[10px] uppercase tracking-widest text-cereniti-400 mt-4">
              Drag to witness the reset
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}