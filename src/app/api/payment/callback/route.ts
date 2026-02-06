import { createClient } from "@/lib/supabase/server";
import { paystack } from "@/lib/services/paystack";
import { NextResponse } from "next/server";

// CRITICAL: Prevent Next.js from caching this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. DETERMINE BASE URL (Fixes the "undefined" error)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }

    console.log(`Processing Payment Callback for: ${reference}`);

    // 2. Verify with Paystack
    const verification = await paystack.verifyTransaction(reference);

    if (!verification.success) {
      console.error("Paystack Verification Failed:", verification);
      // Redirect to Book page with error
      return NextResponse.redirect(`${origin}/book?error=payment_verification_failed`);
    }

    console.log("Payment Verified. Updating Database...");

    // 3. Update Database
    const supabase = await createClient();
    
    // Update booking status
    const { error } = await supabase
      .from("bookings")
      .update({ 
        payment_status: 'paid',
        status: 'requested', // Make visible to Admin
        payment_method: verification.method || 'paystack'
      })
      .eq("id", reference);

    if (error) {
      console.error("Database Update Error:", error);
      return NextResponse.redirect(`${origin}/book?error=database_update_failed`);
    }

    // 4. Success Redirect
    return NextResponse.redirect(`${origin}/client?payment=success`);

  } catch (error: any) {
    console.error("CRITICAL PAYMENT ERROR:", error);
    // Return JSON in dev to see the error details clearly
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}