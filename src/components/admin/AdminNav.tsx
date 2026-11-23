"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Inbox,
  LogOut,
  ExternalLink,
  Camera,
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // If on the login page, don't show the dashboard navigation
  if (pathname === "/admin/login") {
    return null;
  }

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "Portfolio Management",
      href: "/admin/portfolio",
      icon: <Images className="w-4 h-4" />,
    },
    {
      name: "Client Inquiries & Leads",
      href: "/admin/inquiries",
      icon: <Inbox className="w-4 h-4" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="w-full md:w-64 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between flex-shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800 flex flex-col items-center">
          <BrandLogo size="md" />
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-800/60 text-[11px] font-semibold text-red-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Studio Management
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
        >
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-red-500" />
            View Public Site
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
