import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { emailService } from "@/lib/services/email";

// Admin Client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Security Check (Vercel Cron Header)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Call the Database Logic
    const { data: cancelledJobs, error } = await supabaseAdmin.rpc('auto_cancel_unconfirmed_bookings');

    if (error) throw error;

    if (!cancelledJobs || cancelledJobs.length === 0) {
      return NextResponse.json({ message: "No stale bookings found." });
    }

    console.log(`🧹 Auto-cancelled ${cancelledJobs.length} stale bookings.`);

    // 2. Notify Clients (Apology + Refund Info)
    const emailPromises = cancelledJobs.map(async (job: any) => {
      await emailService.send({
        to: job.client_email,
        subject: "Update regarding your Cereniti Request",
        body: `
          Dear ${job.client_name},
          
          We sincerely apologize, but we were unable to secure a Guild Specialist for your request on ${new Date(job.booking_date).toDateString()} within our quality assurance window.
          
          To maintain our standards, we do not deploy backup teams at the last minute. 
          
          Your request has been cancelled and a full refund has been initiated to your payment method (allow 5-7 business days).
          
          Regards,
          The Cereniti Concierge Team
        `
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true, cancelled_count: cancelledJobs.length });

  } catch (e: any) {
    console.error("Cleanup Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}