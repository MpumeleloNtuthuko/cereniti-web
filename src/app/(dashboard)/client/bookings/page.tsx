import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/logic/pricing";
import { Calendar, MapPin, Search } from "lucide-react";
import Link from "next/link";

export default async function ClientBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch ALL bookings
  const { data: allBookings } = await supabase
    .from("bookings")
    .select("*, service:services(title), property:client_properties(estate_name, address)")
    .eq("user_id", user!.id)
    .order("scheduled_date", { ascending: false });

  // Filter in memory (fast enough for client lists)
  const active = allBookings?.filter(b => ['requested', 'confirmed', 'in_progress'].includes(b.status)) || [];
  const past = allBookings?.filter(b => ['completed', 'cancelled'].includes(b.status)) || [];

  return (
    <div className="max-w-5xl space-y-8">
      
      <div className="flex justify-between items-end">
        <h1 className="font-serif text-3xl text-cereniti-900">My Bookings</h1>
      </div>

      {/* ACTIVE BOOKINGS */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cereniti-500 border-b border-cereniti-200 pb-2">Active & Upcoming</h2>
        {active.length > 0 ? (
          <div className="grid gap-4">
            {active.map(booking => (
               <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-cereniti-400 italic py-4">No active bookings.</p>
        )}
      </div>

      {/* PAST BOOKINGS */}
      <div className="space-y-4 pt-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cereniti-500 border-b border-cereniti-200 pb-2">History</h2>
        {past.length > 0 ? (
          <div className="grid gap-4">
            {past.map(booking => (
               <BookingCard key={booking.id} booking={booking} isHistory />
            ))}
          </div>
        ) : (
          <p className="text-sm text-cereniti-400 italic py-4">No history yet.</p>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, isHistory }: { booking: any, isHistory?: boolean }) {
  return (
    <div className={`p-6 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${isHistory ? 'bg-cereniti-50 border-cereniti-100 text-cereniti-600' : 'bg-white border-cereniti-200 shadow-sm hover:shadow-md'}`}>
      
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-lg text-cereniti-900">{booking.service?.title}</h3>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-cereniti-500">
           <span className="flex items-center gap-1" suppressHydrationWarning>
             <Calendar className="h-3 w-3" /> {new Date(booking.scheduled_date).toLocaleDateString()}
           </span>
           <span className="flex items-center gap-1">
             <MapPin className="h-3 w-3" /> {booking.property?.estate_name || "Paarl Area"}
           </span>
        </div>
      </div>

      <div className="text-right">
        <p className="font-mono font-bold text-cereniti-900" suppressHydrationWarning>
           {formatCurrency(booking.total_price)}
        </p>
        <p className="text-[10px] text-cereniti-400 uppercase tracking-widest mt-1">
           {booking.frequency === 'once-off' ? 'One Time' : 'Recurring'}
        </p>
      </div>

    </div>
  );
}

function getStatusColor(status: string) {
  switch(status) {
    case 'requested': return 'bg-amber-100 text-amber-700';
    case 'confirmed': return 'bg-emerald-100 text-emerald-700';
    case 'in_progress': return 'bg-blue-100 text-blue-700';
    case 'completed': return 'bg-cereniti-200 text-cereniti-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-500';
  }
}