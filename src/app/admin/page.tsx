"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Images,
  TrendingUp,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { PortfolioItemType, INITIAL_PORTFOLIO_ITEMS } from "@/lib/sampleData";

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  location?: string;
  status: "new" | "contacted" | "booked" | "archived";
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [photosCount, setPhotosCount] = useState<number>(INITIAL_PORTFOLIO_ITEMS.length);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load portfolio count
        const pRes = await fetch("/api/portfolio");
        if (pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData)) setPhotosCount(pData.length);
        }

        // Load inquiries
        const iRes = await fetch("/api/inquiries");
        if (iRes.ok) {
          const iData = await iRes.json();
          if (Array.isArray(iData)) setInquiries(iData);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const pendingLeads = inquiries.filter((i) => i.status === "new");
  const bookedLeads = inquiries.filter((i) => i.status === "booked");

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Studio Control Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Welcome, <span className="font-serif italic text-red-500">Bharath Kumar</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your Cloudinary media portfolio and respond to prospective client inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-semibold tracking-wider transition-all shadow-md shadow-red-900/30 flex items-center gap-2"
          >
            <Images className="w-4 h-4" />
            <span>Manage Photos</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase font-semibold tracking-wider border border-neutral-800 transition flex items-center gap-2"
          >
            <Inbox className="w-4 h-4 text-red-500" />
            <span>View Inquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Inquiries</span>
            <Inbox className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{inquiries.length}</span>
            <p className="text-xs text-neutral-400 mt-1">Direct inquiries via website</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">New / Pending</span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-yellow-400">{pendingLeads.length}</span>
            <p className="text-xs text-neutral-400 mt-1">Awaiting your response</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Confirmed Shoots</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-green-400">{bookedLeads.length}</span>
            <p className="text-xs text-neutral-400 mt-1">Dates locked &amp; booked</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Portfolio Photos</span>
            <Images className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{photosCount}</span>
            <p className="text-xs text-neutral-400 mt-1">Live in public showcase</p>
          </div>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-white">Recent Client Inquiries</h3>
            <p className="text-xs text-neutral-400">Latest wedding &amp; event booking requests</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 bg-neutral-950/40 rounded-xl border border-neutral-850">
            <p className="text-sm">No inquiries received yet.</p>
            <p className="text-xs text-neutral-500 mt-1">
              New client submissions will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq._id} className="hover:bg-neutral-850/50">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{inq.name}</div>
                      <div className="text-xs text-neutral-400">{inq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{inq.eventType}</td>
                    <td className="py-3.5 px-4 text-neutral-400 text-xs">
                      {inq.eventDate || "TBD"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          inq.status === "new"
                            ? "bg-yellow-950/50 text-yellow-400 border border-yellow-800/50"
                            : inq.status === "booked"
                            ? "bg-green-950/50 text-green-400 border border-green-800/50"
                            : "bg-neutral-800 text-neutral-300"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                          inq.name
                        )}%2C%20thank%20you%20for%20contacting%20Bharath%20Kumar%20Photography!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-950/40 text-green-400 border border-green-800/50 hover:bg-green-900/50 text-xs font-semibold transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
