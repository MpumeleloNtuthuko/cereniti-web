import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; 

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export const whatsappService = {
  
  formatNumber: (phone: string) => {
    let clean = phone.replace(/[\s\-\(\)]/g, "");
    if (clean.startsWith("0")) {
      clean = "+27" + clean.substring(1);
    }
    return `whatsapp:${clean}`;
  },

  sendJobAlert: async (phone: string, contractorName: string, jobDetails: {
    location: string;
    earnings: string;
    date: string;
    type: string;
    layout: string;
    tier: string; // <--- NEW FIELD
  }) => {
    const formattedPhone = whatsappService.formatNumber(phone);
    const dashboardLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://cereniti.co.za'}/contractor`;

    // Tier Logic for Visuals
    const isReserve = jobDetails.tier === 'reserve';
    const tierHeader = isReserve ? "💎 *RESERVE COLLECTION*" : "🛡️ *CLASSIC COLLECTION*";

    const messageBody = `
🌿 *Cereniti Dispatch*
${tierHeader}

Hello ${contractorName},

New opportunity available:
📍 *Location:* ${jobDetails.location}
🏠 *Layout:* ${jobDetails.layout}
💰 *Your Earnings:* ${jobDetails.earnings}
📅 *Date:* ${jobDetails.date}
🛠 *Service:* ${jobDetails.type}

*Action Required:*
Click below to accept:
${dashboardLink}
    `.trim();

    if (client) {
      try {
        console.log(`🚀 Sending WhatsApp to ${formattedPhone}...`);
        await client.messages.create({
          body: messageBody,
          from: fromNumber,
          to: formattedPhone
        });
        return { success: true };
      } catch (error: any) {
        console.error("❌ Twilio Error:", error.message);
        return { success: false, error: error.message };
      }
    }

    console.log("⚠️ Mock WhatsApp:");
    console.log(messageBody);
    return { success: true, mock: true };
  }
};