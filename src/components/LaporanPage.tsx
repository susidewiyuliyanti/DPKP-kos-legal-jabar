import React, { useState } from 'react';
import { KosData, LaporanIlegal } from '../types';
import { exportKosToCSV, formatRupiah, formatDateIndo } from '../utils/helpers';
import { KABUPATEN_KOTA_JABAR } from '../data/initialKos';
import {
  FileBarChart2,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  Download,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface LaporanPageProps {
  kosList: KosData[];
  laporanList: LaporanIlegal[];
}

export const LaporanPage: React.FC<LaporanPageProps> = ({
  kosList,
  laporanList
}) => {
  const [selectedKab, setSelectedKab] = useState('Semua');

  const filteredKos = kosList.filter((k) => {
    return selectedKab === 'Semua' || k.kabupaten === selectedKab;
  });

  const verified = filteredKos.filter((k) => k.status === 'Terverifikasi').length;
  const pending = filteredKos.filter((k) => k.status === 'Menunggu Verifikasi').length;
  const taxPaid = filteredKos.filter((k) => k.pajak_status === 'Lunas').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <FileBarChart2 className="w-4 h-4 text-[#0B3D91]" />
              <span>Pusat Pelaporan & Rekapitulasi Data Eksekutif</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Laporan Akuntabilitas Penyelenggaraan Pemondokan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Statistik agregat legalitas, kepatuhan retribusi Bapenda Jabar, dan ringkasan penanganan aduan masyarakat terkait kos ilegal.
            </p>
          </div>

          <button
            onClick={() => exportKosToCSV(filteredKos)}
            className="inline-flex items-center px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-200" />
            Unduh Berkas Excel (CSV)
          </button>
        </div>
      </div>

      {/* Filter Wilayah */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Wilayah Rekapitulasi:</span>
          <select
            value={selectedKab}
            onChange={(e) => setSelectedKab(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50"
          >
            <option value="Semua">Seluruh Jawa Barat (27 Kab/Kota)</option>
            {KABUPATEN_KOTA_JABAR.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Total Objek: <span className="font-bold text-slate-900">{filteredKos.length} Kos</span>
        </span>
      </div>

      {/* Overview stats for selected region */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Status Terverifikasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {verified} Kos
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {filteredKos.length > 0 ? Math.round((verified / filteredKos.length) * 100) : 0}% Tingkat Legalitas
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {pending} Berkas
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Dalam proses pemeriksaan petugas
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Realisasi Retribusi</span>
            <Receipt className="w-4 h-4 text-[#0B3D91]" />
          </div>
          <div className="text-2xl font-black text-[#0B3D91] mt-2">
            {formatRupiah(taxPaid * 850000)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {taxPaid} wajib retribusi telah lunas
          </p>
        </div>
      </div>

      {/* Aduan Warga Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Rekapitulasi Aduan Warga Terkait Kos Ilegal
            </h3>
            <p className="text-[11px] text-slate-500">
              Laporan masyarakat yang masuk melalui portal publik Cek Kos Legal
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            {laporanList.length} Laporan Masuk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">No. Laporan</th>
                <th className="py-3 px-4">Nama Kos Terduga</th>
                <th className="py-3 px-4">Lokasi & Wilayah</th>
                <th className="py-3 px-4">Keluhan Pelapor</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Status Penanganan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {laporanList.map((lap) => (
                <tr key={lap.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {lap.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-rose-900">
                    {lap.nama_kos_terduga}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{lap.alamat_lengkap}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{lap.kabupaten}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs text-slate-600">
                    <p className="line-clamp-2">{lap.deskripsi}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {formatDateIndo(lap.tanggal_lapor)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {lap.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
