import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendPaymentSuccessEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId, metadata } = body;

    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Mark Payment as completed
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { 
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id
      },
      include: { user: true }
    });

    // Handle fulfillment based on Type
    if (payment.type === "PRODUCT" && metadata?.productId) {
      await prisma.purchase.create({
        data: {
          productId: metadata.productId,
          userId: payment.userId,
          buyerEmail: payment.user.email!,
          amount: payment.amount,
          paymentId: payment.id
        }
      });
      // Optionally trigger email
      if (payment.user.email) {
        await sendPaymentSuccessEmail(payment.user.email, payment.amount);
      }
    } 
    else if (payment.type === "DONATION" && metadata?.profileId) {
      await prisma.donation.create({
        data: {
          profileId: metadata.profileId,
          paymentId: payment.id,
          amount: payment.amount,
          donorName: metadata.donorName || null,
          donorEmail: metadata.donorEmail || null,
          message: metadata.message || null
        }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PAYMENT_VERIFY_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
