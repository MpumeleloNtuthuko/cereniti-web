"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function acceptJob(broadcastId: string, bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Unauthorized" };

  try {
    // CALL THE DATABASE FUNCTION
    const { data: result, error } = await supabase.rpc('claim_job', {
      p_booking_id: bookingId
    });

    if (error) {
      console.error("RPC Error:", error);
      return { success: false, message: "System error during assignment." };
    }

    // Check logic result from SQL
    // @ts-ignore
    if (result && !result.success) {
      // @ts-ignore
      return { success: false, message: result.message };
    }

    revalidatePath("/dashboard/contractor");
    return { success: true, message: "Job Accepted! Added to Upcoming Schedule." };

  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function declineJob(broadcastId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("job_broadcasts")
    .update({ status: 'rejected' })
    .eq("id", broadcastId);

  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard/contractor");
  return { success: true };
}