"use server";

import { createClient } from "@/lib/supabase/server";
import { bookingSchema } from "@/lib/schemas/booking";
import { revalidatePath } from "next/cache";
import { calculateTotal } from "@/lib/logic/pricing";
import { calculateDuration } from "@/lib/logic/duration";
import { paystack } from "@/lib/services/paystack"; // <--- Import Paystack Service

export async function createBooking(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. AUTH CHECK
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { success: false, message: "Please log in to book." };

  // 2. EXTRACTION & PARSING
  const rawAddons = formData.get("addonIds") as string;
  const addonIds = rawAddons ? JSON.parse(rawAddons) : [];

  const getString = (key: string) => {
    const val = formData.get(key);
    return (val && val.toString().trim() !== "") ? val.toString() : undefined;
  };

  const rawData = {
    propertyName: getString("propertyName"),
    address: getString("address"),
    estateName: getString("estateName"),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    livingAreas: Number(formData.get("livingAreas")),
    sqm: Number(formData.get("sqm")),
    isHighCare: formData.get("isHighCare") === "true",
    conditionId: getString("conditionId"),
    serviceId: getString("serviceId"),
    selectedPerkId: getString("selectedPerkId"),
    addonIds: addonIds,
    scheduledDate: new Date(formData.get("scheduledDate") as string),
    startTime: getString("startTime"),
    specialRequests: getString("specialRequests"),
    frequency: getString("frequency"),
  };

  const validation = bookingSchema.safeParse(rawData);
  if (!validation.success) {
    console.error("Validation Error:", validation.error.flatten());
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  // 3. FETCH DATA
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", validation.data.serviceId)
    .single();

  if (serviceError || !service) {
    return { success: false, message: "Selected service invalid." };
  }

  const { data: condition, error: conditionError } = await supabase
    .from("property_conditions")
    .select("*")
    .eq("id", validation.data.conditionId)
    .single();

  if (conditionError || !condition) {
    return { success: false, message: "Please select a property condition." };
  }

  let selectedAddons: any[] = [];
  if (addonIds.length > 0) {
    const { data: found } = await supabase.from("addons").select("*").in("id", addonIds);
    if (found) selectedAddons = found;
  }

  let perkDetails = null;
  if (validation.data.selectedPerkId && validation.data.selectedPerkId !== "decline") {
    const { data: perk } = await supabase
      .from("perks")
      .select("*, partner:partners(name)")
      .eq("id", validation.data.selectedPerkId)
      .single();
    perkDetails = perk;
  }

  // 4. CALCULATIONS
  const finalPrice = calculateTotal({
    bedrooms: validation.data.bedrooms,
    bathrooms: validation.data.bathrooms,
    livingAreas: validation.data.livingAreas,
    sqm: validation.data.sqm,
    isHighCare: validation.data.isHighCare,
    service: service,
    condition: condition,
    selectedAddons: selectedAddons
  });

  const durationMinutes = calculateDuration({
    service: service,
    bedrooms: validation.data.bedrooms,
    bathrooms: validation.data.bathrooms,
    livingAreas: validation.data.livingAreas,
    sqm: validation.data.sqm,
    isHighCare: validation.data.isHighCare
  });

  // 5. DATABASE TRANSACTION
  
  // A. Create Property
  const { data: property, error: propError } = await supabase
    .from("client_properties")
    .insert({
      user_id: user.id,
      name: validation.data.propertyName,
      address: validation.data.address,
      estate_name: validation.data.estateName,
      bedrooms: validation.data.bedrooms,
      bathrooms: validation.data.bathrooms,
      estimated_sqm: validation.data.sqm,
    })
    .select()
    .single();

  if (propError || !property) {
    return { success: false, message: "Could not save property details." };
  }

  // B. Format Notes
  const notesParts = [];
  if (validation.data.specialRequests) notesParts.push(`CLIENT NOTES:\n"${validation.data.specialRequests}"`);
  if (validation.data.isHighCare) notesParts.push(`⚠️ PROTOCOL: LUXURY FINISHES (High Care)`);
  if (perkDetails) {
    // @ts-ignore
    notesParts.push(`🎁 BENEFIT: ${perkDetails.title} @ ${perkDetails.partner?.name}`);
  }
  const finalNotes = notesParts.join("\n\n----------------\n\n");

  // C. Create Booking Record
  // We use the booking UUID as the Paystack Reference
  const bookingId = crypto.randomUUID(); // Generate ID manually

  const { error: bookingError } = await supabase.from("bookings").insert({
    id: bookingId, // Explicit ID
    user_id: user.id,
    property_id: property.id,
    service_id: validation.data.serviceId,
    scheduled_date: validation.data.scheduledDate.toISOString(),
    start_time: validation.data.startTime,
    estimated_duration: durationMinutes,
    
    // --- FINANCIAL & STATUS FIELDS ---
    status: 'requested',
    payment_status: 'pending', // <--- Initial Status
    paystack_ref: bookingId,   // <--- Link for verification
    total_price: finalPrice,        
    calculated_price: finalPrice,
    
    estimated_sqm: validation.data.sqm,
    addons_selected: selectedAddons, 
    frequency: validation.data.frequency,
    subscription_active: validation.data.frequency !== 'once-off',
  });

  if (bookingError) {
    console.error("Booking Error:", bookingError);
    return { success: false, message: "System error creating booking." };
  }

  // --- NEW: PAYMENT INITIALIZATION ---
  const payment = await paystack.initializeTransaction(user.email, finalPrice, bookingId);

  if (!payment.success || !payment.url) {
    // If payment fails to init, we delete the booking to prevent "zombie" unpaid bookings
    await supabase.from("bookings").delete().eq("id", bookingId);
    return { success: false, message: payment.message || "Could not initialize secure payment gateway." };
  }

  // Return the URL for the frontend to redirect
  revalidatePath("/dashboard");
  return { success: true, paymentUrl: payment.url };
}