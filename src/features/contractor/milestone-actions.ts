"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { PROTOCOLS } from "@/lib/data/protocols";

// 1. INITIALIZE THE TIMELINE (Updated to use RPC)
export async function startJobSequence(bookingId: string, serviceTitle: string) {
  const supabase = await createClient();
  
  // Define the Zones
  const zones = [
    { name: "Arrival & Setup", type: "arrival" },
    { name: "Primary Suite", type: "bedroom" },
    { name: "Guest Bedroom", type: "bedroom" },
    { name: "Master Bath", type: "bathroom" },
    { name: "Living & Dining", type: "living" },
    { name: "Culinary Zone", type: "kitchen" },
    { name: "Departure", type: "departure" },
  ];

  // Prepare the data payload
  const milestones = zones.map((zone, index) => ({
    // booking_id will be handled by the RPC
    zone_name: zone.name,
    status: index === 0 ? 'in_progress' : 'pending',
    // @ts-ignore
    tasks: PROTOCOLS[zone.type] || [],
    progress: 0
  }));

  // CALL THE SECURE DATABASE FUNCTION
  const { error } = await supabase.rpc('start_job_sequence', {
    p_booking_id: bookingId,
    p_milestones: milestones
  });
  
  if (error) {
    console.error("Start Job Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath(`/contractor/active/${bookingId}`);
  return { success: true };
}

// 2. UPDATE A SPECIFIC TASK (Keep existing logic, this usually works fine via RLS)
export async function updateMilestoneTask(milestoneId: string, taskLabel: string, completed: boolean, currentTasks: any[]) {
  const supabase = await createClient();

  // Update the JSON array
  const newTasks = currentTasks.map(t => 
    t.label === taskLabel ? { ...t, completed } : t
  );

  // Calculate new progress %
  const total = newTasks.length;
  const done = newTasks.filter((t: any) => t.completed).length;
  const progress = Math.round((done / total) * 100);

  // Auto-complete status if 100%
  const status = progress === 100 ? 'completed' : 'in_progress';
  const completedAt = progress === 100 ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("job_milestones")
    .update({ 
      tasks: newTasks,
      progress,
      status,
      completed_at: completedAt
    })
    .eq("id", milestoneId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/contractor/active/[id]`);
  return { success: true };
}