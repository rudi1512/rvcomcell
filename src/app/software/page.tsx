import React from "react";
import Link from "next/link";

export default function SoftwarePage() {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-xl w-full text-center bg-white/70 backdrop-blur-md border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Maintenance Icon */}
          <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <span className="text-5xl" role="img" aria-label="software icon">
              🚀
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
            Katalog Software <br />
            <span className="text-blue-600">Segera Hadir</span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed mb-10 text-sm md:text-base">
            Kami sedang mempersiapkan daftar produk software siap pakai hasil buatan kami yang siap untuk dijual (seperti sistem kasir, web sekolah, aplikasi inventory, dll.). Halaman ini sedang dalam pemeliharaan dan akan segera aktif.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
            >
              Kembali ke Beranda
            </Link>
            <a
              href="https://wa.me/6285789592881?text=Halo%20RV%20Comcell,%20saya%20tertarik%20untuk%20tanya%20tanya%20mengenai%20produk%20software%20siap%20pakai%20yang%20dijual."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-8 rounded-2xl transition-all"
            >
              Tanya Software (WA)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
