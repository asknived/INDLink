import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ThemeProvider from "@/components/ThemeProvider";
import { defaultThemes } from "@/lib/theme-registry";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import ProfileTracker from "@/components/ProfileTracker";
import { 
  Instagram, Facebook, Linkedin, Youtube, 
  Github, Twitter, Music, MessageCircle, MapPin
} from "lucide-react";

type Props = {
  params: { username: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
  });

  if (!profile) return { title: "Profile Not Found" };

  return {
    title: `${profile.displayName || profile.username} | INDLink`,
    description: profile.bio || "Check out my links on INDLink.",
    openGraph: {
      title: `${profile.displayName || profile.username} | INDLink`,
      description: profile.bio || "Check out my links on INDLink.",
      images: [profile.avatar || "/default-avatar.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.displayName || profile.username} | INDLink`,
      description: profile.bio || "Check out my links on INDLink.",
      images: [profile.avatar || "/default-avatar.png"],
    }
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { position: 'asc' }
      },
      socialLinks: {
        orderBy: { order: 'asc' }
      },
      theme: true
    }
  });

  if (!profile) notFound();

  // Get theme settings
  let settings = defaultThemes[0].settings;
  if (profile.theme?.settings) {
    settings = typeof profile.theme.settings === 'string' 
      ? JSON.parse(profile.theme.settings) 
      : profile.theme.settings;
  }

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case "INSTAGRAM": return <Instagram className="h-6 w-6" />;
      case "FACEBOOK": return <Facebook className="h-6 w-6" />;
      case "LINKEDIN": return <Linkedin className="h-6 w-6" />;
      case "YOUTUBE": return <Youtube className="h-6 w-6" />;
      case "GITHUB": return <Github className="h-6 w-6" />;
      case "TWITTER": return <Twitter className="h-6 w-6" />;
      case "SPOTIFY": return <Music className="h-6 w-6" />;
      case "TELEGRAM": 
      case "WHATSAPP": return <MessageCircle className="h-6 w-6" />;
      default: return null;
    }
  };

  return (
    <ThemeProvider settings={settings as any}>
      <ProfileTracker profileId={profile.id} />
      <div className="min-h-screen flex flex-col items-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
          
          {/* Avatar */}
          <div className="h-28 w-28 rounded-full overflow-hidden border-4" style={{ borderColor: 'var(--theme-primary)' }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.displayName || profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                {(profile.displayName || profile.username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.displayName || `@${profile.username}`}
            </h1>
            {profile.bio && (
              <p className="opacity-90 max-w-md mx-auto">{profile.bio}</p>
            )}
            {profile.location && (
              <div className="flex items-center justify-center text-sm opacity-80 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </div>
            )}
          </div>

          {/* Social Links Row */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {profile.socialLinks.map((social) => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110 opacity-90 hover:opacity-100"
                  style={{ color: 'var(--theme-primary)' }}
                >
                  {renderSocialIcon(social.platform)}
                  <span className="sr-only">{social.platform}</span>
                </a>
              ))}
            </div>
          )}

          {/* Links List */}
          <div className="w-full space-y-4 pt-6">
            {profile.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-full p-4 transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: 'var(--theme-btn-bg)',
                  color: 'var(--theme-btn-text)',
                  borderRadius: 'var(--theme-btn-radius)',
                  border: 'var(--theme-btn-bg)' === 'transparent' ? '1px solid var(--theme-btn-text)' : 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <span className="font-medium text-center">{link.title}</span>
              </a>
            ))}
          </div>

        </div>

        {/* Branding Footer */}
        <div className="mt-auto pt-16 pb-8">
          <Link href="/" className="font-bold tracking-tighter opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--theme-text)' }}>
            INDLink
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
}
