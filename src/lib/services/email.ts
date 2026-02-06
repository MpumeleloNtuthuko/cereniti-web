import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailPayload {
  to: string;
  subject: string;
  body: string; // We will treat this as HTML
}

export const emailService = {
  /**
   * Universal Send Function
   */
  send: async (payload: EmailPayload) => {
    // 1. Dev Mode Safety: Don't send to real people if testing locally (optional)
    if (process.env.NODE_ENV === 'development' && !payload.to.includes('your-test-email')) {
      console.log("Simulating email to:", payload.to);
      // Remove this return if you WANT to test real emails in dev
      // return { success: true }; 
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'Cereniti Concierge <concierge@cereniti.co.za>',
        to: payload.to,
        subject: payload.subject,
        // Wrap the body in a simple HTML font style for elegance
        html: `
          <div style="font-family: Georgia, serif; color: #1C1917; line-height: 1.6;">
            ${payload.body.replace(/\n/g, '<br>')}
          </div>
        `
      });

      if (error) {
        console.error("Resend Error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (e: any) {
      console.error("Email Exception:", e);
      return { success: false, error: e.message };
    }
  },

  // --- TEMPLATES ---

  sendAssessmentInvite: async (email: string, name: string, link: string) => {
    return emailService.send({
      to: email,
      subject: "Action Required: Cereniti Guild Assessment",
      body: `Dear ${name},\n\nYour application has passed initial review. The next step is our Protocol & Integrity Assessment.\n\nPlease complete it here: <a href="${link}" style="color: #B08D37; font-weight: bold;">Start Assessment</a>\n\nThis link expires in 48 hours.\n\nRegards,\nThe Cereniti Team`
    });
  },

  sendInterviewInvite: async (email: string, name: string) => {
    return emailService.send({
      to: email,
      subject: "Cereniti Guild: Interview Invitation",
      body: `Dear ${name},\n\nCongratulations. You have passed the digital assessment with a score meeting our threshold.\n\nWe would like to invite you for a practical interview. Our team will contact you via WhatsApp shortly to schedule.\n\nRegards,\nThe Cereniti Team`
    });
  },

  sendRejection: async (email: string, name: string) => {
    return emailService.send({
      to: email,
      subject: "Update on your Cereniti Application",
      body: `Dear ${name},\n\nThank you for your interest in the Cereniti Guild. After careful review, we have decided not to proceed with your application at this time.\n\nWe wish you the best in your future endeavors.\n\nRegards,\nThe Cereniti Team`
    });
  }
};