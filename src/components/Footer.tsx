import React from 'react';
import { JabarLogo } from './JabarLogo';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B3D91] text-white border-t-4 border-amber-400 mt-12 print:hidden">
      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          {/* Col 1: Brand & Dinas */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <JabarLogo size={42} />
              <div>
                <h4 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug">
                  KOS LEGAL <span className="text-amber-400">JABAR</span>
                </h4>
                <p className="text-blue-200 text-[11px]">
                  Dinas Perumahan & Permukiman Provinsi Jawa Barat
                </p>
              </div>
            </div>
            <p className="text-blue-100/80 leading-relaxed text-[11px]">
              Sistem Informasi Registrasi, Verifikasi Kelaikan, dan Legalisasi Usaha Pemondokan (Rumah Kos) Terpadu Berbasis Digital untuk Perlindungan Konsumen dan Ketertiban Warga.
            </p>
          </div>

          {/* Col 2: Alamat Kantor & Jam Layanan */}
          <div className="space-y-2">
            <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
              Kantor Dinas Perumahan & Permukiman
            </h5>
            <p className="text-blue-100/90 leading-relaxed text-[11px] flex items-start">
              <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-amber-400 mt-0.5" />
              <span>Jl. Kawaluyaan Indah Raya No. 4, Jatisari, Kec. Buahbatu, Kota Bandung, Jawa Barat 40286</span>
            </p>
            <p className="text-blue-200 text-[11px]">
              Jam Operasional Pelayanan: Senin - Jumat (08.00 - 16.00 WIB)
            </p>
          </div>

          {/* Col 3: Kontak Resmi */}
          <div className="space-y-2">
            <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
              Kontak Layanan & Pengaduan
            </h5>
            <div className="space-y-1.5 text-blue-100/90 text-[11px]">
              <p className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-emerald-400 shrink-0" />
                <span className="font-semibold">Telepon / WhatsApp:</span>{' '}
                <a href="tel:087879625033" className="font-mono font-bold ml-1 text-white hover:underline">
                  0878-7962-5033
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2 text-sky-400 shrink-0" />
                <span>Pos-el: disperkim@jabarprov.go.id</span>
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-700/60 text-emerald-200 text-[10px] font-bold border border-emerald-500/40">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Kanal Siaga 24 Jam Satpol PP & DPKP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-blue-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200 gap-2">
          <p className="font-medium text-center sm:text-left">
            © 2026 Pemprov Jawa Barat - Dinas Perumahan & Permukiman - Kontak: 087879625033
          </p>
          <p className="text-[11px] text-blue-300 flex items-center">
            Mewujudkan Hunian Aman, Tertib & Juara Lahir Batin
          </p>
        </div>
      </div>
    </footer>
  );
};
