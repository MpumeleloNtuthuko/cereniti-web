"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Sparkles, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LivePulse({ bookingId }: { bookingId: string }) {
  const [milestones, setMilestones] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 1. Initial Fetch
    const fetchMilestones = async () => {
      const { data } = await supabase
        .from("job_milestones")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });
      if (data) setMilestones(data);
    };

    fetchMilestones();

    // 2. Realtime Subscription
    const channel = supabase
      .channel(`job-${bookingId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'job_milestones', 
        filter: `booking_id=eq.${bookingId}` 
      }, (payload) => {
        // Update local state instantly when Contractor ticks a box
        setMilestones(current => 
          current.map(m => m.id === payload.new.id ? payload.new : m)
        );
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [bookingId, supabase]);

  // --- CALCULATE GLOBAL PROGRESS ---
  // Flatten all tasks to count total ticks
  const allTasks = milestones.flatMap(m => m.tasks || []);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t: any) => t.completed).length;
  const globalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white border border-cereniti-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
      
      {/* Background Texture for Premium Feel */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
         <Sparkles className="h-48 w-48 text-gold-500" />
      </div>

      {/* HEADER */}
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div>
             <div className="flex items-center gap-2 mb-1">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </span>
               <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Live Connection</span>
             </div>
             <h2 className="font-serif text-3xl text-cereniti-900">Restoration in Progress</h2>
          </div>
          <div className="text-right">
             <span className="text-5xl font-serif text-cereniti-900">{globalProgress}%</span>
          </div>
        </div>

        {/* MASTER PROGRESS BAR */}
        <div className="h-1.5 w-full bg-cereniti-100 rounded-full mb-12 overflow-hidden">
          <motion.div 
             className="h-full bg-cereniti-900" 
             initial={{ width: 0 }} 
             animate={{ width: `${globalProgress}%` }} 
             transition={{ type: "spring", stiffness: 50 }}
          />
        </div>

        {/* TIMELINE FEED */}
        <div className="space-y-0 relative border-l-2 border-cereniti-100 ml-3 pl-8 pb-4">
          
          {milestones.length === 0 && (
            <div className="flex items-center gap-2 text-cereniti-400 italic">
               <Loader2 className="h-4 w-4 animate-spin" /> Specialist is initializing the protocol...
            </div>
          )}

          {milestones.map((step) => {
             const isZoneComplete = step.status === 'completed';
             const isZoneActive = step.status === 'in_progress';
             const tasks = step.tasks || [];
             
             // Filter tasks to show: All completed, plus the current active one
             // We don't want to show 20 unchecked boxes, just the relevant ones.
             const visibleTasks = isZoneComplete ? [] : tasks; 

             return (
              <div key={step.id} className="relative mb-10 last:mb-0">
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute -left-[43px] top-1 h-7 w-7 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-500 z-20",
                  isZoneComplete ? "border-emerald-500 text-emerald-500" : 
                  isZoneActive ? "border-gold-500 text-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-cereniti-200 text-cereniti-200"
                )}>
                  {isZoneComplete ? <CheckCircle2 className="h-4 w-4" /> : 
                   isZoneActive ? <div className="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse" /> :
                   <div className="h-2 w-2 rounded-full bg-cereniti-200" />}
                </div>

                {/* Zone Content */}
                <div className={cn("transition-opacity duration-500", step.status === 'pending' ? "opacity-30" : "opacity-100")}>
                  <h4 className={cn(
                    "font-serif text-lg transition-colors",
                    isZoneComplete ? "text-emerald-800 line-through decoration-emerald-200" : 
                    isZoneActive ? "text-cereniti-900 font-bold" : "text-cereniti-400"
                  )}>
                    {step.zone_name}
                  </h4>
                  
                  {/* COMPLETED ZONE STATE */}
                  {isZoneComplete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1">
                       <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                         Restored • {new Date(step.completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                    </motion.div>
                  )}

                  {/* ACTIVE ZONE TASKS LIST */}
                  <AnimatePresence>
                    {isZoneActive && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        className="mt-4 space-y-3"
                      >
                        {tasks.map((task: any, i: number) => (
                           <div key={i} className="flex items-center gap-3 text-sm">
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
                                task.completed ? "bg-gold-500 border-gold-500" : "border-cereniti-300"
                              )}>
                                 {task.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                              </div>
                              <span className={cn(
                                "transition-all duration-300",
                                task.completed ? "text-cereniti-400 line-through" : "text-cereniti-700"
                              )}>
                                {task.label}
                              </span>
                           </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}