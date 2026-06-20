"use client";

import React, { useState } from "react";

interface Course {
  id: string;
  name: string;
  category: string;
  teaser: string;
  description: string;
  duration: string;
  target: string;
  price: number;
  syllabus: string[];
  gradient: string;
  borderColor: string;
  shadowColor: string;
  iconBgColor: string;
  iconTextColor: string;
}

const COURSES: Course[] = [
  {
    id: "office",
    name: "Microsoft Office Spesialis",
    category: "Aplikasi & Administrasi",
    teaser: "Kuasai Microsoft Word, Excel, dan PowerPoint tingkat lanjut untuk kebutuhan kerja profesional.",
    description: "Program pelatihan intensif untuk menguasai alat perkantoran standar dunia. Belajar pengolahan dokumen kompleks, rumus kalkulasi data rumit di Excel (VLOOKUP, PivotTable, Macro dasar), hingga teknik merancang presentasi bisnis yang persuasif dan interaktif.",
    duration: "1 Bulan (12 Pertemuan @2 Jam)",
    target: "Pelajar, Mahasiswa, Staff Administrasi, & Umum",
    price: 450000,
    syllabus: [
      "Microsoft Word: Formatting, Mail Merge, Pembuatan Laporan/Tesis Terstruktur",
      "Microsoft Excel: Formulasi Logika, PivotTable, Charting, & Analisis Data Praktis",
      "Microsoft PowerPoint: Desain Slide Modern, Animasi Transisi, & Presentasi Interaktif"
    ],
    gradient: "from-blue-600 to-cyan-500",
    borderColor: "border-blue-105",
    shadowColor: "shadow-blue-500/5",
    iconBgColor: "bg-blue-50",
    iconTextColor: "text-blue-600"
  },
  {
    id: "design",
    name: "Desain Grafis (Photoshop, Corel & Canva)",
    category: "Desain & Kreatif",
    teaser: "Belajar teori desain, manipulasi gambar, pembuatan logo, dan materi kreatif siap cetak & digital.",
    description: "Kuasai software desain grafis populer untuk membuat materi promosi, identitas brand, dan konten media sosial. Kursus ini mengajarkan dasar estetika visual, komposisi warna, tata letak tipografi, pembuatan ilustrasi vektor, manipulasi foto, hingga desain praktis menggunakan Canva.",
    duration: "1.5 Bulan (16 Pertemuan @2 Jam)",
    target: "Content Creator, Wirausaha, Mahasiswa, & Umum",
    price: 600000,
    syllabus: [
      "CorelDraw: Desain Vektor, Pembuatan Logo, Brosur, & Layout Siap Cetak",
      "Adobe Photoshop: Retouching Foto, Manipulasi Gambar, & Pembuatan Banner Digital",
      "Canva Pro: Desain Instan Konten Sosial Media, Presentasi, & Branding Kit"
    ],
    gradient: "from-pink-600 to-rose-500",
    borderColor: "border-pink-105",
    shadowColor: "shadow-pink-500/5",
    iconBgColor: "bg-pink-50",
    iconTextColor: "text-pink-600"
  },
  {
    id: "teknisi",
    name: "Teknisi Komputer & Laptop",
    category: "Infrastruktur & Hardware",
    teaser: "Pahami perakitan hardware, troubleshooting hardware/software, dan instalasi sistem operasi.",
    description: "Kursus praktek langsung untuk menjadi teknisi komputer handal. Anda akan belajar arsitektur komponen PC/Laptop, cara merakit komputer secara aman, mendiagnosis kerusakan sistem (hardware & software), instalasi sistem operasi Windows & Linux, serta teknik pemeliharaan (maintenance) rutin.",
    duration: "1 Bulan (12 Pertemuan @2 Jam)",
    target: "Calon Teknisi, Pelaku Bisnis IT, & Umum",
    price: 750000,
    syllabus: [
      "Pengenalan & Perakitan Komponen PC/Laptop Secara Praktis",
      "Mendiagnosis Kerusakan (Troubleshooting) Hardware & Penanganannya",
      "Instalasi OS (Windows/Linux), Driver, Software Utility, & Optimasi Sistem"
    ],
    gradient: "from-amber-600 to-yellow-500",
    borderColor: "border-amber-105",
    shadowColor: "shadow-amber-500/5",
    iconBgColor: "bg-amber-50",
    iconTextColor: "text-amber-600"
  },
  {
    id: "linux",
    name: "Linux System Administrator",
    category: "Infrastruktur & Hardware",
    teaser: "Pelajari dasar perintah CLI Linux, manajemen user, permission, hingga administrasi server Linux.",
    description: "Langkah awal menguasai sistem operasi server yang paling banyak digunakan di dunia. Belajar navigasi terminal command-line (CLI), manajemen berkas, konfigurasi hak akses (permission), instalasi paket software, manajemen proses, hingga konfigurasi server dasar (Web Server, SSH, & FTP) menggunakan Ubuntu Server/CentOS.",
    duration: "1 Bulan (12 Pertemuan @2 Jam)",
    target: "Mahasiswa IT, Programmer, & Sysadmin Pemula",
    price: 800000,
    syllabus: [
      "Dasar Operasi Terminal Linux (CLI) & Manajemen File/Folder",
      "Manajemen User, Group, File Permission, & Sekuritas Dasar OS",
      "Instalasi Web Server (Apache/Nginx) & Konfigurasi Server Lokal"
    ],
    gradient: "from-orange-600 to-red-500",
    borderColor: "border-orange-105",
    shadowColor: "shadow-orange-500/5",
    iconBgColor: "bg-orange-50",
    iconTextColor: "text-orange-600"
  },
  {
    id: "mikrotik",
    name: "MikroTik Certified Network",
    category: "Infrastruktur & Hardware",
    teaser: "Kuasai routing, manajemen bandwidth, firewall router, hotspot billing, dan keamanan jaringan.",
    description: "Pelatihan administrasi jaringan berbasis router MikroTik RouterOS. Anda akan dibimbing untuk memahami teknik pembagian internet (Queue Tree/Simple Queue), perancangan LAN/WLAN, konfigurasi sistem login hotspot, pemblokiran situs via firewall, serta penanganan masalah jaringan (*network troubleshooting*).",
    duration: "1 Bulan (12 Pertemuan @2 Jam)",
    target: "Teknisi Jaringan, Sysadmin, & Mahasiswa IT",
    price: 900000,
    syllabus: [
      "Pengenalan Jaringan Komputer, IP Addressing, & Subnetting",
      "Konfigurasi Routing, DHCP Server, Hotspot Gateway, & Firewall Filter",
      "Manajemen Bandwidth (Quality of Service - QoS) & VPN MikroTik"
    ],
    gradient: "from-emerald-600 to-teal-500",
    borderColor: "border-emerald-105",
    shadowColor: "shadow-emerald-500/5",
    iconBgColor: "bg-emerald-50",
    iconTextColor: "text-emerald-600"
  },
  {
    id: "web",
    name: "Fullstack Web Programmer",
    category: "Pemrograman & AI",
    teaser: "Bangun website dinamis dengan menguasai HTML, CSS, JavaScript, database MySQL, dan React.",
    description: "Kursus pemrograman web terlengkap untuk mencetak pengembang aplikasi handal. Diajarkan dari dasar pembuatan kerangka HTML5, styling responsif CSS3, interaktivitas JavaScript, pembuatan database MySQL, hingga pengembangan backend API serta integrasi menggunakan framework modern.",
    duration: "2 Bulan (24 Pertemuan @2 Jam)",
    target: "Calon Web Developer, Mahasiswa IT, & Umum",
    price: 1500000,
    syllabus: [
      "Frontend: HTML5, CSS3, Flexbox/Grid, JavaScript Modern (ES6)",
      "Database & Backend: Perancangan SQL Database, PHP/Node.js REST API",
      "Frontend Framework: Dasar React & React Hooks untuk Aplikasi Dinamis"
    ],
    gradient: "from-indigo-600 to-blue-500",
    borderColor: "border-indigo-105",
    shadowColor: "shadow-indigo-500/5",
    iconBgColor: "bg-indigo-50",
    iconTextColor: "text-indigo-650"
  },
  {
    id: "ai",
    name: "AI Specialist",
    category: "Pemrograman & AI",
    teaser: "Pahami Prompt Engineering, integrasi API OpenAI/Gemini, dan otomasi AI dalam bisnis.",
    description: "Kursus mutakhir untuk memahami pemanfaatan teknologi kecerdasan buatan (AI) di era modern. Pelajari cara merumuskan perintah yang efektif (Prompt Engineering), mengintegrasikan API bahasa besar (LLM) seperti OpenAI GPT & Google Gemini ke dalam kode aplikasi, serta membangun sistem otomasi kerja cerdas.",
    duration: "2 Bulan (20 Pertemuan @2 Jam)",
    target: "Developer, Profesional IT, Pebisnis, & Mahasiswa",
    price: 1800000,
    syllabus: [
      "Dasar Kecerdasan Buatan & Praktik Efektif Prompt Engineering",
      "Pemrograman Otomasi Script Menggunakan Python & AI SDK",
      "Integrasi API OpenAI/Gemini untuk Aplikasi Chatbot & Analisis Data"
    ],
    gradient: "from-purple-600 to-indigo-500",
    borderColor: "border-purple-105",
    shadowColor: "shadow-purple-500/5",
    iconBgColor: "bg-purple-50",
    iconTextColor: "text-purple-600"
  }
];

export default function KursusPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = ["Semua", "Aplikasi & Administrasi", "Desain & Kreatif", "Infrastruktur & Hardware", "Pemrograman & AI"];

  const filteredCourses = activeCategory === "Semua" 
    ? COURSES 
    : COURSES.filter(course => course.category === activeCategory);

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getWhatsAppLink = (courseName: string, price: number) => {
    const formattedPrice = formatPrice(price);
    const message = `Halo RV Comcell, saya tertarik untuk mendaftar kelas kursus *${courseName}* seharga *${formattedPrice}*. Apakah saya bisa berkonsultasi mengenai jadwal kelas dan ketersediaan slot?`;
    return `https://wa.me/6285789592881?text=${encodeURIComponent(message)}`;
  };

  // Rendering Custom SVG Icons
  const renderCourseIcon = (courseId: string) => {
    switch (courseId) {
      case "office":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "design":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case "teknisi":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "linux":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "mikrotik":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );
      case "web":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case "ai":
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  return (
    <div className="flex-grow bg-slate-50 text-slate-800 min-h-screen relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto w-full px-6 py-12 md:py-16 relative z-10">
        
        {/* Header Halaman */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase inline-block mb-4 shadow-sm shadow-blue-500/5">
            Kursus Komputer & IT
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800 leading-tight">
            Akselerasi Skill IT Anda <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bersama RV Comcell
            </span>
          </h1>
          <p className="text-slate-500 mt-4 text-sm md:text-base leading-relaxed font-medium">
            Program pelatihan IT praktis dan intensif yang didesain agar mudah dipahami, dibimbing langsung oleh pengajar praktisi profesional hingga siap kerja.
          </p>
        </div>

        {/* Filter Kategori Menu */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-350 border cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/10"
                  : "bg-white text-slate-650 hover:bg-slate-100/80 hover:text-slate-800 border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Kursus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              {/* Left Color strip indicator */}
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${course.gradient}`} />
              
              <div>
                {/* Icon Container */}
                <div className={`w-14 h-14 ${course.iconBgColor} ${course.iconTextColor} rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
                  {renderCourseIcon(course.id)}
                </div>

                <span className="text-[10px] bg-slate-50 text-slate-500 font-bold border border-slate-150 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {course.category}
                </span>

                <h3 className="text-base md:text-lg font-bold text-slate-800 mt-4 group-hover:text-blue-600 transition-colors">
                  {course.name}
                </h3>
                
                <p className="text-slate-550 text-xs mt-3 leading-relaxed font-medium">
                  {course.teaser}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">Investasi: <span className="text-blue-600 block text-base font-black mt-0.5">{formatPrice(course.price)}</span></span>
                <span className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 px-3.5 py-2 rounded-xl font-bold border border-blue-100 group-hover:border-blue-200 transition-colors flex items-center shadow-3xs">
                  <span>Lihat Detail</span>
                  <svg className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ==========================================
            MODAL DETAIL KURSUS (LIGHT THEME)
        ========================================== */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl p-6 md:p-8 shadow-2xl relative border border-slate-100 my-8">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-5 right-5 w-9 h-9 bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-550 hover:text-slate-800 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-3xs"
                aria-label="Close Modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-slate-100">
                <div className={`w-14 h-14 ${selectedCourse.iconBgColor} ${selectedCourse.iconTextColor} rounded-2xl flex items-center justify-center shadow-2xs`}>
                  {renderCourseIcon(selectedCourse.id)}
                </div>
                <div>
                  <span className="text-[9px] bg-slate-50 text-slate-500 font-bold border border-slate-150 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedCourse.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-1.5">{selectedCourse.name}</h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 text-sm text-slate-600 font-medium">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Tentang Kelas</h4>
                  <p className="leading-relaxed text-slate-650">{selectedCourse.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Durasi Pelatihan</span>
                    <span className="text-slate-800 font-bold text-xs">{selectedCourse.duration}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Target Peserta</span>
                    <span className="text-slate-800 font-bold text-xs">{selectedCourse.target}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Silabus Materi Pembelajaran</h4>
                  <ul className="space-y-2.5">
                    {selectedCourse.syllabus.map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className={`w-5 h-5 bg-gradient-to-r ${selectedCourse.gradient} text-white rounded-full flex items-center justify-center text-[10px] font-black mt-0.5 flex-shrink-0 shadow-2xs`}>
                          {index + 1}
                        </span>
                        <span className="text-slate-650 text-xs leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Modal Area */}
                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Investasi Pelatihan</span>
                    <span className="text-2xl font-black text-blue-600">{formatPrice(selectedCourse.price)}</span>
                  </div>

                  <a
                    href={getWhatsAppLink(selectedCourse.name, selectedCourse.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#22c35e] text-white font-extrabold py-3.5 px-8 rounded-2xl text-center text-sm shadow-md shadow-[#25D366]/10 hover:shadow-[#25D366]/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                    <span>Daftar via WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
