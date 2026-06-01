"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search, LayoutGrid, List as ListIcon, FileImage } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (res.ok) setAssets(data.assets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      setAssets(assets.filter(a => a.id !== id));
      selectedIds.delete(id);
      setSelectedIds(new Set(selectedIds));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} assets?`)) return;
    for (const id of Array.from(selectedIds)) {
      await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    }
    setAssets(assets.filter(a => !selectedIds.has(a.id)));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.storageKey.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || a.type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) return <div>Loading library...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your uploaded images and assets.</p>
        </div>
        <div className="flex gap-2 items-center">
          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Selected ({selectedIds.size})
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search files..." 
            className="pl-8" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="avatar">Avatars</SelectItem>
              <SelectItem value="cover">Covers</SelectItem>
              <SelectItem value="background">Backgrounds</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex bg-muted rounded-md border p-1">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setView("grid")} className="h-7 w-7 p-0">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setView("list")} className="h-7 w-7 p-0">
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-20 border border-dashed rounded-lg bg-muted/10">
          <FileImage className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-medium">No media found</h3>
          <p className="text-sm text-muted-foreground mt-1">Images you upload for your profile will appear here.</p>
        </div>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredAssets.map(asset => (
                <Card key={asset.id} className={`overflow-hidden cursor-pointer transition-all ${selectedIds.has(asset.id) ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`} onClick={() => toggleSelect(asset.id)}>
                  <div className="aspect-square bg-muted relative group">
                    <img src={asset.url} alt={asset.storageKey} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs font-medium truncate" title={asset.storageKey}>{asset.storageKey.split('/').pop()}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] uppercase text-muted-foreground px-2 py-0.5 bg-muted rounded-full">{asset.type}</span>
                      <span className="text-[10px] text-muted-foreground">{(asset.fileSize / 1024).toFixed(0)} KB</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-md divide-y">
              {filteredAssets.map(asset => (
                <div key={asset.id} className={`flex items-center p-3 gap-4 hover:bg-muted/30 transition-colors ${selectedIds.has(asset.id) ? 'bg-primary/5' : ''}`} onClick={() => toggleSelect(asset.id)}>
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img src={asset.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{asset.storageKey.split('/').pop()}</p>
                    <p className="text-xs text-muted-foreground uppercase">{asset.type} • {(asset.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
