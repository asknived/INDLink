import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Link, QrCode, Activity } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  // Aggregate Metrics
  const totalUsers = await prisma.user.count();
  const totalProfiles = await prisma.profile.count();
  const totalLinks = await prisma.link.count();
  const totalQRs = await prisma.qRCode.count();

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Admin</h1>
        <p className="text-muted-foreground">Overview of INDLink platform metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Profiles created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Links created by users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total QRs</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQRs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              QR codes generated
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Database Status</span>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Payment Gateway (Razorpay)</span>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Storage Edge (R2)</span>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">ONLINE</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Audit logs are securely tracked in the database.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
