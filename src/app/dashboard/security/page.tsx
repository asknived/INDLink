"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, MonitorSmartphone, Key } from "lucide-react";

export default function SecurityDashboard() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQr, setShowQr] = useState(false);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-muted-foreground">Manage your account security, 2FA, and active sessions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{twoFactorEnabled ? "2FA is Enabled" : "2FA is Disabled"}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {twoFactorEnabled ? "Your account is highly secure." : "We highly recommend enabling 2FA."}
                  </p>
                </div>
                {!twoFactorEnabled && (
                  <Button onClick={() => setShowQr(true)}>Enable 2FA</Button>
                )}
                {twoFactorEnabled && (
                  <Button variant="destructive" onClick={() => setTwoFactorEnabled(false)}>Disable</Button>
                )}
              </div>
            </div>

            {showQr && !twoFactorEnabled && (
              <div className="p-4 border rounded-lg bg-card text-center space-y-4">
                <p className="text-sm">Scan this QR code with an Authenticator app (like Google Authenticator or Authy).</p>
                <div className="w-48 h-48 bg-muted mx-auto rounded-md flex items-center justify-center">
                  [QR Code Image Placeholder]
                </div>
                <Button onClick={() => { setShowQr(false); setTwoFactorEnabled(true); }}>Verify & Enable</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorSmartphone className="h-5 w-5 text-primary" /> Active Sessions
            </CardTitle>
            <CardDescription>Manage devices currently logged into your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-sm">Windows • Chrome</h4>
                  <p className="text-xs text-muted-foreground">Active Now • Mumbai, India</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">THIS DEVICE</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-sm">iPhone • Safari</h4>
                  <p className="text-xs text-muted-foreground">Last active 2 hrs ago • Bangalore, India</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">Revoke</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> Developer API Keys
            </CardTitle>
            <CardDescription>Generate keys to access the INDLink Public API.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center border rounded-lg bg-muted/30 border-dashed">
              <Key className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium">No API Keys Generated</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">You need an active Business Plan to generate API keys.</p>
              <Button disabled>Generate New Key</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
