"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Link as LinkIcon, UserCircle, QrCode as QrIcon } from "lucide-react";
import QRCode from "react-qr-code";
import { toPng, toSvg } from 'html-to-image';

export default function QRDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [qrs, setQrs] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<{type: 'profile' | 'link', id?: string}>({ type: 'profile' });
  const [qrRecord, setQrRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Customization State
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [template, setTemplate] = useState("standard");
  
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (profile) loadQRRecord();
  }, [activeItem, profile]);

  const fetchData = async () => {
    try {
      const [profileRes, linksRes, qrsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/links"),
        fetch("/api/qr")
      ]);
      if (profileRes.ok) setProfile((await profileRes.json()).profile);
      if (linksRes.ok) setLinks((await linksRes.json()).links);
      if (qrsRes.ok) setQrs((await qrsRes.json()).qrs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadQRRecord = async () => {
    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeItem.type, linkId: activeItem.id })
      });
      const data = await res.json();
      setQrRecord(data.qr);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!qrRef.current) return;
    try {
      let dataUrl = "";
      if (format === 'png') {
        dataUrl = await toPng(qrRef.current, { cacheBust: true, style: { padding: '20px', background: bgColor }});
      } else {
        dataUrl = await toSvg(qrRef.current, { cacheBust: true, style: { padding: '20px', background: bgColor }});
      }
      
      const link = document.createElement('a');
      link.download = `indlink-qr-${activeItem.type}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  // The redirect target URL that the QR encodes
  const qrTargetUrl = qrRecord ? `${window.location.origin}/q/${qrRecord.id}` : window.location.origin;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
        <p className="text-muted-foreground">Generate and customize QR codes for your profile and links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Selection & Customization */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant={activeItem.type === 'profile' ? 'default' : 'outline'} 
                className="w-full justify-start"
                onClick={() => setActiveItem({ type: 'profile' })}
              >
                <UserCircle className="h-4 w-4 mr-2" /> My Profile
              </Button>
              
              <div className="pt-4 pb-2 text-sm font-medium text-muted-foreground uppercase">Individual Links</div>
              {links.map(link => (
                <Button 
                  key={link.id}
                  variant={activeItem.id === link.id ? 'default' : 'outline'} 
                  className="w-full justify-start truncate"
                  onClick={() => setActiveItem({ type: 'link', id: link.id })}
                  title={link.title}
                >
                  <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0" /> {link.title}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="modern">Modern (Dots)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Foreground</label>
                  <Input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-10 p-1 cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background</label>
                  <Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10 p-1 cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Col: Preview & Download */}
        <div className="md:col-span-2 space-y-6">
          <Card className="flex flex-col items-center justify-center py-12">
            <div 
              ref={qrRef} 
              className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <QRCode
                value={qrTargetUrl}
                size={256}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
              />
            </div>
            <div className="mt-8 flex gap-4">
              <Button onClick={() => handleDownload('png')}>
                <Download className="h-4 w-4 mr-2" /> Download PNG
              </Button>
              <Button variant="secondary" onClick={() => handleDownload('svg')}>
                <Download className="h-4 w-4 mr-2" /> Download SVG
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground break-all px-12 text-center">
              Destination: {qrTargetUrl}
            </p>
          </Card>

          {/* Analytics Snapshot */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">QR Analytics</CardTitle>
              <QrIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="text-2xl font-bold">{qrRecord?.scanCount || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Scanned</p>
                  <p className="font-medium text-sm">
                    {qrRecord?.lastScannedAt ? new Date(qrRecord.lastScannedAt).toLocaleDateString() : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
