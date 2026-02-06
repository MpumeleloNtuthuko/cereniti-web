"use client";

import { useState } from "react";
import { updateTeamSize } from "@/features/admin/booking-actions";
import { Button } from "@/components/ui/button";
import { Users, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function TeamConfig({ bookingId, currentSize, status }: { bookingId: string, currentSize: number, status: string }) {
  const [size, setSize] = useState(currentSize || 1);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newSize: number) => {
    if (newSize < 1) return;
    setSize(newSize);
    setIsLoading(true);
    
    // Auto-save on change
    const res = await updateTeamSize(bookingId, newSize);
    setIsLoading(false);
    
    if (res.success) {
      toast.success("Team size updated");
    } else {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-cereniti-200 shadow-sm">
      <h3 className="font-serif text-lg text-cereniti-900 mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-olive-600" /> Team Configuration
      </h3>
      
      <div className="flex items-center justify-between">
        <div>
           <p className="text-xs uppercase text-cereniti-400 tracking-wider">Required Specialists</p>
           <p className="text-sm text-cereniti-500 mt-1">
             {status === 'requested' ? "Set requirement before broadcast." : "Live Requirement"}
           </p>
        </div>

        <div className="flex items-center gap-3 bg-cereniti-50 p-2 rounded-lg border border-cereniti-100">
          <button 
            onClick={() => handleUpdate(size - 1)}
            disabled={isLoading || size <= 1 || status === 'completed'}
            className="h-8 w-8 flex items-center justify-center bg-white border border-cereniti-200 rounded hover:bg-cereniti-100 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="font-bold font-mono w-4 text-center">
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : size}
          </span>
          
          <button 
            onClick={() => handleUpdate(size + 1)}
            disabled={isLoading || status === 'completed'}
            className="h-8 w-8 flex items-center justify-center bg-white border border-cereniti-200 rounded hover:bg-cereniti-100 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}