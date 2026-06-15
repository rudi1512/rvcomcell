"use client";
import React, { useState } from 'react';

/**
 * Komponen Halaman Utama RV Comcell.
 * Menampilkan Landing Page yang mencakup Navbar responsif, Hero Section,
 * Daftar Layanan, Footer dengan Peta, dan Tombol Chat WhatsApp.
 */
export default function Home() {
  // State untuk mengontrol tampilan menu navigasi pada perangkat mobile (burger menu)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Konfigurasi WhatsApp:
   * Gunakan kode negara (62) dan hilangkan angka nol di depan nomor.
   * Contoh: 0857... menjadi 62857...
   */
  const whatsappNumber = "6285789592881"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Navbar / Menu Atas */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-tight">
          <span className="text-blue-600">RV</span>Comcell
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">Beranda</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Katalog</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Servis</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Kontak</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Login
          </button>
          
          {/* Tombol Burger Mobile */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
        </div>

        {/* Menu Mobile Dropdown */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col bg-white border-t border-slate-100 mt-4 py-4 space-y-4 font-semibold text-slate-600`}>
          <a href="#" className="px-2 hover:text-blue-600">Beranda</a>
          <a href="#" className="px-2 hover:text-blue-600">Katalog</a>
          <a href="#" className="px-2 hover:text-blue-600">Servis</a>
          <a href="#" className="px-2 hover:text-blue-600">Kontak</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section / Banner Utama */}
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-20 text-white shadow-2xl flex flex-col items-start relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1]">
              Solusi Teknologi <br/><span className="text-blue-200">Terlengkap & Terpercaya</span>
            </h1>
            <p className="text-base md:text-xl text-blue-50 mb-10 leading-relaxed opacity-90">
              Pusat penjualan Komputer, Laptop, Printer, CCTV, dan Smartphone. Kami juga melayani Jasa Service profesional serta Pembuatan Website & Aplikasi Android.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all transform hover:-translate-y-1 shadow-xl text-center">
                Lihat Produk
              </button>
              <button className="bg-blue-800/30 backdrop-blur-sm text-white border border-blue-300/30 px-10 py-4 rounded-2xl font-bold hover:bg-blue-800/50 transition-all text-center">
                Konsultasi IT
              </button>
            </div>
          </div>
          {/* Elemen Dekorasi Background */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </section>

        {/* Bagian Layanan Unggulan */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Layanan Unggulan Kami</h2>
            <p className="text-slate-500 mt-3">Solusi menyeluruh untuk perangkat digital Anda</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Kartu Layanan 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">
                🛒
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Produk & Gadget</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Jual Laptop, PC, Printer, HP, CCTV, Voucher, serta Aksesori & Part Komputer terlengkap.
              </p>
            </div>

            {/* Kartu Layanan 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">
                🛠️
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Servis & Instalasi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Jasa service Laptop, HP, Printer, rakit PC custom, serta instalasi sistem keamanan CCTV profesional.
              </p>
            </div>

            {/* Kartu Layanan 3 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Software House</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Jasa pembuatan Website Profil, Sistem Informasi berbasis Web, dan pengembangan Aplikasi Android.
              </p>
            </div>

            {/* Kartu Layanan 4 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform">
                🎓
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">Kursus Komputer</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pelatihan IT untuk umum: Office, Desain Grafis, Teknisi Komputer, hingga dasar Pemrograman.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer: Identitas Toko, Sosial Media, dan Google Maps */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Kolom 1: Identitas & Sosmed */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-2xl font-extrabold tracking-tight mb-4">
                <span className="text-blue-600">RV</span>Comcell
              </div>
              <div className="text-slate-600 space-y-2 mb-8 leading-relaxed">
                <p className="font-bold text-slate-800">Alamat Kami:</p>
                <p>
                  Desa Sri Rejosari, Kecamatan Way Jepara<br />
                  Kabupaten Lampung Timur, Lampung
                  <br />
                  0857-8959-2881
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="font-bold text-slate-800 text-sm uppercase tracking-wider">Ikuti Kami</p>
                <div className="flex space-x-4">
                  {/* YouTube */}
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm" title="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm" title="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm" title="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  {/* TikTok */}
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm" title="TikTok">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.9-.39-2.81-.12-1.12.3-2.13.92-2.78 1.88-.61.84-.81 1.96-.54 2.96.23.95.82 1.8 1.62 2.32 1.01.68 2.26.83 3.39.47 1.25-.38 2.26-1.33 2.75-2.51.15-.41.22-.84.22-1.27.02-3.66.01-7.31.01-10.97z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: Maps - Menggunakan iframe dari Google Maps */}
          <div className="h-72 md:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.617983631817!2d105.684863!3d-5.1866407000000025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e408df7e3fd503b%3A0xea8e6019b00a6aa2!2sRV%20Computer%20And%20Cellular!5e1!3m2!1sid!2sid!4v1781534110910!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-100 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} RV Comcell. Seluruh Hak Cipta Dilindungi.
        </div>
      </footer>

      {/* 
          Floating WhatsApp Button - Pojok Kanan Bawah 
          Z-index 50 memastikan tombol berada di lapisan paling atas.
          Animate-ping digunakan untuk indikator 'online' agar terlihat hidup.
      */}
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110 z-50 flex items-center space-x-2 group"
        title="Chat via WhatsApp"
      >
        <div className="relative">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2.04c-5.46 0-9.9 4.44-9.9 9.9 0 1.77.46 3.45 1.26 4.93l-1.3 4.75 4.85-1.27c1.45.79 3.08 1.21 4.9 1.21 5.46 0 9.9-4.44 9.9-9.9s-4.44-9.9-9.9-9.9zm0 18.14c-1.58 0-3.1-.42-4.43-1.21l-3.05.8 1.01-3.7c-.82-1.45-1.26-3.1-1.26-4.89 0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.7 8.24-8.24 8.24zm4.52-6.86c-.25-.12-.92-.46-1.06-.51-.15-.05-.26-.07-.37.07-.11.15-.43.51-.53.61-.1.11-.2.12-.37.05-.15-.07-.64-.24-1.22-.75-.45-.39-.76-.65-.9-1.07-.14-.4-.01-.37.1-.51.09-.11.25-.26.37-.39.12-.12.15-.2.22-.34.07-.15.04-.26-.02-.37-.07-.11-.37-.9-.51-1.22-.14-.3-.29-.26-.37-.26-.07 0-.15-.02-.23-.02-.11 0-.29.04-.44.2-.15.15-.57.56-.57 1.37 0 .81.58 1.59.66 1.7.08.11 1.14 1.74 2.76 2.44 1.62.7 1.62.48 1.92.45.28-.03.92-.37 1.05-.73.13-.36.13-.34.09-.62z"/>
          </svg>
          {/* Indikator Online (Dot Berkedip) */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        </div>
        <span className="font-bold text-sm">Chat</span>
      </a>
    </div>
  );
}