"use client";

import { useState } from "react";
import { cancelBooking } from "@/features/client/actions";
import { calculateCancellation } from "@/lib/logic/refunds";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

// Helper formatter
const formatMoney = (amount: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);

interface Props {
  bookingId: string;
  status: string;
  scheduledDate: string;
  totalPrice: number;
}

export function ClientBookingActions({ bookingId, status, scheduledDate, totalPrice }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Live Calculation (Pass Status)
  const calculation = calculateCancellation(totalPrice, scheduledDate, status);
  const isFree = calculation.penaltyAmount === 0;

  const handleCancel = async () => {
    setIsLoading(true);
    const res = await cancelBooking(bookingId);
    setIsLoading(false);
    setShowConfirm(false);

    if (res.success) {
      toast.success("Cancelled Successfully", { description: res.message });
    } else {
      toast.error("Error", { description: res.message });
    }
  };

  if (status === 'in_progress') {
    return <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">In Progress</span>;
  }

  if (status === 'completed' || status === 'cancelled') {
    return null; 
  }

  return (
    <>
      <Button 
         variant="ghost" 
         onClick={() => setShowConfirm(true)}
         className="text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-bold uppercase tracking-wider"
      >
        Cancel Booking
      </Button>

      {/* CONFIRM MODAL */}
      <AlertDialog.Root open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-cereniti-900/60 backdrop-blur-md z-[100] animate-in fade-in" />
          <AlertDialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-8 shadow-2xl animate-in zoom-in-95 border border-cereniti-100">
            
            <div className="text-center mb-6">
               <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isFree ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {isFree ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
               </div>
               <AlertDialog.Title className="text-xl font-serif font-bold text-cereniti-900">
                 {isFree ? "Cancel Request?" : "Cancellation Policy"}
               </AlertDialog.Title>
            </div>

            {/* FINANCIAL BREAKDOWN */}
            <div className={`rounded-lg p-4 mb-6 border ${isFree ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
               <div className="flex justify-between text-sm mb-2 text-cereniti-600">
                  <span>Job Value</span>
                  <span>{formatMoney(totalPrice)}</span>
               </div>
               
               {!isFree && (
                 <div className="flex justify-between text-sm mb-2 text-red-600 font-medium">
                    <span>Fee ({calculation.penaltyPercentage * 100}%)</span>
                    <span>- {formatMoney(calculation.penaltyAmount)}</span>
                 </div>
               )}
               
               <div className="h-px bg-black/5 my-2" />
               
               <div className="flex justify-between text-lg font-bold text-cereniti-900">
                  <span>Refund Total</span>
                  <span className={isFree ? "text-emerald-700" : "text-cereniti-900"}>{formatMoney(calculation.refundAmount)}</span>
               </div>
               
               <p className={`text-[10px] mt-2 text-center uppercase tracking-widest ${isFree ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isFree ? "Full Refund • No Penalty" : `Reason: ${calculation.tierName}`}
               </p>
            </div>

            <AlertDialog.Description className="text-xs text-cereniti-500 text-center mb-6 leading-relaxed">
               Refunds are processed to your original payment method within 5-7 business days. 
               This action cannot be undone.
            </AlertDialog.Description>

            <div className="flex gap-3">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" className="flex-1 border-cereniti-200">Keep Job</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button 
                  onClick={(e) => { e.preventDefault(); handleCancel(); }}
                  disabled={isLoading} 
                  className={isFree ? "flex-1 bg-cereniti-900 hover:bg-olive-900 text-white" : "flex-1 bg-red-600 hover:bg-red-700 text-white"}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : "Confirm Cancel"}
                </Button>
              </AlertDialog.Action>
            </div>

          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
}