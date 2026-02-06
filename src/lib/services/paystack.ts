import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export const paystack = {
  /**
   * Initialize a Transaction (Get the Payment Page URL)
   */
  initializeTransaction: async (email: string, amountZAR: number, reference: string) => {
    // Paystack expects amount in Cents (R100 = 10000)
    const amountInCents = Math.round(amountZAR * 100);
    
    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payment/callback`;

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amountInCents,
          reference, // We use the Booking ID as reference
          callback_url: callbackUrl,
          channels: ['card', 'eft', 'qr'], // Allow refined payment methods
          metadata: {
            custom_fields: [
              { display_name: "Service Type", variable_name: "service", value: "Home Care" }
            ]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, url: response.data.data.authorization_url };
    } catch (error: any) {
      console.error("Paystack Init Error:", error.response?.data || error.message);
      return { success: false, message: "Payment gateway connection failed." };
    }
  },

  /**
   * Verify a Transaction (Server-Side Double Check)
   */
  verifyTransaction: async (reference: string) => {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        }
      );

      const data = response.data.data;
      if (data.status === 'success') {
        return { success: true, amount: data.amount / 100, method: data.channel };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }
};