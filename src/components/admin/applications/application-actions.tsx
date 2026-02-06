"use client";

import { useState } from "react";
import { inviteToAssessment, rejectApplication, approveApplication, inviteToInterview } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle, XCircle, UserCheck, Copy, FastForward, Link as LinkIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface ActionsProps {
  id: string;
  status: string;
  email: string;
  name: string;
}

export function ApplicationActions({ id, status, email, name }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Construct links
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const assessmentUrl = `${origin}/contractor/assessment/${id}`;
  const interviewPrepUrl = `${origin}/contractor/interview-prep`;

  // --- UTILS ---
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} Copied`, { description: text });
  };

  const performAction = async (actionFn: Function, successMessage?: string) => {
    setIsLoading(true);
    try {
      const result = await actionFn();
      if (!result.success) {
        toast.error("Action Failed", { description: result.message });
      } else {
        if (successMessage) toast.success(successMessage);
        return result; 
      }
    } catch (e) {
      toast.error("System Error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleInviteAssessment = async () => {
    setIsLoading(true);
    const result = await inviteToAssessment(id);
    setIsLoading(false);

    if (result.success && result.link) {
      copyToClipboard(result.link, "Assessment Link"); // Auto-copy on success
      
      const subject = "Cereniti Guild Assessment";
      const body = `Dear ${name},\n\nPlease complete your assessment here:\n${result.link}`;
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } else {
      toast.error("Error", { description: result.message });
    }
  };

  const handleReject = () => {
    if (confirm("Reject this candidate?")) {
      performAction(() => rejectApplication(id), "Application Rejected.");
    }
  };

  const handleFastTrack = () => {
    if (confirm("Skip assessment and move to Interview?")) {
      performAction(() => inviteToInterview(id), "Moved to Interview stage.");
    }
  };

  const handleApprove = () => {
    if (confirm("Activate Specialist account?")) {
      performAction(() => approveApplication(id), "Contractor Activated.");
    }
  };

  const handleInterviewInvite = () => {
    const subject = "Interview Invitation";
    const body = `Dear ${name},\n\nWe would like to schedule your interview.\n\nPlease review our prep material here: ${interviewPrepUrl}`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    toast.info("Email client opened.");
  };

  // --- RENDER ---

  // 1. PENDING (Action Required)
  if (status === 'pending') {
    return (
      <div className="flex flex-col items-end gap-3">
        <div className="flex gap-2">
          {/* Copy Button (Manual) */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => copyToClipboard(assessmentUrl, "Assessment Link")}
            title="Copy Assessment Link without sending email"
            className="h-10 px-3 border-cereniti-200 text-cereniti-500"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button onClick={handleInviteAssessment} disabled={isLoading} className="bg-cereniti-900 text-white hover:bg-gold-600 shadow-md transition-all">
            {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Mail className="mr-2 h-4 w-4" />}
            Accept & Send Invite
          </Button>
          <Button variant="ghost" onClick={handleReject} disabled={isLoading} className="text-red-600 hover:bg-red-50 hover:text-red-700">
            Reject
          </Button>
        </div>

        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-[10px] text-cereniti-400 underline hover:text-cereniti-600">
          {showAdvanced ? "Hide Advanced" : "Advanced Options"}
        </button>
        {showAdvanced && (
            <Button variant="outline" size="sm" onClick={handleFastTrack} disabled={isLoading} className="text-xs h-8 border-cereniti-200 text-cereniti-600">
              <FastForward className="mr-2 h-3 w-3 text-gold-600" /> Fast Track
            </Button>
        )}
      </div>
    );
  }

  // 2. WAITING (Assessment Sent)
  if (status === 'assessment_invited') {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2 items-center">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-200 flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" /> Awaiting Assessment
          </span>
          <Button size="sm" variant="outline" onClick={() => copyToClipboard(assessmentUrl, "Link")} className="h-8 text-xs border-cereniti-200 text-cereniti-600">
             <LinkIcon className="h-3 w-3 mr-2" /> Copy Link
          </Button>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="sm" onClick={handleFastTrack} disabled={isLoading} className="text-xs text-cereniti-400 hover:text-gold-600">Skip Test</Button>
           <Button variant="ghost" size="sm" onClick={handleReject} className="text-xs text-red-400 hover:text-red-600">Reject</Button>
        </div>
      </div>
    );
  }

  // 3. INTERVIEW STAGE
  if (status === 'interview') {
    return (
      <div className="flex gap-2">
        {/* Copy Prep Link Button */}
        <Button 
            variant="outline" 
            onClick={() => copyToClipboard(interviewPrepUrl, "Prep Page URL")} 
            className="border-cereniti-200 text-cereniti-600"
            title="Copy Interview Prep Page URL"
        >
          <BookOpen className="h-4 w-4" />
        </Button>

        <Button onClick={handleInterviewInvite} variant="outline" className="border-cereniti-900 text-cereniti-900 hover:bg-cereniti-50">
          <Mail className="mr-2 h-4 w-4" /> Email Invite
        </Button>
        <Button onClick={handleApprove} disabled={isLoading} className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md border border-emerald-700">
          {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <UserCheck className="mr-2 h-4 w-4" />}
          Final Approval
        </Button>
      </div>
    );
  }

  // 4. APPROVED
  if (status === 'approved') {
    return (
      <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded text-sm font-medium border border-emerald-200 flex items-center gap-2">
        <CheckCircle className="h-4 w-4" /> Active Specialist
      </span>
    );
  }

  // 5. REJECTED
  return (
    <div className="flex items-center gap-4">
      <span className="px-4 py-2 bg-red-50 text-red-700 rounded text-sm font-medium border border-red-200 flex items-center gap-2">
        <XCircle className="h-4 w-4" /> Rejected
      </span>
      <Button variant="ghost" size="sm" onClick={handleFastTrack} className="text-xs text-cereniti-400 hover:text-cereniti-900">Re-instate</Button>
    </div>
  );
}