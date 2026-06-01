import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isBot, parseUserAgent, anonymizeIp, generateFingerprint } from "@/lib/analytics-utils";

export async function GET(req: Request, { params }: { params: { qrId: string } }) {
  try {
    const qrId = params.qrId;
    
    const qr = await prisma.qRCode.findUnique({
      where: { id: qrId },
      include: { profile: true }
    });

    if (!qr) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Capture Analytics
    const userAgent = req.headers.get("user-agent") || "";
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "127.0.0.1";
    const ipAddress = anonymizeIp(rawIp.split(',')[0].trim());
    const botDetected = isBot(userAgent);

    if (!botDetected) {
      // Fire and forget tracking
      prisma.qRCode.update({
        where: { id: qr.id },
        data: { 
          scanCount: { increment: 1 },
          lastScannedAt: new Date()
        }
      }).catch(e => console.error("QR Scan Tracking Failed:", e));
    }

    // Determine target URL
    let targetUrl = `/${qr.profile.username}`;
    
    if (qr.type === 'link' && qr.linkId) {
      targetUrl = `/go/${qr.linkId}`;
    }

    return NextResponse.redirect(new URL(targetUrl, req.url));
  } catch (error) {
    console.error("[QR_REDIRECT_ERROR]", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
