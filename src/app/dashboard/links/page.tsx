"use client";

import { useEffect, useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical, Plus, Trash2, Edit2, Link as LinkIcon } from "lucide-react";

// Sortable Item Component
function SortableLinkItem({ link, onDelete }: { link: any; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-card border border-border p-4 rounded-lg shadow-sm mb-3">
      <div {...attributes} {...listeners} className="cursor-grab hover:text-primary">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm">{link.title}</h4>
        <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-[400px]">{link.url}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 bg-muted rounded-full uppercase tracking-wider">{link.type}</span>
        <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

export default function LinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, url: newUrl }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewUrl("");
        fetchLinks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Save to DB
        const reorderPayload = newArray.map((item, index) => ({ id: item.id, position: index }));
        fetch("/api/links/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: reorderPayload }),
        });

        return newArray;
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Links</h1>
        <p className="text-muted-foreground">Manage and reorder your links.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="My Website" required />
            </div>
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." required />
            </div>
            <Button type="submit" className="w-full sm:w-auto mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Your Links</h3>
        {links.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg border border-border border-dashed">
            <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">You don't have any links yet.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={links.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {links.map(link => (
                <SortableLinkItem key={link.id} link={link} onDelete={handleDelete} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
