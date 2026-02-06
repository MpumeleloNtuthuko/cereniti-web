"use client";

import { useState } from "react";
import { broadcastBooking } from "@/features/admin/booking-actions";
import { Button } from "@/components/ui/button";
import { RadioTower, Users, Check, Clock, AlertCircle, ShieldCheck, Loader2 } from "lucide-react";

interface BroadcastPanelProps {
  bookingId: string;
  bookingStatus: string;
  specialistsNeeded: number;
  broadcasts: any[];
}

export function BroadcastPanel({ bookingId, bookingStatus, specialistsNeeded, broadcasts }: BroadcastPanelProps) {
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // 1. Calculate Team State
  const acceptedBroadcasts = broadcasts.filter(b => b.status === 'accepted');
  const pendingBroadcasts = broadcasts.filter(b => b.status === 'sent');
  
  const filledCount = acceptedBroadcasts.length;
  const neededCount = specialistsNeeded || 1; // Default to 1 if null
  const isFullyStaffed = filledCount >= neededCount;
  const remainingSlots = neededCount - filledCount;

  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    const res = await broadcastBooking(bookingId);
    setIsBroadcasting(false);
    if (!res.success) alert(res.message);
  };

  // --- STATE 1: FULLY STAFFED ---
  if (isFullyStaffed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-emerald-800 font-bold flex items-center gap-2">
            <Check className="h-5 w-5" /> Deployment Complete
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase">
            Team Locked
          </span>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs text-emerald-600 uppercase tracking-widest font-bold">Assigned Team</p>
          {acceptedBroadcasts.map((b) => (
             <div key={b.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-emerald-100">
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                   {b.contractor?.profiles?.full_name?.[0] || "S"}
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-900">{b.contractor?.profiles?.full_name}</p>
                   <p className="text-[10px] text-gray-500 uppercase">Specialist Verified</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  // --- STATE 2: BROADCASTING / PARTIAL FILL ---
  return (
    <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-cereniti-50 px-6 py-4 border-b border-cereniti-200 flex justify-between items-center">
        <h3 className="font-serif text-lg text-cereniti-900 flex items-center gap-2">
          <RadioTower className="h-4 w-4 text-olive-600" /> Deployment Signal
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-xs text-cereniti-500 font-medium">
             Capacity: <span className="font-bold text-cereniti-900">{filledCount} / {neededCount}</span>
           </span>
           {/* Visual Dots for Capacity */}
           <div className="flex gap-1">
              {[...Array(neededCount)].map((_, i) => (
                 <div key={i} className={`h-2 w-2 rounded-full ${i < filledCount ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              ))}
           </div>
        </div>
      </div>

      <div className="p-6">
        
        {/* A. If Locked (Requested state) */}
        {bookingStatus === 'requested' ? (
          <div className="text-center space-y-3 py-2">
            <div className="inline-flex items-center justify-center p-2 bg-amber-100 text-amber-600 rounded-full mb-2">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-cereniti-900">Broadcast Locked</p>
            <p className="text-xs text-cereniti-500 max-w-xs mx-auto">
              Confirm the booking to enable broadcasting.
            </p>
          </div>
        ) : (
          
          /* B. Broadcasting Interface */
          <div className="space-y-6">
            
            {/* Show Accepted Specialists (If any) */}
            {filledCount > 0 && (
               <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Joined the Team</p>
                  {acceptedBroadcasts.map((b) => (
                     <div key={b.id} className="flex items-center gap-2 text-sm text-cereniti-700 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        {b.contractor?.profiles?.full_name} has accepted.
                     </div>
                  ))}
               </div>
            )}

            {/* Waiting Message */}
            {broadcasts.length > 0 ? (
               <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 items-start animate-pulse">
                  <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-sm font-bold text-amber-800">
                        Waiting for {remainingSlots} more Specialist{remainingSlots > 1 ? 's' : ''}...
                     </p>
                     <p className="text-xs text-amber-700 mt-1">
                        Signal currently active on {pendingBroadcasts.length} devices.
                     </p>
                  </div>
               </div>
            ) : (
               <div className="text-center text-sm text-cereniti-500">
                  Ready to deploy. Notify active specialists.
               </div>
            )}

            {/* Action Button */}
            {/* Only show if we haven't broadcasted yet OR if we want to re-broadcast (optional) */}
            {broadcasts.length === 0 && (
                <Button 
                  onClick={handleBroadcast} 
                  disabled={isBroadcasting}
                  className="bg-cereniti-900 text-white hover:bg-olive-900 w-full h-12"
                >
                  {isBroadcasting ? <Loader2 className="animate-spin mr-2"/> : <RadioTower className="mr-2 h-4 w-4" />}
                  {isBroadcasting ? "Sending Signal..." : `Broadcast to Guild (${neededCount} Needed)`}
                </Button>
            )}

          </div>
        )}
      </div>
    </div>
  );
}