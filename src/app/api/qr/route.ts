import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const qrs = await prisma.qRCode.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ qrs }, { status: 200 });
  } catch (error) {
    console.error("[QR_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, linkId } = body;

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Check if it already exists
    const existing = await prisma.qRCode.findFirst({
      where: { profileId: profile.id, type, linkId: linkId || null }
    });

    if (existing) {
      return NextResponse.json({ qr: existing }, { status: 200 });
    }

    const qr = await prisma.qRCode.create({
      data: {
        profileId: profile.id,
        type,
        linkId: linkId || null,
        imageUrl: "" // We don't store the actual image, we generate it on the fly in the UI, but we could store a base64 here if needed.
      }
    });

    return NextResponse.json({ qr }, { status: 201 });
  } catch (error) {
    console.error("[QR_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
