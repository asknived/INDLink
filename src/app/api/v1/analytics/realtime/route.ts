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

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // In a real app, this would poll Redis.
    // For now, we query the DB for activity in the last 5 minutes.
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const [activeVisitors, recentClicks] = await Promise.all([
      prisma.visitorSession.count({
        where: {
          profileId: profile.id,
          lastSeen: { gte: fiveMinutesAgo }
        }
      }),
      prisma.click.findMany({
        where: {
          profileId: profile.id,
          timestamp: { gte: fiveMinutesAgo },
          isBot: false
        },
        include: { link: { select: { title: true } } },
        orderBy: { timestamp: 'desc' },
        take: 10
      })
    ]);

    return NextResponse.json({
      activeVisitors,
      recentClicks: recentClicks.map(c => ({
        id: c.id,
        linkTitle: c.link.title,
        country: c.country,
        device: c.device,
        time: c.timestamp
      }))
    }, { status: 200 });

  } catch (error) {
    console.error("[ANALYTICS_REALTIME_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
