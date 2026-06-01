import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Auth Logic for Dashboards
  const isLoggedIn = !!req.auth;
  const isOnDashboard = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");

  if (isOnDashboard) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 2. Custom Domain Logic
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("[::1]");
  const isAppDomain = hostname === "indlink.in" || hostname === "www.indlink.in" || isLocalhost;

  if (!isAppDomain && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/_next")) {
    // Rewrite custom domain to /d/[domain]/[path]
    return NextResponse.rewrite(new URL(`/d/${hostname}${url.pathname}`, req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
