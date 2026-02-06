import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { ActiveJobMode } from "@/components/contractor/active-job-mode";
import { redirect } from "next/navigation";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ActiveJobPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Fetch Booking Details & Milestones
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      property:client_properties(address, estate_name),
      service:services(title),
      milestones:job_milestones(*)
    `)
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cereniti-50">
        <div className="text-center">
          <h1 className="text-xl font-serif text-cereniti-900 mb-2">Job Not Found</h1>
          <Link href="/contractor" className="text-sm underline text-cereniti-500">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  // 2. SECURITY CHECK (Updated for Team Model)
  // Check if this specific user has ACCEPTED this specific job via broadcasts
  const { data: teamMember } = await supabase
    .from("job_broadcasts")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("contractor_id", user.id)
    .eq("status", "accepted")
    .single();

  if (!teamMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cereniti-50">
         <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Unauthorized Access</h1>
          <p className="text-sm text-cereniti-500">You are not part of the active team for this job.</p>
          <div className="mt-4">
            <Link href="/dashboard/contractor">
                <button className="text-xs bg-cereniti-900 text-white px-4 py-2 rounded">Go Back</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cereniti-50 pb-24">
      {/* Navbar ensures they can logout if stuck */}
      <Navbar user={user} />

      <div className="container mx-auto px-4 pt-24 max-w-2xl">
        
        {/* Header */}
        <div className="mb-8">
           <Link href="/contractor" className="text-cereniti-500 hover:text-cereniti-900 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
             <ArrowLeft className="h-3 w-3" /> Back to Dashboard
           </Link>
           <h1 className="font-serif text-3xl text-cereniti-900">{booking.service?.title}</h1>
           <div className="flex items-center gap-2 mt-2 text-cereniti-600 text-sm">
              <MapPin className="h-4 w-4 text-olive-600" />
              <span>{booking.property?.estate_name} • {booking.property?.address}</span>
           </div>
        </div>

        {/* THE CURATOR INTERFACE */}
        {/* We sort milestones here to ensure consistent SSR order */}
        <ActiveJobMode milestones={booking.milestones?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || []} />

      </div>
    </main>
  );
}