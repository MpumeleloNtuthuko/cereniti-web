"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to verify the requester is an Admin
async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error("Access Denied: Admins Only");
  return { supabase, requesterId: user.id };
}

export async function updateUserRole(targetUserId: string, newRole: 'client' | 'contractor' | 'admin') {
  try {
    const { supabase, requesterId } = await ensureAdmin();

    // SAFETY CHECK: Prevent Admin from demoting themselves
    if (targetUserId === requesterId && newRole !== 'admin') {
      return { success: false, message: "Safety Protocol: You cannot revoke your own Admin status." };
    }

    // Update the Role
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", targetUserId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/users");
    return { success: true, message: `User role updated to ${newRole.toUpperCase()}.` };

  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

export async function deleteUser(targetUserId: string) {
    // Note: Deleting users is complex due to Foreign Keys (bookings, etc).
    // Usually, we just "Ban" or "Suspend" them. For now, we'll implement Role changes only.
    return { success: false, message: "User deletion is disabled for data integrity." };
}