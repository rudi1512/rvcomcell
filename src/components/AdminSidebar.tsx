"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminSidebarProps = {
  isOpen: boolean;
  toggle: () => void;
};

export default function AdminSidebar({ isOpen, toggle }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    // Simple logout navigation; actual auth sign‑out should be handled elsewhere
    router.push("/admin/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-100 flex flex-col z-40 transform transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950 font-black tracking-wider text-xl text-white">
        <span className="text-blue-500">RV</span>Comcell Admin
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-6 px-4 space-y-1">
        <Link
          href="/admin/dashboard"
          className="block w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          📦 Kelola Produk
        </Link>
        <Link
          href="/admin/dashboard?tab=software"
          className="block w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          💻 Kelola Software
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 rounded-xl text-sm font-semibold transition-all"
        >
          🚪 Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}
