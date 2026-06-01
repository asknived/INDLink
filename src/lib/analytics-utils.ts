import { UAParser } from "ua-parser-js";
import crypto from "crypto";

const KNOWN_BOTS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "slurp",
  "baiduspider",
  "ahrefsbot",
  "semrushbot",
  "facebookexternalhit",
  "twitterbot",
  "whatsapp",
  "telegrambot",
  "linkedinbot"
];

export function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return KNOWN_BOTS.some(bot => ua.includes(bot));
}

export function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  return {
    device: parser.getDevice().type || "desktop", // mobile, tablet, console, smarttv, wearable, embedded
    browser: parser.getBrowser().name || "unknown",
    os: parser.getOS().name || "unknown",
  };
}

// IP anonymization (zero out the last octet for IPv4 or last 80 bits for IPv6)
export function anonymizeIp(ip: string): string {
  if (!ip) return "0.0.0.0";
  if (ip.includes(":")) {
    // IPv6
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + ":0000:0000:0000:0000:0000";
  }
  // IPv4
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  return ip;
}

export function generateFingerprint(ip: string, userAgent: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(`${ip}-${userAgent}`);
  return hash.digest("hex");
}

export function extractUTMs(url: URL) {
  return {
    utm_source: url.searchParams.get("utm_source"),
    utm_medium: url.searchParams.get("utm_medium"),
    utm_campaign: url.searchParams.get("utm_campaign"),
    utm_term: url.searchParams.get("utm_term"),
    utm_content: url.searchParams.get("utm_content"),
  };
}
