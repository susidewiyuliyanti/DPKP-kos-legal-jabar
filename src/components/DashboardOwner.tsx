import React, { useState } from 'react';
import { KosData } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/helpers';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Receipt,
  BedDouble,
  FileText,
  Clock,
  ExternalLink,
  PlusCircle,
  Building,
  User,
  Plus,
  Minus
} from 'lucide-react';

interface DashboardOwnerProps {
  kosList: KosData[];
  onOpenPaymentModal: (kos: KosData) => void;
  onOpenCertificateModal: (kos: KosData) => void;
  onUpdateKos: (updated: KosData) => void;
  onNavigateRegister: () => void;
}

export const DashboardOwner: React.FC<DashboardOwnerProps> = ({
  kosList,
  onOpenPaymentModal,
  onOpenCertificateModal,
  onUpdateKos,
  onNavigateRegister
}) => {
  // Let user pick which kos to focus on if they own multiple, defaulting to the first one
  const [selectedKosId, setSelectedKosId] = useState<string>(kosList[0]?.id || '');
  const activeKos = kosList.find((k) => k.id === selectedKosId) || kosList[0];

  const handleRoomOccupancyChange = (delta: number) => {
    if (!activeKos) return;
    const newOccupied = Math.max(0, Math.min(activeKos.jumlah_kamar, activeKos.kamar_terisi + delta));
    const updated: KosData = {
      ...activeKos,
      kamar_terisi: newOccupied
    };
    onUpdateKos(updated);
  };

  if (!activeKos) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto bg-blue-50 text-[#0B3D91] rounded-2xl flex items-center justify-center">
          <Building className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Belum Ada Properti Kos Terdaftar</h3>
        <p className="text-xs text-slate-600">
          Anda belum mendaftarkan properti rumah pemondokan. Daftarkan sekarang untuk mendapatkan legalitas resmi dan izin operasional Pemprov Jabar.
        </p>
        <button
          onClick={onNavigateRegister}
          className="px-5 py-2.5 bg-[#0B3D91] hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          Daftarkan Kos Sekarang
        </button>
      </div>
    );
  }

  const isVerified = activeKos.status === 'Terverifikasi';
  const isTaxPaid = activeKos.pajak_status === 'Lunas';
  const availableRooms = activeKos.jumlah_kamar - activeKos.kamar_terisi;
  const occupancyPercent = Math.round((activeKos.kamar_terisi / activeKos.jumlah_kamar) * 100);

  return (
    <div className="space-y-6">
      {/* Property Switcher Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 text-[#0B3D91] rounded-xl flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                Portal Pemilik Usaha Kos
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {activeKos.id}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {activeKos.nama}
            </h2>
            <p className="text-xs text-slate-500">
              Pemilik: <span className="font-semibold text-slate-700">{activeKos.pemilik}</span> ({activeKos.kabupaten})
            </p>
          </div>
        </div>

        {/* Kos Selection Dropdown if multiple */}
        {kosList.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Pilih Kos:</span>
            <select
              value={selectedKosId}
              onChange={(e) => setSelectedKosId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B3D91] focus:outline-hidden"
            >
              {kosList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama} ({k.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Official Status Banner (STATUS BADGE HIJAU RESMI IF VERIFIED) */}
      <div
        className={`rounded-2xl p-6 sm:p-7 shadow-sm border transition-all ${
          isVerified
            ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white border-emerald-700'
            : 'bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-900 text-white border-amber-700'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm bg-white/10 backdrop-blur-xs border border-white/20">
              {isVerified ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200">STATUS BADGE HIJAU RESMI PEMPROV JABAR</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-200">STATUS: MENUNGGU VERIFIKASI BERKAS</span>
                </>
              )}
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isVerified ? 'USAHA KOS TERVERIFIKASI & AMAN' : 'MENUNGGU TINJAUAN PETUGAS'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-100 max-w-xl opacity-90 mt-1">
                {isVerified
                  ? 'Properti pemondokan ini telah memenuhi standar Perda Jabar No. 13/2011, data KTP tervalidasi Dukcapil, dan terdata resmi di sistem pengawasan ketertiban Jawa Barat.'
                  : 'Dokumen pendaftaran sedang diproses oleh verifikator teknis Dinas Perumahan dan Permukiman Provinsi Jawa Barat.'}
              </p>
            </div>

            {/* Official Check Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Badge 1: Verifikasi KTP Selesai Disetujui */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 flex items-center space-x-2.5">
                <div className="p-1.5 bg-emerald-500/30 rounded-lg text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Identitas</p>
                  <p className="text-xs font-semibold">
                    {isVerified ? 'Verifikasi KTP Selesai Disetujui' : 'KTP Dalam Pemeriksaan'}
                  </p>
                </div>
              </div>

              {/* Badge 2: Izin Usaha Kos Valid s/d 31 Des 2025 */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 flex items-center space-x-2.5">
                <div className="p-1.5 bg-emerald-500/30 rounded-lg text-emerald-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Izin Usaha</p>
                  <p className="text-xs font-semibold">
                    {isVerified ? `Valid s/d ${formatDateIndo(activeKos.izin_valid_until)}` : 'Menunggu Penerbitan SK'}
                  </p>
                </div>
              </div>

              {/* Badge 3: Pajak Lunas */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 flex items-center space-x-2.5">
                <div className={`p-1.5 rounded-lg ${isTaxPaid ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'}`}>
                  {isTaxPaid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Pajak Daerah</p>
                  <p className="text-xs font-semibold">
                    {isTaxPaid ? 'Pajak Retribusi Lunas' : 'Belum Bayar (BJB VA)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Side Buttons */}
          <div className="shrink-0 flex flex-col gap-2.5 sm:w-56">
            {/* Button Bayar Pajak Simulasi BJB VA */}
            <button
              id="btn-bayar-pajak-bjb"
              onClick={() => onOpenPaymentModal(activeKos)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md ${
                isTaxPaid
                  ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>{isTaxPaid ? 'Lihat Bukti Pajak BJB' : 'Bayar Pajak BJB (Rp 850k)'}</span>
            </button>

            {/* View Certificate & QR */}
            {isVerified && (
              <button
                id="btn-lihat-sertifikat-resmi"
                onClick={() => onOpenCertificateModal(activeKos)}
                className="w-full py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all border border-white/30 flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>QR & Sertifikat Legal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: My Kos List & Kamar Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kamar Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
              <BedDouble className="w-4 h-4 text-[#0B3D91]" />
              <span>Status Okupansi Kamar</span>
            </div>
            <span className="text-xs font-bold text-[#0B3D91] bg-blue-50 px-2 py-0.5 rounded">
              {occupancyPercent}% Terisi
            </span>
          </div>

          {/* Occupancy Progress Bar */}
          <div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-[#0B3D91] h-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>{activeKos.kamar_terisi} Kamar Terisi</span>
              <span>{availableRooms} Kamar Tersedia</span>
            </div>
          </div>

          {/* Interactive Room Adjuster for Owner */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Pembaruan Cepat Ketersediaan Kamar:
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Kamar Terisi Saat Ini:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRoomOccupancyChange(-1)}
                  disabled={activeKos.kamar_terisi <= 0}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  title="Kurangi kamar terisi"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                  {activeKos.kamar_terisi}
                </span>
                <button
                  onClick={() => handleRoomOccupancyChange(1)}
                  disabled={activeKos.kamar_terisi >= activeKos.jumlah_kamar}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition-colors"
                  title="Tambah kamar terisi"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              * Perubahan otomatis diselaraskan dengan basis data pencarian calon penyewa Pemprov Jabar.
            </p>
          </div>

          {/* Estimated Monthly Revenue */}
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
            <span className="text-slate-500">Estimasi Omzet Bulanan:</span>
            <span className="font-bold text-slate-900">
              {formatRupiah((activeKos.harga_per_bulan || 1000000) * activeKos.kamar_terisi)}
            </span>
          </div>
        </div>

        {/* Detail Properti & Dokumen */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Building className="w-4 h-4 text-[#0B3D91]" />
              <span>Informasi Teknis Bangunan & Legalitas</span>
            </div>
            <button
              onClick={() => onOpenCertificateModal(activeKos)}
              className="text-xs font-semibold text-[#0B3D91] hover:underline flex items-center"
            >
              Lihat Format Cetak Sertifikat
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foto Bangunan */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Foto Fasad Bangunan
              </span>
              <img
                src={activeKos.foto_bangunan_base64 || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'}
                alt={activeKos.nama}
                className="w-full h-44 object-cover rounded-xl border border-slate-200 shadow-2xs"
              />
            </div>

            {/* Data summary */}
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Nomor Surat Izin (NIP):</span>
                <span className="font-mono font-bold text-[#0B3D91]">{activeKos.no_izin}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Alamat & Titik Koordinat:</span>
                <span className="font-medium text-slate-800">{activeKos.lokasi}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fasilitas Utama:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(activeKos.fasilitas || ['Kamar Mandi Dalam', 'WiFi', 'CCTV']).map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">Rekening VA BJB:</span>
                  <span className="font-mono font-bold text-slate-800">{activeKos.va_bjb || '-'}</span>
                </div>
                <button
                  onClick={() => onOpenPaymentModal(activeKos)}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-[#0B3D91] hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Rincian VA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
