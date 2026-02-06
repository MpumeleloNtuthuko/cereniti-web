import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

// Helper to validate File (Server) OR FileList (Client)
const validateFile = (fileOrList: any) => {
  if (!fileOrList) return false;
  
  // 1. Client Side Check (FileList)
  if (typeof FileList !== "undefined" && fileOrList instanceof FileList) {
    return fileOrList.length > 0;
  }
  
  // 2. Server Side Check (File)
  if (typeof File !== "undefined" && fileOrList instanceof File) {
    return fileOrList.size > 0;
  }
  
  return false;
};

// Helper to check size
const validateSize = (fileOrList: any) => {
  if (!fileOrList) return false;
  if (typeof FileList !== "undefined" && fileOrList instanceof FileList) {
    return fileOrList[0]?.size <= MAX_FILE_SIZE;
  }
  if (typeof File !== "undefined" && fileOrList instanceof File) {
    return fileOrList.size <= MAX_FILE_SIZE;
  }
  return false;
};

// Helper to check type
const validateType = (fileOrList: any) => {
  if (!fileOrList) return false;
  let type = "";
  
  if (typeof FileList !== "undefined" && fileOrList instanceof FileList) {
    type = fileOrList[0]?.type;
  } else if (typeof File !== "undefined" && fileOrList instanceof File) {
    type = fileOrList.type;
  }
  
  return ACCEPTED_FILE_TYPES.includes(type);
};

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^(\+27|0)[6-8][0-9]{8}$/, "Invalid SA phone number"),
  idNumber: z.string().length(13, "SA ID Number must be 13 digits"),
  experienceYears: z.coerce.number().min(0, "Years cannot be negative"),
  hasSmartphone: z.boolean().default(false).refine(val => val === true, "A smartphone is required."),
  transportNeeded: z.boolean().default(true),
  
  // UPDATED FILE LOGIC
  cv: z.any()
    .refine(validateFile, "CV is required.")
    .refine(validateSize, "Max file size is 5MB.")
    .refine(validateType, "Only PDF, JPG, or PNG allowed."),
  
  idDoc: z.any()
    .refine(validateFile, "Certified ID is required.")
    .refine(validateSize, "Max file size is 5MB.")
    .refine(validateType, "Only PDF, JPG, or PNG allowed."),

  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms." }),
  }),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;