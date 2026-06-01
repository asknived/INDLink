import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const assets = await prisma.mediaAsset.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ assets }, { status: 200 });
  } catch (error) {
    console.error("[MEDIA_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset || asset.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    // Delete from R2
    await storage.deleteFile(asset.storageKey);

    // Delete from DB
    await prisma.mediaAsset.delete({ where: { id } });

    // Refund Storage Quota
    await prisma.user.update({
      where: { id: session.user.id },
      data: { storageUsed: { decrement: asset.fileSize } }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[MEDIA_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
