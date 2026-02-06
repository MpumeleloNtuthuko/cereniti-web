"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- HELPER: Admin Check ---
async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: No User Found");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // In dev mode, if you haven't set yourself as admin yet, you might want to comment this check out temporarily
  // but for production, keep it strict.
  if (profile?.role !== 'admin') throw new Error("Unauthorized: Admin Access Required");
  
  return supabase;
}

// 1. REJECT APPLICATION
export async function rejectApplication(id: string) {
  try {
    const supabase = await ensureAdmin();
    const { error } = await supabase.from("contractor_applications").update({ status: 'rejected' }).eq("id", id);
    if (error) throw new Error(error.message);
    
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// 2. INVITE TO ASSESSMENT (Generates Link)
export async function inviteToAssessment(id: string) {
  try {
    const supabase = await ensureAdmin();
    
    // Update status
    const { error } = await supabase.from("contractor_applications").update({ status: 'assessment_invited' }).eq("id", id);
    if (error) throw new Error(error.message);

    // Generate Link
    const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contractor/assessment/${id}`;
    
    revalidatePath(`/admin/applications/${id}`);
    return { success: true, link };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// 3. INVITE TO INTERVIEW (Status Update Only)
export async function inviteToInterview(id: string) {
  try {
    const supabase = await ensureAdmin();
    const { error } = await supabase.from("contractor_applications").update({ status: 'interview' }).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath(`/admin/applications/${id}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// 4. APPROVE & ONBOARD (The Critical One)
export async function approveApplication(id: string) {
  try {
    const supabase = await ensureAdmin();

    // A. Fetch Application Data
    const { data: app } = await supabase
      .from("contractor_applications")
      .select("user_id, full_name, email, phone")
      .eq("id", id)
      .single();

    if (!app || !app.user_id) throw new Error("Critical: Application not linked to a User ID.");

    // B. SELF-HEALING: Ensure Profile Exists
    // (If the trigger failed earlier, we fix it now manually)
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", app.user_id).single();
    
    if (!profile) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: app.user_id,
        email: app.email,
        full_name: app.full_name,
        phone: app.phone,
        role: 'client' // We upgrade it in step D
      });
      if (profileError) throw new Error(`Profile Repair Failed: ${profileError.message}`);
    }

    // C. Create Contractor Record
    const { error: contractorError } = await supabase
      .from("contractors")
      .upsert({
        id: app.user_id, // Foreign Key to Profile
        application_id: id,
        status: 'active',
        joined_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (contractorError) throw new Error(`Contractor Registry Failed: ${contractorError.message}`);

    // D. Upgrade Profile Role
    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role: 'contractor' })
      .eq("id", app.user_id);

    if (roleError) throw new Error(`Role Upgrade Failed: ${roleError.message}`);

    // E. Finalize Application Status
    const { error: appError } = await supabase
      .from("contractor_applications")
      .update({ status: 'approved' })
      .eq("id", id);

    if (appError) throw new Error(`Status Update Failed: ${appError.message}`);

    revalidatePath(`/admin/applications/${id}`);
    return { success: true };

  } catch (e: any) {
    console.error("Approval Error:", e);
    return { success: false, message: e.message };
  }
}