import { createClient } from "@/lib/supabase/server";
import { TicketManager } from "@/components/admin/incidents/ticket-manager";
import { ArrowLeft, User, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Ticket with Profile AND Booking (if linked)
  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profile:profiles(*),
      booking:bookings(
         id, scheduled_date, total_price,
         service:services(title),
         property:client_properties(address)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !ticket) notFound();

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-cereniti-200 pb-6">
        <Link href="/admin/incidents" className="text-cereniti-500 hover:text-cereniti-900 text-sm flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
           <div>
              <span className="text-xs font-bold uppercase text-red-500 tracking-widest">{ticket.type}</span>
              <h1 className="font-serif text-3xl text-cereniti-900 mt-2">{ticket.subject}</h1>
              <p className="text-cereniti-500 text-sm mt-2">Logged on {new Date(ticket.created_at).toLocaleString()}</p>
           </div>
           <div className="text-right">
              <span className="text-xs text-cereniti-400 uppercase tracking-widest">Ticket ID</span>
              <p className="font-mono text-cereniti-900">{ticket.id.slice(0,8)}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: TICKET INFO */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Description Card */}
           <div className="bg-white p-8 rounded-xl border border-cereniti-200 shadow-sm">
             <h3 className="font-bold text-cereniti-900 mb-4 text-sm uppercase tracking-wider">Client Report</h3>
             <p className="text-cereniti-700 leading-relaxed whitespace-pre-wrap">
               {ticket.description}
             </p>
           </div>

           {/* ACTION COMPONENT */}
           <TicketManager 
             id={ticket.id} 
             status={ticket.status} 
             existingResponse={ticket.admin_response} 
           />
        </div>

        {/* RIGHT: CONTEXT */}
        <div className="space-y-6">
           
           {/* Client Card */}
           <div className="bg-cereniti-900 text-white p-6 rounded-xl shadow-lg">
             <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
               <User className="h-4 w-4" /> Client
             </h3>
             <div className="space-y-2 text-sm">
               <p className="font-bold text-lg">{ticket.profile?.full_name}</p>
               <p className="text-cereniti-300">{ticket.profile?.email}</p>
               <p className="text-cereniti-300">{ticket.profile?.phone}</p>
             </div>
             <a href={`mailto:${ticket.profile?.email}`} className="block mt-6 text-center bg-white/10 hover:bg-white/20 py-2 rounded text-xs uppercase font-bold transition-all">
                Send Email
             </a>
           </div>

           {/* Linked Booking (If Exists) */}
           {ticket.booking && (
             <div className="bg-white p-6 rounded-xl border border-cereniti-200 shadow-sm">
               <h3 className="font-serif text-lg mb-4 flex items-center gap-2 text-cereniti-900">
                 <Calendar className="h-4 w-4 text-olive-600" /> Linked Job
               </h3>
               <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-cereniti-400 block">Service</span>
                    <span className="font-medium text-cereniti-900">{ticket.booking.service?.title}</span>
                  </div>
                  <div>
                    <span className="text-xs text-cereniti-400 block">Date</span>
                    <span className="font-medium text-cereniti-900">{new Date(ticket.booking.scheduled_date).toDateString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-cereniti-400 block">Address</span>
                    <span className="font-medium text-cereniti-900">{ticket.booking.property?.address}</span>
                  </div>
                  <div className="pt-4 border-t border-cereniti-100">
                    <Link href={`/admin/bookings/${ticket.booking.id}`} className="text-xs font-bold text-olive-600 hover:underline">
                       View Booking Record →
                    </Link>
                  </div>
               </div>
             </div>
           )}

        </div>

      </div>
    </div>
  );
}