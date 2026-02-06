"use client";

import { useState } from "react";
import { formatCurrency, calculateContractorShare } from "@/lib/logic/pricing";
import { formatDuration } from "@/lib/logic/duration"; // Ensure you export this from logic/duration.ts
import { acceptJob, declineJob } from "@/features/contractor/dashboard-actions";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Loader2, BedDouble, Bath, Users, Clock, Hourglass, Ruler } from "lucide-react";
import { toast } from "sonner";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";

interface JobCardProps {
  broadcastId: string;
  booking: any;
  acceptedCount: number;
}

export function JobCard({ broadcastId, booking, acceptedCount }: JobCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);

  // Team Logic
  const needed = booking.specialists_needed || 1;
  const isFull = acceptedCount >= needed;

  // Earnings Logic
  const estimatedEarnings = calculateContractorShare(booking.total_price, needed);
  
  // Time Formatting
  const startTime = booking.start_time ? booking.start_time.slice(0, 5) : "TBD";

  const handleAction = async () => {
    if (!actionType) return;
    setIsLoading(true);

    try {
      if (actionType === 'accept') {
        const res = await acceptJob(broadcastId, booking.id);
        if (res.success) {
          toast.success("Job Accepted Successfully", { description: "It has been added to your schedule." });
        } else {
          toast.error("Could not accept job", { description: res.message });
        }
      } else {
        const res = await declineJob(broadcastId);
        if (res.success) {
           toast.info("Job Declined", { description: "We will look for other opportunities." });
        } else {
           toast.error("Error", { description: res.message });
        }
      }
    } catch (e) {
      toast.error("Network Error");
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <>
      <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        {/* Header - EARNINGS ONLY */}
        <div className="bg-cereniti-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-gold-600 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-cereniti-400">Potential Earnings</p>
              <p className="font-bold font-serif text-xl" suppressHydrationWarning>
                {formatCurrency(estimatedEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="font-serif text-xl text-cereniti-900">{booking.service?.title}</h3>
            <p className="text-sm text-cereniti-500 mt-1">{booking.service?.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-cereniti-50 p-4 rounded-lg border border-cereniti-100">
            {/* DATE */}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-gold-600 mt-0.5" />
              <div>
                <p className="font-bold text-cereniti-900" suppressHydrationWarning>{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                <p className="text-[10px] text-cereniti-500 capitalize">{booking.frequency?.replace("-", " ") || "One time"}</p>
              </div>
            </div>

            {/* TIME */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gold-600 mt-0.5" />
              <div>
                <p className="font-bold text-cereniti-900">{startTime}</p>
                <p className="text-[10px] text-cereniti-500 flex items-center gap-1">
                   <Hourglass className="h-3 w-3" /> {formatDuration(booking.estimated_duration || 0)}
                </p>
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-2 col-span-2 border-t border-cereniti-200 pt-3 mt-1">
              <MapPin className="h-4 w-4 text-gold-600 mt-0.5" />
              <div>
                <p className="font-bold text-cereniti-900">{booking.property?.estate_name || "Paarl"}</p>
                <p className="text-[10px] text-cereniti-500 line-clamp-1">{booking.property?.address}</p>
              </div>
            </div>
            
            {/* METRICS ROW */}
            <div className="flex items-center gap-2 col-span-2 pt-1">
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-cereniti-100 text-xs text-cereniti-600">
                   <BedDouble className="h-3 w-3" /> {booking.property?.bedrooms || 0}
                </div>
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-cereniti-100 text-xs text-cereniti-600">
                   <Bath className="h-3 w-3" /> {booking.property?.bathrooms || 0}
                </div>
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-cereniti-100 text-xs text-cereniti-600">
                   <Ruler className="h-3 w-3" /> {booking.estimated_sqm || 0}m²
                </div>
            </div>
          </div>
          
          {/* Team Status Indicator */}
          {needed > 1 && (
             <div className="pt-2 flex justify-between items-center border-t border-cereniti-100">
                <div className="flex items-center gap-2 text-xs font-bold text-cereniti-500 uppercase tracking-widest">
                   <Users className="h-3 w-3" /> Team Slots
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex gap-1">
                      {[...Array(needed)].map((_, i) => (
                         <div key={i} className={cn(
                            "h-2 w-6 rounded-full transition-colors",
                            i < acceptedCount ? "bg-red-400" : "bg-emerald-400"
                         )} />
                      ))}
                   </div>
                   <span className="text-xs font-mono text-cereniti-900 font-medium">
                     {acceptedCount}/{needed} Filled
                   </span>
                </div>
             </div>
          )}

          {booking.special_requests && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <p className="text-[10px] font-bold text-yellow-700 uppercase mb-1">Notes</p>
              <p className="text-xs text-yellow-800 line-clamp-2">{booking.special_requests}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cereniti-100 flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setActionType('decline')}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Decline
          </Button>
          <Button 
            onClick={() => setActionType('accept')} 
            disabled={isFull}
            className={cn("flex-[2] text-white shadow-md hover:shadow-lg transition-all", isFull ? "bg-gray-400 cursor-not-allowed" : "bg-gold-600 hover:bg-gold-700")}
          >
            {isFull ? "Slots Full" : "Accept Job"}
          </Button>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <AlertDialog.Root open={!!actionType} onOpenChange={() => !isLoading && setActionType(null)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-cereniti-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="mb-4">
              <AlertDialog.Title asChild>
                <h3 className="text-lg font-serif font-bold text-cereniti-900">
                  {actionType === 'accept' ? 'Confirm Deployment' : 'Decline Opportunity'}
                </h3>
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-cereniti-500 mt-2">
                {actionType === 'accept' 
                  ? "By accepting, you commit to arriving on time with your kit. This job will be locked to your schedule."
                  : "Are you sure? This opportunity will be removed from your board immediately."
                }
              </AlertDialog.Description>
            </div>

            <div className="flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <Button variant="ghost" disabled={isLoading}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button 
                  onClick={(e) => { e.preventDefault(); handleAction(); }}
                  disabled={isLoading}
                  className={actionType === 'accept' ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (actionType === 'accept' ? "Confirm Acceptance" : "Confirm Decline")}
                </Button>
              </AlertDialog.Action>
            </div>

          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}