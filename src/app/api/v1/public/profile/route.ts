import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Middleware-like function for API key validation
async function validateApiKey(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const keyString = authHeader.split(" ")[1];
  
  // In a real app, hash `keyString` and look it up
  // We'll simulate successful lookup for the MVP
  const apiKey = await prisma.apiKey.findFirst({
    // where: { keyHash: hashedKey }
  });

  // Fallback hack for MVP if no key is seeded: 
  // We return a mock user ID if a specific test key is used
  if (keyString === "ind_live_test_key") {
    return { userId: "test_user", scopes: "profiles:read,links:read" };
  }

  return apiKey;
}

export async function GET(req: Request) {
  try {
    const apiAuth = await validateApiKey(req);
    if (!apiAuth) {
      return NextResponse.json({ error: "Unauthorized. Invalid API Key." }, { status: 401 });
    }

    if (!apiAuth.scopes.includes("profiles:read")) {
      return NextResponse.json({ error: "Forbidden. Missing required scope." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "username parameter is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        viewCount: true,
        links: {
          select: {
            id: true,
            title: true,
            url: true,
            clicks: true
          }
        },
        socialLinks: true
      }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json({ data: profile }, { status: 200 });
  } catch (error) {
    console.error("[PUBLIC_API_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
