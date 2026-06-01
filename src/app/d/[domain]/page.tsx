import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function CustomDomainProfilePage({ params }: { params: { domain: string } }) {
  const customDomain = await prisma.customDomain.findUnique({
    where: { domain: params.domain },
    include: { profile: true }
  });

  if (!customDomain || customDomain.status !== "VERIFIED") {
    return notFound();
  }

  // Redirect internally to the actual profile renderer route, or we can just render the Profile here.
  // The simplest approach is redirecting, but a true white-label keeps the domain.
  // For the MVP, we will rewrite/render the profile directly. But to avoid duplicating code,
  // we can redirect or we can just export the Profile component from `/[username]/page.tsx` and render it here.
  
  redirect(`/${customDomain.profile.username}`);
}
