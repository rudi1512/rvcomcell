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
  
  // Sidebar States (Responsive & Collapsible)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Untuk mobile drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Untuk desktop collapse
  const [activeTab, setActiveTab] = useState<"dashboard" | "produk" | "software">("dashboard");

  // Database Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [softSearchTerm, setSoftSearchTerm] = useState("");
  const [softSelectedCategory, setSoftSelectedCategory] = useState("Semua Kategori");

  // Pagination States
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentSoftwarePage, setCurrentSoftwarePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

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

  // ==========================================
  // FILTERING & PAGINATION LOGIC
  // ==========================================

  // 1. Filter Produk
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (prod.description && prod.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Semua Kategori" || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginasi Produk
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentProductPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // 2. Filter Software
  const filteredSoftware = softwareList.filter((soft) => {
    const matchesSearch = soft.name.toLowerCase().includes(softSearchTerm.toLowerCase()) || 
                          (soft.description && soft.description.toLowerCase().includes(softSearchTerm.toLowerCase()));
    const matchesCategory = softSelectedCategory === "Semua Kategori" || soft.category === softSelectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginasi Software
  const totalSoftwarePages = Math.ceil(filteredSoftware.length / itemsPerPage);
  const indexOfLastSoftware = currentSoftwarePage * itemsPerPage;
  const indexOfFirstSoftware = indexOfLastSoftware - itemsPerPage;
  const currentSoftwareList = filteredSoftware.slice(indexOfFirstSoftware, indexOfLastSoftware);

  // Statistik Dashboard
  const totalHardware = products.length;
  const totalSoftware = softwareList.length;
  const lowStockProducts = products.filter(p => p.stock <= 3);
  const lowStockCount = lowStockProducts.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

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
    <div className="flex-grow min-h-screen flex bg-slate-50/50 relative overflow-hidden font-sans">
      
      {/* ==========================================
          SIDEBAR KIRI (COLLAPSIBLE & DRAWER)
      ========================================== */}
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-100 flex flex-col z-40 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static h-screen ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        isSidebarCollapsed ? "md:w-20" : "md:w-64"
      } w-64`}>
        
        {/* Brand Header */}
        <div className={`h-16 flex items-center border-b border-slate-800 bg-slate-950 font-black tracking-wider text-xl text-white transition-all duration-300 ${
          isSidebarCollapsed ? "justify-center px-2" : "px-6"
        }`}>
          {isSidebarCollapsed ? (
            <span className="text-blue-500 text-2xl font-black">RV</span>
          ) : (
            <div className="truncate">
              <span className="text-blue-500">RV</span>Comcell Admin
            </div>
          )}
        </div>

        {/* Menu Navigasi & Logout */}
        <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
          {/* TAB 0: DASHBOARD */}
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all ${
              isSidebarCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"
            } ${
              activeTab === "dashboard" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
            }`}
            title="Dashboard Overview"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {!isSidebarCollapsed && <span className="truncate">Dashboard</span>}
          </button>

          {/* TAB 1: KELOLA PRODUK */}
          <button
            onClick={() => {
              setActiveTab("produk");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all ${
              isSidebarCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"
            } ${
              activeTab === "produk" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
            }`}
            title="Kelola Produk"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {!isSidebarCollapsed && <span className="truncate">Kelola Produk</span>}
          </button>
          
          {/* TAB 2: KELOLA SOFTWARE */}
          <button
            onClick={() => {
              setActiveTab("software");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all ${
              isSidebarCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"
            } ${
              activeTab === "software" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
            }`}
            title="Kelola Software"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {!isSidebarCollapsed && <span className="truncate">Kelola Software</span>}
          </button>

          {/* LINE BREAK */}
          <div className="border-t border-slate-800 my-4" />

          {/* LOGOUT BUTTON (DEKAT DENGAN KELOLA SOFTWARE) */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-xl text-sm font-bold transition-all ${
              isSidebarCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"
            } bg-slate-800 hover:bg-rose-955 hover:text-rose-250 text-slate-300`}
            title="Keluar (Logout)"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isSidebarCollapsed && <span className="truncate">Keluar (Logout)</span>}
          </button>
        </nav>
      </aside>

      {/* ==========================================
          MAIN AREA CONTENT
      ========================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Header Main Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            {/* Hamburger button (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-650 hover:bg-slate-100 rounded-xl md:hidden transition-colors"
              aria-label="Toggle Sidebar Mobile"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Collapse button (Desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl hidden md:block transition-colors"
              aria-label="Toggle Sidebar Desktop"
              title={isSidebarCollapsed ? "Tampilkan Sidebar" : "Sembunyikan Sidebar"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {isSidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h8M4 12h8M4 18h8M16 6l6 6-6 6" />
                )}
              </svg>
            </button>

            <h2 className="text-base md:text-lg font-extrabold text-slate-800 tracking-tight transition-all">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "produk" && "Manajemen Produk Hardware"}
              {activeTab === "software" && "Manajemen Katalog Software"}
            </h2>
          </div>

          <div className="text-xs font-semibold text-slate-555 flex items-center space-x-2">
            <span className="hidden sm:inline text-slate-400 font-medium">Masuk sebagai:</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold border border-blue-100 shadow-2xs">
              {adminUser?.full_name || adminUser?.email}
            </span>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Body content */}
          <div className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto">
          
          {/* Notification Toast */}
          {notification && (
            <div 
              className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-xl text-white font-bold flex items-center space-x-3 border animate-bounce ${
                notification.type === "success" 
                  ? "bg-emerald-500 border-emerald-400" 
                  : "bg-rose-500 border-rose-400"
              }`}
            >
              <span className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </span>
              <span className="text-sm">{notification.message}</span>
            </div>
          )}

          {/* ==========================================
              KARTU RINGKASAN STATISTIK (UNTUK SEMUA TAB)
          ========================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-300 group">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Total Hardware</span>
                <span className="text-3xl font-black text-slate-800 tracking-tight">{totalHardware}</span>
                <span className="text-slate-400 text-[10px] block mt-1.5 font-medium">{totalStock} unit stok tersedia</span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-300 group">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Total Software</span>
                <span className="text-3xl font-black text-slate-800 tracking-tight">{totalSoftware}</span>
                <span className="text-slate-400 text-[10px] block mt-1.5 font-medium">Aplikasi demo aktif</span>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-300 group">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Stok Menipis</span>
                <span className={`text-3xl font-black tracking-tight ${lowStockCount > 0 ? "text-amber-500" : "text-slate-800"}`}>{lowStockCount}</span>
                <span className="text-slate-400 text-[10px] block mt-1.5 font-medium">Batas stok &le; 3 unit</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300 ${
                lowStockCount > 0 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
              }`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-300 group">
              <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Gabungan Katalog</span>
                <span className="text-3xl font-black text-slate-800 tracking-tight">{totalHardware + totalSoftware}</span>
                <span className="text-slate-400 text-[10px] block mt-1.5 font-medium">Total seluruh layanan</span>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ==========================================
              TAB 0: DASHBOARD OVERVIEW (NEW)
          ========================================== */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box Kiri: Peringatan Stok Rendah & Tingkat Stok */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xs flex flex-col h-full">
                <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-100 pb-4">
                  <span className="text-amber-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Pemantauan Stok Produk</h3>
                </div>

                {loadingData ? (
                  <div className="text-center py-12 flex-grow flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : lowStockCount > 0 ? (
                  <div className="space-y-4 overflow-y-auto max-h-[350px] pr-1 flex-grow">
                    <div className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-2xl mb-2 flex items-center">
                      ⚠️ Terdapat <span className="underline mx-1 font-bold">{lowStockCount} produk</span> dengan stok sangat tipis (sisa 3 unit atau kurang). Segera lakukan pemesanan ulang!
                    </div>
                    {lowStockProducts.map((prod) => (
                      <div key={prod.id} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-800 truncate">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-1">Kategori: {prod.category}</div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            prod.stock === 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {prod.stock === 0 ? "Habis" : `${prod.stock} Unit`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl mb-3 shadow-2xs">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <p className="text-xs font-extrabold text-slate-700">Seluruh Stok Produk Aman</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[240px]">Semua hardware terdaftar memiliki sisa stok 4 unit ke atas.</p>
                  </div>
                )}
                
                <button
                  onClick={() => setActiveTab("produk")}
                  className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-650 hover:text-blue-700 text-xs font-bold rounded-2xl border border-slate-200 hover:border-blue-105 transition-all text-center"
                >
                  Kelola Stok Selengkapnya &rarr;
                </button>
              </div>

              {/* Box Kanan: Ringkasan Katalog Software */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xs flex flex-col h-full">
                <div className="flex items-center space-x-2.5 mb-6 border-b border-slate-100 pb-4">
                  <span className="text-purple-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Katalog Software Aktif</h3>
                </div>

                {loadingData ? (
                  <div className="text-center py-12 flex-grow flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : softwareList.length > 0 ? (
                  <div className="space-y-4 overflow-y-auto max-h-[350px] pr-1 flex-grow">
                    {softwareList.slice(0, 5).map((soft) => (
                      <div key={soft.id} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-800 truncate">{soft.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-1">Lisensi: {formatPrice(soft.price)}</div>
                        </div>
                        <div className="text-right">
                          <a 
                            href={soft.demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-purple-50 hover:bg-purple-100 text-purple-650 hover:text-purple-750 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-purple-100 transition-all inline-flex items-center"
                          >
                            Demo Link
                          </a>
                        </div>
                      </div>
                    ))}
                    {softwareList.length > 5 && (
                      <div className="text-center text-[10px] text-slate-400 font-bold py-1">
                        + {softwareList.length - 5} software lainnya terdaftar.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-2xl border border-slate-100">
                    <span className="text-2xl block mb-2">💻</span>
                    <p className="text-xs font-bold text-slate-700">Katalog Software Kosong</p>
                    <button 
                      onClick={() => {
                        setActiveTab("software");
                        openAddSoftwareModal();
                      }}
                      className="mt-2 text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Tambahkan Software Pertama Anda &rarr;
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setActiveTab("software")}
                  className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-purple-50 text-slate-650 hover:text-purple-700 text-xs font-bold rounded-2xl border border-slate-200 hover:border-purple-105 transition-all text-center"
                >
                  Kelola Software Selengkapnya &rarr;
                </button>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 1: KELOLA PRODUK HARDWARE
          ========================================== */}
          {activeTab === "produk" && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-xs">
              
              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="flex-grow flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentProductPage(1);
                      }}
                      placeholder="Cari nama atau deskripsi produk..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 font-medium transition-all"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>

                  {/* Category Filter */}
                  <div className="sm:w-48">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentProductPage(1);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-semibold transition-all cursor-pointer"
                    >
                      <option value="Semua Kategori">Semua Kategori</option>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center sm:justify-end gap-3">
                  <button
                    onClick={openAddProductModal}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-2xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center space-x-1.5"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Produk</span>
                  </button>
                </div>
              </div>

              {loadingData ? (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 text-sm font-medium">Memuat data produk...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                          <th className="p-4 w-20 text-center">Foto</th>
                          <th className="p-4">Nama Produk</th>
                          <th className="p-4">Kategori</th>
                          <th className="p-4">Harga</th>
                          <th className="p-4 text-center">Stok</th>
                          <th className="p-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-750">
                        {currentProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 flex justify-center">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/85 shadow-2xs text-lg">
                                {prod.image_url ? (
                                  <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-800 text-sm">{prod.name}</div>
                              {prod.description && (
                                <div className="text-xs text-slate-400 mt-1 max-w-sm truncate" title={prod.description}>
                                  {prod.description}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold">
                                {prod.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-900 font-bold">{formatPrice(prod.price)}</td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                                prod.stock === 0
                                  ? "bg-rose-50 text-rose-600 border-rose-100"
                                  : prod.stock <= 3
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}>
                                {prod.stock === 0 ? "Habis" : `${prod.stock} Unit`}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginasi Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold">
                      Menampilkan <span className="text-slate-800">{indexOfFirstProduct + 1}</span> - <span className="text-slate-800">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> dari <span className="text-slate-800">{filteredProducts.length}</span> item
                    </span>
                    
                    {totalProductPages > 1 && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setCurrentProductPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentProductPage === 1}
                          className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs font-bold hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          Sebelumnya
                        </button>
                        
                        {Array.from({ length: totalProductPages }, (_, idx) => idx + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentProductPage(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                              currentProductPage === pageNum
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-slate-50 border border-slate-200 text-slate-655 hover:bg-slate-105"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentProductPage(prev => Math.min(prev + 1, totalProductPages))}
                          disabled={currentProductPage === totalProductPages}
                          className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs font-bold hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          Berikutnya
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="text-slate-500 font-semibold">Tidak menemukan produk yang cocok</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter pencarian atau kategori Anda</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("Semua Kategori");
                    }}
                    className="mt-4 bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-all"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 2: KELOLA SOFTWARE
          ========================================== */}
          {activeTab === "software" && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-xs">
              
              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="flex-grow flex flex-col sm:flex-row gap-3">
                  {/* Search Input */}
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={softSearchTerm}
                      onChange={(e) => {
                        setSoftSearchTerm(e.target.value);
                        setCurrentSoftwarePage(1);
                      }}
                      placeholder="Cari nama atau deskripsi software..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 placeholder-slate-400 font-medium transition-all"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>

                  {/* Category Filter */}
                  <div className="sm:w-48">
                    <select
                      value={softSelectedCategory}
                      onChange={(e) => {
                        setSoftSelectedCategory(e.target.value);
                        setCurrentSoftwarePage(1);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 font-semibold transition-all cursor-pointer"
                    >
                      <option value="Semua Kategori">Semua Kategori</option>
                      {SOFTWARE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center sm:justify-end gap-3">
                  <button
                    onClick={openAddSoftwareModal}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-2xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center space-x-1.5"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Tambah Software</span>
                  </button>
                </div>
              </div>

              {loadingData ? (
                <div className="text-center py-16">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400 text-sm font-medium">Memuat data software...</p>
                </div>
              ) : filteredSoftware.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                          <th className="p-4 w-20 text-center">Foto</th>
                          <th className="p-4">Nama Software</th>
                          <th className="p-4">Kategori</th>
                          <th className="p-4">Harga Lisensi</th>
                          <th className="p-4">Link Demo</th>
                          <th className="p-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-750">
                        {currentSoftwareList.map((soft) => (
                          <tr key={soft.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 flex justify-center">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/80 shadow-2xs text-lg">
                                {soft.image_url ? (
                                  <img src={soft.image_url} alt={soft.name} className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-800 text-sm">{soft.name}</div>
                              {soft.description && (
                                <div className="text-xs text-slate-400 mt-1 max-w-sm truncate" title={soft.description}>
                                  {soft.description}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="bg-purple-50 text-purple-650 text-xs px-3 py-1 rounded-full font-bold border border-purple-100">
                                {soft.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-900 font-bold">{formatPrice(soft.price)}</td>
                            <td className="p-4 max-w-xs truncate text-blue-650 hover:underline font-semibold">
                              <a href={soft.demo_url} target="_blank" rel="noopener noreferrer">
                                {soft.demo_url}
                              </a>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => openEditSoftwareModal(soft)}
                                  className="bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteSoftware(soft.id, soft.name)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginasi Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-semibold">
                      Menampilkan <span className="text-slate-800">{indexOfFirstSoftware + 1}</span> - <span className="text-slate-800">{Math.min(indexOfLastSoftware, filteredSoftware.length)}</span> dari <span className="text-slate-800">{filteredSoftware.length}</span> software
                    </span>
                    
                    {totalSoftwarePages > 1 && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setCurrentSoftwarePage(prev => Math.max(prev - 1, 1))}
                          disabled={currentSoftwarePage === 1}
                          className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs font-bold hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          Sebelumnya
                        </button>
                        
                        {Array.from({ length: totalSoftwarePages }, (_, idx) => idx + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentSoftwarePage(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                              currentSoftwarePage === pageNum
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentSoftwarePage(prev => Math.min(prev + 1, totalSoftwarePages))}
                          disabled={currentSoftwarePage === totalSoftwarePages}
                          className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-xl text-xs font-bold hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          Berikutnya
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="text-slate-500 font-semibold">Tidak menemukan software yang cocok</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter pencarian atau kategori Anda</p>
                  <button
                    onClick={() => {
                      setSoftSearchTerm("");
                      setSoftSelectedCategory("Semua Kategori");
                    }}
                    className="mt-4 bg-slate-200/80 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl transition-all"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
          {/* Copyright Footer */}
          <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500 font-semibold w-full font-sans">
            &copy; {new Date().getFullYear()} RV Comcell. Seluruh Hak Cipta Dilindungi.
          </footer>
        </div>
      </main>

      {/* ==========================================
          MODAL FORM: PRODUK HARDWARE
      ========================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-8 border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center uppercase tracking-wider">
              <span className="text-blue-650">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
              <span>{editingProduct ? "Edit Produk Hardware" : "Tambah Produk Hardware"}</span>
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Asus Vivobook X415"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all cursor-pointer"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-850 text-sm transition-all"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-855 text-sm transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* Preview Foto */}
              {(prodImage || uploading) && (
                <div className="mt-3 flex items-center space-x-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  {uploading ? (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center animate-pulse border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold animate-bounce">Uploading...</span>
                    </div>
                  ) : (
                    <img src={prodImage} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                  )}
                  <div className="text-xs text-slate-500 truncate max-w-[300px]">
                    <span className="font-bold text-slate-700 block">Preview Foto:</span>
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
                  placeholder="Detail spesifikasi perangkat, garansi, dll."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm transition-all"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
                >
                  {saving ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL FORM: PRODUK SOFTWARE
      ========================================== */}
      {isSoftwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-8 border border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800 mb-5 pb-3 border-b border-slate-100 flex items-center uppercase tracking-wider">
              <span className="text-blue-650">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
              <span>{editingSoftware ? "Edit Produk Software" : "Tambah Produk Software"}</span>
            </h3>

            <form onSubmit={handleSaveSoftware} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Software</label>
                <input
                  type="text"
                  required
                  value={softName}
                  onChange={(e) => setSoftName(e.target.value)}
                  placeholder="Contoh: Aplikasi POS Kasir"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={softCategory}
                    onChange={(e) => setSoftCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm font-semibold transition-all cursor-pointer"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm transition-all"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm transition-all"
                />
              </div>

              {/* Preview Foto */}
              {(softImage || uploading) && (
                <div className="mt-3 flex items-center space-x-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  {uploading ? (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center animate-pulse border border-slate-200">
                      <span className="text-[9px] text-slate-400 font-bold animate-bounce">Uploading...</span>
                    </div>
                  ) : (
                    <img src={softImage} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                  )}
                  <div className="text-xs text-slate-500 truncate max-w-[300px]">
                    <span className="font-bold text-slate-700 block">Preview Foto:</span>
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
                  placeholder="Detail fitur aplikasi, keunggulan, integrasi, dll."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm transition-all"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSoftwareModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
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
