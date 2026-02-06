import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatCurrency } from "@/lib/logic/pricing";
import { Calendar, MapPin, User, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  // 1. Fetch Bookings with Relations
  // Using explicit FK constraint for profiles
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(title),
      profile:profiles!bookings_profile_fkey(full_name, email, phone) 
    `)
    .order('scheduled_date', { ascending: false });

  if (error) {
    return (
      <div className="p-12 text-red-500 bg-red-50 m-8 rounded-xl border border-red-200">
        <h3 className="font-bold">Database Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cereniti-900">Bookings Registry</h1>
          <p className="text-cereniti-500 text-sm mt-1">Manage schedules and job statuses.</p>
        </div>
      </div>

      <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-cereniti-50 border-b border-cereniti-200">
                <tr>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Client</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Service</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Value</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-cereniti-100">
                {bookings?.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-cereniti-50/50 transition-colors">
                    <td className="px-6 py-4 text-cereniti-900 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gold-600" />
                        {new Date(booking.scheduled_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-cereniti-400 pl-5">
                        {booking.frequency !== 'once-off' ? 'Recurring' : 'One-time'}
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <div className="font-medium text-cereniti-900">{booking.profile?.full_name || "Unknown User"}</div>
                    <div className="text-xs text-cereniti-400">{booking.profile?.email || "No Email"}</div>
                    </td>
                    <td className="px-6 py-4 text-cereniti-600">
                    {booking.service?.title}
                    </td>
                    <td className="px-6 py-4 font-mono text-cereniti-600">
                    {formatCurrency(booking.total_price)}
                    </td>
                    <td className="px-6 py-4">
                    {/* PASSING DATE TO BADGE FOR LOGIC CHECK */}
                    <BookingStatusBadge status={booking.status} dateStr={booking.scheduled_date} />
                    </td>
                    <td className="px-6 py-4 text-right">
                    <Link href={`/admin/bookings/${booking.id}`}>
                        <button className="text-gold-600 hover:text-gold-800 font-bold text-xs uppercase tracking-wider">
                        Manage
                        </button>
                    </Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {(!bookings || bookings.length === 0) && (
          <div className="p-12 text-center text-cereniti-400">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}

// --- INTELLIGENT STATUS BADGE ---
function BookingStatusBadge({ status, dateStr }: { status: string, dateStr: string }) {
  const jobDate = new Date(dateStr);
  // Set to midnight today for comparison
  const today = new Date();
  today.setHours(0,0,0,0);
  jobDate.setHours(0,0,0,0);

  const isPast = jobDate < today;

  // 1. Logic: Job is in the past but still 'requested' (Expired/Unassigned)
  if (isPast && status === 'requested') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 border border-gray-200">
        <XCircle className="h-3 w-3" /> Expired / Unassigned
      </span>
    );
  }

  // 2. Logic: Job is in the past but still 'confirmed' (No-Show / Incomplete)
  if (isPast && status === 'confirmed') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-700 border border-red-200">
        <AlertTriangle className="h-3 w-3" /> Overdue / Incomplete
      </span>
    );
  }

  // 3. Logic: Job is in the past but 'in_progress' (Forgot to checkout)
  if (isPast && status === 'in_progress') {
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-200">
        <HelpCircle className="h-3 w-3" /> Stuck Active
      </span>
    );
  }

  // 4. Standard Statuses (Future or Completed)
  const styles: Record<string, string> = {
    requested: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-cereniti-900 text-white",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-gray-100"}`}>
      {status ? status.replace("_", " ") : "Unknown"}
    </span>
  );
}