import { Service } from "@/types/database";

export interface DurationFactors {
  service?: Service;
  bedrooms: number;
  bathrooms: number;
  livingAreas: number;
  sqm: number;
  isHighCare: boolean; // Marble takes longer to clean safely
}

export function calculateDuration(factors: DurationFactors): number {
  if (!factors.service) return 0;

  // 1. BASELINE (Includes 1 Bed/1 Bath/0 Living)
  let minutes = factors.service.base_duration;

  // 2. VOLUME ADDITIONS
  const extraBeds = Math.max(0, factors.bedrooms - 1);
  const extraBaths = Math.max(0, factors.bathrooms - 1);
  const extraLiving = Math.max(0, factors.livingAreas);

  minutes += extraBeds * factors.service.duration_per_bed;
  minutes += extraBaths * factors.service.duration_per_bath;
  
  // Living areas usually take ~20 mins each
  minutes += extraLiving * 20; 

  // 3. SQM FACTOR (Large houses take walking time)
  // e.g. 1 min per 2 sqm
  minutes += (factors.sqm * 0.5);

  // 4. COMPLEXITY MULTIPLIER
  // High Care (Marble/Wood) requires slower, careful work (+15%)
  if (factors.isHighCare) {
    minutes = minutes * 1.15;
  }

  // Round to nearest 30 mins for scheduling blocks
  return Math.ceil(minutes / 30) * 30;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
}