import { createClient } from "@/lib/supabase/server";
import { SupportForm } from "@/components/client/support-form";
import { redirect } from "next/navigation";

// FIX: Must be 'export default' for Next.js Pages
export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch active bookings to link complaint to
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, scheduled_date, service:services(title)")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-3xl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cereniti-900">Concierge Desk</h1>
        <p className="text-cereniti-500 text-sm mt-1">Report an incident or request specialized assistance.</p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-cereniti-200 rounded-xl p-8 shadow-sm">
         <SupportForm bookings={bookings || []} />
      </div>

      {/* Support Info Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-cereniti-50 rounded-lg border border-cereniti-100">
           <p className="text-xs font-bold text-cereniti-900 uppercase tracking-widest mb-1">Emergency Protocol</p>
           <p className="text-xs text-cereniti-500">For immediate property threats (leaks, security), please contact your Estate security first, then log a ticket here.</p>
        </div>
        <div className="p-4 bg-cereniti-50 rounded-lg border border-cereniti-100">
           <p className="text-xs font-bold text-cereniti-900 uppercase tracking-widest mb-1">Response Time</p>
           <p className="text-xs text-cereniti-500">Our concierge team typically responds within 2 hours during business hours (08:00 - 18:00).</p>
        </div>
      </div>

    </div>
  );
}