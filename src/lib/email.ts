import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@indlink.in";

export async function sendPaymentSuccessEmail(to: string, amountInPaise: number) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Payment Successful - INDLink",
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Your payment of ₹${(amountInPaise / 100).toFixed(2)} was successful.</p>
        <p>You can download your product or view your subscription details in your dashboard.</p>
      `
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function sendInvoiceEmail(to: string, pdfUrl: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Your INDLink Invoice",
      html: `
        <h1>Invoice Generated</h1>
        <p>You can download your latest invoice here: <a href="${pdfUrl}">Download PDF</a></p>
      `
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
