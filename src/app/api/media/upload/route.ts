import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZES = {
  avatar: 5 * 1024 * 1024,      // 5MB
  cover: 10 * 1024 * 1024,     // 10MB
  background: 10 * 1024 * 1024 // 10MB
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, fileName, fileSize, mimeType } = body;

    // Validation
    if (!type || !fileName || !fileSize || !mimeType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP, SVG allowed." }, { status: 400 });
    }

    const maxSizeBytes = MAX_SIZES[type as keyof typeof MAX_SIZES] || 5 * 1024 * 1024;
    if (fileSize > maxSizeBytes) {
      return NextResponse.json({ error: `File too large. Max size is ${maxSizeBytes / 1024 / 1024}MB.` }, { status: 400 });
    }

    // Quota Check
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { storageUsed: true, storageLimit: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newStorageTotal = Number(user.storageUsed) + Number(fileSize);
    if (newStorageTotal > Number(user.storageLimit)) {
      return NextResponse.json({ error: "Storage limit exceeded. Upgrade your plan." }, { status: 403 });
    }

    // Generate Storage Key (e.g. avatars/123-avatar-uuid.webp)
    const timestamp = Date.now();
    const ext = fileName.split('.').pop() || "png";
    const key = `${type}s/${session.user.id}-${timestamp}.${ext}`;
    
    // Get Presigned URL
    const uploadUrl = await storage.getUploadUrl(key, mimeType);
    const finalUrl = storage.getFileUrl(key);

    return NextResponse.json({ uploadUrl, key, finalUrl }, { status: 200 });

  } catch (error) {
    console.error("[MEDIA_UPLOAD_PREPARE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// We use PUT to finalize the DB record after the client successfully uploads to the presigned URL
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, key, finalUrl, fileSize, mimeType } = body;

    const asset = await prisma.mediaAsset.create({
      data: {
        userId: session.user.id,
        type,
        url: finalUrl,
        storageKey: key,
        fileSize: Number(fileSize),
        mimeType
      }
    });

    // Update User Storage Quota
    await prisma.user.update({
      where: { id: session.user.id },
      data: { storageUsed: { increment: Number(fileSize) } }
    });

    return NextResponse.json({ asset }, { status: 200 });
  } catch (error) {
    console.error("[MEDIA_UPLOAD_FINALIZE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
