"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { headers } from "next/headers";
import { emailService } from "@/lib/services/email";

// --- VALIDATION SCHEMAS ---

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^(\+27|0)[6-8][0-9]{8}$/, "Invalid SA phone number"), 
  role: z.enum(["client", "contractor"]),
});

// --- HELPER: GET SAFE ORIGIN ---
async function getSafeOrigin() {
  const headerOrigin = (await headers()).get("origin") || "";
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // If the header is invalid (0.0.0.0) or missing, use the Env Variable
  if (!headerOrigin || headerOrigin.includes("0.0.0.0")) {
    return envUrl;
  }
  
  return headerOrigin;
}

// --- ACTIONS ---

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const nextParam = formData.get("next") as string;

  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return { error: "Invalid email or password format." };
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data);
  
  if (error) {
    return { error: "Invalid credentials. Please try again." };
  }

  if (nextParam && nextParam.startsWith("/")) {
    revalidatePath("/", "layout");
    redirect(nextParam);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  revalidatePath("/", "layout");

  if (profile?.role === 'admin') {
    redirect("/admin/dashboard");
  } else if (profile?.role === 'contractor') {
    redirect("/contractor");
  } else {
    redirect("/client");
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const origin = await getSafeOrigin(); // Use Safe Origin
  
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    role: formData.get("role") as "client" | "contractor",
  };

  const validation = signupSchema.safeParse(rawData);
  if (!validation.success) {
    const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0];
    return { error: firstError || "Please check your inputs." };
  }

  const { error } = await supabase.auth.signUp({
    email: rawData.email,
    password: rawData.password,
    options: {
      data: {
        full_name: rawData.fullName,
        phone: rawData.phone,
        role: rawData.role,
      },
      // FIXED: Use the sanitized origin
      emailRedirectTo: `${origin}/${rawData.role === 'contractor' ? 'contractor/join' : 'book'}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  
  if (rawData.role === 'contractor') {
    redirect("/contractor/join");
  } else {
    redirect("/book");
  }
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// --- PASSWORD RECOVERY ---

export async function forgotPassword(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = await getSafeOrigin(); // Use Safe Origin (Fixes 0.0.0.0 issue)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // FIX: Uses sanitized origin so the email link is valid
    redirectTo: `${origin}/callback?next=/update-password`,
  });

  if (error) {
    console.error("Reset Error:", error.message);
    return { error: "Could not send reset link. Please try again." };
  }

  return { success: true, message: "If an account exists, a recovery link has been sent." };
}

export async function updatePassword(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Password updated successfully");
}