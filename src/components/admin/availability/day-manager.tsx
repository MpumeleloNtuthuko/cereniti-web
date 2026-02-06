"use client";

import { useState } from "react";
import { addBlock, removeBlock } from "@/features/admin/availability-actions";
import { Button } from "@/components/ui/button";
import { X, Clock, Trash2, ShieldAlert, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DayManagerProps {
  date: Date;
  blocks: any[]; // Existing blocks for this day
  onClose: () => void;
}

export function DayManager({ date, blocks, onClose }: DayManagerProps) {
  const [mode, setMode] = useState<'view' | 'add'>('view');
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to format date for DB
  const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD local time

  const handleAddFullDay = async () => {
    setIsSubmitting(true);
    const res = await addBlock(dateStr, undefined, undefined, "Full Day Closure");
    setIsSubmitting(false);
    if (res.success) {
       toast.success("Full Day Blocked");
       onClose(); // Close to refresh
    } else {
       toast.error(res.message);
    }
  };

  const handleAddTimeBlock = async () => {
    setIsSubmitting(true);
    const res = await addBlock(dateStr, startTime, endTime, reason || "Time Block");
    setIsSubmitting(false);
    if (res.success) {
       toast.success("Time Slot Blocked");
       setMode('view');
       onClose();
    } else {
       toast.error(res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Remove this block?")) return;
    await removeBlock(id);
    toast.success("Block Removed");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cereniti-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-cereniti-200"
      >
        {/* HEADER */}
        <div className="bg-cereniti-50 px-6 py-4 border-b border-cereniti-100 flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl text-cereniti-900">{date.toDateString()}</h3>
            <p className="text-xs text-cereniti-500 uppercase tracking-wider">Availability Settings</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cereniti-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-cereniti-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          
          {/* EXISTING BLOCKS LIST */}
          <div className="space-y-3 mb-6">
            {blocks.length === 0 ? (
              <p className="text-sm text-cereniti-400 italic text-center py-4">No blocks. This day is fully open.</p>
            ) : (
              blocks.map((block) => (
                <div key={block.id} className="flex justify-between items-center p-3 rounded-lg border border-red-100 bg-red-50 text-red-700">
                   <div className="flex items-center gap-3">
                      {block.start_time ? (
                        <div className="bg-white p-1.5 rounded text-xs font-bold border border-red-100">
                          {block.start_time.slice(0,5)} - {block.end_time.slice(0,5)}
                        </div>
                      ) : (
                        <span className="text-xs font-bold uppercase bg-red-200 px-2 py-1 rounded text-red-800">Whole Day</span>
                      )}
                      <span className="text-sm">{block.reason}</span>
                   </div>
                   <button onClick={() => handleDelete(block.id)} className="text-red-400 hover:text-red-700">
                     <Trash2 className="h-4 w-4" />
                   </button>
                </div>
              ))
            )}
          </div>

          {/* ADD ACTIONS */}
          {mode === 'view' ? (
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleAddFullDay} disabled={isSubmitting} variant="outline" className="h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                 <ShieldAlert className="mr-2 h-4 w-4" /> Block Full Day
              </Button>
              <Button onClick={() => setMode('add')} className="h-12 bg-cereniti-900 text-white hover:bg-gold-600">
                 <Clock className="mr-2 h-4 w-4" /> Block Time
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-cereniti-500">From</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-cereniti-500">To</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 border rounded" />
                  </div>
               </div>
               <input 
                 placeholder="Reason (Optional)" 
                 value={reason} 
                 onChange={e => setReason(e.target.value)}
                 className="w-full p-2 border rounded text-sm"
               />
               <div className="flex gap-2 pt-2">
                 <Button onClick={() => setMode('view')} variant="ghost" className="flex-1">Cancel</Button>
                 <Button onClick={handleAddTimeBlock} disabled={isSubmitting} className="flex-1 bg-cereniti-900 text-white">Save Block</Button>
               </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}