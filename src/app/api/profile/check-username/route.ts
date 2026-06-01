import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateUsername } from "@/lib/profile-utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ available: false, error: "Username is required" }, { status: 400 });
    }

    const { isValid, error } = validateUsername(username);

    if (!isValid) {
      return NextResponse.json({ available: false, error }, { status: 400 });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return NextResponse.json({ available: false });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("[CHECK_USERNAME_ERROR]", error);
    return NextResponse.json({ available: false, error: "Internal Server Error" }, { status: 500 });
  }
}
