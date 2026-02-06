"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ASSESSMENT_QUESTIONS, Question } from "@/lib/data/assessment-questions";
import { submitAssessment } from "@/features/contractor/assessment-actions";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Eye, Shield, Beaker, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ICONS = {
  visual: Eye,
  situational: AlertTriangle,
  integrity: Shield,
  technical: Beaker,
  behavioral: BrainCircuit
};

export function AssessmentWizard({ applicationId }: { applicationId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State allows string (single) or string[] (multi)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'passed' | 'failed' | null>(null);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const ModuleIcon = ICONS[currentQuestion.module];
  const progress = ((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  // Handle Logic
  const handleSelect = (optionId: string) => {
    if (currentQuestion.type === 'single-choice') {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    } 
    else if (currentQuestion.type === 'multi-select') {
      // Toggle Logic
      const current = (answers[currentQuestion.id] as string[]) || [];
      if (current.includes(optionId)) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: current.filter(id => id !== optionId) }));
      } else {
        // Limit to 2 selections if question asks for 2 (optional UI polish, but good for UX)
        if (current.length < 2) {
           setAnswers(prev => ({ ...prev, [currentQuestion.id]: [...current, optionId] }));
        }
      }
    }
  };

  const handleText = (text: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: text }));
  };

  const handleNext = async () => {
    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      const res = await submitAssessment(applicationId, answers);
      setIsSubmitting(false);
      if (res.success) setResult(res.status as 'passed' | 'failed');
    }
  };

  // Check if current question is answered
  const isAnswered = () => {
    const ans = answers[currentQuestion.id];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return ans.length > 0;
  };

  // ... (Keep Result View same as before) ...
  // --- COMPLETION STATE ---
  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 px-6">
        {/* Animated Check Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ type: "spring", duration: 0.6 }}
          className="h-24 w-24 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-emerald-900/20"
        >
          <Check className="h-10 w-10" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-serif text-4xl text-cereniti-900 mb-6">
            Assessment Uploaded.
          </h2>
          
          <p className="text-cereniti-600 leading-relaxed text-lg mb-8">
            Your responses have been securely transmitted to the Guild Council. 
            Our team is currently evaluating your aptitude against the Cereniti Standard.
          </p>

          <div className="bg-cereniti-50 p-6 rounded-xl border border-cereniti-200 mb-10 text-sm text-cereniti-500 leading-relaxed">
            <strong className="text-cereniti-900 block mb-2 uppercase tracking-widest text-xs">Next Steps</strong>
            If your profile matches our current requirements, you will receive a WhatsApp invitation for a practical interview within 48 hours.
          </div>

          <Button 
            className="bg-cereniti-900 hover:bg-cereniti-800 text-white w-full h-14 text-base shadow-lg transition-all" 
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-cereniti-200 shadow-xl rounded-2xl overflow-hidden min-h-[700px] flex flex-col">
      
      {/* HEADER */}
      <div className="bg-cereniti-900 text-white p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
            <ModuleIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-cereniti-400">Assessment Module</p>
            <p className="font-serif text-xl capitalize">{currentQuestion.module} Protocol</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-serif text-olive-400">0{currentIndex + 1}</p>
          <p className="text-[10px] text-cereniti-500">of {ASSESSMENT_QUESTIONS.length}</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="h-1.5 w-full bg-cereniti-100">
        <motion.div className="h-full bg-olive-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>

      {/* BODY */}
      <div className="p-8 lg:p-12 flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            {/* Question Text */}
            <h3 className="text-xl md:text-2xl font-medium text-cereniti-900 mb-2 leading-relaxed">
              {currentQuestion.text}
            </h3>
            
            {/* Hint for Multi-Select */}
            {currentQuestion.type === 'multi-select' && (
              <p className="text-xs font-bold text-olive-600 uppercase tracking-widest mb-6">
                Select 2 Options
              </p>
            )}

            {/* Image */}
            {currentQuestion.image_url && (
              <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden border border-cereniti-200 shadow-sm mt-6">
                <Image src={currentQuestion.image_url} alt="Test" fill className="object-cover" />
              </div>
            )}

            {/* OPTIONS GRID (2 Cols for 6 options) */}
            <div className={cn("grid gap-4 mt-8", currentQuestion.options && currentQuestion.options.length > 4 ? "md:grid-cols-2" : "grid-cols-1")}>
              
              {currentQuestion.type === 'text' ? (
                 <textarea 
                    className="w-full h-48 p-4 border rounded-lg resize-none focus:outline-none focus:border-cereniti-900 bg-cereniti-50" 
                    placeholder="Type your detailed observation here..."
                    onChange={(e) => handleText(e.target.value)}
                    value={answers[currentQuestion.id] as string || ""}
                 />
              ) : (
                 currentQuestion.options?.map((opt) => {
                    const isSelected = Array.isArray(answers[currentQuestion.id]) 
                       ? (answers[currentQuestion.id] as string[])?.includes(opt.id)
                       : answers[currentQuestion.id] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={cn(
                          "text-left p-5 rounded-lg border transition-all duration-200 text-sm md:text-base flex items-start gap-3",
                          isSelected
                            ? "border-cereniti-900 bg-cereniti-900 text-white shadow-lg transform scale-[1.02]"
                            : "border-cereniti-200 hover:border-cereniti-400 text-cereniti-700 hover:bg-cereniti-50"
                        )}
                      >
                        <div className={cn("mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0", 
                           isSelected ? "border-white bg-white/20" : "border-cereniti-300"
                        )}>
                           {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        {opt.text}
                      </button>
                    )
                 })
              )}
            </div>

          </motion.div>
        </AnimatePresence>

{/* FOOTER NAV */}
        <div className="mt-12 flex justify-end pt-6 border-t border-cereniti-100">
          <Button 
            onClick={handleNext}
            disabled={!isAnswered() || isSubmitting}
            // CHANGED: From bg-olive-600 to bg-cereniti-900 (Charcoal)
            className="bg-cereniti-900 hover:bg-cereniti-800 text-white px-10 h-14 text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Confirm & Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}