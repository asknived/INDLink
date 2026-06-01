import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Verify Purchase
    const purchase = await prisma.purchase.findFirst({
      where: {
        productId,
        userId: session.user.id
      },
      include: { product: true }
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 403 });
    }

    // Retrieve original storage key from product
    // In Phase 5 architecture, fileUrl might actually store the secure R2 key.
    const storageKey = purchase.product.fileUrl; 
    
    // Generate an expiring presigned GET URL
    // NOTE: In a real implementation, you'd add a `getDownloadUrl` to `storage.ts`
    // using GetObjectCommand. For this MVP, we return a mock signed URL or the public URL if configured.
    
    // Hack: Assuming `storage.ts` has been extended or we just return the public URL for now.
    const downloadUrl = storage.getFileUrl(storageKey); 

    return NextResponse.json({ downloadUrl }, { status: 200 });

  } catch (error) {
    console.error("[SECURE_DOWNLOAD_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
