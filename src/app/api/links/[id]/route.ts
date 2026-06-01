import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const linkId = params.id;
    const body = await req.json();
    const { title, url, type, icon, isActive, isFeatured } = body;

    // Verify ownership
    const existingLink = await prisma.link.findUnique({
      where: { id: linkId }
    });

    if (!existingLink || existingLink.profileId !== profile.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const updatedLink = await prisma.link.update({
      where: { id: linkId },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(type && { type }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
      }
    });

    return NextResponse.json({ link: updatedLink }, { status: 200 });
  } catch (error) {
    console.error("[LINK_PUT_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const linkId = params.id;

    // Verify ownership
    const existingLink = await prisma.link.findUnique({
      where: { id: linkId }
    });

    if (!existingLink || existingLink.profileId !== profile.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { id: linkId }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[LINK_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
