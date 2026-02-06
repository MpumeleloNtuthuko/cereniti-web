"use client";

import { useState } from "react";
import { updateTicketStatus, resolveTicket } from "@/features/admin/incident-actions";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Search, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TicketManagerProps {
  id: string;
  status: string;
  existingResponse?: string | null;
}

export function TicketManager({ id, status, existingResponse }: TicketManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState(existingResponse || "");
  const [isEditing, setIsEditing] = useState(!existingResponse && status !== 'resolved');

  const handleStatusChange = async (newStatus: 'investigating' | 'open') => {
    setIsLoading(true);
    const res = await updateTicketStatus(id, newStatus);
    setIsLoading(false);
    if (res.success) toast.success(`Status updated to ${newStatus}`);
    else toast.error(res.message);
  };

  const handleResolve = async () => {
    if (!responseText.trim()) {
      toast.error("Please provide a response before resolving.");
      return;
    }
    if (!confirm("Are you sure you want to resolve and close this ticket?")) return;

    setIsLoading(true);
    const res = await resolveTicket(id, responseText);
    setIsLoading(false);
    
    if (res.success) {
      toast.success("Ticket Resolved");
      setIsEditing(false);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="bg-white border border-cereniti-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-serif text-lg text-cereniti-900 mb-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-olive-600" /> Admin Response
      </h3>

      {/* READ ONLY VIEW (If resolved) */}
      {!isEditing ? (
        <div className="space-y-4">
          <div className="bg-cereniti-50 p-4 rounded-lg border border-cereniti-100 text-sm text-cereniti-700 leading-relaxed">
            {responseText}
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
             <CheckCircle className="h-4 w-4" /> Ticket Resolved
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-xs text-cereniti-400">
            Re-open Case
          </Button>
        </div>
      ) : (
        /* EDIT VIEW */
        <div className="space-y-4">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Type your resolution or response to the client here..."
            className="w-full h-32 p-4 border border-cereniti-200 rounded-lg text-sm focus:outline-none focus:border-cereniti-900 resize-none bg-white"
          />
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              {status === 'open' && (
                <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={() => handleStatusChange('investigating')}
                   disabled={isLoading}
                   className="text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  <Search className="mr-2 h-3 w-3" /> Mark Investigating
                </Button>
              )}
              {status === 'investigating' && (
                 <span className="text-xs font-bold text-amber-600 flex items-center gap-2 px-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Investigation in Progress
                 </span>
              )}
            </div>

            <Button 
              onClick={handleResolve} 
              disabled={isLoading} 
              className="bg-cereniti-900 text-white hover:bg-olive-900"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Send & Resolve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}