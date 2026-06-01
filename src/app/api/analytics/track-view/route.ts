import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isBot, parseUserAgent, anonymizeIp, generateFingerprint } from "@/lib/analytics-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId } = body;

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "127.0.0.1";
    const ipAddress = anonymizeIp(rawIp.split(',')[0].trim());
    
    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || "Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";
    const referrer = req.headers.get("referer") || "Direct";
    
    const botDetected = isBot(userAgent);
    const { device, browser, os } = parseUserAgent(userAgent);
    const fingerprint = generateFingerprint(ipAddress, userAgent);

    // Run tracking asynchronously
    recordProfileView(
      profileId, fingerprint, ipAddress, userAgent, botDetected, country, city, device, browser, os, referrer
    ).catch(e => console.error("Profile Tracking Error:", e));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[TRACK_VIEW_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function recordProfileView(
  profileId: string, fingerprint: string, ipAddress: string, userAgent: string, 
  botDetected: boolean, country: string, city: string, device: string, 
  browser: string, os: string, referrer: string
) {
  // 1. Handle Visitor Session (Unique/Returning Tracking)
  let isNewVisitor = false;
  
  const existingSession = await prisma.visitorSession.findUnique({
    where: {
      profileId_fingerprint: {
        profileId,
        fingerprint
      }
    }
  });

  if (!existingSession) {
    isNewVisitor = true;
    await prisma.visitorSession.create({
      data: {
        profileId,
        fingerprint,
        visitCount: 1
      }
    });
  } else {
    // Prevent rapid refresh counting (e.g. within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (existingSession.lastSeen < oneHourAgo) {
      await prisma.visitorSession.update({
        where: { id: existingSession.id },
        data: { 
          visitCount: { increment: 1 },
          lastSeen: new Date()
        }
      });
    } else {
      // Ignore rapid repeat visits from analytics
      return;
    }
  }

  // 2. Record Raw Profile View
  await prisma.profileView.create({
    data: {
      profileId,
      visitorFingerprint: fingerprint,
      ipAddress,
      country,
      city,
      device,
      browser,
      operatingSystem: os,
      referrer,
      userAgent,
      isBot: botDetected
    }
  });

  // 3. Update Daily Analytics (Upsert)
  if (!botDetected) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.profile.update({
      where: { id: profileId },
      data: { viewCount: { increment: 1 } }
    });

    await prisma.dailyAnalytics.upsert({
      where: {
        profileId_date: {
          profileId,
          date: today
        }
      },
      update: {
        totalViews: { increment: 1 },
        uniqueVisitors: isNewVisitor ? { increment: 1 } : undefined
      },
      create: {
        profileId,
        date: today,
        totalClicks: 0,
        totalViews: 1,
        uniqueVisitors: isNewVisitor ? 1 : 0
      }
    });
  }
}
