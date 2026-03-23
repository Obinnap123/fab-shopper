"use client";

import { useState, useRef } from "react";
import { SectionCard } from "@/components/admin/ui/section-card";
import { ImageIcon, Pencil, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CollectionsClient({ initialCollections }: { initialCollections: any[] }) {
  const [collections, setCollections] = useState(initialCollections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For creating a new collection
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Rename Actions
  const handleStartRename = (col: any) => {
    setEditingId(col.id);
    setEditName(col.name);
  };

  const handleSaveRename = async (id: string) => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCollections(collections.map(c => c.id === id ? { ...c, name: json.data.name, slug: json.data.slug } : c));
        setEditingId(null);
        toast.success("Collection renamed successfully");
      } else {
        toast.error("Failed to rename collection");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload Action
  const handleFileClick = (id: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("data-collection-id", id);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const colId = e.target.getAttribute("data-collection-id");
    if (!file || !colId) return;

    setIsUploading(colId);
    
    // 1. Upload to Cloudinary via existing route
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      // 2. Patch Collection with new Image URL
      const patchRes = await fetch(`/api/collections/${colId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });

      const json = await patchRes.json();
      if (patchRes.ok && json.data) {
        setCollections(collections.map(c => c.id === colId ? { ...c, image: json.data.image } : c));
        toast.success("Image uploaded successfully");
      }
    } catch (e) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Create Collection Action
  const handleCreateCollection = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCollections([...collections, json.data]);
        setNewName("");
        toast.success("Collection created successfully");
      } else {
        toast.error("Failed to create collection");
      }
    } catch (e) {
      toast.error("An error occurred. Check browser console.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Hidden Global File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <SectionCard title="Collection List">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <div key={collection.id} className="rounded-2xl border border-forest/10 overflow-hidden bg-white shadow-sm flex flex-col">
              
              {/* Cover Image Area */}
              <div 
                className="h-40 w-full bg-forest/5 relative group cursor-pointer border-b border-forest/10 flex items-center justify-center"
                onClick={() => handleFileClick(collection.id)}
              >
                {collection.image ? (
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover transition-opacity group-hover:opacity-60" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-forest/40">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs uppercase tracking-widest">No Cover</span>
                  </div>
                )}

                {/* Hover overlay for upload instructions */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading === collection.id ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  ) : (
                    <span className="text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                       Upload New
                    </span>
                  )}
                </div>
              </div>

              {/* Text & Actions Details */}
              <div className="p-5 flex-1 flex flex-col">
                {editingId === collection.id ? (
                  <div className="flex items-center gap-2 w-full mb-2">
                    <input 
                      autoFocus
                      className="flex-1 rounded-lg border border-forest/20 px-3 h-8 text-sm focus:outline-none focus:border-forest"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <button onClick={() => setEditingId(null)} className="text-forest/50 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleSaveRename(collection.id)} disabled={isSaving} className="text-forest/50 hover:text-forest">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between mb-1 group">
                    <p className="font-semibold text-forest text-lg">{collection.name}</p>
                    <button onClick={() => handleStartRename(collection)} className="text-forest/30 hover:text-forest opacity-0 group-hover:opacity-100 transition-opacity p-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="mt-auto pt-2 flex items-center justify-between text-xs text-forest/60">
                   <p className="font-mono bg-forest/5 px-2 py-0.5 rounded text-[10px]">{collection.slug}</p>
                   <p>{collection._count?.products || 0} products</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Add Collection" subtitle="Quickly create a new collection from scratch.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded-2xl border border-forest/15 px-4 py-3 text-sm focus:outline-none focus:border-forest w-full lg:col-span-2" 
            placeholder="E.g. Summer Collection" 
          />
          <button 
            onClick={handleCreateCollection}
            disabled={isCreating || !newName.trim()}
            className="rounded-full bg-forest px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-cream hover:bg-forest/90 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
          </button>
        </div>
      </SectionCard>
    </>
  );
}
