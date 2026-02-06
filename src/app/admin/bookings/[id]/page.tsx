import { createClient } from "@/lib/supabase/server";
import { BookingActions } from "@/components/admin/bookings/booking-actions";
import { BroadcastPanel } from "@/components/admin/bookings/broadcast-panel";
import { TeamConfig } from "@/components/admin/bookings/team-config";
import { ArrowLeft, Home, Info, DollarSign, Calendar, User, Clock, Hourglass, Ruler, MapPin, Gem, ShieldCheck, AlertOctagon, Ban, Archive } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/logic/pricing";
import { formatDuration } from "@/lib/logic/duration";
import { Button } from "@/components/ui/button";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*),
      profile:profiles!bookings_profile_fkey(*),
      property:client_properties(*),
      assigned_contractor:contractors(id, profiles(full_name, phone))
    `)
    .eq("id", id)
    .single();

  if (error || !booking) notFound();

  // 2. Fetch Broadcasts
  const { data: broadcasts } = await supabase
    .from("job_broadcasts")
    .select(`id, status, sent_at, contractor:contractors(profiles(full_name))`)
    .eq("booking_id", id)
    .order('sent_at', { ascending: false });

  // 3. LOGIC: Is this a "Zombie" Booking?
  const jobDate = new Date(booking.scheduled_date);
  const today = new Date();
  jobDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  
  // It is expired if date is in past AND status is not final (completed/cancelled)
  const isExpired = jobDate < today && !['completed', 'cancelled'].includes(booking.status);

  // Formatting
  const startTime = booking.start_time ? booking.start_time.slice(0, 5) : "TBD";
  const durationText = booking.estimated_duration ? formatDuration(booking.estimated_duration) : "N/A";
  // @ts-ignore
  const assignedProfile = booking.assigned_contractor?.profiles;

  return (
    <div className="p-4 lg:p-12 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cereniti-200 pb-6">
        <div>
          <Link href="/admin/bookings" className="text-cereniti-500 hover:text-cereniti-900 text-sm flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Registry
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-cereniti-900">Booking #{booking.id.slice(0,6)}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isExpired ? 'bg-red-100 text-red-700' : 'bg-cereniti-100 text-cereniti-600'}`}>
              {isExpired ? "EXPIRED / STALE" : booking.frequency}
            </span>
          </div>
          <p className="text-cereniti-500 text-sm mt-1 flex items-center gap-2">
            <Calendar className="h-3 w-3 text-gold-600" />
            {new Date(booking.scheduled_date).toDateString()}
          </p>
        </div>

        {/* ACTIONS: Only show standard actions if valid. If expired, hide them. */}
        {!isExpired && <BookingActions id={booking.id} status={booking.status} />}
      </div>

      {/* --- EXPIRED STATE UI --- */}
      {isExpired ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 animate-in fade-in slide-in-from-top-4">
           <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full border border-red-100 shadow-sm">
                 <AlertOctagon className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-4 flex-1">
                 <div>
                    <h2 className="text-xl font-bold text-red-800">Operational Failure: Booking Expired</h2>
                    <p className="text-red-700 mt-1 max-w-2xl text-sm leading-relaxed">
                       This booking was scheduled for <strong>{new Date(booking.scheduled_date).toLocaleDateString()}</strong> but is still in <strong>{booking.status}</strong> status. 
                       It cannot be broadcasted or started. Immediate remediation required.
                    </p>
                 </div>

                 {/* REMEDIATION ACTIONS */}
                 <div className="flex gap-4 pt-2">
                    {/* We reuse BookingActions logic but conceptually these would be specific 'Archive' actions */}
                    {/* For now, we allow cancellation to clean it up */}
                    <div className="p-4 bg-white rounded-lg border border-red-100 shadow-sm flex items-center gap-4 w-full max-w-lg">
                       <span className="text-xs font-bold uppercase text-red-500">Remediation:</span>
                       <BookingActions id={booking.id} status="force_cancel_view" /> 
                       {/* Note: You need to update BookingActions to handle this "view" or just render a Cancel button here */}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: JOB DETAILS --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROPERTY CARD (Simplified if expired) */}
          <div className={`bg-white p-8 rounded-xl border shadow-sm ${isExpired ? 'border-red-100 opacity-80' : 'border-cereniti-200'}`}>
            <h3 className="font-serif text-lg text-cereniti-900 mb-6 flex items-center gap-2 border-b border-cereniti-100 pb-2">
              <Home className="h-4 w-4 text-olive-600" /> Property Profile
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-cereniti-50 rounded-lg text-cereniti-400">
                    <MapPin className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-xs uppercase text-cereniti-400 tracking-wider font-bold">Location</p>
                    <p className="font-serif text-xl text-cereniti-900">{booking.property?.address}</p>
                    <p className="text-cereniti-600">{booking.property?.estate_name}</p>
                 </div>
              </div>
              {/* Only show deep details if NOT expired/cancelled to reduce noise */}
              {!isExpired && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-cereniti-50 rounded-lg text-center border border-cereniti-100">
                    <p className="text-2xl font-bold text-cereniti-900">{booking.property?.bedrooms}</p>
                    <p className="text-[10px] uppercase tracking-widest text-cereniti-500">Bedrooms</p>
                  </div>
                  <div className="p-4 bg-cereniti-50 rounded-lg text-center border border-cereniti-100">
                    <p className="text-2xl font-bold text-cereniti-900">{booking.property?.bathrooms}</p>
                    <p className="text-[10px] uppercase tracking-widest text-cereniti-500">Bathrooms</p>
                  </div>
                  <div className="p-4 bg-cereniti-50 rounded-lg text-center border border-cereniti-100 flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-cereniti-900">{booking.estimated_sqm || 0}</span>
                        <span className="text-xs font-medium text-cereniti-400">m²</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-cereniti-500 flex items-center gap-1">
                      <Ruler className="h-3 w-3" /> Size
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SERVICE SCOPE (Visual adjustments for expired) */}
          <div className="bg-white p-8 rounded-xl border border-cereniti-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-cereniti-100 pb-2 mb-6">
                <h3 className="font-serif text-lg text-cereniti-900 flex items-center gap-2">
                  <Info className="h-4 w-4 text-olive-600" /> Service Scope
                </h3>
                {booking.service?.tier === 'reserve' ? (
                   <span className="flex items-center gap-1 bg-cereniti-900 text-gold-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-gold-900">
                      <Gem className="h-3 w-3" /> Reserve
                   </span>
                ) : (
                   <span className="flex items-center gap-1 bg-cereniti-50 text-cereniti-500 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-cereniti-200">
                      <ShieldCheck className="h-3 w-3" /> Classic
                   </span>
                )}
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase text-cereniti-400 tracking-wider mb-1">Selected Ritual</p>
                <p className="font-bold text-xl text-cereniti-900">{booking.service?.title}</p>
              </div>
              {/* Hide addons/notes if expired to declutter */}
              {!isExpired && booking.addons_selected?.length > 0 && (
                <div className="bg-gold-50/50 p-5 rounded-lg border border-gold-100">
                  <p className="text-xs uppercase text-gold-700 font-bold mb-3 tracking-widest">Enhancements</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {booking.addons_selected.map((addon: any) => (
                      <li key={addon.id} className="text-sm text-cereniti-800 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {addon.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-6">
          
          {/* 1. OPERATIONS PANEL (Hidden if Expired) */}
          {!isExpired && (
            <>
              <TeamConfig bookingId={booking.id} currentSize={booking.specialists_needed || 1} status={booking.status} />
              
              {/* Only show broadcast if not cancelled/completed/expired */}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <BroadcastPanel 
                  bookingId={booking.id} 
                  bookingStatus={booking.status}
                  specialistsNeeded={booking.specialists_needed || 1}
                  broadcasts={broadcasts || []} 
                />
              )}
            </>
          )}

          {/* 2. CLIENT CARD */}
          <div className={`bg-cereniti-900 text-cereniti-50 p-6 rounded-xl shadow-lg ${isExpired ? 'opacity-50' : ''}`}>
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Client Profile
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-cereniti-400 uppercase tracking-widest mb-1">Name</p>
                <p className="text-lg font-bold">{booking.profile?.full_name || "Unknown"}</p>
              </div>
              <div className="bg-white/5 p-2 rounded">
                 <p className="text-[10px] text-cereniti-400 uppercase tracking-widest mb-0.5">Contact</p>
                 <p className="text-xs text-cereniti-100">{booking.profile?.email}</p>
                 <p className="text-xs text-cereniti-100 mt-1">{booking.profile?.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* 3. FINANCIAL CARD */}
          <div className="bg-white p-6 rounded-xl border border-cereniti-200 shadow-sm">
            <h3 className="font-serif text-lg text-cereniti-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-olive-600" /> Financials
            </h3>
            <div className="flex justify-between items-end">
              <span className="text-cereniti-500 text-sm">Total Quote</span>
              <span className="text-2xl font-serif text-cereniti-900 font-bold">
                {formatCurrency(booking.total_price)}
              </span>
            </div>
            {isExpired && (
                <div className="mt-4 p-2 bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100 rounded">
                    Refund Required
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}