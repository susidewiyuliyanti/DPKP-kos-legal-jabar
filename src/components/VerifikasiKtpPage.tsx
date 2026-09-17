import React, { useState } from 'react';
import { KosData } from '../types';
import { simulateDukcapilCheck } from '../utils/helpers';
import {
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Building,
  Eye,
  AlertCircle
} from 'lucide-react';

interface VerifikasiKtpPageProps {
  kosList: KosData[];
  onVerifyKos: (kosId: string) => void;
  onRejectKos: (kosId: string, reason: string) => void;
  onOpenCertificateModal: (kos: KosData) => void;
}

export const VerifikasiKtpPage: React.FC<VerifikasiKtpPageProps> = ({
  kosList,
  onVerifyKos,
  onRejectKos,
  onOpenCertificateModal
}) => {
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Menunggu Verifikasi' | 'Terverifikasi'>('Menunggu Verifikasi');
  const [activeKtpModal, setActiveKtpModal] = useState<KosData | null>(null);

  const pendingList = kosList.filter((k) => k.status === 'Menunggu Verifikasi');

  const displayedList = kosList.filter((k) => {
    if (filterStatus === 'Semua') return true;
    return k.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <BadgeCheck className="w-4 h-4 text-[#0B3D91]" />
              <span>Gate Integrasi Disdukcapil Provinsi Jawa Barat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verifikasi Identitas NIK & Kelaikan Usaha Kos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pemeriksaan kesesuaian Nomor Induk Kependudukan (NIK 16 digit), keaslian foto KTP pemilik, serta kelengkapan berkas fisik pemondokan.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              {pendingList.length} Menunggu Persetujuan
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterStatus('Menunggu Verifikasi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            filterStatus === 'Menunggu Verifikasi'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Antrean Baru ({pendingList.length})
        </button>
        <button
          onClick={() => setFilterStatus('Terverifikasi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            filterStatus === 'Terverifikasi'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sudah Disetujui ({kosList.filter((k) => k.status === 'Terverifikasi').length})
        </button>
        <button
          onClick={() => setFilterStatus('Semua')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            filterStatus === 'Semua'
              ? 'bg-[#0B3D91] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Riwayat ({kosList.length})
        </button>
      </div>

      {/* Verification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedList.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
            Tidak ada permohonan verifikasi pada kategori ini.
          </div>
        ) : (
          displayedList.map((kos) => {
            const dukcapil = simulateDukcapilCheck(kos.nik, kos.pemilik);
            const isVerified = kos.status === 'Terverifikasi';

            return (
              <div
                key={kos.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      ID: {kos.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {kos.nama}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Pemilik: <span className="font-semibold text-slate-800">{kos.pemilik}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {kos.status}
                  </span>
                </div>

                {/* Dukcapil Inspection Card */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-700 font-bold">
                      NIK: {kos.nik || '3273011405780003'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0B3D91]">
                      API Dukcapil
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Wilayah Asal:</span>
                      <span className="font-semibold text-slate-800">{dukcapil.kabupaten}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tanggal Lahir / JK:</span>
                      <span className="font-semibold text-slate-800">
                        {dukcapil.tanggalLahir} ({dukcapil.jenisKelamin})
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-emerald-700 font-medium flex items-center pt-1 border-t border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                    {dukcapil.pesan}
                  </p>
                </div>

                {/* Property & Document Preview */}
                <div className="flex items-center space-x-3 text-xs">
                  <img
                    src={kos.foto_bangunan_base64}
                    alt={kos.nama}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 line-clamp-1">{kos.lokasi}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Kapasitas: <span className="font-bold text-slate-800">{kos.jumlah_kamar} Kamar</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      WhatsApp: <span className="font-mono text-slate-700">{kos.wa}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Didaftarkan: {kos.tanggal_daftar}
                  </span>

                  <div className="flex items-center space-x-2">
                    {!isVerified ? (
                      <>
                        <button
                          onClick={() => onRejectKos(kos.id, 'Data foto bangunan kurang jelas')}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                        >
                          Tolak Berkas
                        </button>
                        <button
                          id={`btn-approve-${kos.id}`}
                          onClick={() => onVerifyKos(kos.id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Setujui Verifikasi</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onOpenCertificateModal(kos)}
                        className="px-3 py-1.5 text-xs font-bold text-[#0B3D91] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Lihat SK Resmi</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
