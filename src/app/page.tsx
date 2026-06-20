import React from "react";

export default function Home() {
  const whatsappNumber = "6285789592881"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20RV%20Comcell%2C%20saya%2520ingin%2520berkonsultasi%252520mengenai%25252520layanan%25252520IT%25252520Anda.`;

  return (
    <div className="flex-grow bg-slate-50 text-slate-800 relative overflow-hidden font-sans">
      
      {/* Background Tech Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10 flex flex-col space-y-20 md:space-y-28">
        
        {/* ==========================================
            HERO SECTION
        ========================================== */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-16 lg:p-20 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden border border-slate-800">
          
          {/* Left Text Side */}
          <div className="relative z-10 max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black px-4 py-2 rounded-full tracking-wider uppercase inline-block mb-6">
              Teknologi Terintegrasi & Terpercaya
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
              Solusi Teknologi <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Masa Depan Anda
              </span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed opacity-90 max-w-xl">
              Pusat penjualan Komputer, Laptop, Printer, CCTV, dan Smartphone terlengkap. Kami juga melayani Jasa Service profesional, perakitan PC, serta pembuatan Website & Aplikasi Android kustom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a 
                href="/produk" 
                className="bg-blue-600 hover:bg-blue-750 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all text-center inline-block transform hover:-translate-y-0.5"
              >
                Lihat Katalog
              </a>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 px-8 py-3.5 rounded-2xl font-bold hover:shadow-md hover:shadow-slate-500/5 transition-all text-center inline-block"
              >
                Konsultasi IT
              </a>
            </div>
          </div>

          {/* Right Visual Tech Side */}
          <div className="w-full lg:w-5/12 max-w-md lg:max-w-none flex justify-center relative select-none">
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 border border-indigo-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-10 border border-dashed border-purple-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
              
              {/* Central Glowing Shield */}
              <div className="w-40 h-40 bg-gradient-to-br from-blue-650 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-blue-400/40 relative z-10 animate-pulse">
                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>

              {/* Floating Orbiting Tech Badges */}
              <div className="absolute -top-4 left-1/4 w-12 h-12 bg-slate-900 border border-blue-500/40 text-blue-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="absolute top-1/4 -right-4 w-12 h-12 bg-slate-900 border border-purple-500/40 text-purple-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-10 w-12 h-12 bg-slate-900 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Background Glow Overlay */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        </section>

        {/* ==========================================
            SERVICES SECTION
        ========================================== */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black px-4 py-2 rounded-full tracking-wider uppercase inline-block mb-3">
              Layanan Unggulan
            </span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Solusi Menyeluruh Bisnis Anda</h2>
            <p className="text-slate-500 mt-3 text-sm md:text-base font-medium">
              Layanan profesional yang dirancang khusus untuk memenuhi kebutuhan perangkat digital dan peningkatan skill Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">Produk & Gadget</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  Penjualan Laptop, PC Desktop, Printer, Smartphone, CCTV, Voucher Game, serta Part Komputer terlengkap dengan garansi resmi.
                </p>
              </div>
              <a href="/produk" className="mt-8 text-xs font-bold text-blue-600 group-hover:underline inline-flex items-center">
                <span>Lihat Katalog Produk</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">Servis & Instalasi</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  Service Laptop, PC, HP, Printer, rakit komputer kustom, serta jasa pemasangan & instalasi jaringan CCTV profesional di lokasi Anda.
                </p>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-8 text-xs font-bold text-indigo-600 group-hover:underline inline-flex items-center">
                <span>Pesan Servis Sekarang</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-800 group-hover:text-purple-600 transition-colors">Software House</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  Jasa pembuatan Website Profil Sekolah/Perusahaan, Sistem Informasi Berbasis Web Kustom, dan pembuatan Aplikasi Android.
                </p>
              </div>
              <a href="/software" className="mt-8 text-xs font-bold text-purple-600 group-hover:underline inline-flex items-center">
                <span>Katalog Software</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Service Card 4 */}
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-3 text-slate-800 group-hover:text-emerald-600 transition-colors">Kursus Komputer</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  Pelatihan komputer intensif dari tingkat dasar perkantoran (Microsoft Office), Desain Grafis, Teknisi Jaringan, hingga Pemrograman & AI.
                </p>
              </div>
              <a href="/kursus" className="mt-8 text-xs font-bold text-emerald-600 group-hover:underline inline-flex items-center">
                <span>Daftar Kelas IT</span>
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ==========================================
            WHY CHOOSE US SECTION
        ========================================== */}
        <section className="bg-slate-100/50 rounded-[2.5rem] p-8 md:p-16 border border-slate-200/60 relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="bg-indigo-50 text-indigo-650 border border-indigo-100 text-[10px] font-black px-4 py-2 rounded-full tracking-wider uppercase inline-block mb-3">
              Keunggulan Kami
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Mengapa Memilih RV Comcell?</h2>
            <p className="text-slate-550 mt-3 text-xs md:text-sm font-medium leading-relaxed">
              Kami menggabungkan profesionalisme layanan teknis dengan kurikulum pendidikan IT modern untuk memberikan solusi nyata terbaik bagi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white border border-slate-150 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 shadow-3xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1.5">Pengerjaan Cepat & Handal</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Diagnosa instan untuk service hardware dan proses pengembangan software terkelola menggunakan teknologi terkini.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white border border-slate-150 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-3xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1.5">Garansi Resmi & Dukungan Penuh</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Semua transaksi produk hardware dilindungi garansi resmi. Aplikasi kami dilengkapi masa pemeliharaan gratis.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white border border-slate-150 rounded-xl flex items-center justify-center flex-shrink-0 text-purple-600 shadow-3xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1.5">Kurikulum & Instruktur Praktisi</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Materi kursus komputer dibuat relevan sesuai dengan kompetensi di dunia kerja asli, dibimbing oleh pengajar praktisi.</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-white border border-slate-150 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-3xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-1.5">Kustomisasi Sistem yang Skalabel</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Tim pengembang kami siap merancang modul sistem informasi atau portal web yang fleksibel sesuai kebutuhan Anda.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            CALL TO ACTION SECTION
        ========================================== */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-650 to-purple-650 rounded-[2.5rem] p-8 md:p-16 text-white text-center shadow-xl relative overflow-hidden flex flex-col items-center">
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
              Ingin Berdiskusi Solusi IT dengan Kami?
            </h2>
            <p className="text-blue-100 text-xs md:text-sm mb-8 leading-relaxed opacity-95">
              Konsultasikan jenis laptop yang ingin dibeli, kebutuhan perbaikan hardware, pembuatan aplikasi custom bisnis, atau tanyakan ketersediaan slot kelas kursus sekarang juga.
            </p>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all inline-flex items-center justify-center space-x-2.5 transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>

          {/* Background Decor inside CTA */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        </section>

      </main>

    </div>
  );
}