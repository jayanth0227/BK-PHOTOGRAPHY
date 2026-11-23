import React from "react";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Admin Dashboard | Bharath Kumar Photography",
  description: "Secure management console for Bharath Kumar Photography.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col md:flex-row font-sans">
      <AdminNav />
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
