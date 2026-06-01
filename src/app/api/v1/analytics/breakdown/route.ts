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
    const range = searchParams.get("range") || "30"; 
    const days = parseInt(range);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Prisma doesn't have native GroupBy for multiple un-related tables easily returning format we want,
    // so we group manually or use groupBy.
    
    // Devices Breakdown
    const devices = await prisma.click.groupBy({
      by: ['device'],
      where: { profileId: profile.id, timestamp: { gte: startDate }, isBot: false },
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } }
    });

    // Countries Breakdown
    const countries = await prisma.click.groupBy({
      by: ['country'],
      where: { profileId: profile.id, timestamp: { gte: startDate }, isBot: false },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10
    });

    // Referrers
    const referrers = await prisma.click.groupBy({
      by: ['referrer'],
      where: { profileId: profile.id, timestamp: { gte: startDate }, isBot: false },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 5
    });

    const formatData = (data: any[], key: string) => 
      data.map(item => ({ name: item[key] || "Unknown", value: item._count[key] }));

    return NextResponse.json({
      devices: formatData(devices, 'device'),
      countries: formatData(countries, 'country'),
      referrers: formatData(referrers, 'referrer')
    }, { status: 200 });

  } catch (error) {
    console.error("[ANALYTICS_BREAKDOWN_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
