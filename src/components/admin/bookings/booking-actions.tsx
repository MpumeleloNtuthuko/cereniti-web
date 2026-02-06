"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/features/admin/booking-actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Play, CheckCheck, Loader2, Ban } from "lucide-react";

interface BookingActionsProps {
  id: string;
  status: string;
}

export function BookingActions({ id, status }: BookingActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: 'confirmed' | 'completed' | 'cancelled' | 'in_progress') => {
    // Customize confirmation message based on action
    const message = newStatus === 'cancelled' 
      ? "Are you sure you want to CANCEL this job? This cannot be undone." 
      : `Are you sure you want to mark this job as ${newStatus}?`;

    if (!confirm(message)) return;
    
    setIsLoading(true);
    const result = await updateBookingStatus(id, newStatus);
    setIsLoading(false);

    if (!result.success) {
      alert(result.message);
    }
  };

  // --- 1. SPECIAL REMEDIATION VIEW (For Expired Jobs) ---
  // This status is passed virtually from the page logic when a job is detected as stale
  if (status === 'force_cancel_view') {
    return (
        <Button 
          size="sm" 
          className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
          onClick={() => handleStatusChange('cancelled')} 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <Ban className="h-3 w-3 mr-2" />}
          Force Cancel & Archive
        </Button>
    );
  }

  // --- 2. READ ONLY STATES ---
  if (status === 'cancelled') {
    return <span className="text-red-500 font-bold border border-red-200 bg-red-50 px-3 py-1 rounded text-xs">Cancelled</span>;
  }

  if (status === 'completed') {
    return <span className="text-emerald-500 font-bold border border-emerald-200 bg-emerald-50 px-3 py-1 rounded text-xs">Completed</span>;
  }

  // --- 3. ACTIVE MANAGEMENT STATES ---
  return (
    <div className="flex items-center gap-2">
      
      {/* A. REQUESTED -> CONFIRM */}
      {status === 'requested' && (
        <>
          <Button 
            size="sm" 
            onClick={() => handleStatusChange('confirmed')} 
            disabled={isLoading}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <CheckCircle className="h-3 w-3 mr-1" />}
            Confirm Job
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleStatusChange('cancelled')} 
            disabled={isLoading}
            className="text-red-500 hover:bg-red-50"
          >
            <XCircle className="h-3 w-3 mr-1" /> Decline
          </Button>
        </>
      )}

      {/* B. CONFIRMED -> IN PROGRESS */}
      {status === 'confirmed' && (
        <Button 
          size="sm" 
          onClick={() => handleStatusChange('in_progress')} 
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <Play className="h-3 w-3 mr-1" />}
          Start Job
        </Button>
      )}

      {/* C. IN PROGRESS -> COMPLETE */}
      {status === 'in_progress' && (
        <Button 
          size="sm" 
          onClick={() => handleStatusChange('completed')} 
          disabled={isLoading}
          className="bg-cereniti-900 text-white hover:bg-olive-900"
        >
          {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <CheckCheck className="h-3 w-3 mr-1" />}
          Mark Complete
        </Button>
      )}

      {/* Cancel Option for Active Jobs (Visible unless Requested/Cancelled/Completed) */}
      {status !== 'requested' && (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => handleStatusChange('cancelled')} 
          disabled={isLoading}
          className="text-cereniti-400 hover:text-red-500"
        >
          Cancel
        </Button>
      )}
    </div>
  );
}