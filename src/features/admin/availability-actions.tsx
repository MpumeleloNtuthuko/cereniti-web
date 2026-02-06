"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// FETCH BLOCKS FOR A SPECIFIC MONTH (For UI display)
export async function getBlockedDates(start: Date, end: Date) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blocked_dates")
    .select("*")
    .gte("date", start.toISOString())
    .lte("date", end.toISOString());
  return data || [];
}

// ADD BLOCK (Whole Day OR Time Range)
export async function addBlock(dateStr: string, start?: string, end?: string, reason?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  // If Start/End provided, it's a time block. If null, it's a full day.
  const { error } = await supabase.from("blocked_dates").insert({
    date: dateStr,
    start_time: start || null,
    end_time: end || null,
    reason: reason || 'Unavailable'
  });

  if (error) return { success: false, message: error.message };
  
  revalidatePath("/admin/availability");
  revalidatePath("/book");
  return { success: true };
}

// REMOVE BLOCK
export async function removeBlock(blockId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blocked_dates").delete().eq("id", blockId);
  
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/availability");
  revalidatePath("/book");
  return { success: true };
}