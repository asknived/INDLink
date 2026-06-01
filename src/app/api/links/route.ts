import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!profile) return NextResponse.json({ links: [] }, { status: 200 });

    const links = await prisma.link.findMany({
      where: { profileId: profile.id },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({ links }, { status: 200 });
  } catch (error) {
    console.error("[LINKS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await req.json();
    const { title, url, type, icon, isActive, isFeatured } = body;

    // Get highest position
    const lastLink = await prisma.link.findFirst({
      where: { profileId: profile.id },
      orderBy: { position: 'desc' }
    });

    const newPosition = lastLink ? lastLink.position + 1 : 0;

    const link = await prisma.link.create({
      data: {
        profileId: profile.id,
        title,
        url,
        type: type || "CUSTOM",
        icon,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        position: newPosition,
      }
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("[LINKS_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
