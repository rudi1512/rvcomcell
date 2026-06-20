"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1",
    name: "Asus Vivobook Go 14",
    description: "Laptop modern bertenaga Intel Celeron, RAM 8GB, SSD 256GB. Layar 14 inci FHD, ringan dan sangat cocok untuk pelajar & pekerja kantoran.",
    price: 6299000,
    stock: 5,
    category: "Laptop",
  },
  {
    id: "mock-2",
    name: "PC Gaming Ryzen 5 5600G",
    description: "Komputer rakitan siap pakai. Processor AMD Ryzen 5 5600G dengan Radeon Graphics, RAM 16GB Dual Channel, SSD 512GB NVMe. Lancar untuk gaming ringan & desain.",
    price: 5800000,
    stock: 3,
    category: "PC & Rakitan",
  },
  {
    id: "mock-3",
    name: "Epson L3210 All-in-One Printer",
    description: "Printer ecotank multifungsi untuk cetak, scan, dan copy. Sangat hemat tinta dengan kualitas cetak tajam, cocok untuk kebutuhan cetak dokumen harian.",
    price: 2350000,
    stock: 8,
    category: "Printer",
  },
  {
    id: "mock-4",
    name: "TP-Link Tapo C200 Smart CCTV",
    description: "Kamera pengawas pintar dengan resolusi 1080p, bisa berputar 360 derajat. Dilengkapi night vision, motion detection, dan audio dua arah. Pantau lewat HP.",
    price: 380000,
    stock: 12,
    category: "Smart CCTV",
  },
  {
    id: "mock-5",
    name: "Logitech MK220 Wireless Combo",
    description: "Satu set keyboard dan mouse wireless ringkas dengan jangkauan sinyal hingga 10 meter. Baterai tahan lama dan tombol senyap.",
    price: 299000,
    stock: 15,
    category: "Aksesoris",
  },
  {
    id: "mock-6",
    name: "Xiaomi Redmi Note 13",
    description: "Smartphone Android layar AMOLED 120Hz, kamera utama 108MP, RAM 8GB, Internal 256GB. Baterai 5000mAh mendukung fast charging 33W.",
    price: 2599000,
    stock: 6,
    category: "HP",
  },
];

const CATEGORIES = ["Semua", "Laptop", "PC & Rakitan", "Printer", "Smart CCTV", "Aksesoris", "HP"];

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Mencoba fetch dari Supabase table 'products'
        // Jika tabel belum dibuat, ini akan melempar error dan masuk ke catch block
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (error) throw error;

        if (data && data.length > 0) {
          // Mapping data dari Supabase jika ada
          const formattedData = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || "",
            price: Number(item.price),
            stock: Number(item.stock) || 0,
            image_url: item.image_url,
            category: item.category || "Umum",
          }));
          setProducts(formattedData);
          setIsUsingMock(false);
        } else {
          // Jika kosong, gunakan mock data
          setProducts(MOCK_PRODUCTS);
          setIsUsingMock(true);
        }
      } catch (err) {
        console.warn("Gagal terhubung ke database Supabase (tabel mungkin belum dibuat). Menggunakan data simulasi (offline).", err);
        setProducts(MOCK_PRODUCTS);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter produk berdasarkan pencarian dan kategori
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Fungsi untuk mendapatkan emoji ikon kategori
  const getCategoryEmoji = (category?: string) => {
    switch (category) {
      case "Laptop": return "💻";
      case "PC & Rakitan": return "🖥️";
      case "Printer": return "🖨️";
      case "Smart CCTV": return "📹";
      case "HP": return "📱";
      case "Aksesoris": return "🔌";
      default: return "📦";
    }
  };

  // Mendapatkan warna gradien banner kartu berdasarkan kategori
  const getCategoryGradient = (category?: string) => {
    switch (category) {
      case "Laptop": return "from-blue-500 to-cyan-500";
      case "PC & Rakitan": return "from-indigo-500 to-purple-500";
      case "Printer": return "from-amber-500 to-orange-500";
      case "Smart CCTV": return "from-emerald-500 to-teal-500";
      case "HP": return "from-pink-500 to-rose-500";
      case "Aksesoris": return "from-slate-600 to-slate-800";
      default: return "from-blue-600 to-indigo-600";
    }
  };

  const getWhatsAppLink = (productName: string, price: number) => {
    const formattedPrice = formatPrice(price);
    const message = `Halo RV Comcell, saya tertarik dengan produk *${productName}* seharga *${formattedPrice}*. Apakah stok masih tersedia?`;
    return `https://wa.me/6285789592881?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
      {/* Header Halaman */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Katalog Produk</h1>
        <p className="text-slate-500 mt-2 text-base md:text-lg">
          Temukan komputer, gadget, dan sistem keamanan berkualitas dengan harga bersaing.
        </p>
        
        {isUsingMock && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Menampilkan data katalog simulasi (offline). Konfigurasikan tabel Supabase untuk sinkronisasi live.</span>
          </div>
        )}
      </div>

      {/* Kontrol Filter & Pencarian */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col gap-6">
        {/* Input Pencarian */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari produk impian Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl">
            🔍
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Produk / Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse h-96">
              <div className="h-40 bg-slate-200"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3 pt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Cover Card - Menggunakan background gradien dan Emoji untuk estetika modern */}
              <div className={`h-40 bg-gradient-to-r ${getCategoryGradient(product.category)} flex items-center justify-center relative overflow-hidden`}>
                <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {getCategoryEmoji(product.category)}
                </span>
                <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 uppercase">
                  {product.category || "Produk"}
                </span>
              </div>

              {/* Isi Info Produk */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                  {product.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-400">Harga</span>
                    <span className="text-lg font-extrabold text-blue-600">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-400">Stok</span>
                    <span className={`text-sm font-bold ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                      {product.stock > 0 ? `${product.stock} Unit` : "Habis"}
                    </span>
                  </div>
                </div>

                <a
                  href={getWhatsAppLink(product.name, product.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-center text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.634-1.024-5.117-2.892-6.98-1.868-1.863-4.355-2.887-6.993-2.887-5.443 0-9.866 4.42-9.87 9.866-.001 1.779.47 3.514 1.36 5.052L1.824 21.8l4.823-1.646zm12.19-5.143c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.66.85-.81 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.3-.77-.69-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.3-.02-.43-.06-.13-.58-1.39-.79-1.9-.21-.51-.43-.44-.58-.45-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.69.3-.24.24-.92.9-1.13 2.19-.21 1.28.72 2.53.82 2.67.1.14 1.83 2.8 4.43 3.93 1.15.5 2.05.78 2.76.99.64.21 1.23.18 1.69.11.51-.08 1.54-.63 1.76-1.24.22-.6.22-1.12.15-1.24-.07-.12-.25-.19-.51-.32z"/>
                  </svg>
                  <span>Pesan Sekarang</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian atau filter "{selectedCategory}".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
            }}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-all"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
