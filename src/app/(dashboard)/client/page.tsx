import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/logic/pricing";
import { Calendar, MapPin, ArrowRight, Clock, Sparkles, Plus, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ClientBookingActions } from "@/components/client/booking-actions";
import { LivePulse } from "@/components/client/live-pulse";

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch Active/Upcoming Jobs (Standard Query)
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select(`
      *, 
      service:services(title), 
      property:client_properties(estate_name, address)
    `)
    .eq("user_id", user.id)
    .in("status", ["requested", "confirmed", "in_progress"])
    .order("scheduled_date", { ascending: true }); // Earliest first

  // 2. Fetch Recent History
  const { data: history } = await supabase
    .from("bookings")
    .select("*, service:services(title)")
    .eq("user_id", user.id)
    .in("status", ["completed", "cancelled"])
    .order("scheduled_date", { ascending: false })
    .limit(3);

  // 3. SEPARATE THE DATA
  const activeJob = activeBookings?.find(b => b.status === 'in_progress');
  const nextUpJob = activeBookings?.find(b => b.id !== activeJob?.id);

  // 4. SECURELY FETCH TEAMS (The Fix)
  // We use the RPC function to bypass RLS and get exactly what we need
  let activeTeam: any[] = [];
  let nextTeam: any[] = [];

  if (activeJob) {
    const { data } = await supabase.rpc('get_booking_team', { p_booking_id: activeJob.id });
    if (data) activeTeam = data;
  }

  if (nextUpJob) {
    const { data } = await supabase.rpc('get_booking_team', { p_booking_id: nextUpJob.id });
    if (data) nextTeam = data;
  }

  return (
    <div className="max-w-5xl space-y-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-cereniti-900">Sanctuary Status</h1>
          <p className="text-cereniti-500 text-sm mt-1">Overview of your home care.</p>
        </div>
        <Link href="/book">
          <button className="bg-cereniti-900 text-white px-6 py-3 rounded-none hover:bg-gold-600 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> New Request
          </button>
        </Link>
      </div>

      <div className="space-y-8">
        
        {/* --- SECTION 1: LIVE NOW (If Active) --- */}
        {activeJob && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Active Team Header */}
              {activeTeam.length > 0 && (
                <div className="bg-white border border-cereniti-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                   <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-cereniti-500 mb-2 flex items-center gap-2">
                         <Users className="h-4 w-4 text-gold-600" /> On Site Now
                      </h3>
                      <h2 className="font-serif text-xl text-cereniti-900">{activeJob.service?.title}</h2>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                      {activeTeam.map((member: any, i: number) => (
                         <div key={i} className="flex items-center gap-3 bg-cereniti-50 px-4 py-2 rounded-lg border border-cereniti-100">
                            <div className="h-8 w-8 rounded-full bg-cereniti-900 text-white flex items-center justify-center text-xs font-bold">
                               {member.full_name?.[0] || "S"}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-cereniti-900">
                                  {member.full_name || "Specialist"}
                               </p>
                               <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                               </span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              {/* The Timeline */}
              <LivePulse bookingId={activeJob.id} />
           </div>
        )}

        {/* --- SECTION 2: UP NEXT (Pending or Confirmed) --- */}
        {nextUpJob ? (
          <div>
             {/* Header separator if both exist */}
             {activeJob && (
               <h3 className="text-xs font-bold uppercase tracking-widest text-cereniti-400 mb-4 mt-8 ml-1">Up Next</h3>
             )}

             <div className="bg-white border border-cereniti-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                {/* Status Bar */}
                <div className={`px-6 py-4 flex justify-between items-center text-white ${nextUpJob.status === 'requested' ? 'bg-cereniti-800' : 'bg-gold-600'}`}>
                   <div className="flex items-center gap-3">
                      {nextUpJob.status === 'confirmed' ? (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <Clock className="h-4 w-4 opacity-80" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {nextUpJob.status === 'requested' ? 'Request Pending Approval' : 'Confirmed Booking'}
                      </span>
                   </div>
                   <span className="font-serif text-lg" suppressHydrationWarning>{formatCurrency(nextUpJob.total_price)}</span>
                </div>
                
                <div className="p-8">
                   <div className="flex flex-col md:flex-row justify-between gap-8">
                      {/* Job Details */}
                      <div className="flex-1">
                         <h2 className="text-3xl font-serif text-cereniti-900 mb-4">{nextUpJob.service?.title}</h2>
                         
                         <div className="space-y-3 text-sm text-cereniti-500">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-cereniti-50 flex items-center justify-center text-gold-600">
                                 <Calendar className="h-4 w-4" /> 
                              </div>
                              <span className="font-medium text-cereniti-900" suppressHydrationWarning>
                                {new Date(nextUpJob.scheduled_date).toDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-cereniti-50 flex items-center justify-center text-gold-600">
                                 <MapPin className="h-4 w-4" /> 
                              </div>
                              <span>{nextUpJob.property?.estate_name || nextUpJob.property?.address}</span>
                            </div>
                         </div>

                         {/* CONDITIONAL: PENDING NOTE */}
                         {nextUpJob.status === 'requested' && (
                           <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                              <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                              <p className="text-xs text-amber-800 leading-relaxed">
                                Our concierge is currently reviewing your logistics and team availability. You will receive a confirmation notification shortly.
                              </p>
                           </div>
                         )}

                         {/* CONDITIONAL: TEAM DISPLAY (Visible only if confirmed) */}
                         {nextUpJob.status === 'confirmed' && nextTeam.length > 0 && (
                            <div className="mt-6 border-t border-cereniti-100 pt-4">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-cereniti-400 mb-3 flex items-center gap-2">
                                  <ShieldCheck className="h-3 w-3" /> Assigned Specialists
                               </p>
                               <div className="flex flex-wrap gap-4">
                                  {nextTeam.map((member: any, i: number) => (
                                     <div key={i} className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-cereniti-900 text-white flex items-center justify-center text-sm font-serif border-2 border-white shadow-sm">
                                           {member.full_name?.[0] || "S"}
                                        </div>
                                        <div>
                                           <p className="text-sm font-bold text-cereniti-900 leading-none">
                                              {member.full_name}
                                           </p>
                                           <p className="text-[10px] text-cereniti-500 uppercase mt-1">Guild Member</p>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-end justify-end">
                         <ClientBookingActions 
                           bookingId={nextUpJob.id} 
                           status={nextUpJob.status} 
                           totalPrice={nextUpJob.total_price} 
                           scheduledDate={nextUpJob.scheduled_date} 
                         />
                      </div>
                   </div>
                </div>
              </div>
          </div>
        ) : (
           /* EMPTY STATE */
           !activeJob && (
              <div className="bg-cereniti-50 border border-dashed border-cereniti-300 rounded-2xl p-12 text-center">
                 <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-cereniti-200 text-cereniti-400">
                    <Sparkles className="h-6 w-6" />
                 </div>
                 <h3 className="font-serif text-xl text-cereniti-900">Your schedule is clear.</h3>
                 <p className="text-cereniti-500 text-sm mb-6 mt-2">Ready to restore order to your sanctuary?</p>
                 <Link href="/book" className="inline-flex items-center justify-center px-6 py-3 bg-cereniti-900 text-white rounded-lg hover:bg-gold-600 transition-colors shadow-sm text-sm font-bold uppercase tracking-wider">
                    Book a Reset
                 </Link>
              </div>
           )
        )}
      </div>

      {/* HISTORY TABLE */}
      <div>
         <div className="flex justify-between items-end mb-6">
            <h3 className="font-serif text-xl text-cereniti-900">Recent History</h3>
            <Link href="/dashboard/client/bookings" className="text-xs font-bold uppercase tracking-widest text-gold-600 hover:text-gold-800 flex items-center gap-1 group">
               View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
         </div>
         
         <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
            {history && history.length > 0 ? (
               history.map((job) => (
                  <div key={job.id} className="p-5 border-b border-cereniti-100 last:border-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-cereniti-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${job.status === 'completed' ? 'bg-cereniti-900' : 'bg-red-400'}`}>
                           {job.status === 'completed' ? '✓' : '×'}
                        </div>
                        <div>
                          <p className="font-medium text-cereniti-900 text-sm">{job.service?.title}</p>
                          <p className="text-xs text-cereniti-400" suppressHydrationWarning>{new Date(job.scheduled_date).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-cereniti-600" suppressHydrationWarning>
                          {formatCurrency(job.total_price)}
                        </span>
                        {job.status === 'completed' && (
                           <Link href={`/book`}>
                             <button className="text-[10px] uppercase font-bold text-cereniti-400 hover:text-gold-600 border border-cereniti-200 px-3 py-1.5 rounded hover:border-gold-300 transition-all">
                               Book Again
                             </button>
                           </Link>
                        )}
                     </div>
                  </div>
               ))
            ) : (
               <div className="p-12 text-center text-sm text-cereniti-400">No recent history available.</div>
            )}
         </div>
      </div>

    </div>
  );
}