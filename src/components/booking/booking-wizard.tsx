"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormValues } from "@/lib/schemas/booking";
import { createBooking } from "@/features/booking/actions";
import { Button } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Service, PropertyCondition, Addon, Perk } from "@/types/database";
import { calculateTotal, formatCurrency } from "@/lib/logic/pricing";
import { 
  Check, Home, Sparkles, Calendar as CalIcon, Loader2, Minus, Plus, 
  PlusCircle, AlertTriangle, Hammer, Cat, Repeat, CalendarClock, Infinity as InfinityIcon,
  Gem, CalendarDays, Ruler, Coffee, Wine, User, Clock, Hourglass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlockedTimeSlots } from "@/features/booking/availability-actions";
import { calculateDuration, formatDuration } from "@/lib/logic/duration";
import { toast } from "sonner";

const ICON_MAP: Record<string, any> = {
  Disc: PlusCircle, 
  Snowflake: PlusCircle, 
  Maximize: PlusCircle, 
  Scan: PlusCircle, 
  ArrowUp: PlusCircle,
  AlertTriangle, Hammer, Cat, PlusCircle
};

interface WizardProps {
  services: Service[];
  addons: Addon[];
  conditions: PropertyCondition[];
  perks: Perk[];
  blockedDates: Date[];
}

enum Step {
  PROPERTY = 0,
  DETAILS = 1,
  SERVICE = 2,
  ADDONS = 3,
  PERKS = 4,
  DATE = 5,
  SUCCESS = 6
}

export function BookingWizard({ services, addons, conditions, perks, blockedDates }: WizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>(Step.PROPERTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const { 
    register, 
    control, 
    watch, 
    handleSubmit, 
    trigger,
    setValue,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bedrooms: 1, bathrooms: 1, livingAreas: 0, sqm: 0, isHighCare: false,
      addonIds: [], frequency: "once-off", scheduledDate: undefined, startTime: undefined
    },
    mode: "onChange"
  });

  // --- WATCHERS ---
  const watchedBeds = watch("bedrooms");
  const watchedBaths = watch("bathrooms");
  const watchedLiving = watch("livingAreas");
  const watchedSqm = watch("sqm");
  const watchedHighCare = watch("isHighCare");
  const watchedConditionId = watch("conditionId");
  const watchedServiceId = watch("serviceId");
  const watchedAddonIds = watch("addonIds") || [];
  const watchedFrequency = watch("frequency");
  const watchedDate = watch("scheduledDate");

  const selectedService = services.find(s => s.id === watchedServiceId);
  const selectedCondition = conditions.find(c => c.id === watchedConditionId);
  const selectedAddons = addons.filter(a => watchedAddonIds.includes(a.id));

  // --- PRICING ---
  const totalEstimatedPrice = useMemo(() => {
    return calculateTotal({
      bedrooms: watchedBeds,
      bathrooms: watchedBaths,
      livingAreas: watchedLiving,
      sqm: watchedSqm,
      condition: selectedCondition,
      // FIX: Ensure boolean fallback
      isHighCare: watchedHighCare || false, 
      service: selectedService,
      selectedAddons: selectedAddons
    });
  }, [watchedBeds, watchedBaths, watchedLiving, watchedSqm, watchedHighCare, selectedCondition, selectedService, selectedAddons]);

  // --- DURATION ---
  const estimatedDuration = useMemo(() => {
    return calculateDuration({
      service: selectedService,
      bedrooms: watchedBeds,
      bathrooms: watchedBaths,
      livingAreas: watchedLiving,
      sqm: watchedSqm,
      // FIX: Ensure boolean fallback here too
      isHighCare: watchedHighCare || false
    });
  }, [selectedService, watchedBeds, watchedBaths, watchedLiving, watchedSqm, watchedHighCare]);

  // --- PERKS ---
  const eligiblePerks = useMemo(() => {
    return perks.filter(p => totalEstimatedPrice >= p.min_order_value);
  }, [totalEstimatedPrice, perks]);

  // --- TIME SLOT LOGIC ---
  useEffect(() => {
    if (watchedDate) {
      setLoadingSlots(true);
      const allSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
      
      const now = new Date();
      const isToday = watchedDate.toDateString() === now.toDateString();
      let availableSlots = allSlots;

      if (isToday) {
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentTotalMins = (currentHour * 60) + currentMin;
        const BUFFER_MINUTES = 60;

        availableSlots = allSlots.filter(slot => {
          const [h, m] = slot.split(':').map(Number);
          const slotMins = (h * 60) + m;
          return slotMins > (currentTotalMins + BUFFER_MINUTES);
        });
      }

      setTimeSlots(availableSlots);
      
      const offset = watchedDate.getTimezoneOffset();
      const localDate = new Date(watchedDate.getTime() - (offset * 60000));
      const dateStr = localDate.toISOString().split('T')[0];

      getBlockedTimeSlots(dateStr).then((blocked) => {
        setBlockedSlots(blocked);
        setLoadingSlots(false);
      });
    }
  }, [watchedDate]);

  // --- NAVIGATION ---
  const nextStep = async () => {
    let isValid = false;
    switch (currentStep) {
      case Step.PROPERTY: isValid = await trigger(["propertyName", "address", "estateName", "bedrooms", "bathrooms"]); break;
      case Step.DETAILS: isValid = await trigger(["livingAreas", "sqm", "conditionId"]); break;
      case Step.SERVICE: isValid = await trigger(["serviceId"]); break;
      case Step.ADDONS: isValid = true; break;
      case Step.PERKS: isValid = true; break;
      case Step.DATE: isValid = await trigger(["scheduledDate", "startTime", "frequency"]); break;
      default: isValid = false;
    }

    if (isValid) {
      setCurrentStep((prev) => {
        let next = prev + 1;
        if (next === Step.PERKS && eligiblePerks.length === 0) next = Step.DATE;
        return Math.min(next, Step.SUCCESS);
      });
    } else {
        toast.error("Incomplete", { description: "Please fill in all required fields." });
    }
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => {
      let back = prev - 1;
      if (back === Step.PERKS && eligiblePerks.length === 0) back = Step.ADDONS;
      return Math.max(back, Step.PROPERTY);
    });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    if (!data.scheduledDate || !data.startTime) {
        toast.error("Selection Required", { description: "Please pick a date and start time." });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'addonIds') formData.append(key, JSON.stringify(value));
      else if (value instanceof Date) {
         const offset = value.getTimezoneOffset();
         const localAdjustedDate = new Date(value.getTime() - (offset * 60000));
         formData.append(key, localAdjustedDate.toISOString().split('T')[0]); 
      }
      else if (value !== undefined && value !== null) formData.append(key, String(value));
    });

    try {
        const result = await createBooking(null, formData);
        
        if (result.success && result.paymentUrl) {
           toast.success("Initiating Secure Payment...", { description: "Redirecting to Paystack gateway." });
           window.location.href = result.paymentUrl;
        } else if (result.success) {
           setCurrentStep(Step.SUCCESS);
        } else {
           if (result.errors) {
              const errorMessages = Object.entries(result.errors).map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`).join(", ");
              toast.error("Validation Failed", { description: errorMessages });
           } else {
              toast.error("System Error", { description: result.message || "An unknown error occurred." });
           }
        }
    } catch (e) {
        toast.error("Network Error");
    } finally {
        setIsSubmitting(false);
    }
  };

  const onError: SubmitErrorHandler<BookingFormValues> = (errors) => {
    if (errors.scheduledDate) toast.error("Date Required", { description: "Please select a date." });
    else if (errors.startTime) toast.error("Time Required", { description: "Please select a start time." });
    else toast.error("Missing Information", { description: "Check all required fields." });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-cereniti-200 shadow-2xl rounded-2xl overflow-hidden min-h-[750px] flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <div className="bg-cereniti-900 text-cereniti-50 p-6 md:p-8 w-full md:w-1/3 flex flex-col justify-between shrink-0">
         <div>
            <div className="mb-6 md:mb-8">
               <span className="text-[10px] uppercase tracking-widest text-cereniti-400">Concierge</span>
               <h2 className="font-serif text-2xl md:text-3xl mt-2">Configure <br/>Experience</h2>
            </div>
         </div>

         {/* LIVE INVOICE */}
         <div className="border-t border-cereniti-800 pt-6">
            <div className="space-y-2 mb-4 text-xs text-cereniti-400">
               {selectedService ? (
                 <div className="flex justify-between text-white border-b border-cereniti-800 pb-2 mb-2">
                   <span>
                     {selectedService.title} <br/>
                     <span className="text-[10px] text-cereniti-500 font-normal">Base (1 Bed, 1 Bath)</span>
                   </span>
                   <span>{formatCurrency(selectedService.base_price)}</span>
                 </div>
               ) : (
                 <p>Select Service...</p>
               )}

               {selectedService && watchedBeds > 1 && <div className="flex justify-between"><span>+ {watchedBeds-1} Extra Bedroom{watchedBeds-1 > 1 ? 's' : ''}</span><span>{formatCurrency((watchedBeds - 1) * selectedService.price_per_bed)}</span></div>}
               {selectedService && watchedBaths > 1 && <div className="flex justify-between"><span>+ {watchedBaths-1} Extra Bathroom{watchedBaths-1 > 1 ? 's' : ''}</span><span>{formatCurrency((watchedBaths - 1) * selectedService.price_per_bath)}</span></div>}
               {selectedService && watchedLiving > 1 && <div className="flex justify-between"><span>+ {watchedLiving - 1} Extra Living Area{watchedLiving - 1 > 1 ? 's' : ''}</span><span>{formatCurrency((watchedLiving - 1) * selectedService.price_per_living)}</span></div>}
               {selectedService && watchedSqm > 0 && <div className="flex justify-between"><span>Surface ({watchedSqm}m²)</span><span>{formatCurrency(watchedSqm * selectedService.price_per_sqm)}</span></div>}
               
               {selectedCondition && selectedCondition.value > 1 && <div className="flex justify-between text-gold-500 pt-2"><span>Cond: {selectedCondition.label}</span><span>x{selectedCondition.value}</span></div>}
               {watchedHighCare && <div className="flex justify-between text-gold-500"><span>Luxury Finishes Care</span><span>x1.25</span></div>}
               {selectedAddons.length > 0 && (
                 <div className="border-t border-cereniti-800 mt-2 pt-2">
                   {selectedAddons.map(a => {
                     const price = selectedService?.tier === 'classic' ? (a.price_classic || a.price) : a.price;
                     return (
                        <div key={a.id} className="flex justify-between text-gold-300"><span>+ {a.title}</span><span>{formatCurrency(price)}</span></div>
                     )
                   })}
                 </div>
               )}
            </div>
            
            <div className="border-t border-cereniti-800 pt-3">
               <p className="text-cereniti-500 text-[10px] uppercase tracking-widest">Estimated Investment</p>
               <motion.p key={totalEstimatedPrice} initial={{opacity:0}} animate={{opacity:1}} className="font-serif text-2xl md:text-3xl mt-1">{formatCurrency(totalEstimatedPrice)}</motion.p>
               
               <div className="mt-4">
                 {totalEstimatedPrice >= 2500 ? (
                   <span className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-gold-500"><Gem className="h-3 w-3" /> Gold Tier Benefits</span>
                 ) : totalEstimatedPrice >= 1000 ? (
                   <span className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-cereniti-300"><Coffee className="h-3 w-3" /> Silver Tier Benefits</span>
                 ) : (
                   <span className="text-[10px] text-cereniti-600">Add R{1000 - totalEstimatedPrice} to unlock perks</span>
                 )}
               </div>
            </div>
         </div>
      </div>

      {/* FORM AREA */}
      <div className="p-5 md:p-12 w-full md:w-2/3 bg-white relative flex flex-col">
        <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
               
               {/* STEP 1: PROPERTY */}
               {currentStep === Step.PROPERTY && (
                 <motion.div key="st1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                    <StepHeader title="Profile the Space" subtitle="Location and Basic Volume." />
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2"><label className="text-xs uppercase text-cereniti-500">Estate / Area</label><input {...register("estateName")} className="input-std w-full border-b py-2 focus:outline-none focus:border-cereniti-900" placeholder="e.g. Val de Vie" /></div>
                          <div className="space-y-2"><label className="text-xs uppercase text-cereniti-500">House Name</label><input {...register("propertyName")} className="input-std w-full border-b py-2 focus:outline-none focus:border-cereniti-900" placeholder="e.g. The Villa" /></div>
                       </div>
                       <div className="space-y-2"><label className="text-xs uppercase text-cereniti-500">Address</label><input {...register("address")} className="input-std w-full border-b py-2 focus:outline-none focus:border-cereniti-900" placeholder="Street, Number, Gate Code..." /></div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <Counter label="Bedrooms" name="bedrooms" control={control} min={1} />
                          <Counter label="Bathrooms" name="bathrooms" control={control} min={1} />
                       </div>
                    </div>
                 </motion.div>
               )}
               
               {/* STEP 2: DETAILS */}
               {currentStep === Step.DETAILS && (
                 <motion.div key="st2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                    <StepHeader title="Composition & Condition" subtitle="Details that define the scope of work." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-xs uppercase text-cereniti-500">Living & Dining Areas</label><Counter label="Lounges / Dining" name="livingAreas" control={control} min={1} /></div>
                        <div className="space-y-2"><label className="text-xs uppercase text-cereniti-500">Property Size</label><div className="flex items-center border border-cereniti-200 rounded-lg bg-cereniti-50/30 p-4 h-[74px]"><div className="mr-3 text-cereniti-400"><Ruler className="h-5 w-5" /></div><input type="number" {...register("sqm", { valueAsNumber: true })} className="w-full bg-transparent font-bold text-cereniti-900 text-lg focus:outline-none placeholder:text-cereniti-300" placeholder="120" /><span className="text-xs font-bold text-cereniti-400 ml-2">m²</span></div></div>
                    </div>
                    <div className="space-y-3"><label className="text-xs uppercase text-cereniti-500">Current Condition (Required)</label><div className="grid grid-cols-1 gap-3"><Controller name="conditionId" control={control} render={({ field }) => (<>{conditions.map(c => (<div key={c.id} onClick={() => field.onChange(c.id)} className={cn("cursor-pointer border rounded-lg p-3 flex justify-between items-center hover:bg-cereniti-50", field.value === c.id ? "border-cereniti-900 bg-cereniti-50 ring-1 ring-cereniti-900" : "border-cereniti-200")}><div><p className="text-sm font-medium">{c.label}</p><p className="text-xs text-cereniti-500">{c.description}</p></div>{field.value === c.id && <Check className="h-4 w-4" />}</div>))}</>)} /></div></div>
                    <div className="space-y-3 pt-2"><Controller name="isHighCare" control={control} render={({ field }) => (<div onClick={() => field.onChange(!field.value)} className={cn("cursor-pointer border rounded-lg p-4 flex gap-4 items-center", field.value ? "border-gold-500 bg-gold-50 ring-1 ring-gold-500" : "border-cereniti-200")}><div className={cn("h-10 w-10 rounded-full flex center shrink-0", field.value ? "bg-gold-600 text-white" : "bg-cereniti-100 text-cereniti-400")}><Gem className="h-5 w-5" /></div><div><h4 className="font-medium text-sm">Luxury Finishes Protocol</h4><p className="text-xs text-cereniti-500">Marble, stone, or raw wood requiring pH-neutral chemistry.</p></div></div>)} /></div>
                 </motion.div>
               )}

               {/* STEP 3: SERVICE */}
               {currentStep === Step.SERVICE && (
                 <motion.div key="st3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                    <StepHeader title="Select Ritual" subtitle="Choose based on your needs." />
                    <div className="grid gap-4"><Controller name="serviceId" control={control} render={({ field }) => (<>{services.map(s => (<div key={s.id} onClick={() => field.onChange(s.id)} className={cn("cursor-pointer rounded-xl border p-5 relative hover:bg-cereniti-50", field.value === s.id ? "border-cereniti-900 bg-cereniti-50 ring-1" : "border-cereniti-200")}><div className="flex justify-between items-center"><h4 className="font-serif text-lg">{s.title}</h4><span className="text-xs font-bold bg-cereniti-200 px-2 py-1 rounded">{s.price_label}</span></div><p className="text-xs text-cereniti-500 mt-2 max-w-sm">{s.description}</p>{field.value === s.id && <div className="absolute top-5 right-5 h-4 w-4 bg-cereniti-900 rounded-full flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>}</div>))}</>)} /></div>
                 </motion.div>
               )}

               {/* STEP 4: ADDONS */}
               {currentStep === Step.ADDONS && (
                 <motion.div key="st4" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-6">
                    <StepHeader title="Refinements" subtitle="Specific focus areas." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Controller name="addonIds" control={control} render={({ field }) => (<>{addons.map(a => { 
                      const Icon = ICON_MAP[a.icon_name] || PlusCircle; 
                      const isSelected = field.value?.includes(a.id); 
                      // Dynamic Price Logic for Classic/Reserve
                      const price = selectedService?.tier === 'classic' ? (a.price_classic || a.price) : a.price;
                      return (<div key={a.id} onClick={() => { const cur = field.value || []; field.onChange(isSelected ? cur.filter((id:string)=>id!==a.id) : [...cur, a.id]); }} className={cn("cursor-pointer rounded-xl border p-4 flex gap-4 items-center", isSelected ? "border-gold-500 bg-gold-50 ring-1" : "border-cereniti-200")}><div className={cn("p-2 rounded-full shrink-0", isSelected ? "bg-gold-100 text-gold-700" : "bg-cereniti-100 text-cereniti-500")}><Icon className="h-5 w-5"/></div><div><h4 className="font-medium text-sm">{a.title}</h4><p className="text-xs font-bold mt-0.5">+{formatCurrency(price)}</p></div></div>); })}</>)} /></div>
                 </motion.div>
               )}

               {/* STEP 5: PERKS */}
               {currentStep === Step.PERKS && (
                 <motion.div key="st5" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="space-y-6">
                    <div className={cn("p-8 rounded-xl text-white text-center relative overflow-hidden", totalEstimatedPrice >= 2500 ? "bg-gradient-to-br from-gold-900 to-cereniti-900" : "bg-cereniti-800")}>
                       <span className={cn("py-1 px-3 border rounded-full text-[10px] font-bold uppercase", totalEstimatedPrice >= 2500 ? "border-yellow-500/50 text-yellow-500" : "border-cereniti-300 text-cereniti-200")}>{totalEstimatedPrice >= 2500 ? "Gold Tier Unlocked" : "Silver Tier Unlocked"}</span>
                       <h3 className="font-serif text-3xl mt-4">The Displacement Protocol</h3>
                       <p className="text-white/80 text-sm mt-2 max-w-md mx-auto">Complimentary treatment arranged for you while we work.</p>
                    </div>
                    <div className="grid gap-4"><Controller name="selectedPerkId" control={control} render={({ field }) => (<>{eligiblePerks.map((p: any) => { let PerkIcon = User; if (p.title.includes("Coffee")) PerkIcon = Coffee; else if (p.title.includes("Wine")) PerkIcon = Wine; else if (p.title.includes("Massage")) PerkIcon = Gem; return (<div key={p.id} onClick={() => field.onChange(p.id)} className={cn("cursor-pointer rounded-xl border p-5 flex justify-between items-center", field.value === p.id ? "border-gold-500 bg-gold-50 ring-1" : "border-cereniti-200")}><div className="flex gap-4 items-center"><div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", field.value === p.id ? "bg-gold-600 text-white" : "bg-cereniti-100 text-cereniti-500")}><PerkIcon className="h-5 w-5" /></div><div><h4 className="font-serif text-lg">{p.title}</h4><p className="text-xs uppercase text-cereniti-500">{p.partner?.name}</p></div></div><div className="text-right"><span className="text-xs line-through text-cereniti-400">R{p.retail_value}</span><span className="block text-sm font-bold text-gold-600">Included</span></div></div>) })}<div onClick={() => field.onChange("decline")} className={cn("cursor-pointer border p-4 text-center text-xs uppercase rounded-xl hover:bg-cereniti-50", field.value==="decline"?"bg-cereniti-900 text-white hover:bg-cereniti-800":"text-cereniti-400")}>No thank you, I will stay home</div></>)} /></div>
                 </motion.div>
               )}

               {/* STEP 6: DATE & TIME */}
               {currentStep === Step.DATE && (
                 <motion.div key="st6" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
                    <StepHeader title="Commitment & Timing" subtitle="Schedule your reset." />
                    
                    <div className="flex justify-center mb-2"><div className="inline-flex items-center gap-2 px-4 py-2 bg-cereniti-100 rounded-full text-cereniti-700 text-xs font-bold uppercase tracking-wider border border-cereniti-200"><Hourglass className="h-3 w-3 text-gold-600" /> Est Duration: {formatDuration(estimatedDuration)}</div></div>
                    
                    <div className="space-y-2"><label className="text-xs uppercase text-cereniti-500">Frequency</label><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Controller name="frequency" control={control} render={({ field }) => (<>{["once-off", "weekly", "bi-weekly", "monthly"].map(opt => (<div key={opt} onClick={() => field.onChange(opt)} className={cn("cursor-pointer border p-4 rounded-xl capitalize flex items-center gap-3", field.value===opt ? "border-cereniti-900 bg-cereniti-50 ring-1" : "border-cereniti-200 hover:border-cereniti-300")}>{opt === "once-off" ? <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center shrink-0"><CalIcon className="h-5 w-5"/></div> : opt === "weekly" ? <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center shrink-0"><InfinityIcon className="h-5 w-5"/></div> : opt === "bi-weekly" ? <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center shrink-0"><Repeat className="h-5 w-5"/></div> : <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center shrink-0"><CalendarDays className="h-5 w-5"/></div>}<span>{opt.replace("-", " ")} {opt !== "once-off" && "Contract"}</span></div>))}</>)} /></div></div>
                    
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-center border border-cereniti-100 rounded-xl p-4 md:p-6 bg-cereniti-50/50 overflow-x-auto">
                         <Controller name="scheduledDate" control={control} render={({ field }) => (
                            <DayPicker mode="single" required selected={field.value} onSelect={field.onChange} disabled={[{ before: new Date() }, ...blockedDates]} modifiers={{ blocked: blockedDates }} modifiersStyles={{ blocked: { textDecoration: 'line-through', opacity: 0.5, color: '#ef4444' } }} styles={{ head_cell: { width: "40px", color: "#8C8680" }, day_selected: { backgroundColor: "#1C1B1A", color: "white" } }} />
                         )} />
                      </div>
                      
                      {watchedDate && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                          <label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Start Time</label>
                          {loadingSlots ? (<div className="p-4 text-center text-xs text-cereniti-400"><Loader2 className="h-4 w-4 animate-spin inline mr-2"/> Checking availability...</div>) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3"><Controller name="startTime" control={control} render={({ field }) => (<>{timeSlots.length > 0 ? timeSlots.map(time => { const isBlocked = blockedSlots.includes(time); return (<button key={time} type="button" disabled={isBlocked} onClick={() => field.onChange(time)} className={cn("py-2 px-3 rounded-lg border text-sm font-medium transition-all", field.value === time ? "bg-cereniti-900 text-white border-cereniti-900 shadow-md" : isBlocked ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through" : "bg-white text-cereniti-700 border-cereniti-200 hover:border-gold-500")}>{time}</button>) }) : <p className="text-xs text-cereniti-400 col-span-3 text-center py-2">No slots available for this date.</p>}</>)} /></div>
                          )}
                          {errors.startTime && <p className="text-red-500 text-xs font-bold text-center">Please select a start time.</p>}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 mt-4"><label className="text-xs uppercase tracking-widest text-cereniti-500 font-bold">Logistics & Access Notes</label><textarea {...register("specialRequests")} className="w-full border border-cereniti-200 rounded-lg p-4 text-sm focus:outline-none focus:border-cereniti-900 min-h-[100px] bg-white" placeholder="Gate codes, alarm instructions, specific focus areas..." /></div>
                 </motion.div>
               )}

               {/* STEP 7: SUCCESS */}
               {currentStep === Step.SUCCESS && (
                  <div className="text-center pt-12 space-y-6">
                     <div className="h-20 w-20 bg-cereniti-900 rounded-full flex items-center justify-center text-white text-3xl mx-auto">✓</div>
                     <h3 className="font-serif text-3xl">Request Sent</h3>
                     <p className="text-cereniti-500">Our concierge will contact you via WhatsApp shortly to verify logistics.</p>
                     <Button variant="outline" onClick={() => window.location.href = '/'}>Return Home</Button>
                  </div>
               )}

            </AnimatePresence>
          </div>

          {currentStep !== Step.SUCCESS && (
             <div className="flex justify-between pt-8 border-t border-cereniti-100 mt-8">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0} className={currentStep === 0 ? "invisible" : ""}>Back</Button>
                <Button type={currentStep === Step.DATE ? "submit" : "button"} onClick={currentStep === Step.DATE ? undefined : nextStep} disabled={isSubmitting} className="bg-cereniti-900 text-white hover:bg-gold-600 px-8">
                   {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : currentStep === Step.DATE ? "Confirm Booking" : "Next"}
                </Button>
             </div>
          )}
        </form>
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return <div className="mb-4"><h3 className="font-serif text-2xl text-cereniti-900">{title}</h3><p className="text-sm text-cereniti-500 mt-1">{subtitle}</p></div>;
}

function Counter({ label, name, control, min = 1 }: { label: string, name: any, control: any, min?: number }) {
  return (
    <div className="flex justify-between p-4 border border-cereniti-100 rounded-lg bg-cereniti-50/30 items-center h-[74px]">
      <span className="text-sm font-medium">{label}</span>
      <Controller name={name} control={control} render={({ field }) => (
         <div className="flex gap-4 items-center">
            <button type="button" onClick={() => field.onChange(Math.max(min, field.value - 1))} className={cn("h-8 w-8 rounded-full border border-cereniti-200 flex items-center justify-center transition-all", field.value <= min ? "opacity-50 cursor-not-allowed bg-transparent" : "hover:bg-white")} disabled={field.value <= min}><Minus className="h-3 w-3" /></button>
            <span className="w-4 text-center font-bold">{field.value}</span>
            <button type="button" onClick={() => field.onChange(field.value + 1)} className="h-8 w-8 rounded-full border border-cereniti-200 flex items-center justify-center hover:bg-white"><Plus className="h-3 w-3" /></button>
         </div>
      )} />
    </div>
  )
}