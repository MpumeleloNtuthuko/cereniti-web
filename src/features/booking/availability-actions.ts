"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_CONCURRENT_JOBS = 3; // Change this based on your team size

export async function getBlockedTimeSlots(dateStr: string) {
  const supabase = await createClient();

  // 1. Fetch Existing Bookings (Capacity Check)
  const { data: bookings } = await supabase
    .from("bookings")
    .select("start_time, estimated_duration")
    .eq("scheduled_date", dateStr)
    .neq("status", "cancelled");

  // 2. Fetch Admin Blocks (Manual Overrides)
  const { data: adminBlocks } = await supabase
    .from("blocked_dates")
    .select("start_time, end_time")
    .eq("date", dateStr);

  const loadMap: Record<number, number> = {}; // Key is minute of day (e.g., 480 = 08:00)

  // --- PROCESS BOOKINGS (CAPACITY) ---
  if (bookings) {
    bookings.forEach(job => {
      if (!job.start_time) return;
      
      // Convert start time "08:00:00" to minutes from midnight
      const [h, m] = job.start_time.split(':').map(Number);
      let startMins = h * 60 + m;
      // Default duration 120 mins if missing
      let endMins = startMins + (job.estimated_duration || 120);

      // Increment load for every 30min block this job occupies
      for (let t = startMins; t < endMins; t += 30) {
        loadMap[t] = (loadMap[t] || 0) + 1;
      }
    });
  }

  // Use a Set to store unique blocked strings "HH:MM"
  const blockedStartTimes = new Set<string>();

  // --- CHECK CAPACITY LIMITS ---
  // Standard operating hours: 08:00 (480) to 16:00 (960)
  for (let t = 480; t <= 960; t += 30) {
    if ((loadMap[t] || 0) >= MAX_CONCURRENT_JOBS) {
      // Convert minutes back to "HH:MM"
      const h = Math.floor(t / 60).toString().padStart(2, '0');
      const m = (t % 60).toString().padStart(2, '0');
      blockedStartTimes.add(`${h}:${m}`);
    }
  }

  // --- PROCESS ADMIN BLOCKS ---
  if (adminBlocks) {
    adminBlocks.forEach(block => {
      // IF start_time IS NULL, IT MEANS WHOLE DAY BLOCKED
      if (!block.start_time) {
         // Block ALL standard slots
         for (let t = 480; t <= 960; t += 30) {
            const h = Math.floor(t / 60).toString().padStart(2, '0');
            const m = (t % 60).toString().padStart(2, '0');
            blockedStartTimes.add(`${h}:${m}`);
         }
      } else {
         // PARTIAL BLOCK (Specific Time Range)
         const [sh, sm] = block.start_time.split(':').map(Number);
         const [eh, em] = block.end_time.split(':').map(Number);
         const startMins = sh * 60 + sm;
         const endMins = eh * 60 + em;

         for (let t = startMins; t < endMins; t += 30) {
            const h = Math.floor(t / 60).toString().padStart(2, '0');
            const m = (t % 60).toString().padStart(2, '0');
            blockedStartTimes.add(`${h}:${m}`);
         }
      }
    });
  }

  return Array.from(blockedStartTimes).sort();
}