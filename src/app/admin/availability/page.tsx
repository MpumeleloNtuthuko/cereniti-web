import { createClient } from "@/lib/supabase/server";
import { AvailabilityManager } from "@/components/admin/availability/availability-manager";
import { CalendarClock } from "lucide-react";

export default async function AvailabilityPage() {
  const supabase = await createClient();

  // Fetch ALL blocks
  const { data: blocks } = await supabase.from("blocked_dates").select("*");

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-full bg-cereniti-100 flex items-center justify-center text-cereniti-900">
          <CalendarClock className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-cereniti-900">Calendar Control</h1>
          <p className="text-cereniti-500 text-sm">Manage holidays, team training, and time-specific blocks.</p>
        </div>
      </div>

      {/* We pass all blocks to the client component */}
      <AvailabilityManager allBlocks={blocks || []} />
    </div>
  );
}