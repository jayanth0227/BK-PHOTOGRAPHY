"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  Tag,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PortfolioItemType, INITIAL_PORTFOLIO_ITEMS } from "@/lib/sampleData";

const CATEGORIES = [
  "Marriage",
  "Haldi",
  "Birthday",
  "Pre-Wedding",
  "Portraits",
] as const;

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Marriage");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : INITIAL_PORTFOLIO_ITEMS);
      }
    } catch (err) {
      console.error("Failed to load portfolio:", err);
      setItems(INITIAL_PORTFOLIO_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file to upload.");
      return;
    }
    setError(null);
    setUploading(true);

    try {
      // 1. Upload to Cloudinary API
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // 2. Save portfolio metadata to MongoDB
      const saveRes = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          imageUrl: uploadData.url,
          cloudinaryPublicId: uploadData.publicId,
          location,
          eventDate,
          featured,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(saveData.error || "Failed to save portfolio metadata");
      }

      setSuccess("Photo uploaded and added to portfolio successfully!");
      setModalOpen(false);
      // Reset form
      setTitle("");
      setLocation("");
      setEventDate("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setFeatured(false);

      // Refresh list
      fetchItems();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during upload.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo from the portfolio?")) {
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete item");
      }

      setItems(items.filter((item) => item._id !== id));
      setSuccess("Photo deleted successfully");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete photo");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Media &amp; Cloudinary
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Portfolio <span className="font-serif italic text-red-500">Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Upload new high-resolution shoots, assign categories, and curate your public showcase.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-semibold tracking-wider transition-all shadow-lg shadow-red-900/40 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Photo</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-950/50 border border-green-800 text-green-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Grid of Portfolio items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between"
          >
            {/* Image Thumbnail */}
            <div className="relative h-60 w-full overflow-hidden bg-black">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-neutral-700">
                  {item.category}
                </span>
              </div>

              {item.featured && (
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-600 text-white shadow-md">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Meta & Actions */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-medium text-white">{item.title}</h4>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-400">
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {item.location}
                    </span>
                  )}
                  {item.eventDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {item.eventDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500 font-mono">
                  {item._id.startsWith("demo") ? "Demo Photo" : "Cloudinary Asset"}
                </span>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-medium text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-red-500" />
              Upload Photo to Portfolio
            </h3>
            <p className="text-xs text-neutral-400 mt-1 mb-6">
              File will be uploaded to Cloudinary and added to your showcase gallery.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Drop / Select */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                  Photo File *
                </label>
                <div className="border-2 border-dashed border-neutral-800 hover:border-red-600/60 rounded-2xl p-4 text-center cursor-pointer transition">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-500 cursor-pointer"
                  />
                  {previewUrl && (
                    <div className="mt-4 relative h-40 w-full rounded-xl overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Telugu Muhurtham"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Shoot Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                  Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Taj Falaknuma, Hyderabad"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 bg-neutral-900 border-neutral-800 focus:ring-0"
                />
                <label htmlFor="featuredToggle" className="text-xs text-neutral-300 cursor-pointer">
                  Feature this photo prominently on the homepage
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {uploading ? "Uploading to Cloudinary..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
