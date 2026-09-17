import React from 'react';
import {
  Settings,
  BookOpen,
  Scale,
  ShieldCheck,
  RotateCcw,
  Building,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface PengaturanPageProps {
  onResetData: () => void;
}

export const PengaturanPage: React.FC<PengaturanPageProps> = ({ onResetData }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-[#0B3D91]" />
          <span>Sistem Tata Kelola & Landasan Peraturan</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan & Dasar Hukum Regulasi Kos Jabar
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Informasi ketentuan perizinan, standarisasi keselamatan bangunan pemondokan, dan konfigurasi data aplikasi KOS LEGAL JABAR.
        </p>
      </div>

      {/* Perda summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200 text-[#0B3D91]">
          <Scale className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-900">
            Peraturan Daerah Provinsi Jawa Barat Nomor 13 Tahun 2011
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            Perda ini mengatur tentang tata kelola pemondokan, hak dan kewajiban pemilik rumah kos serta penyewa, standarisasi ventilasi udara, rasio sanitasi kamar mandi, hingga kewajiban pelaporan penghuni berkala kepada aparat RT/RW setempat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-[#0B3D91] block">Pasal 7 - Kewajiban Izin</span>
              <p className="text-[11px] text-slate-600">
                Setiap orang atau badan yang menyelenggarakan usaha pemondokan dengan jumlah kamar lebih dari 5 (lima) wajib memiliki izin resmi dari Dinas Perumahan dan Permukiman.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-[#0B3D91] block">Pasal 12 - Retribusi Daerah</span>
              <p className="text-[11px] text-slate-600">
                Wajib retribusi dikenakan tarif pelayanan izin tahunan sebesar Rp 850.000 yang disetorkan ke Kas Daerah Provinsi Jawa Barat melalui Bank BJB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Standar Teknis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Syarat Teknis Penerbitan Badge Hijau Legalitas:</span>
        </div>

        <ul className="space-y-2 text-slate-600">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>NIK pemilik tervalidasi aktif pada server Disdukcapil Jawa Barat (Kode 32).</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Memiliki APAR (Alat Pemadam Api Ringan) untuk bangunan lebih dari 10 kamar.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Lunas retribusi daerah tahun anggaran berjalan via Virtual Account BJB.</span>
          </li>
        </ul>
      </div>

      {/* System LocalStorage Controls */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
        <h4 className="font-bold text-sm text-slate-900">
          Pemeliharaan Data Aplikasi (LocalStorage KOS_LEGAL_JABAR)
        </h4>
        <p className="text-xs text-slate-600">
          Data aplikasi disimpan secara persisten di peramban pengguna. Anda dapat mereset data ke kondisi awal (default 128+ kos Jawa Barat) untuk keperluan pengujian.
        </p>
        <button
          onClick={onResetData}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors inline-flex items-center space-x-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data ke Data Pabrik (Default Seed)</span>
        </button>
      </div>
    </div>
  );
};
