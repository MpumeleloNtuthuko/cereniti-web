"use client";

import { useState } from "react";
import { updateMilestoneTask } from "@/features/contractor/milestone-actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, Circle, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function ActiveJobMode({ milestones }: { milestones: any[] }) {
  // Sort by created_at to keep flow logical
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Determine which is the "Current" active step (first incomplete one)
  const currentActiveIndex = sortedMilestones.findIndex(m => m.status !== 'completed');
  const activeIdInitial = currentActiveIndex !== -1 ? sortedMilestones[currentActiveIndex].id : null;

  const [expandedId, setExpandedId] = useState<string | null>(activeIdInitial);
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  const handleToggle = async (milestoneId: string, taskLabel: string, currentVal: boolean, allTasks: any[]) => {
    setLoadingTask(`${milestoneId}-${taskLabel}`);
    
    // Optimistic Update could go here, but for safety we await server
    const res = await updateMilestoneTask(milestoneId, taskLabel, !currentVal, allTasks);
    
    setLoadingTask(null);
    if (!res.success) toast.error("Failed to update");
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* HEADER CARD */}
      <div className="bg-cereniti-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Camera className="h-24 w-24" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-gold-500 mb-1">Live Protocol</p>
          <h2 className="font-serif text-2xl">Cereniti Standard</h2>
          <p className="text-cereniti-400 text-xs mt-2">
            {sortedMilestones.filter(m => m.status === 'completed').length} of {sortedMilestones.length} Zones Restored
          </p>
        </div>
        {/* Progress Bar */}
        <div className="mt-6 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold-500 transition-all duration-700" 
            style={{ width: `${(sortedMilestones.filter(m => m.status === 'completed').length / sortedMilestones.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ACCORDION LIST */}
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => {
          const isCompleted = milestone.status === 'completed';
          const isExpanded = expandedId === milestone.id;
          const tasks = milestone.tasks || [];

          return (
            <div 
              key={milestone.id}
              className={cn(
                "border rounded-xl transition-all duration-300 overflow-hidden bg-white",
                isCompleted ? "border-emerald-100 opacity-60" : "border-cereniti-200 shadow-sm",
                isExpanded && !isCompleted ? "ring-1 ring-cereniti-900" : ""
              )}
            >
              {/* HEADER */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                className="p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                    isCompleted ? "bg-emerald-100 text-emerald-600" : 
                    milestone.progress > 0 ? "bg-gold-100 text-gold-600" : "bg-cereniti-50 text-cereniti-300"
                  )}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : 
                     <span className="text-xs font-bold font-mono">{index + 1}</span>
                    }
                  </div>
                  
                  <div>
                    <h3 className={cn("font-medium text-sm", isCompleted ? "text-cereniti-400 line-through" : "text-cereniti-900")}>
                      {milestone.zone_name}
                    </h3>
                    {!isCompleted && (
                      <p className="text-[10px] text-cereniti-500 uppercase tracking-wider">
                        {milestone.progress}% Complete
                      </p>
                    )}
                  </div>
                </div>

                <ChevronDown className={cn("h-4 w-4 text-cereniti-400 transition-transform", isExpanded ? "rotate-180" : "")} />
              </div>

              {/* TASKS BODY */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: "auto" }} 
                    exit={{ height: 0 }} 
                    className="overflow-hidden bg-cereniti-50/50 border-t border-cereniti-100"
                  >
                    <div className="p-4 space-y-3">
                      {tasks.map((task: any, i: number) => (
                        <div 
                          key={i}
                          onClick={() => handleToggle(milestone.id, task.label, task.completed, tasks)}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all active:scale-[0.98]",
                            task.completed ? "bg-emerald-50/50" : "bg-white border border-cereniti-100 hover:border-cereniti-300"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                            task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-cereniti-300 bg-white"
                          )}>
                             {loadingTask === `${milestone.id}-${task.label}` ? (
                               <Loader2 className="h-3 w-3 animate-spin" />
                             ) : task.completed && (
                               <CheckCircle className="h-3.5 w-3.5" />
                             )}
                          </div>
                          <p className={cn(
                            "text-sm leading-tight transition-colors select-none",
                            task.completed ? "text-emerald-700 line-through decoration-emerald-300" : "text-cereniti-700"
                          )}>
                            {task.label}
                          </p>
                        </div>
                      ))}
                      
                      {/* Photo Upload Prompt */}
                      {milestone.progress === 100 && !isCompleted && (
                         <div className="mt-6 p-4 bg-cereniti-900 rounded-lg text-center text-white">
                            <p className="text-xs font-bold uppercase mb-2">Zone Finished</p>
                            <Button className="w-full bg-gold-600 hover:bg-gold-700 text-black h-10 text-xs">
                               <Camera className="mr-2 h-4 w-4" /> Upload Verification Photo
                            </Button>
                         </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}