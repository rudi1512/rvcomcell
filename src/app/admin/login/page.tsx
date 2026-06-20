"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Jika sudah login, cek apakah terdaftar sebagai admin lalu langsung arahkan ke dashboard
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: admin } = await supabase
          .from("admins")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (admin) {
          router.push("/admin/dashboard");
        } else {
          setCheckingSession(false);
        }
      } else {
        setCheckingSession(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Sign in dengan email & password menggunakan Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Verifikasi apakah User ID terdaftar di tabel public.admins
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (adminError || !adminData) {
          // Jika tidak terdaftar di public.admins, logout paksa
          await supabase.auth.signOut();
          throw new Error("Akun Anda tidak memiliki hak akses administrator. Silakan hubungi admin utama.");
        }

        // Jika sukses, arahkan ke dashboard
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk ke sistem. Silakan periksa kembali email & password Anda.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Memeriksa sesi login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50/50">
      <div className="max-w-md w-full bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        {/* Glow Decor */}
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Logo Brand */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              <span className="text-blue-600">Admin</span> Login
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Masuk untuk mengelola produk dan katalog software</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs px-4 py-3 rounded-2xl mb-6 font-semibold leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rvcomcell.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl text-center text-sm shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center disabled:bg-slate-400 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Memverifikasi...</span>
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
