"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateProfileCompletion } from "@/lib/profile-utils";
import ImageUploader from "@/components/ImageUploader";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || {});
        if (data.profile) {
          setCompletionScore(calculateProfileCompletion(data.profile, data.profile.links || [], data.profile.socialLinks || []));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;
    try {
      const res = await fetch(`/api/profile/check-username?username=${username}`);
      const data = await res.json();
      if (!res.ok) {
        setUsernameError(data.error || "Username is unavailable");
      } else {
        setUsernameError("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profile saved!");
        fetchProfile();
      } else {
        setUsernameError(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSuccess = (type: string) => (url: string, key: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [type === 'background' ? 'backgroundUrl' : type === 'cover' ? 'coverImage' : 'avatar']: url,
      [`${type}StorageKey`]: key
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your public profile settings and social links.</p>
      </div>

      <Card className="bg-muted/50 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Profile Completion</h3>
            <span className="font-bold text-primary">{completionScore}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${completionScore}%` }}></div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Media Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Media Assets</CardTitle>
            <CardDescription>Upload your avatar, cover, and background images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label>Avatar (1:1)</Label>
                <ImageUploader 
                  type="avatar" 
                  aspectRatio={1} 
                  currentImage={profile?.avatar} 
                  onSuccess={handleMediaSuccess('avatar')} 
                />
              </div>
              <div className="space-y-3">
                <Label>Background Image (16:9)</Label>
                <ImageUploader 
                  type="background" 
                  aspectRatio={16/9} 
                  currentImage={profile?.backgroundUrl} 
                  onSuccess={handleMediaSuccess('background')} 
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label>Cover Image (3:1)</Label>
                <ImageUploader 
                  type="cover" 
                  aspectRatio={3} 
                  currentImage={profile?.coverImage} 
                  onSuccess={handleMediaSuccess('cover')} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 pt-4">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profile?.displayName || ""}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center">
                <span className="bg-muted px-3 border border-r-0 border-input rounded-l-md text-sm text-muted-foreground h-10 flex items-center">indlink.in/</span>
                <Input
                  id="username"
                  value={profile?.username || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfile({ ...profile, username: val });
                    checkUsername(val);
                  }}
                  className={`rounded-l-none ${usernameError ? 'border-destructive' : ''}`}
                  placeholder="your-username"
                  required
                />
              </div>
              {usernameError && <p className="text-sm text-destructive">{usernameError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={profile?.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell your audience about yourself"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || !!usernameError}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
