import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

async function sendOtpEmail(userEmail, optCode) {
  try {
    const { error, data } = await resend.emails.send({
      from: "Onboarding <onboarding@resend.dev>",
      to: userEmail,
      template: {
        id: "verification-code",
        variables: {
          OTP: optCode,
        },
      },
    });

    if (!data) {
      throw new Error(`Error sending email ${error.message}`);
    }

    console.log("OTP Email Sent:", data);
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

export default sendOtpEmail;
