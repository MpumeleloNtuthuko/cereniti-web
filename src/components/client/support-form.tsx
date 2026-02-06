"use client";

import { useState } from "react";
import { submitTicket } from "@/features/client/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Send, AlertCircle, FileText, HelpCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SupportFormProps {
  bookings: {
    id: string;
    scheduled_date: string;
    service: { title: string } | null; // Handle null service safely
  }[];
}

export function SupportForm({ bookings }: SupportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("general");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitTicket(formData);
      
      if (result.success) {
        toast.success("Request Logged", {
          description: "Our concierge team has been notified and will respond shortly.",
          duration: 5000,
        });
        // Reset form
        (e.target as HTMLFormElement).reset();
        setCategory("general");
      } else {
        toast.error("Submission Failed", { description: result.message });
      }
    } catch (error) {
      toast.error("Network Error", { description: "Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* 1. TICKET TYPE SELECTOR (Visual Tiles) */}
      <div className="space-y-3">
        <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Nature of Inquiry</label>
        <input type="hidden" name="type" value={category} />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TypeCard 
            id="general" 
            label="General" 
            icon={HelpCircle} 
            active={category === "general"} 
            onClick={() => setCategory("general")} 
          />
          <TypeCard 
            id="billing" 
            label="Billing" 
            icon={CreditCard} 
            active={category === "billing"} 
            onClick={() => setCategory("billing")} 
          />
          <TypeCard 
            id="complaint" 
            label="Complaint" 
            icon={FileText} 
            active={category === "complaint"} 
            onClick={() => setCategory("complaint")} 
          />
          <TypeCard 
            id="incident" 
            label="Incident" 
            icon={AlertCircle} 
            active={category === "incident"} 
            onClick={() => setCategory("incident")} 
            isUrgent 
          />
        </div>
      </div>

      {/* 2. RELATED BOOKING (Optional) */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Related Booking (Optional)</label>
        <div className="relative">
          <select 
            name="booking_id" 
            className="w-full appearance-none bg-cereniti-50 border border-cereniti-200 text-cereniti-900 text-sm rounded-lg p-3 focus:outline-none focus:border-cereniti-900 transition-colors"
          >
            <option value="">-- General Inquiry --</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {new Date(b.scheduled_date).toLocaleDateString()} - {b.service?.title || "Service"}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cereniti-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
          </div>
        </div>
      </div>

      {/* 3. SUBJECT */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Subject</label>
        <input 
          name="subject"
          required
          type="text" 
          placeholder="Brief summary of the issue..."
          className="w-full border-b border-cereniti-300 py-2 text-cereniti-900 placeholder:text-cereniti-300 focus:outline-none focus:border-cereniti-900 bg-transparent transition-colors"
        />
      </div>

      {/* 4. DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Description</label>
        <textarea 
          name="description"
          required
          placeholder="Please provide details so we can assist you effectively..."
          className="w-full border border-cereniti-200 rounded-lg p-4 text-sm focus:outline-none focus:border-cereniti-900 min-h-[150px] bg-cereniti-50/30 transition-all placeholder:text-cereniti-300 resize-none"
        />
      </div>

      {/* 5. SUBMIT */}
      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className={cn(
            "text-white px-8 h-12 shadow-lg transition-all",
            category === 'incident' ? "bg-red-600 hover:bg-red-700" : "bg-cereniti-900 hover:bg-olive-900"
          )}
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
          {category === 'incident' ? "Report Incident" : "Submit Request"}
        </Button>
      </div>

    </form>
  );
}

// --- SUB COMPONENT ---
function TypeCard({ id, label, icon: Icon, active, onClick, isUrgent }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:shadow-md",
        active 
          ? (isUrgent ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500" : "bg-cereniti-900 border-cereniti-900 text-white shadow-lg") 
          : "bg-white border-cereniti-200 text-cereniti-500 hover:border-cereniti-400"
      )}
    >
      <Icon className={cn("h-6 w-6", active ? (isUrgent ? "text-red-600" : "text-olive-400") : "text-cereniti-400")} />
      <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    </div>
  );
}