import React, { useState } from 'react';
import { KosData } from '../types';
import { KABUPATEN_KOTA_JABAR } from '../data/initialKos';
import { exportKosToCSV, formatRupiah } from '../utils/helpers';
import {
  Building,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface DataBangunanKosProps {
  kosList: KosData[];
  onVerifyKos: (kosId: string) => void;
  onOpenCertificateModal: (kos: KosData) => void;
}

export const DataBangunanKos: React.FC<DataBangunanKosProps> = ({
  kosList,
  onVerifyKos,
  onOpenCertificateModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKab, setSelectedKab] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const filtered = kosList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.no_izin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchKab = selectedKab === 'Semua' || item.kabupaten === selectedKab;
    const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;

    return matchSearch && matchKab && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <Building className="w-4 h-4 text-[#0B3D91]" />
              <span>Daftar Induk Inventarisasi Bangunan Kos Jawa Barat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Data Seluruh Bangunan Kos Terdaftar
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Data induk resmi seluruh properti rumah pemondokan yang teregistrasi pada sistem perizinan terpadu Pemprov Jawa Barat.
            </p>
          </div>

          <button
            onClick={() => exportKosToCSV(filtered)}
            className="inline-flex items-center px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-200" />
            Ekspor Data Terpilih (CSV)
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama kos, pemilik, jalan, izin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91]"
            />
          </div>

          {/* Filter Wilayah */}
          <select
            value={selectedKab}
            onChange={(e) => setSelectedKab(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="Semua">Semua Kab/Kota</option>
            {KABUPATEN_KOTA_JABAR.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="Semua">Semua Status Legal</option>
            <option value="Terverifikasi">Terverifikasi Hijau</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi Kuning</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total: <span className="font-bold text-slate-900">{filtered.length}</span> Bangunan
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-4">Nama Kos & No Izin</th>
                <th className="py-3.5 px-4">Pemilik & NIK</th>
                <th className="py-3.5 px-4">Lokasi & Kota</th>
                <th className="py-3.5 px-4">Status Legalitas</th>
                <th className="py-3.5 px-4">Kapasitas Kamar</th>
                <th className="py-3.5 px-4">Pajak Retribusi</th>
                <th className="py-3.5 px-4 text-center">Aksi Verifikasi & SK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 text-xs">
                    Tidak ditemukan data kos yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isVerified = item.status === 'Terverifikasi';
                  const isTaxPaid = item.pajak_status === 'Lunas';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Nama Kos */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{item.nama}</div>
                        <div className="text-[10px] font-mono text-[#0B3D91] font-semibold mt-0.5">
                          {item.no_izin}
                        </div>
                      </td>

                      {/* Pemilik */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{item.pemilik}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          NIK: {item.nik || '-'}
                        </div>
                      </td>

                      {/* Lokasi */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-slate-700 line-clamp-1">{item.lokasi}</div>
                        <div className="text-[10px] font-semibold text-slate-500">
                          {item.kabupaten}
                        </div>
                      </td>

                      {/* Status (Terverifikasi Hijau / Menunggu Verifikasi Kuning) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-[#16A34A] mr-1.5" />
                            Terverifikasi Hijau
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                            Menunggu Verifikasi
                          </span>
                        )}
                      </td>

                      {/* Kamar (6/8 terisi) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800">
                          {item.kamar_terisi}/{item.jumlah_kamar} terisi
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {item.jumlah_kamar - item.kamar_terisi} kamar kosong
                        </div>
                      </td>

                      {/* Pajak Retribusi */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            isTaxPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isTaxPaid ? 'Pajak Lunas' : 'Belum Bayar'}
                        </span>
                      </td>

                      {/* Aksi Verifikasi button */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1.5">
                          {!isVerified ? (
                            <button
                              onClick={() => onVerifyKos(item.id)}
                              className="px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-all shadow-xs flex items-center space-x-1"
                              title="Klik untuk memverifikasi dan memunculkan di Peta Sebaran"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verifikasi</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenCertificateModal(item)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0B3D91] font-semibold text-[11px] rounded-lg transition-colors border border-blue-200 flex items-center space-x-1"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Sertifikat</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
