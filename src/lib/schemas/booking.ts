import { z } from "zod";

export const bookingSchema = z.object({
  // Property Info
  estateName: z.string().optional(),
  propertyName: z.string().min(2, "Property name required"),
  address: z.string().min(5, "Full address is required"),
  
  // Metrics
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  livingAreas: z.number().min(0),
  sqm: z.number().min(1, "Please enter property size"),
  
  // FIX: Allow optional/undefined, default to false
  isHighCare: z.boolean().optional().default(false), 
  
  // Selections
  conditionId: z.string().min(1, "Please select the home condition"),
  serviceId: z.string().min(1, "Please select a service"),
  addonIds: z.array(z.string()).optional(),
  selectedPerkId: z.string().optional(),
  
  // Logistics
  frequency: z.enum(["once-off", "weekly", "bi-weekly", "monthly"]),
  
  // Date & Time
scheduledDate: z.date({ message: "Please select a date" }),
  startTime: z.string({ message: "Please select a start time" }).min(1, "Start time is required"),
  specialRequests: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;