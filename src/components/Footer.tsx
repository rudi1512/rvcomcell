"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
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
                Hubungi Kami: 0857-8959-2881
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
        &copy; {currentYear} RV Comcell. Seluruh Hak Cipta Dilindungi.
      </div>
    </footer>
  );
}
