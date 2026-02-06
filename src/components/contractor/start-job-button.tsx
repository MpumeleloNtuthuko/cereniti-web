"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startJobSequence } from "@/features/contractor/milestone-actions"; // Ensure this action exists from Phase 2
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StartJobButtonProps {
  bookingId: string;
  serviceTitle: string;
}

export function StartJobButton({ bookingId, serviceTitle }: StartJobButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!confirm("Are you at the property and ready to begin?")) return;
    
    setIsLoading(true);
    try {
      // 1. Initialize DB rows
      const res = await startJobSequence(bookingId, serviceTitle);
      
      if (res.success) {
        // 2. Redirect to the Active Mode Page
        router.push(`/contractor/active/${bookingId}`);
      } else {
        toast.error(res.message);
        setIsLoading(false);
      }
    } catch (e) {
      toast.error("Network Error");
      setIsLoading(false);
    }
  };

  return (
    <Button 
      size="sm" 
      onClick={handleStart} 
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
    >
      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 mr-1" />}
      Start Job
    </Button>
  );
}