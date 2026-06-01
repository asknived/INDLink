import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { validateUsername, generateSlug } from "@/lib/profile-utils";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        links: {
          orderBy: { position: 'asc' }
        },
        socialLinks: {
          orderBy: { order: 'asc' }
        },
        theme: true
      }
    });

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { username, displayName, bio, website, location, avatar, coverImage, themeId } = body;

    // Validate and format username if provided
    if (username) {
      username = generateSlug(username);
      const { isValid, error } = validateUsername(username);
      if (!isValid) {
        return NextResponse.json({ error }, { status: 400 });
      }

      // Check uniqueness if they are changing it
      const existing = await prisma.profile.findUnique({ where: { username } });
      if (existing && existing.userId !== session.user.id) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
      }
    }

    // Upsert the profile (Create if doesn't exist, update if it does)
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        ...(username && { username }),
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
        ...(location !== undefined && { location }),
        ...(avatar !== undefined && { avatar }),
        ...(coverImage !== undefined && { coverImage }),
        ...(themeId !== undefined && { themeId }),
      },
      create: {
        userId: session.user.id,
        username: username || generateSlug(session.user.name || session.user.email?.split('@')[0] || Date.now().toString()),
        displayName,
        bio,
        website,
        location,
        avatar,
        coverImage,
        themeId,
      }
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[PROFILE_PUT_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
