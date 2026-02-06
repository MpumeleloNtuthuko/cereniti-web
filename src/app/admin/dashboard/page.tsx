import { createClient } from "@/lib/supabase/server";
import { Users, UserCheck, CalendarClock, Wallet, ArrowUpRight, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/logic/pricing";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Queries (Kept efficient)
  const { count: clientCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client");
  const { count: pipelineCount } = await supabase.from("contractor_applications").select("*", { count: "exact", head: true }).in("status", ["pending", "assessment_invited", "interview"]);
  const { count: requestCount } = await supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "requested");
  const { data: revenueData } = await supabase.from("bookings").select("total_price").in("status", ["confirmed", "completed", "in_progress"]);
  const totalRevenue = revenueData?.reduce((sum, row) => sum + (row.total_price || 0), 0) || 0;

  // Recent Data
  const { data: recentBookings } = await supabase.from("bookings").select("*, profile:profiles(email, full_name)").order("created_at", { ascending: false }).limit(3);
  const { data: recentApplicants } = await supabase.from("contractor_applications").select("*").order("created_at", { ascending: false }).limit(3);

  return (
    <div className="p-4 lg:p-12 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-serif text-3xl text-cereniti-900">Mission Control</h1>
          <p className="text-cereniti-500 text-sm mt-1">Live platform telemetry.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-cereniti-200 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-cereniti-900 uppercase tracking-wider">Operational</span>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Est. Revenue" value={formatCurrency(totalRevenue)} icon={Wallet} color="emerald" sub="Pipeline Value" />
        <MetricCard label="Requests" value={requestCount || 0} icon={CalendarClock} color={requestCount && requestCount > 0 ? "amber" : "gray"} sub="Action Required" />
        <MetricCard label="Vetting" value={pipelineCount || 0} icon={UserCheck} color="blue" sub="In Review" />
        <MetricCard label="Clients" value={clientCount || 0} icon={Users} color="gray" sub="Total Users" />
      </div>

      {/* FEEDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* APPLICANTS FEED */}
        <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-cereniti-100 flex justify-between items-center bg-cereniti-50/50">
            <h3 className="font-serif text-lg text-cereniti-900">New Applicants</h3>
            <Link href="/admin/applications" className="text-xs text-olive-600 hover:text-olive-800 font-bold uppercase tracking-wider flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-cereniti-100">
            {recentApplicants?.length === 0 ? <EmptyState message="No new applications" /> : recentApplicants?.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-cereniti-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center text-cereniti-600 font-bold shrink-0">{app.full_name[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-cereniti-900">{app.full_name}</p>
                    <p className="text-xs text-cereniti-500">{app.experience_years} Yrs Exp</p>
                  </div>
                </div>
                <StatusPill status={app.status} />
              </div>
            ))}
          </div>
        </div>

        {/* BOOKINGS FEED */}
        <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-cereniti-100 flex justify-between items-center bg-cereniti-50/50">
            <h3 className="font-serif text-lg text-cereniti-900">Incoming Requests</h3>
            <Link href="/admin/bookings" className="text-xs text-olive-600 hover:text-olive-800 font-bold uppercase tracking-wider flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-cereniti-100">
            {recentBookings?.length === 0 ? <EmptyState message="No bookings yet" /> : recentBookings?.map((booking: any) => (
              <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-cereniti-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-olive-50 flex items-center justify-center text-olive-600 shrink-0"><Clock className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-medium text-cereniti-900">{booking.profile?.full_name || "Guest"}</p>
                    <p className="text-xs text-cereniti-500 flex gap-1">
                      <span suppressHydrationWarning>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span suppressHydrationWarning>{formatCurrency(booking.total_price)}</span>
                    </p>
                  </div>
                </div>
                <BookingStatusPill status={booking.status} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color = "gray" }: any) {
  const colors: any = { gray: "bg-cereniti-100 text-cereniti-600", olive: "bg-olive-100 text-olive-700", blue: "bg-blue-100 text-blue-700", emerald: "bg-emerald-100 text-emerald-700", amber: "bg-amber-100 text-amber-700" };
  return (
    <div className="bg-white p-5 rounded-xl border border-cereniti-200 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <p className="text-cereniti-500 text-[10px] uppercase tracking-widest font-bold">{label}</p>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon className="h-4 w-4" /></div>
      </div>
      <div>
        <h3 className="text-2xl font-serif text-cereniti-900" suppressHydrationWarning>{value}</h3>
        <p className="text-[10px] text-cereniti-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: any = { pending: "bg-yellow-100 text-yellow-800", assessment_invited: "bg-blue-100 text-blue-800", interview: "bg-purple-100 text-purple-800", approved: "bg-emerald-100 text-emerald-800", rejected: "bg-red-50 text-red-400" };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${map[status] || "bg-gray-100"}`}>{status.replace("_", " ")}</span>;
}

function BookingStatusPill({ status }: { status: string }) {
  const map: any = { requested: "bg-amber-100 text-amber-800", confirmed: "bg-emerald-100 text-emerald-800", completed: "bg-cereniti-900 text-white", cancelled: "bg-red-50 text-red-400" };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${map[status] || "bg-gray-100"}`}>{status}</span>;
}

function EmptyState({ message }: { message: string }) {
  return <div className="p-8 text-center flex flex-col items-center justify-center text-cereniti-400"><AlertCircle className="h-6 w-6 mb-2 opacity-50" /><span className="text-xs uppercase tracking-widest">{message}</span></div>;
}