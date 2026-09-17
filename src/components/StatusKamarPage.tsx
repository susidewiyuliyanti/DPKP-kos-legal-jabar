import React, { useState } from 'react';
import { KosData } from '../types';
import { formatRupiah } from '../utils/helpers';
import {
  BedDouble,
  Search,
  CheckCircle2,
  Users,
  Building,
  Plus,
  Minus
} from 'lucide-react';

interface StatusKamarPageProps {
  kosList: KosData[];
  onUpdateKos: (updated: KosData) => void;
}

export const StatusKamarPage: React.FC<StatusKamarPageProps> = ({
  kosList,
  onUpdateKos
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalKamar = kosList.reduce((acc, k) => acc + k.jumlah_kamar, 0);
  const totalTerisi = kosList.reduce((acc, k) => acc + k.kamar_terisi, 0);
  const totalKosong = totalKamar - totalTerisi;
  const overallOccupancy = totalKamar > 0 ? Math.round((totalTerisi / totalKamar) * 100) : 0;

  const handleAdjustRoom = (kos: KosData, delta: number) => {
    const newOccupied = Math.max(0, Math.min(kos.jumlah_kamar, kos.kamar_terisi + delta));
    onUpdateKos({
      ...kos,
      kamar_terisi: newOccupied
    });
  };

  const filtered = kosList.filter((k) => {
    return (
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.kabupaten.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <BedDouble className="w-4 h-4 text-[#0B3D91]" />
              <span>Manajemen Okupansi & Kapasitas Pemondokan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Status Ketersediaan Kamar Kos Jawa Barat
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pemantauan daya tampung pemondokan mahasiswa dan pekerja, tingkat hunian (occupancy rate), dan ketersediaan unit kamar kosong di Jawa Barat.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
            <div>
              <span className="text-[10px] text-blue-700 block font-bold uppercase">
                Rata-rata Okupansi
              </span>
              <span className="text-lg font-black text-[#0B3D91]">
                {overallOccupancy}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Kapasitas Kamar
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{totalKamar}</span>
            <span className="text-xs text-slate-500 font-semibold">Kamar Terdaftar</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Kamar Terisi (Dihuni)
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-emerald-600">{totalTerisi}</span>
            <span className="text-xs text-slate-500 font-semibold">Penghuni Aktif</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Kamar Tersedia (Kosong)
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-blue-600">{totalKosong}</span>
            <span className="text-xs text-slate-500 font-semibold">Siap Huni</span>
          </div>
        </div>
      </div>

      {/* Cards of rooms per kos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-slate-900">
            Daftar Okupansi Per Rumah Kos
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 w-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((kos) => {
            const vacant = kos.jumlah_kamar - kos.kamar_terisi;
            const pct = Math.round((kos.kamar_terisi / kos.jumlah_kamar) * 100);

            return (
              <div
                key={kos.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      {kos.nama}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {kos.kabupaten} • Pemilik: {kos.pemilik}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 font-mono">
                    {pct}% Terisi
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0B3D91] h-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1 font-medium">
                    <span>{kos.kamar_terisi} Terisi</span>
                    <span className="text-emerald-700 font-bold">{vacant} Kosong</span>
                  </div>
                </div>

                {/* Room Adjuster */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500 text-[11px]">Kelola Kamar Terisi:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAdjustRoom(kos, -1)}
                      disabled={kos.kamar_terisi <= 0}
                      className="w-6 h-6 rounded-md bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs">
                      {kos.kamar_terisi}
                    </span>
                    <button
                      onClick={() => handleAdjustRoom(kos, 1)}
                      disabled={kos.kamar_terisi >= kos.jumlah_kamar}
                      className="w-6 h-6 rounded-md bg-white border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
