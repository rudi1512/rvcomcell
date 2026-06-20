"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category: string;
}

interface Software {
  id: string;
  name: string;
  description: string;
  price: number;
  demo_url: string;
  image_url?: string;
  category: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"produk" | "software">("produk");

  // Database Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);

  // Product Form Fields
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("Laptop");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");

  // Software Form Fields
  const [softName, setSoftName] = useState("");
  const [softCategory, setSoftCategory] = useState("Aplikasi Bisnis");
  const [softPrice, setSoftPrice] = useState("");
  const [softDemo, setSoftDemo] = useState("");
  const [softDesc, setSoftDesc] = useState("");
  const [softImage, setSoftImage] = useState("");

  // File Upload Loading State
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading indicator for form actions
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Categories lists matching public page filters
  const PRODUCT_CATEGORIES = ["Laptop", "PC & Rakitan", "Printer", "Smart CCTV", "Aksesoris", "HP"];
  const SOFTWARE_CATEGORIES = ["Aplikasi Bisnis", "Pendidikan", "Umum"];

  useEffect(() => {
    // 1. Verifikasi Autentikasi Admin
    async function verifyAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/admin/login");
          return;
        }

        const { data: admin } = await supabase
          .from("admins")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!admin) {
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        setAdminUser(admin);
        
        // Load data jika admin terverifikasi
        await loadAllData();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyAdmin();
  }, [router]);

  // Load produk dan software dari Supabase
  const loadAllData = async () => {
    try {
      setLoadingData(true);
      
      const { data: prodData } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      const { data: softData } = await supabase.from("software").select("*").order("created_at", { ascending: false });

      setProducts(prodData || []);
      setSoftwareList(softData || []);
    } catch (err) {
      console.error("Error loading db tables data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // ==========================================
  // IMAGE FILE UPLOAD TO STORAGE BUCKET
  // ==========================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "produk" | "software") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file ke bucket 'katalog'
      const { data, error: uploadError } = await supabase.storage
        .from("katalog")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(
          "Gagal mengunggah foto. Pastikan Anda telah membuat Storage Bucket bernama 'katalog' dengan akses Public di dashboard Supabase Anda. Detail: " + uploadError.message
        );
      }

      // Dapatkan URL publik file yang diunggah
      const { data: { publicUrl } } = supabase.storage
        .from("katalog")
        .getPublicUrl(filePath);

      if (type === "produk") {
        setProdImage(publicUrl);
      } else {
        setSoftImage(publicUrl);
      }

      showNotification("success", "Foto berhasil diunggah!");
    } catch (err: any) {
      showNotification("error", err.message || "Gagal mengunggah file.");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // CRUD - PRODUK (HARDWARE)
  // ==========================================
  
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCategory("Laptop");
    setProdPrice("");
    setProdStock("");
    setProdDesc("");
    setProdImage("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdStock(product.stock.toString());
    setProdDesc(product.description || "");
    setProdImage(product.image_url || "");
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: prodName,
        category: prodCategory,
        price: parseFloat(prodPrice),
        stock: parseInt(prodStock),
        description: prodDesc,
        image_url: prodImage || null,
      };

      if (editingProduct) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        
        if (error) throw error;
        showNotification("success", "Produk berhasil diperbarui!");
      } else {
        // Insert
        const { error } = await supabase
          .from("products")
          .insert([payload]);

        if (error) throw error;
        showNotification("success", "Produk baru berhasil ditambahkan!");
      }

      setIsProductModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menyimpan produk.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      showNotification("success", "Produk berhasil dihapus!");
      await loadAllData();
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menghapus produk.");
    }
  };

  // ==========================================
  // CRUD - SOFTWARE (APLIKASI)
  // ==========================================

  const openAddSoftwareModal = () => {
    setEditingSoftware(null);
    setSoftName("");
    setSoftCategory("Aplikasi Bisnis");
    setSoftPrice("");
    setSoftDemo("");
    setSoftDesc("");
    setSoftImage("");
    setIsSoftwareModalOpen(true);
  };

  const openEditSoftwareModal = (software: Software) => {
    setEditingSoftware(software);
    setSoftName(software.name);
    setSoftCategory(software.category);
    setSoftPrice(software.price.toString());
    setSoftDemo(software.demo_url);
    setSoftDesc(software.description || "");
    setSoftImage(software.image_url || "");
    setIsSoftwareModalOpen(true);
  };

  const handleSaveSoftware = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: softName,
        category: softCategory,
        price: parseFloat(softPrice),
        demo_url: softDemo,
        description: softDesc,
        image_url: softImage || null,
      };

      if (editingSoftware) {
        // Update
        const { error } = await supabase
          .from("software")
          .update(payload)
          .eq("id", editingSoftware.id);
        
        if (error) throw error;
        showNotification("success", "Software berhasil diperbarui!");
      } else {
        // Insert
        const { error } = await supabase
          .from("software")
          .insert([payload]);

        if (error) throw error;
        showNotification("success", "Software baru berhasil ditambahkan!");
      }

      setIsSoftwareModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menyimpan software.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSoftware = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus software "${name}"?`)) return;

    try {
      const { error } = await supabase.from("software").delete().eq("id", id);
      if (error) throw error;
      showNotification("success", "Software berhasil dihapus!");
      await loadAllData();
    } catch (err: any) {
      showNotification("error", err.message || "Gagal menghapus software.");
    }
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (checkingAuth) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-medium">Memverifikasi hak akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow min-h-screen flex bg-slate-50 relative overflow-hidden">
      
      {/* ==========================================
          SIDEBAR KIRI
      ========================================== */}
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-100 flex flex-col z-40 transform transition-transform duration-300 md:translate-x-0 md:static ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950 font-black tracking-wider text-xl text-white">
          <span className="text-blue-500">RV</span>Comcell Admin
        </div>

        {/* Menu navigasi */}
        <nav className="flex-grow py-6 px-4 space-y-1">
          <button
            onClick={() => {
              setActiveTab("produk");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "produk" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">📦</span>
            <span>Kelola Produk</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("software");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "software" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-lg">💻</span>
            <span>Kelola Software</span>
          </button>
        </nav>

        {/* Logout area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 rounded-xl text-sm font-semibold transition-all"
          >
            <span>🚪</span>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN AREA CONTENT
      ========================================== */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header Main Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Hamburger button (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
            {activeTab === "produk" ? "📦 Manajemen Produk Hardware" : "💻 Manajemen Katalog Software"}
          </h2>

          <div className="text-sm font-medium text-slate-500 flex items-center space-x-2">
            <span className="hidden sm:inline">Masuk sebagai:</span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold text-xs border border-slate-200">
              {adminUser?.full_name || adminUser?.email}
            </span>
          </div>
        </header>

        {/* Body content */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* Notifikasi Pop Up */}
          {notification && (
            <div 
              className={`fixed bottom-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-xl text-white font-semibold flex items-center space-x-2 animate-bounce ${
                notification.type === "success" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              <span>{notification.type === "success" ? "✅" : "⚠️"}</span>
              <span>{notification.message}</span>
            </div>
          )}

          {/* TAB 1: KELOLA PRODUK */}
          {activeTab === "produk" && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Daftar Produk</h3>
                  <p className="text-xs text-slate-400">Total: {products.length} item terdaftar</p>
                </div>
                <button
                  onClick={openAddProductModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center space-x-1.5"
                >
                  <span>＋</span>
                  <span>Tambah Produk</span>
                </button>
              </div>

              {loadingData ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-400 text-sm">Memuat data produk...</p>
                </div>
              ) : products.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="p-4 w-16">Foto</th>
                        <th className="p-4">Nama Produk</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4">Stok</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                              {prod.image_url ? (
                                <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg">📦</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-slate-800">{prod.name}</td>
                          <td className="p-4">
                            <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-900">{formatPrice(prod.price)}</td>
                          <td className="p-4">
                            <span className={prod.stock > 0 ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                              {prod.stock} Unit
                            </span>
                          </td>
                          <td className="p-4 flex items-center justify-center space-x-2">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
                  <span className="text-4xl block mb-3">📦</span>
                  <p className="text-slate-400 font-semibold">Belum ada produk terdaftar</p>
                  <button
                    onClick={openAddProductModal}
                    className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg"
                  >
                    Buat Produk Pertama
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KELOLA SOFTWARE */}
          {activeTab === "software" && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Daftar Software</h3>
                  <p className="text-xs text-slate-400">Total: {softwareList.length} software terdaftar</p>
                </div>
                <button
                  onClick={openAddSoftwareModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center space-x-1.5"
                >
                  <span>＋</span>
                  <span>Tambah Software</span>
                </button>
              </div>

              {loadingData ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-400 text-sm">Memuat data software...</p>
                </div>
              ) : softwareList.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="p-4 w-16">Foto</th>
                        <th className="p-4">Nama Software</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Harga Lisensi</th>
                        <th className="p-4">Link Demo</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                      {softwareList.map((soft) => (
                        <tr key={soft.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                              {soft.image_url ? (
                                <img src={soft.image_url} alt={soft.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg">💻</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-slate-800">{soft.name}</td>
                          <td className="p-4">
                            <span className="bg-purple-50 text-purple-600 text-xs px-2.5 py-1 rounded-full font-bold">
                              {soft.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-900">{formatPrice(soft.price)}</td>
                          <td className="p-4 max-w-xs truncate text-blue-600 hover:underline">
                            <a href={soft.demo_url} target="_blank" rel="noopener noreferrer">
                              {soft.demo_url}
                            </a>
                          </td>
                          <td className="p-4 flex items-center justify-center space-x-2">
                            <button
                              onClick={() => openEditSoftwareModal(soft)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSoftware(soft.id, soft.name)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
                  <span className="text-4xl block mb-3">🚀</span>
                  <p className="text-slate-400 font-semibold">Belum ada software terdaftar</p>
                  <button
                    onClick={openAddSoftwareModal}
                    className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg"
                  >
                    Buat Software Pertama
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ==========================================
          MODAL FORM: PRODUK
      ========================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
              {editingProduct ? "✏️ Edit Produk Hardware" : "📦 Tambah Produk Hardware"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Asus Vivobook X415"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="Contoh: 10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga (Rupiah)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="Contoh: 5999000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Foto Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, "produk")}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Atau Gunakan URL Foto</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                />
              </div>

              {/* Preview Foto */}
              {(prodImage || uploading) && (
                <div className="mt-3 flex items-center space-x-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  {uploading ? (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center animate-pulse">
                      <span className="text-[10px] text-slate-400 font-bold animate-bounce">Uploading...</span>
                    </div>
                  ) : (
                    <img src={prodImage} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                  )}
                  <div className="text-xs text-slate-500 truncate max-w-[300px]">
                    <span className="font-semibold text-slate-700 block">Preview Foto:</span>
                    {uploading ? "Sedang mengunggah file..." : prodImage}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Produk</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detail spesifikasi, garansi, dll."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all disabled:bg-slate-400"
                >
                  {saving ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL FORM: SOFTWARE
      ========================================== */}
      {isSoftwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
              {editingSoftware ? "✏️ Edit Produk Software" : "🚀 Tambah Produk Software"}
            </h3>

            <form onSubmit={handleSaveSoftware} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Software</label>
                <input
                  type="text"
                  required
                  value={softName}
                  onChange={(e) => setSoftName(e.target.value)}
                  placeholder="Contoh: Aplikasi POS Kasir"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={softCategory}
                    onChange={(e) => setSoftCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                  >
                    {SOFTWARE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga Lisensi (Rupiah)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={softPrice}
                    onChange={(e) => setSoftPrice(e.target.value)}
                    placeholder="Contoh: 1500000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link Demo (Wajib)</label>
                  <input
                    type="url"
                    required
                    value={softDemo}
                    onChange={(e) => setSoftDemo(e.target.value)}
                    placeholder="Contoh: https://demo-pos.rvcomcell.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Foto Cover</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "software")}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Atau Gunakan URL Foto</label>
                <input
                  type="text"
                  value={softImage}
                  onChange={(e) => setSoftImage(e.target.value)}
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                />
              </div>

              {/* Preview Foto */}
              {(softImage || uploading) && (
                <div className="mt-3 flex items-center space-x-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  {uploading ? (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center animate-pulse">
                      <span className="text-[10px] text-slate-400 font-bold animate-bounce">Uploading...</span>
                    </div>
                  ) : (
                    <img src={softImage} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                  )}
                  <div className="text-xs text-slate-500 truncate max-w-[300px]">
                    <span className="font-semibold text-slate-700 block">Preview Foto:</span>
                    {uploading ? "Sedang mengunggah file..." : softImage}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Fitur Software</label>
                <textarea
                  rows={3}
                  value={softDesc}
                  onChange={(e) => setSoftDesc(e.target.value)}
                  placeholder="Detail fitur aplikasi, keunggulan, dll."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSoftwareModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all disabled:bg-slate-400"
                >
                  {saving ? "Menyimpan..." : "Simpan Software"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
