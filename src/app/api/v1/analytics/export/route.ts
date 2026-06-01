import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!profile) return new Response("Profile not found", { status: 404 });

    const clicks = await prisma.click.findMany({
      where: { profileId: profile.id, isBot: false },
      include: { link: { select: { title: true, url: true } } },
      orderBy: { timestamp: 'desc' }
    });

    // Generate CSV
    const headers = ["Timestamp", "Link Title", "Link URL", "Country", "Device", "Browser", "OS", "Referrer"];
    const rows = clicks.map(c => [
      c.timestamp.toISOString(),
      `"${c.link.title.replace(/"/g, '""')}"`,
      `"${c.link.url.replace(/"/g, '""')}"`,
      c.country || "Unknown",
      c.device || "Unknown",
      c.browser || "Unknown",
      c.operatingSystem || "Unknown",
      `"${(c.referrer || "Direct").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="analytics_export_${new Date().toISOString().split('T')[0]}.csv"`,
      }
    });
  } catch (error) {
    console.error("[ANALYTICS_EXPORT_ERROR]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
