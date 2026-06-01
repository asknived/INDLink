import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const bodyText = await req.text();
    const isValid = verifyWebhookSignature(bodyText, signature);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // Handle Subscription charged (Recurring payments)
    if (event.event === "subscription.charged") {
      const subId = event.payload.subscription.entity.id;
      // In a full implementation, we'd look up the subscription by Razorpay ID,
      // create a new Payment record, extend the currentPeriodEnd, and issue an Invoice.
      console.log("Subscription charged:", subId);
    }
    
    // Handle Subscription cancelled
    else if (event.event === "subscription.cancelled") {
      const subId = event.payload.subscription.entity.id;
      console.log("Subscription cancelled:", subId);
      // Update DB to status CANCELED
    }

    // Acknowledge webhook
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
