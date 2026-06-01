"use client";

import { useEffect } from "react";

export default function ProfileTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    // Only track once per page load
    const trackView = async () => {
      try {
        await fetch("/api/analytics/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId })
        });
      } catch (e) {
        // Silently fail if tracking is blocked
      }
    };
    trackView();
  }, [profileId]);

  return null; // Silent component
}
