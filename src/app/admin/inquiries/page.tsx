"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Phone,
  Mail,
  Calendar,
  MapPin,
  MessageCircle,
  Trash2,
  Sparkles,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  location?: string;
  message?: string;
  status: "new" | "contacted" | "booked" | "archived";
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries(
          inquiries.map((inq) =>
            inq._id === id ? { ...inq, status: newStatus as InquiryItem["status"] } : inq
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer inquiry?")) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries(inquiries.filter((inq) => inq._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  const filteredInquiries =
    filterStatus === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filterStatus);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Client Relationship Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Client Inquiries &amp; <span className="font-serif italic text-red-500">Leads</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Review incoming event requests, update statuses, and contact prospective clients directly via WhatsApp.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "new", "contacted", "booked", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                filterStatus === st
                  ? "bg-red-600 text-white"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Cards / Table */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 bg-neutral-900/30 rounded-2xl border border-neutral-800">
          <Inbox className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <p className="text-base font-medium text-neutral-300">No inquiries found</p>
          <p className="text-xs text-neutral-500 mt-1">
            Submissions made through the public website will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => {
            const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
              inq.name
            )}%2C%20thank%20you%20for%20reaching%20out%20to%20Bharath%20Kumar%20Photography%20regarding%20your%20${encodeURIComponent(
              inq.eventType
            )}%20celebration!`;

            return (
              <div
                key={inq._id}
                className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-medium text-white">{inq.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/60 text-red-400 border border-red-800/40">
                      {inq.eventType}
                    </span>

                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                      className={`text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 border transition focus:outline-none cursor-pointer ${
                        inq.status === "new"
                          ? "bg-yellow-950/50 text-yellow-400 border-yellow-800/50"
                          : inq.status === "booked"
                          ? "bg-green-950/50 text-green-400 border-green-800/50"
                          : inq.status === "contacted"
                          ? "bg-blue-950/50 text-blue-400 border-blue-800/50"
                          : "bg-neutral-800 text-neutral-400 border-neutral-700"
                      }`}
                    >
                      <option value="new">New / Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked & Confirmed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      {inq.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      {inq.email}
                    </span>
                    {inq.eventDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        {inq.eventDate}
                      </span>
                    )}
                    {inq.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        {inq.location}
                      </span>
                    )}
                  </div>

                  {inq.message && (
                    <p className="text-xs sm:text-sm text-neutral-300 bg-neutral-950/60 p-3 rounded-xl border border-neutral-850 mt-2">
                      &ldquo;{inq.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold uppercase tracking-wider transition shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider transition"
                  >
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>Call</span>
                  </a>

                  <button
                    onClick={() => handleDelete(inq._id)}
                    className="p-2.5 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
