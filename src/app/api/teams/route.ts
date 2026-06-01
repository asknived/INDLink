import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { profileId, name } = body;

    // Verify Business Plan status before allowing Team Creation
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE", planId: "BUSINESS" }
    });

    if (!subscription) {
      return NextResponse.json({ error: "Business Plan required for Teams" }, { status: 403 });
    }

    const team = await prisma.team.create({
      data: {
        profileId,
        name,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER"
          }
        }
      }
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("[TEAM_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
