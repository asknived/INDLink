import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { defaultThemes } from "@/lib/theme-registry";

export async function GET() {
  try {
    // Upsert default themes to ensure they exist in DB (simulating initialization)
    const tx = defaultThemes.map(theme => 
      prisma.theme.upsert({
        where: { name: theme.name },
        update: {}, // Don't override if user edited (in a real system)
        create: {
          name: theme.name,
          settings: theme.settings,
        }
      })
    );
    await prisma.$transaction(tx);

    const themes = await prisma.theme.findMany();
    return NextResponse.json({ themes }, { status: 200 });
  } catch (error) {
    console.error("[THEMES_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
