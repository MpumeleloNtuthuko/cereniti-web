import { Service, PropertyCondition, Addon } from "@/types/database";

export interface PricingFactors {
  service?: Service;
  condition?: PropertyCondition;
  bedrooms: number;
  bathrooms: number;
  livingAreas: number;
  sqm: number;
  isHighCare: boolean;
  selectedAddons: Addon[];
}

export function calculateTotal(factors: PricingFactors): number {
  if (!factors.service) return 0;

  // 1. VOLUME CALCULATION
  // Calculate extra rooms beyond the base (1 Bed/1 Bath/0 Living included in base price)
  const extraBeds = Math.max(0, factors.bedrooms - 1);
  const extraBaths = Math.max(0, factors.bathrooms - 1);
  const extraLiving = Math.max(0, factors.livingAreas - 1); 

  // Room Costs
  const bedCost = extraBeds * factors.service.price_per_bed;
  const bathCost = extraBaths * factors.service.price_per_bath;
  const livingCost = extraLiving * factors.service.price_per_living;

  // Volume Subtotal
  const volumeTotal = factors.service.base_price + bedCost + bathCost + livingCost;

  // 2. SURFACE AREA CALCULATION
  const surfaceCost = (factors.sqm || 0) * (factors.service.price_per_sqm || 0);

  // Combine Base + Surface
  const baseWithSurface = volumeTotal + surfaceCost;

  // 3. CONDITION MULTIPLIER (The Intensity)
  let conditionVal = factors.condition?.value || 1.0;
  
  // Cap the multiplier if the service restricts it (e.g. Classic Tier caps at 1.2x)
  if (factors.service.condition_multiplier_cap && conditionVal > factors.service.condition_multiplier_cap) {
    conditionVal = factors.service.condition_multiplier_cap;
  }

  // 4. FINISHES MULTIPLIER (The Risk Premium)
  // +25% for high-care surfaces like marble/stone
  const finishesMultiplier = factors.isHighCare ? 1.25 : 1.0;

  // Calculate Labor Subtotal (Multipliers apply to the service work, not add-ons)
  const laborSubtotal = baseWithSurface * conditionVal * finishesMultiplier;

  // 5. ADD-ONS (DUAL PRICING LOGIC)
  // Check if the current service is 'classic' tier and use the cheaper price if available
  const addonsTotal = factors.selectedAddons.reduce((sum, item) => {
    // If service tier is classic, use price_classic. If null, fallback to standard price.
    // If service tier is reserve, use standard price.
    // Note: We use optional chaining in case 'tier' is missing in legacy data
    const itemPrice = (factors.service?.tier === 'classic' && item.price_classic) 
      ? item.price_classic 
      : item.price;
      
    return sum + itemPrice;
  }, 0);

  // 6. FINAL TOTAL
  const grandTotal = laborSubtotal + addonsTotal;

  // Round to nearest 10 for clean display (e.g. R1253 -> R1260)
  return Math.ceil(grandTotal / 10) * 10;
}

/**
 * Calculates the individual payout per contractor based on the "Labor Pot" model.
 * 
 * Logic:
 * - Solo Job (1 Person): 35% Commission
 * - Team Job (2+ People): 45% Labor Pot shared equally
 */
export function calculateContractorShare(totalPrice: number, teamSize: number = 1): number {
  const size = Math.max(1, teamSize);
  let payout = 0;

  if (size === 1) {
    // Solo Job: 35% Commission
    payout = totalPrice * 0.35;
  } else {
    // Team Job: Share of 45% Labor Pot
    const laborPot = totalPrice * 0.45;
    payout = laborPot / size;
  }

  // Safety Floor: Ensure no one earns less than R230 (Transport/Base Minimum)
  return Math.max(230, payout);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}