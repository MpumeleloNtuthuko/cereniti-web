"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          
          {/* 1. LUXURY BACKDROP (Blur + Darken) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cereniti-900/40 backdrop-blur-md transition-all"
          />

          {/* 2. THE CONTRACT (Paper Modal) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Apple-style spring
            className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-cereniti-50 rounded-xl shadow-2xl overflow-hidden border border-cereniti-200"
          >
            
            {/* --- HEADER (Sticky) --- */}
            <div className="flex items-center justify-between border-b border-cereniti-200 bg-white/80 backdrop-blur-sm px-6 py-5 md:px-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-cereniti-100 text-cereniti-900">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-cereniti-900">Platform Agreement</h2>
                  <p className="text-xs text-cereniti-500 uppercase tracking-wider">Independent Specialist Contract</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-transparent hover:border-cereniti-200 hover:bg-cereniti-100 transition-all"
              >
                <X className="h-4 w-4 text-cereniti-400 group-hover:text-cereniti-900" />
              </button>
            </div>

            {/* --- CONTENT (Scrollable) --- */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-cereniti-50">
              <div className="prose prose-stone max-w-none">
                
                {/* Intro */}
                <p className="font-serif text-lg text-cereniti-600 leading-relaxed italic border-l-2 border-cereniti-300 pl-4 mb-8">
                  "Excellence is not an act, but a habit. By joining Cereniti, you agree to uphold the highest standards of dignity, discretion, and detail."
                </p>

                {/* Clauses */}
                <div className="space-y-8">
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cereniti-900 mb-3">
                      <span className="text-olive-500">01.</span> Contractor Relationship
                    </h3>
                    <p className="text-sm leading-7 text-cereniti-600">
                      You acknowledge that you are entering into this agreement as an <strong>Independent Specialist</strong>. You are not an employee of Cereniti. You retain full autonomy to accept or decline job broadcasts via the platform. You are solely responsible for your own tax declarations (SARS) and personal benefits.
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cereniti-900 mb-3">
                      <span className="text-olive-500">02.</span> Equipment & Liability
                    </h3>
                    <p className="text-sm leading-7 text-cereniti-600">
                      Cereniti provides a specialized "Kit" (tools, vacuums, formulas) for each engagement. This equipment is provided on a commercial rental basis, fully subsidized by the platform. You agree to return the Kit in the same condition it was issued. 
                      <br /><br />
                      <span className="bg-red-50 text-red-700 px-1 rounded">Clause:</span> Negligence resulting in lost or damaged equipment will result in a deduction from your Excellence Bonus.
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cereniti-900 mb-3">
                      <span className="text-olive-500">03.</span> Compensation Model
                    </h3>
                    <p className="text-sm leading-7 text-cereniti-600">
                      <strong>Base Pay:</strong> Guaranteed R230 per completed standard job.<br />
                      <strong>Excellence Bonus:</strong> An additional 10% commission is awarded for 5-star ratings with zero complaints.<br />
                      Payments are processed weekly on Fridays into your nominated bank account.
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cereniti-900 mb-3">
                      <span className="text-olive-500">04.</span> POPIA & Privacy
                    </h3>
                    <p className="text-sm leading-7 text-cereniti-600">
                      We collect your ID, CV, and Address strictly for vetting and security clearance purposes at estates (e.g., Val de Vie). Your data is stored in an encrypted vault. We do not sell your data. By accepting, you consent to background checks including criminal record verification.
                    </p>
                  </section>
                </div>

                {/* Digital Sig Placeholder */}
                <div className="mt-12 pt-8 border-t border-cereniti-200">
                  <p className="text-xs text-cereniti-400 uppercase tracking-widest mb-2">Digital Acknowledgement</p>
                  <div className="font-serif text-2xl text-cereniti-300 select-none">
                    Signed digitally by Applicant
                  </div>
                </div>

              </div>
            </div>

            {/* --- FOOTER (Sticky) --- */}
            <div className="border-t border-cereniti-200 bg-white p-6 md:px-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-cereniti-400 hidden sm:block">
                  Last updated: December 2025
                </p>
                <div className="flex gap-4 w-full sm:w-auto">
                  <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
                    Decline
                  </Button>
                  <Button 
                    onClick={onAccept} 
                    className="flex-1 sm:flex-none bg-cereniti-900 text-white hover:bg-olive-900 px-8 gap-2 group"
                  >
                    I Accept & Agree
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}