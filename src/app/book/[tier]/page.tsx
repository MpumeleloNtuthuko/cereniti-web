import { Navbar } from "@/components/layout/navbar";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DynamicBookingPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  
  // Guard against invalid URLs
  if (tier !== 'classic' && tier !== 'reserve') {
    redirect("/book");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Fetch Services FILTERED BY TIER
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .eq("tier", tier) // <--- The Filter
    .order("display_order");

  // 2. Fetch Common Data
  const [conditionsRes, addonsRes, perksRes, blockedRes] = await Promise.all([
    supabase.from("property_conditions").select("*").order("display_order"),
    supabase.from("addons").select("*").eq("is_active", true).order("price", { ascending: true }),
    supabase.from("perks").select("*, partner:partners(name, location)").eq("is_active", true),
    supabase.from("blocked_dates").select("date")
  ]);

  const conditions = conditionsRes.data || [];
  const addons = addonsRes.data || [];
  const blockedDates = blockedRes.data?.map(d => new Date(d.date)) || [];
  
  // Perks only matter for Reserve, but we pass empty array for Classic to hide the step
  const formattedPerks = tier === 'reserve' 
    ? perksRes.data?.map((p: any) => ({
        ...p,
        partner_name: p.partner?.name,
        partner_location: p.partner?.location
      })) || []
    : [];

  return (
    <main className="min-h-screen bg-cereniti-50">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 lg:px-12 py-24 lg:py-32">
        
        {/* Header with Back Button */}
        <div className="relative text-center mb-10 lg:mb-16">
           <Link href="/book" className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cereniti-400 hover:text-cereniti-900 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Switch Tier
           </Link>

           <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${tier === 'reserve' ? 'bg-cereniti-900 text-gold-500' : 'bg-white border border-cereniti-200 text-cereniti-500'}`}>
              {tier === 'reserve' ? 'Reserve Collection' : 'Classic Collection'}
           </span>
           <h1 className="mt-6 font-serif text-3xl md:text-5xl text-cereniti-900 leading-tight">
             {tier === 'reserve' ? 'Curate your Experience.' : 'Schedule your Standard.'}
           </h1>
        </div>

        {/* The Wizard (Reused) */}
        <BookingWizard 
           services={services || []} 
           conditions={conditions}
           addons={addons} 
           perks={formattedPerks} // Empty for Classic, Full for Reserve
           blockedDates={blockedDates} 
        />

      </div>
    </main>
  );
}