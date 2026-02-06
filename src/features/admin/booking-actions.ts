"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { whatsappService } from "@/lib/services/whatsapp";
import { formatCurrency, calculateContractorShare } from "@/lib/logic/pricing";

// ... (keep checkAdmin helper) ...
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === 'admin';
}

export async function broadcastBooking(bookingId: string) {
  const supabase = await createClient();
  
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  // 1. Fetch Booking Details
  // FIX: Added ', tier' to the service relation selection
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      property:client_properties!bookings_property_id_fkey(estate_name, address, bedrooms, bathrooms),
      service:services(title, tier) 
    `)
    .eq("id", bookingId)
    .single();

  if (!booking) return { success: false, message: "Booking not found." };

  // 2. Get Active Contractors
  const { data: contractors } = await supabase
    .from("contractors")
    .select(`id, profile:profiles!contractors_id_fkey(full_name, phone)`)
    .eq("status", "active");

  // @ts-ignore
  if (!contractors || contractors.length === 0) {
    return { success: false, message: "No active contractors found." };
  }

  // 3. Prepare Broadcast Rows
  const broadcastRows = contractors.map(c => ({
    booking_id: bookingId,
    contractor_id: c.id,
    status: 'sent'
  }));

  const { error } = await supabase.from("job_broadcasts").insert(broadcastRows);
  if (error) return { success: false, message: error.message };

  // 4. TRIGGER WHATSAPP NOTIFICATIONS
  const teamSize = booking.specialists_needed || 1;
  const contractorEarnings = calculateContractorShare(booking.total_price, teamSize);
  
  const prop = Array.isArray(booking.property) ? booking.property[0] : booking.property;
  const locationDisplay = prop?.estate_name || prop?.address || "Paarl Area";
  const bedCount = prop?.bedrooms ?? 1;
  const bathCount = prop?.bathrooms ?? 1;
  const layoutString = `${bedCount} Bed / ${bathCount} Bath`;
  
  // FIX: Extract the tier correctly now that we fetched it
  const tier = booking.service?.tier || 'classic';

  const notificationPromises = contractors.map(async (c: any) => {
    const profile = Array.isArray(c.profile) ? c.profile[0] : c.profile;

    if (profile?.phone) {
      await whatsappService.sendJobAlert(
        profile.phone,
        profile.full_name || "Specialist",
        {
          location: locationDisplay,
          earnings: formatCurrency(contractorEarnings),
          date: new Date(booking.scheduled_date).toLocaleDateString(),
          type: booking.service?.title || "Home Care",
          layout: layoutString,
          tier: tier // <--- Pass correct tier
        }
      );
    }
  });

  await Promise.all(notificationPromises);

  revalidatePath(`/admin/bookings/${bookingId}`);
  return { success: true, count: contractors.length };
}

// ... (keep updateBookingStatus and updateTeamSize) ...
export async function updateBookingStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'in_progress') {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  return { success: true };
}

export async function updateTeamSize(bookingId: string, size: number) {
  const supabase = await createClient();
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, message: "Unauthorized" };

  const { error } = await supabase
    .from("bookings")
    .update({ specialists_needed: size })
    .eq("id", bookingId);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/bookings/${bookingId}`);
  return { success: true };
}