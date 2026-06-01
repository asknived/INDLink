import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30"; // 7, 30, 90 days
    const days = parseInt(range);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get aggregated stats
    const dailyStats = await prisma.dailyAnalytics.findMany({
      where: {
        profileId: profile.id,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    });

    const totalViews = dailyStats.reduce((sum, day) => sum + day.totalViews, 0);
    const totalClicks = dailyStats.reduce((sum, day) => sum + day.totalClicks, 0);
    const uniqueVisitors = dailyStats.reduce((sum, day) => sum + day.uniqueVisitors, 0);
    
    // CTR Calculation
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";

    // Chart Data mapping
    const chartData = dailyStats.map(stat => ({
      date: stat.date.toISOString().split('T')[0],
      views: stat.totalViews,
      clicks: stat.totalClicks,
    }));

    // Top Links
    const topLinks = await prisma.link.findMany({
      where: { profileId: profile.id },
      orderBy: { clickCount: 'desc' },
      take: 5,
      select: { id: true, title: true, url: true, clickCount: true }
    });

    return NextResponse.json({
      overview: {
        totalViews,
        totalClicks,
        uniqueVisitors,
        ctr: `${ctr}%`
      },
      chartData,
      topLinks
    }, { status: 200 });

  } catch (error) {
    console.error("[ANALYTICS_OVERVIEW_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
