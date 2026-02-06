"use server";

import { createClient } from "@/lib/supabase/server";
import { applicationSchema } from "@/lib/schemas/application";
// REMOVED: import { v4 as uuidv4 } from "uuid"; 

export async function submitApplication(prevState: any, formData: FormData) {
  // WRAP IN TRY/CATCH TO PREVENT 500 ERRORS
  try {
    const supabase = await createClient();

    // 1. SECURITY CHECK
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    // 2. EXTRACT DATA
    const rawData = {
      fullName: formData.get("fullName"),
      email: user.email, 
      phone: formData.get("phone"),
      idNumber: formData.get("idNumber"),
      experienceYears: Number(formData.get("experienceYears")),
      hasSmartphone: formData.get("hasSmartphone") === "on",
      transportNeeded: formData.get("transportNeeded") === "on",
      cv: formData.get("cv") as File,
      idDoc: formData.get("idDoc") as File,
      termsAccepted: formData.get("termsAccepted") === "on",
    };

    // 3. VALIDATE
    const result = applicationSchema.safeParse(rawData);
    if (!result.success) {
      console.error("Validation Error:", result.error.flatten());
      return { success: false, errors: result.error.flatten().fieldErrors };
    }

    // 4. UPLOAD FILES
    // Use native crypto.randomUUID() instead of external library
    const folderName = result.data.idNumber; 
    
    // Upload CV
    const cvFileName = `${folderName}/cv-${crypto.randomUUID()}-${result.data.cv.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: cvError } = await supabase.storage
      .from("secure-applications")
      .upload(cvFileName, result.data.cv);

    if (cvError) {
      console.error("Supabase Storage Error (CV):", cvError);
      return { success: false, message: `CV Upload Failed: ${cvError.message}` };
    }

    // Upload ID
    const idFileName = `${folderName}/id-${crypto.randomUUID()}-${result.data.idDoc.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error: idError } = await supabase.storage
      .from("secure-applications")
      .upload(idFileName, result.data.idDoc);

    if (idError) {
      console.error("Supabase Storage Error (ID):", idError);
      return { success: false, message: `ID Upload Failed: ${idError.message}` };
    }

    // 5. INSERT TO DB
    const { error: dbError } = await supabase.from("contractor_applications").insert({
      user_id: user.id,
      full_name: result.data.fullName,
      email: user.email,
      phone: result.data.phone,
      id_number: result.data.idNumber,
      experience_years: result.data.experienceYears,
      has_smartphone: result.data.hasSmartphone,
      transport_needed: result.data.transportNeeded,
      cv_path: cvFileName,
      id_doc_path: idFileName,
      status: 'pending'
    });

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return { success: false, message: `Database Error: ${dbError.message}` };
    }

    // OPTIONAL: Sync Profile
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: result.data.fullName,
      phone: result.data.phone,
      role: 'client' 
    }, { onConflict: 'id', ignoreDuplicates: true });

    return { success: true, message: "Application received successfully." };

  } catch (e: any) {
    console.error("CRITICAL SERVER ERROR:", e);
    return { success: false, message: `Server Error: ${e.message || "Unknown error"}` };
  }
}