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
  isHighCare: z.boolean().default(false),
  
  // Selections
  conditionId: z.string().uuid("Please select the home condition"),
  serviceId: z.string().uuid("Please select a service"),
  addonIds: z.array(z.string()).optional(),
  selectedPerkId: z.string().optional(),
  
  // Logistics
  frequency: z.enum(["once-off", "weekly", "bi-weekly", "monthly"]),
  scheduledDate: z.date({ required_error: "Please select a date" }),
  startTime: z.string({ required_error: "Please select a start time" }), // <--- NEW
  specialRequests: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;