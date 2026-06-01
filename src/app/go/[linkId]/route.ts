import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isBot, parseUserAgent, anonymizeIp, generateFingerprint, extractUTMs } from "@/lib/analytics-utils";

export async function GET(req: Request, { params }: { params: { linkId: string } }) {
  try {
    const linkId = params.linkId;
    
    // Validate Link
    const link = await prisma.link.findUnique({
      where: { id: linkId },
    });

    if (!link || !link.isActive) {
      return NextResponse.redirect(new URL("/404", req.url)); // Or redirect to profile
    }

    // Capture Headers
    const userAgent = req.headers.get("user-agent") || "";
    // Vercel / Cloudflare edge IP headers
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "127.0.0.1";
    const ipAddress = anonymizeIp(rawIp.split(',')[0].trim());
    
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";
    const referrer = req.headers.get("referer") || "Direct";
    
    const botDetected = isBot(userAgent);
    const { device, browser, os } = parseUserAgent(userAgent);
    const url = new URL(req.url);
    const utms = extractUTMs(url);

    // Asynchronous Analytics Recording (Fire and Forget)
    // In a high-scale environment, this should ideally be pushed to Redis/Kafka or handled by Edge Middleware.
    // We execute it but do not block the redirect.
    recordClickAnalytics(link, ipAddress, userAgent, botDetected, country, city, device, browser, os, referrer, utms)
      .catch(e => console.error("Analytics Recording Failed:", e));

    // Redirect instantly
    return NextResponse.redirect(new URL(link.url));
  } catch (error) {
    console.error("[REDIRECT_ENGINE_ERROR]", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

async function recordClickAnalytics(
  link: any, 
  ipAddress: string, 
  userAgent: string, 
  botDetected: boolean, 
  country: string, 
  city: string, 
  device: string, 
  browser: string, 
  os: string, 
  referrer: string,
  utms: any
) {
  // Fraud Protection: Prevent multiple clicks from same IP within 5 seconds for the same link
  const recentClick = await prisma.click.findFirst({
    where: {
      linkId: link.id,
      ipAddress,
      timestamp: {
        gte: new Date(Date.now() - 5000) // 5 seconds ago
      }
    }
  });

  if (recentClick) {
    console.log("Click ignored due to rate limiting/fraud protection.");
    return;
  }

  // 1. Record the raw click
  await prisma.click.create({
    data: {
      profileId: link.profileId,
      linkId: link.id,
      ipAddress,
      country,
      city,
      device,
      browser,
      operatingSystem: os,
      referrer,
      userAgent,
      isBot: botDetected,
      ...utms
    }
  });

  // 2. Update Daily Analytics (Upsert)
  if (!botDetected) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Increment Link Click Count
    await prisma.link.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } }
    });

    await prisma.dailyAnalytics.upsert({
      where: {
        profileId_date: {
          profileId: link.profileId,
          date: today
        }
      },
      update: {
        totalClicks: { increment: 1 }
      },
      create: {
        profileId: link.profileId,
        date: today,
        totalClicks: 1,
        totalViews: 0,
        uniqueVisitors: 0
      }
    });
  }
}
