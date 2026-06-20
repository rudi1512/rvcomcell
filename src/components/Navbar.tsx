"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Cek sesi login saat ini
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Dengarkan perubahan status login (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Produk", path: "/produk" },
    { name: "Software", path: "/software" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Sembunyikan Navbar di halaman admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm py-4 px-6 md:px-12 sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight select-none">
          <span className="text-blue-600">RV</span>Comcell
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-semibold">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`transition-colors duration-200 py-1 border-b-2 ${
                isActive(item.path)
                  ? "text-blue-600 border-blue-600"
                  : "text-slate-600 border-transparent hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Link 
                href="/admin/dashboard" 
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/admin/login" 
              className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Login
            </Link>
          )}

          {/* Tombol Burger Mobile */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col bg-white border-t border-slate-100 mt-4 py-4 space-y-2 font-semibold text-slate-600 px-2 animate-fadeIn">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Auth Buttons */}
          <div className="pt-2 px-3 border-t border-slate-100 mt-2 space-y-2 sm:hidden">
            {user ? (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
