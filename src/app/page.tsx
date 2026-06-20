import React from "react";

/**
 * Komponen Halaman Utama RV Comcell.
 * Menampilkan Landing Page yang mencakup Hero Section,
 * Daftar Layanan, dan Tombol Chat WhatsApp.
 */
export default function Home() {
  const whatsappNumber = "6285789592881"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="flex-grow">
      {/* Main Content Area */}
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
              <a 
                href="/produk" 
                className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all transform hover:-translate-y-1 shadow-xl text-center inline-block"
              >
                Lihat Produk
              </a>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800/30 backdrop-blur-sm text-white border border-blue-300/30 px-10 py-4 rounded-2xl font-bold hover:bg-blue-800/50 transition-all text-center inline-block"
              >
                Konsultasi IT
              </a>
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

      {/* Floating WhatsApp Button - Pojok Kanan Bawah */}
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