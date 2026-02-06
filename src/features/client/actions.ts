"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateCancellation } from "@/lib/logic/refunds";

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  // 1. Fetch Booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("status, scheduled_date, total_price")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (!booking) return { success: false, message: "Booking not found." };

  if (booking.status === 'in_progress' || booking.status === 'completed') {
    return { success: false, message: "Cannot cancel a job that is active or completed." };
  }

  // 2. Calculate Financials (PASS STATUS HERE)
  const calc = calculateCancellation(booking.total_price, booking.scheduled_date, booking.status);

  // 3. Update Database
  const { error } = await supabase
    .from("bookings")
    .update({ 
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_fee: calc.penaltyAmount,
      refund_amount: calc.refundAmount,
      special_requests: `[SYSTEM: CANCELLED] Refund: R${calc.refundAmount} | Fee: R${calc.penaltyAmount} (${calc.tierName})` 
    })
    .eq("id", bookingId);

  if (error) return { success: false, message: error.message };
  
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/client/bookings");
  return { success: true, message: `Booking cancelled. Refund of R${calc.refundAmount} initiated.` };
}

// 2. LOG INCIDENT / TICKET
export async function submitTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const rawData = {
    type: formData.get("type"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    booking_id: formData.get("booking_id")?.toString() || null, // Optional
  };

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user.id,
    type: rawData.type,
    subject: rawData.subject,
    description: rawData.description,
    booking_id: rawData.booking_id, // If linked to a specific job
    status: 'open'
  });

  if (error) return { success: false, message: "Failed to log ticket." };

  // Notify Admin (Mock)
  console.log(`🚨 NEW TICKET from ${user.email}: ${rawData.subject}`);

  revalidatePath("/dashboard/client/support");
  return { success: true, message: "Ticket logged. Our Concierge will respond shortly." };
}