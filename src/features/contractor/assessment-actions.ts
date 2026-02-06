"use server";

import { createClient } from "@/lib/supabase/server";
import { ASSESSMENT_QUESTIONS } from "@/lib/data/assessment-questions";

// We receive answers as a JSON string for multi-select support, or handle simple parsing
export async function submitAssessment(applicationId: string, rawAnswers: Record<string, string | string[]>) {
  const supabase = await createClient();

  let scores = { visual: 0, situational: 0, integrity: 0, technical: 0, behavioral: 0 };
  let maxScores = { visual: 0, situational: 0, integrity: 0, technical: 0, behavioral: 0 };

  ASSESSMENT_QUESTIONS.forEach(q => {
    maxScores[q.module] += 1;
    const userAnswer = rawAnswers[q.id];

    if (q.type === 'text') {
      // Keyword matching
      if (typeof userAnswer === 'string') {
        const input = userAnswer.toLowerCase();
        const hasKeyword = q.keywords?.some(k => input.includes(k.toLowerCase()));
        if (hasKeyword && input.length > 15) scores[q.module] += 1;
      }
    } 
    else if (q.type === 'single-choice') {
      // ID Matching
      const correct = q.options?.find(o => o.isCorrect)?.id;
      if (userAnswer === correct) scores[q.module] += 1;
    } 
    else if (q.type === 'multi-select') {
      // Array Matching (Must get ALL correct to get the point - Strict)
      if (Array.isArray(userAnswer)) {
        const correctOptions = q.options?.filter(o => o.isCorrect).map(o => o.id) || [];
        // Check if lengths match and every selected item is correct
        const isExactMatch = userAnswer.length === correctOptions.length && 
                             userAnswer.every(val => correctOptions.includes(val));
        
        if (isExactMatch) scores[q.module] += 1;
      }
    }
  });

  // CONSISTENCY CHECK: Integrity Module
  // If they got < 100% on Integrity, they fail immediately.
  const integrityPass = scores.integrity === maxScores.integrity;
  
  // TECHNICAL CHECK: Must get > 60%
  const technicalScore = (scores.technical / maxScores.technical);
  const technicalPass = technicalScore >= 0.6;

  // Final Status
  const status = (integrityPass && technicalPass) ? 'passed' : 'failed';

  // Save to DB
  await supabase.from("contractor_assessments").insert({
    application_id: applicationId,
    score_visual: scores.visual,
    score_situational: scores.situational,
    score_integrity: scores.integrity,
    score_technical: scores.technical,
    // Add behavioral column to DB or map it
    total_score: Object.values(scores).reduce((a, b) => a + b, 0),
    status: status,
    completed_at: new Date().toISOString()
  });

  // Update Application
  await supabase
    .from("contractor_applications")
    .update({ status: status === 'passed' ? 'interview' : 'rejected' })
    .eq("id", applicationId);

  return { success: true, status };
}