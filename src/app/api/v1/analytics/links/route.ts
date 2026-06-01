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

    const links = await prisma.link.findMany({
      where: { profileId: profile.id },
      include: {
        clicks: {
          where: { isBot: false },
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    const enrichedLinks = links.map(link => {
      const totalClicks = link.clicks.length;
      const uniqueIps = new Set(link.clicks.map(c => c.ipAddress)).size;
      const lastClick = link.clicks[0]?.timestamp || null;

      // Calculate Top Country
      const countries: Record<string, number> = {};
      link.clicks.forEach(c => { if(c.country) countries[c.country] = (countries[c.country] || 0) + 1; });
      const topCountry = Object.keys(countries).sort((a,b) => countries[b] - countries[a])[0] || "N/A";

      // Calculate Top Device
      const devices: Record<string, number> = {};
      link.clicks.forEach(c => { if(c.device) devices[c.device] = (devices[c.device] || 0) + 1; });
      const topDevice = Object.keys(devices).sort((a,b) => devices[b] - devices[a])[0] || "N/A";

      return {
        id: link.id,
        title: link.title,
        url: link.url,
        clicks: totalClicks,
        uniqueClicks: uniqueIps,
        lastClick,
        topCountry,
        topDevice
      };
    });

    return NextResponse.json({ links: enrichedLinks }, { status: 200 });

  } catch (error) {
    console.error("[ANALYTICS_LINKS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
