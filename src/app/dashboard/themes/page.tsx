"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ThemesPage() {
  const [themes, setThemes] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [themesRes, profileRes] = await Promise.all([
        fetch("/api/themes"),
        fetch("/api/profile")
      ]);

      if (themesRes.ok && profileRes.ok) {
        const themesData = await themesRes.json();
        const profileData = await profileRes.json();
        setThemes(themesData.themes || []);
        setProfile(profileData.profile || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = async (themeId: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId }),
      });
      if (res.ok) {
        setProfile({ ...profile, themeId });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Themes</h1>
        <p className="text-muted-foreground">Customize the appearance of your public profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isActive = profile?.themeId === theme.id;
          const settings = typeof theme.settings === 'string' ? JSON.parse(theme.settings) : theme.settings;
          
          return (
            <Card 
              key={theme.id} 
              className={`overflow-hidden transition-all ${isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
            >
              <div 
                className="h-32 w-full flex items-center justify-center relative border-b border-border"
                style={{ backgroundColor: settings.bgColor }}
              >
                <div 
                  className="px-4 py-2 text-sm font-medium"
                  style={{ 
                    backgroundColor: settings.buttonBgColor, 
                    color: settings.buttonTextColor,
                    borderRadius: settings.buttonRadius,
                    border: settings.buttonBgColor === 'transparent' ? `1px solid ${settings.buttonTextColor}` : 'none'
                  }}
                >
                  Button Preview
                </div>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{theme.name}</CardTitle>
                  {isActive && <Check className="h-5 w-5 text-primary" />}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button 
                  variant={isActive ? "secondary" : "default"} 
                  className="w-full"
                  onClick={() => applyTheme(theme.id)}
                  disabled={isActive}
                >
                  {isActive ? "Active Theme" : "Apply Theme"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
