"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, ApplicationFormValues } from "@/lib/schemas/application";
import { submitApplication } from "@/features/contractor/actions";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, FileText, Lock } from "lucide-react";
import { TermsModal } from "./terms-modal";
import { cn } from "@/lib/utils";

interface ApplicationFormProps {
  userEmail: string;
  userId: string;
  userName: string;
  userPhone: string;
}

export function ApplicationForm({ userEmail, userId, userName, userPhone }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // FIX: Removed <ApplicationFormValues> to let Zod infer types automatically
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
        email: userEmail,
        fullName: userName, 
        phone: userPhone,   
        experienceYears: 0,
        hasSmartphone: false,
        transportNeeded: true,
        termsAccepted: false
    }
  });
  
  // @ts-ignore
  const termsAccepted = watch("termsAccepted");
  
  const handleAcceptTerms = () => {
    setValue("termsAccepted", true, { shouldValidate: true });
    setShowTerms(false);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
        const formData = new FormData();
        
        // Append text fields
        formData.append("fullName", data.fullName);
        formData.append("email", userEmail); 
        formData.append("phone", data.phone);
        formData.append("idNumber", data.idNumber);
        formData.append("experienceYears", String(data.experienceYears));
        formData.append("hasSmartphone", data.hasSmartphone ? "on" : "off");
        formData.append("transportNeeded", data.transportNeeded ? "on" : "off");
        formData.append("termsAccepted", data.termsAccepted ? "on" : "off");

        if (data.cv && data.cv.length > 0) formData.append("cv", data.cv[0]);
        if (data.idDoc && data.idDoc.length > 0) formData.append("idDoc", data.idDoc[0]);

        const result = await submitApplication(null, formData);

        if (result.success) {
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (result.errors) {
                setServerError("Please check your inputs. Some fields are invalid.");
            } else {
                setServerError(result.message || "An unexpected error occurred.");
            }
        }
    } catch (error) {
        setServerError("Network error. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 space-y-6 bg-white border border-cereniti-200 rounded-xl p-8 shadow-sm">
        <div className="h-20 w-20 bg-cereniti-900 text-white mx-auto flex items-center justify-center rounded-full text-4xl font-serif">✓</div>
        <h3 className="font-serif text-3xl text-cereniti-900">Application Received</h3>
        <p className="text-cereniti-600 max-w-md mx-auto leading-relaxed">
            Your documents have been securely vaulted. The Guild Council will review your profile.
        </p>
        <Button className="bg-cereniti-100 text-cereniti-900 hover:bg-cereniti-200" onClick={() => window.location.href = '/'}>
            Return Home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {serverError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r">
              <p className="font-bold">Submission Failed</p>
              <p>{serverError}</p>
          </div>
      )}

      {/* --- PERSONAL DETAILS --- */}
      <div className="space-y-6">
        
        {/* EMAIL FIELD (LOCKED) */}
        <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold flex items-center gap-2">
                <Lock className="h-3 w-3" /> Account Email
            </label>
            <input 
                {...register("email")}
                type="email" 
                readOnly 
                className="input-std w-full border-b border-cereniti-200 py-3 bg-cereniti-50 text-cereniti-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-cereniti-400">Linked to your login credentials.</p>
        </div>

        <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Full Name</label>
            <input 
            {...register("fullName")}
            type="text" 
            className={cn("input-std w-full border-b border-cereniti-300 py-3 focus:outline-none focus:border-cereniti-900 transition-colors bg-transparent", errors.fullName && "border-red-500")}
            placeholder="e.g. Thandiwe Nkosi"
            />
            {/* @ts-ignore */}
            {errors.fullName && <p className="text-xs text-red-500 font-medium">{String(errors.fullName.message)}</p>}
        </div>

        <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">WhatsApp Number</label>
            <input 
              {...register("phone")} 
              type="tel" 
              className={cn("input-std w-full border-b border-cereniti-300 py-3 focus:outline-none focus:border-cereniti-900 bg-transparent", errors.phone && "border-red-500")}
              placeholder="072 123 4567" 
            />
            {/* @ts-ignore */}
            {errors.phone && <p className="text-xs text-red-500 font-medium">{String(errors.phone.message)}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">SA ID Number</label>
                <input {...register("idNumber")} type="text" className={cn("input-std w-full border-b border-cereniti-300 py-3 focus:outline-none focus:border-cereniti-900 bg-transparent", errors.idNumber && "border-red-500")} placeholder="13 digits" />
                {/* @ts-ignore */}
                {errors.idNumber && <p className="text-xs text-red-500 font-medium">{String(errors.idNumber.message)}</p>}
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Years of Experience</label>
                <input {...register("experienceYears")} type="number" className={cn("input-std w-full border-b border-cereniti-300 py-3 focus:outline-none focus:border-cereniti-900 bg-transparent", errors.experienceYears && "border-red-500")} defaultValue={0} />
                {/* @ts-ignore */}
                {errors.experienceYears && <p className="text-xs text-red-500 font-medium">{String(errors.experienceYears.message)}</p>}
            </div>
        </div>
      </div>

      {/* --- DOCUMENT UPLOAD --- */}
      <div className="pt-8 border-t border-cereniti-100">
        <p className="text-xs font-bold uppercase tracking-widest text-cereniti-900 mb-6">Required Documentation</p>
        <div className="space-y-8">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-cereniti-500 flex items-center gap-2"><FileText className="h-3 w-3" /> Curriculum Vitae (CV)</label>
                <div className="relative group"><input {...register("cv")} type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm text-cereniti-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cereniti-100 file:text-cereniti-900 hover:file:bg-cereniti-200 cursor-pointer border border-cereniti-200 rounded-lg p-3 bg-cereniti-50/50" /></div>
                {/* @ts-ignore */}
                {errors.cv && <p className="text-xs text-red-500 font-medium">{String(errors.cv.message)}</p>}
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-cereniti-500 flex items-center gap-2"><UploadCloud className="h-3 w-3" /> Certified ID</label>
                <div className="relative group"><input {...register("idDoc")} type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full text-sm text-cereniti-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cereniti-100 file:text-cereniti-900 hover:file:bg-cereniti-200 cursor-pointer border border-cereniti-200 rounded-lg p-3 bg-cereniti-50/50" /></div>
                {/* @ts-ignore */}
                {errors.idDoc && <p className="text-xs text-red-500 font-medium">{String(errors.idDoc.message)}</p>}
            </div>
        </div>
      </div>

      {/* --- CHECKBOXES & TERMS --- */}
      <div className="pt-8 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer"><input {...register("hasSmartphone")} type="checkbox" className="h-5 w-5 accent-cereniti-900 border-cereniti-300 rounded" /><span className="text-sm text-cereniti-700">I have a working smartphone</span></label>
        {/* @ts-ignore */}
        {errors.hasSmartphone && <p className="text-xs text-red-500">{String(errors.hasSmartphone.message)}</p>}
        
        <label className="flex items-center gap-3 cursor-pointer"><input {...register("transportNeeded")} type="checkbox" defaultChecked className="h-5 w-5 accent-cereniti-900 border-cereniti-300 rounded" /><span className="text-sm text-cereniti-700">I need transport from Paarl Taxi Rank</span></label>
      </div>

      <div className="pt-6 border-t border-cereniti-100">
        <div className={cn("flex items-start gap-3 rounded-lg border p-4 transition-colors", errors.termsAccepted ? "border-red-200 bg-red-50" : "border-cereniti-100 bg-cereniti-50/50")}>
          <div className="pt-1"><input {...register("termsAccepted")} type="checkbox" className="h-5 w-5 cursor-pointer accent-cereniti-900" /></div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-cereniti-900 block">I agree to the Terms & Privacy Policy</label>
            <p className="text-xs text-cereniti-500 leading-relaxed">By checking this box, I confirm I have read the <button type="button" onClick={() => setShowTerms(true)} className="font-bold underline decoration-cereniti-300 underline-offset-2 hover:text-olive-500 transition-colors">Platform Agreement</button> and consent to ID verification.</p>
            {errors.termsAccepted && <p className="text-xs text-red-500 font-bold mt-1">Required</p>}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button type="submit" disabled={isSubmitting} className="w-full bg-cereniti-900 text-white hover:bg-cereniti-800 h-14 text-lg shadow-lg hover:shadow-xl transition-all">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Submit Application"}
        </Button>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} onAccept={handleAcceptTerms} />
    </form>
  );
}