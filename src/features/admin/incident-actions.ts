"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin') throw new Error("Admin access required");
  
  return supabase;
}

// 1. UPDATE STATUS (e.g. Start Investigation)
export async function updateTicketStatus(id: string, status: 'open' | 'investigating' | 'resolved') {
  try {
    const supabase = await ensureAdmin();
    const { error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/incidents");
    revalidatePath(`/admin/incidents/${id}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// 2. RESOLVE & RESPOND
export async function resolveTicket(id: string, response: string) {
  try {
    const supabase = await ensureAdmin();
    const { error } = await supabase
      .from("support_tickets")
      .update({ 
        status: 'resolved',
        admin_response: response
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    // TODO: Trigger Email Notification here via emailService

    revalidatePath("/admin/incidents");
    revalidatePath(`/admin/incidents/${id}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}