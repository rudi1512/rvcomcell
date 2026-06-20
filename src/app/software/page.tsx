"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Software {
  id: string;
  name: string;
  description: string;
  price: number;
  demo_url: string;
  image_url?: string;
  category?: string;
}

const MOCK_SOFTWARE: Software[] = [
  {
    id: "soft-1",
    name: "Sistem Kasir (Point of Sales) Cloud",
    description: "Sistem kasir berbasis web yang cepat dan responsif untuk usaha retail, cafe, minimarket, dan restoran. Lengkap dengan cetak struk, manajemen stok barang real-time, manajemen supplier, serta laporan laba rugi otomatis bulanan.",
    price: 1500000,
    demo_url: "https://demo.rvcomcell.com/pos",
    category: "Aplikasi Bisnis",
  },
  {
    id: "soft-2",
    name: "Sistem Informasi Akademik Sekolah (SIAS)",
    description: "Portal manajemen sekolah terpadu yang menghubungkan Admin, Guru, Siswa, dan Wali Murid. Fitur mencakup absensi digital, input nilai rapor kurikulum merdeka, pembayaran SPP online, serta modul ujian online (CBT).",
    price: 3500000,
    demo_url: "https://demo.rvcomcell.com/sias",
    category: "Pendidikan",
  },
  {
    id: "soft-3",
    name: "Aplikasi Manajemen Inventory & Gudang",
    description: "Solusi pergudangan modern untuk memantau stok keluar-masuk, sistem stock opname otomatis, mutasi barang antar cabang, peringatan stok minimum, serta cetak barcode produk. Sangat cocok untuk distributor & e-commerce.",
    price: 2000000,
    demo_url: "https://demo.rvcomcell.com/inventory",
    category: "Aplikasi Bisnis",
  },
];

export default function SoftwarePage() {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    async function fetchSoftware() {
      try {
        setLoading(true);
        // Mencoba fetch dari Supabase table 'software'
        const { data, error } = await supabase
          .from("software")
          .select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: Number(item.price),
            demo_url: item.demo_url || "#",
            image_url: item.image_url,
            category: item.category || "Umum",
          }));
          setSoftwareList(formattedData);
          setIsUsingMock(false);
        } else {
          setSoftwareList(MOCK_SOFTWARE);
          setIsUsingMock(true);
        }
      } catch (err) {
        console.warn("Gagal terhubung ke tabel Supabase 'software'. Menggunakan data simulasi (offline).", err);
        setSoftwareList(MOCK_SOFTWARE);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSoftware();
  }, []);

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getSoftwareEmoji = (category?: string) => {
    switch (category) {
      case "Aplikasi Bisnis": return "📊";
      case "Pendidikan": return "🏫";
      default: return "💻";
    }
  };

  const getSoftwareGradient = (category?: string) => {
    switch (category) {
      case "Aplikasi Bisnis": return "from-blue-600 to-indigo-600";
      case "Pendidikan": return "from-purple-600 to-indigo-700";
      default: return "from-slate-700 to-slate-900";
    }
  };

  const getWhatsAppLink = (name: string, price: number) => {
    const formattedPrice = formatPrice(price);
    const message = `Halo RV Comcell, saya tertarik dengan produk software *${name}* seharga *${formattedPrice}*. Apakah saya bisa berkonsultasi untuk pemesanan/custom?`;
    return `https://wa.me/6285789592881?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
      {/* Header Halaman */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Katalog Software</h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Jelajahi aplikasi siap pakai buatan tim RV Comcell untuk meningkatkan efisiensi bisnis dan instansi Anda.
        </p>

        {isUsingMock && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Menampilkan data katalog software simulasi (offline). Konfigurasikan tabel Supabase untuk sinkronisasi live.</span>
          </div>
        )}
      </div>

      {/* Grid Software */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse h-96">
              <div className="h-44 bg-slate-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-10 bg-slate-200 rounded w-1/3 pt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : softwareList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {softwareList.map((soft) => (
            <div
              key={soft.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Header Visual - Menggunakan Gambar jika ada, atau background gradien & Emoji */}
              <div className={`h-44 relative overflow-hidden ${!soft.image_url ? `bg-gradient-to-br ${getSoftwareGradient(soft.category)} flex flex-col items-center justify-center text-white` : ''}`}>
                {soft.image_url ? (
                  <img 
                    src={soft.image_url} 
                    alt={soft.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <>
                    <span className="text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {getSoftwareEmoji(soft.category)}
                    </span>
                  </>
                )}
                <span className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase">
                  {soft.category || "Software"}
                </span>
              </div>

              {/* Info Detail */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-3">
                  {soft.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4">
                  {soft.description}
                </p>

                {/* Harga Area */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mb-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400">Harga Lisensi</span>
                    <span className="text-xl font-extrabold text-blue-600">{formatPrice(soft.price)}</span>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                    Lisensi Permanen
                  </span>
                </div>

                {/* Tombol Aksi */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={soft.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-2xl text-center text-sm border border-slate-200 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>🌐</span>
                    <span>Coba Demo</span>
                  </a>
                  <a
                    href={getWhatsAppLink(soft.name, soft.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#22c35e] text-white font-bold py-3 px-4 rounded-2xl text-center text-sm shadow-md shadow-[#25D366]/10 hover:shadow-[#25D366]/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    <span>Pesan (WA)</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <span className="text-5xl block mb-4">🚀</span>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Software Belum Tersedia</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Maaf, saat ini belum ada software yang didaftarkan di katalog. Hubungi kami untuk pembuatan sistem kustom.
          </p>
        </div>
      )}
    </div>
  );
}
