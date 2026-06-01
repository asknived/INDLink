export const RESERVED_USERNAMES = [
  "admin",
  "api",
  "dashboard",
  "login",
  "register",
  "support",
  "pricing",
  "about",
  "contact",
];

export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters long." };
  }
  
  if (username.length > 30) {
    return { isValid: false, error: "Username cannot exceed 30 characters." };
  }

  const regex = /^[a-z0-9_]+$/;
  if (!regex.test(username)) {
    return { isValid: false, error: "Username can only contain lowercase letters, numbers, and underscores." };
  }

  if (RESERVED_USERNAMES.includes(username)) {
    return { isValid: false, error: "This username is reserved and cannot be used." };
  }

  return { isValid: true };
}

export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

export function calculateProfileCompletion(profile: any, links: any[], socialLinks: any[]): number {
  let score = 0;
  
  if (profile?.avatar) score += 15;
  if (profile?.bio) score += 15;
  if (profile?.username) score += 20;
  if (profile?.themeId) score += 10;
  if (socialLinks && socialLinks.length > 0) score += 15;
  if (links && links.length > 0) score += 25;

  return score;
}
