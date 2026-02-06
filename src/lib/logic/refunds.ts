export interface RefundCalculation {
  hoursUntilJob: number;
  penaltyPercentage: number;
  refundPercentage: number;
  penaltyAmount: number;
  refundAmount: number;
  tierName: string;
  message: string;
}

export function calculateCancellation(totalPrice: number, scheduledDate: Date | string, status: string): RefundCalculation {
  const now = new Date();
  const jobDate = new Date(scheduledDate);
  
  // Difference in hours
  const hoursUntilJob = (jobDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  // --- LOGIC START ---
  
  // SCENARIO 1: Booking not yet confirmed by Admin (Free Cancellation)
  if (status === 'requested') {
    return {
      hoursUntilJob,
      penaltyPercentage: 0,
      refundPercentage: 1,
      penaltyAmount: 0,
      refundAmount: totalPrice,
      tierName: "Pending Approval",
      message: "Cancellation is free for pending requests."
    };
  }

  // SCENARIO 2: Confirmed Booking (Time-based Penalties)
  let penaltyPct = 0;
  let tier = "Standard Notice";
  let msg = "Full refund initiated.";

  if (hoursUntilJob <= 24) {
    penaltyPct = 0.75; // 75% Penalty
    tier = "Critical (<24h)";
    msg = "Late cancellation within 24 hours.";
  } else if (hoursUntilJob <= 48) {
    penaltyPct = 0.50; // 50% Penalty
    tier = "Short Notice (<48h)";
    msg = "Cancellation within 48 hours.";
  } else if (hoursUntilJob <= 72) {
    penaltyPct = 0.25; // 25% Penalty
    tier = "Notice Period (<72h)";
    msg = "Cancellation within 3 days.";
  }

  // Calculate Amounts
  const penaltyAmount = totalPrice * penaltyPct;
  const refundAmount = totalPrice - penaltyAmount;

  return {
    hoursUntilJob,
    penaltyPercentage: penaltyPct,
    refundPercentage: 1 - penaltyPct,
    penaltyAmount,
    refundAmount,
    tierName: tier,
    message: msg
  };
}