import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { JobCard } from "@/components/contractor/job-card";
import { StartJobButton } from "@/components/contractor/start-job-button";
import { Bell, Briefcase, Calendar, MapPin, Clock, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDuration } from "@/lib/logic/duration";

export const dynamic = "force-dynamic";

export default async function ContractorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Verify Role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'contractor') return <div className="p-12 text-center">Unauthorized</div>;

  // --- DATE UTILS ---
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Midnight today for comparison

  // ---------------------------------------------------------
  // 2. FETCH OPPORTUNITIES
  // ---------------------------------------------------------
  const { data: broadcasts } = await supabase
    .from("job_broadcasts")
    .select(`
      id, status,
      booking:bookings (
        id, scheduled_date, total_price, frequency, special_requests, specialists_needed, status,
        start_time, estimated_duration, estimated_sqm,
        service:services (title, description),
        property:client_properties (address, estate_name, bedrooms, bathrooms),
        broadcasts_log:job_broadcasts (status) 
      )
    `)
    .eq("contractor_id", user.id)
    .eq("status", "sent")
    .order("sent_at", { ascending: false });

  // FILTER 1: OPPORTUNITIES
  // Remove if team full OR if date is in the past
  const opportunities = broadcasts?.filter((item: any) => {
    const booking = item.booking;
    if (!booking) return false;

    // A. Date Check (Hide expired opportunities)
    const jobDate = new Date(booking.scheduled_date);
    if (jobDate < now) return false;

    // B. Team Check
    const acceptedCount = booking.broadcasts_log?.filter((b: any) => b.status === 'accepted').length || 0;
    const needed = booking.specialists_needed || 1;
    return acceptedCount < needed;
  }) || [];

  // ---------------------------------------------------------
  // 3. FETCH SCHEDULE
  // ---------------------------------------------------------
  
  // A. Direct Assignments
  const { data: directAssignments } = await supabase
    .from("bookings")
    .select(`
      id, scheduled_date, status, total_price, frequency, specialists_needed,
      start_time, estimated_duration, estimated_sqm,
      service:services(title),
      property:client_properties(estate_name, address, bedrooms, bathrooms)
    `)
    .eq("assigned_contractor_id", user.id)
    .neq("status", "cancelled");

  // B. Team Assignments
  const { data: teamAssignments } = await supabase
    .from("job_broadcasts")
    .select(`
      booking:bookings (
        id, scheduled_date, status, total_price, frequency, specialists_needed,
        start_time, estimated_duration, estimated_sqm,
        service:services(title),
        property:client_properties(estate_name, address, bedrooms, bathrooms)
      )
    `)
    .eq("contractor_id", user.id)
    .eq("status", "accepted");

  // C. Merge
  const directJobs = directAssignments || [];
  // @ts-ignore
  const teamJobs = teamAssignments?.map(t => t.booking).filter(b => b.status !== 'cancelled') || [];
  
  const jobMap = new Map();
  directJobs.forEach(job => jobMap.set(job.id, job));
  teamJobs.forEach(job => jobMap.set(job.id, job));
  
  const allJobs = Array.from(jobMap.values());

  // FILTER 2: SCHEDULE
  // Only show Future jobs OR jobs that are currently In Progress
  const schedule = allJobs
    .filter((job: any) => {
      const jobDate = new Date(job.scheduled_date);
      // Keep if (Date >= Today) OR (Status is 'in_progress')
      return jobDate >= now || job.status === 'in_progress';
    })
    .sort((a: any, b: any) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());


  return (
    <div className="min-h-screen bg-cereniti-50 pb-20">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8 lg:py-12 mt-16">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-cereniti-900">Specialist Portal</h1>
          <p className="text-cereniti-500">Welcome, {user.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: OPPORTUNITIES */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 mb-4">
               <div className="h-8 w-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600"><Bell className="h-4 w-4" /></div>
               <h2 className="font-bold text-lg text-cereniti-900">New Opportunities ({opportunities.length})</h2>
            </div>
            {opportunities.length > 0 ? (
               <div className="grid gap-6">
                 {opportunities.map((item: any) => {
                    const acceptedCount = item.booking.broadcasts_log?.filter((b: any) => b.status === 'accepted').length || 0;
                    return <JobCard key={item.id} broadcastId={item.id} booking={item.booking} acceptedCount={acceptedCount} />;
                 })}
               </div>
            ) : (
               <div className="bg-white border border-cereniti-200 rounded-xl p-12 text-center text-cereniti-400">
                  <Briefcase className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p>No new jobs available.</p>
               </div>
            )}
          </div>

          {/* RIGHT: SCHEDULE */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-cereniti-200 rounded-xl p-6 shadow-sm sticky top-32">
              <h3 className="font-bold text-cereniti-900 mb-4 flex items-center gap-2"><Calendar className="h-4 w-4" /> My Schedule</h3>
              
              <div className="space-y-3">
                {schedule.length > 0 ? (
                  schedule.map((job: any) => {
                    const jobDate = new Date(job.scheduled_date);
                    // Check if Locked (Future date)
                    const isFuture = jobDate > now && job.status !== 'in_progress';
                    const startTime = job.start_time ? job.start_time.slice(0, 5) : "TBD";

                    return (
                      <div key={job.id} className="p-4 bg-cereniti-50 rounded-lg border border-cereniti-100">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-cereniti-900 bg-white px-2 py-1 rounded border border-cereniti-200 flex items-center gap-2 w-fit">
                               <Clock className="h-3 w-3" />
                               <span suppressHydrationWarning>{jobDate.toLocaleDateString()}</span>
                             </span>
                             <span className="text-[10px] text-cereniti-500 mt-1 pl-1 font-mono">
                               {startTime} • {job.estimated_duration ? formatDuration(job.estimated_duration) : "N/A"}
                             </span>
                          </div>
                          
                          {job.status === 'in_progress' ? (
                              <Link href={`/contractor/active/${job.id}`}>
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-1">
                                      <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"/> Resume
                                  </span>
                              </Link>
                          ) : isFuture ? (
                              <span className="text-[10px] bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 cursor-not-allowed">
                                 <Lock className="h-3 w-3" /> Locked
                              </span>
                          ) : (
                              <StartJobButton bookingId={job.id} serviceTitle={job.service?.title} />
                          )}
                        </div>
                        
                        <p className="text-sm font-serif text-cereniti-900 mt-2">{job.service?.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-cereniti-500">
                          <MapPin className="h-3 w-3" />
                          <span className="uppercase tracking-wider">{job.property?.estate_name || "Paarl"}</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-cereniti-400 bg-cereniti-50 rounded-lg border border-dashed border-cereniti-200">
                    <p className="text-sm">No jobs assigned.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}