import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { amount, type, productId, planId } = body;

    if (!amount || !type) {
      return NextResponse.json({ error: "Amount and type are required" }, { status: 400 });
    }

    // Create Order in Razorpay
    const options = {
      amount: amount, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        type,
        productId,
        planId
      }
    };

    const order = await razorpay.orders.create(options);

    // Record pending payment in DB
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount,
        type,
        razorpayOrderId: order.id,
      }
    });

    return NextResponse.json({ order, paymentId: payment.id }, { status: 200 });
  } catch (error) {
    console.error("[CREATE_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
