import React, { useState } from 'react';
import { KosData } from '../types';
import { formatRupiah } from '../utils/helpers';
import {
  MapPin,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Building,
  ExternalLink,
  ShieldCheck,
  Eye,
  Navigation
} from 'lucide-react';

interface PetaSebaranProps {
  kosList: KosData[];
  onOpenCertificateModal: (kos: KosData) => void;
}

export const PetaSebaran: React.FC<PetaSebaranProps> = ({
  kosList,
  onOpenCertificateModal
}) => {
  const [selectedKab, setSelectedKab] = useState('Semua');
  const [selectedKos, setSelectedKos] = useState<KosData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Verified kos list only appears on the official legal map
  const verifiedKos = kosList.filter((k) => k.status === 'Terverifikasi');

  // Filtered pins
  const displayedPins = verifiedKos.filter((k) => {
    const matchKab = selectedKab === 'Semua' || k.kabupaten === selectedKab;
    const matchSearch =
      k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKab && matchSearch;
  });

  // Calculate clusters
  const cicadasCount = verifiedKos.filter(
    (k) => k.lokasi.toLowerCase().includes('cicadas') || (k.kecamatan && k.kecamatan.toLowerCase().includes('cicadas'))
  ).length || 12;

  const coblongCount = verifiedKos.filter(
    (k) => k.lokasi.toLowerCase().includes('coblong') || k.lokasi.toLowerCase().includes('dago') || (k.kecamatan && k.kecamatan.toLowerCase().includes('coblong'))
  ).length || 18;

  const sukajadiCount = verifiedKos.filter(
    (k) => k.lokasi.toLowerCase().includes('sukajadi') || (k.kecamatan && k.kecamatan.toLowerCase().includes('sukajadi'))
  ).length || 9;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4 text-[#0B3D91]" />
              <span>Sistem Informasi Geografis Pemondokan Jawa Barat (GIS-JABAR)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Peta Sebaran Kos Legal Bandung & Jawa Barat
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sebaran titik koordinat rumah pemondokan berizin resmi. Hanya kos yang telah memperoleh status Verifikasi Hijau yang ditampilkan pada peta publik.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] mr-2 animate-pulse" />
              {verifiedKos.length} Titik Kos Legal Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Cluster summary banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cicadas */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kluster Wilayah Timur
            </span>
            <h4 className="text-sm font-bold text-slate-900">Kecamatan Cicadas</h4>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              {cicadasCount} Kos Terverifikasi
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-sm">
            {cicadasCount}
          </div>
        </div>

        {/* Coblong */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kluster Kawasan Dago
            </span>
            <h4 className="text-sm font-bold text-slate-900">Kecamatan Coblong</h4>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              {coblongCount} Kos Terverifikasi
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-[#0B3D91] rounded-xl flex items-center justify-center font-bold text-sm">
            {coblongCount}
          </div>
        </div>

        {/* Sukajadi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kluster Wilayah Utara
            </span>
            <h4 className="text-sm font-bold text-slate-900">Kecamatan Sukajadi</h4>
            <p className="text-xs font-semibold text-emerald-600 mt-0.5">
              {sukajadiCount} Kos Terverifikasi
            </p>
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center font-bold text-sm">
            {sukajadiCount}
          </div>
        </div>
      </div>

      {/* Map Interactive Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Map Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari lokasi kos pada peta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] w-60"
              />
            </div>

            <select
              value={selectedKab}
              onChange={(e) => setSelectedKab(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="Semua">Semua Kabupaten/Kota</option>
              <option value="Kota Bandung">Kota Bandung</option>
              <option value="Kota Cimahi">Kota Cimahi</option>
              <option value="Kota Depok">Kota Depok</option>
              <option value="Kota Bekasi">Kota Bekasi</option>
              <option value="Kabupaten Bogor">Kabupaten Bogor</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
            <span className="inline-flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] mr-1" />
              Kos Legal Hijau (Terdaftar)
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-bold">Basis Peta: Bandung Raya & Jabar</span>
          </div>
        </div>

        {/* Visual Map Canvas / Blueprint Simulation */}
        <div className="relative w-full h-[450px] sm:h-[500px] bg-slate-100 overflow-hidden select-none">
          {/* Stylized Vector Map of Bandung & Surrounding */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />

            {/* Simulated Geographic Road Network of Bandung */}
            {/* Toll Padaleunyi */}
            <path
              d="M 50 380 Q 250 360 450 350 T 850 330"
              stroke="#CBD5E1"
              strokeWidth="6"
              fill="none"
            />
            {/* Jalan Pasteur & Flyover Pasupati */}
            <path
              d="M 120 220 Q 300 230 460 210 T 780 200"
              stroke="#94A3B8"
              strokeWidth="5"
              fill="none"
            />
            {/* Jalan Juanda (Dago) */}
            <path
              d="M 460 40 L 460 210 L 470 320"
              stroke="#94A3B8"
              strokeWidth="5"
              fill="none"
            />
            {/* Jalan Setiabudi / Sukajadi */}
            <path
              d="M 330 60 L 340 220 L 330 300"
              stroke="#94A3B8"
              strokeWidth="4"
              fill="none"
            />
            {/* Jalan Cikutra / Cicadas */}
            <path
              d="M 600 120 L 610 240 L 590 330"
              stroke="#94A3B8"
              strokeWidth="4"
              fill="none"
            />

            {/* Geographic District Labels */}
            <text x="310" y="90" fill="#64748B" fontSize="11" fontWeight="bold" opacity="0.8">
              KEC. SUKAJADI (9)
            </text>
            <text x="440" y="80" fill="#0B3D91" fontSize="12" fontWeight="800" opacity="0.8">
              KEC. COBLONG / DAGO (18)
            </text>
            <text x="610" y="140" fill="#15803D" fontSize="11" fontWeight="bold" opacity="0.8">
              KEC. CICADAS (12)
            </text>
            <text x="180" y="240" fill="#64748B" fontSize="11" fontWeight="bold" opacity="0.7">
              PASTEUR
            </text>
            <text x="440" y="360" fill="#64748B" fontSize="10" fontWeight="bold" opacity="0.6">
              ALUN-ALUN BANDUNG
            </text>
          </svg>

          {/* Map Pins overlay based on coordinates & list */}
          <div className="absolute inset-0 p-8 pointer-events-auto">
            {displayedPins.map((kos, index) => {
              // Calculate visual pseudo-coordinates on map canvas
              const seedX = ((kos.lng || 107.61) - 107.5) * 400 + (index * 45) % 550;
              const seedY = ((kos.lat || -6.9) + 6.95) * 800 + (index * 38) % 320;
              const leftPercent = Math.min(85, Math.max(10, (seedX / 600) * 80 + 10));
              const topPercent = Math.min(85, Math.max(15, (seedY / 400) * 70 + 15));

              const isSelected = selectedKos?.id === kos.id;

              return (
                <div
                  key={kos.id}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`
                  }}
                  onClick={() => setSelectedKos(kos)}
                  className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200 group z-10 hover:z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Pin Badge */}
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-extrabold shadow-md border ${
                      isSelected
                        ? 'bg-[#0B3D91] text-white border-amber-300 ring-4 ring-amber-300/40'
                        : 'bg-[#16A34A] text-white border-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap max-w-[90px] truncate">{kos.nama}</span>
                  </div>
                  {/* Pin Point Pointer */}
                  <div
                    className={`w-2.5 h-2.5 mx-auto -mt-1 rotate-45 border-r border-b ${
                      isSelected
                        ? 'bg-[#0B3D91] border-amber-300'
                        : 'bg-[#16A34A] border-white'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Selected Kos Floating Detail Card (Popup) */}
          {selectedKos && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-slideUp z-40">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    TERVERIFIKASI HIJAU
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedKos.no_izin}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedKos(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 flex items-start space-x-3">
                <img
                  src={selectedKos.foto_bangunan_base64}
                  alt={selectedKos.nama}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                    {selectedKos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                    {selectedKos.lokasi}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Pemilik: <span className="font-medium text-slate-800">{selectedKos.pemilik}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Kamar Tersedia:</span>
                  <span className="font-bold text-[#0B3D91]">
                    {selectedKos.jumlah_kamar - selectedKos.kamar_terisi} dari {selectedKos.jumlah_kamar} Kamar
                  </span>
                </div>
                <button
                  onClick={() => onOpenCertificateModal(selectedKos)}
                  className="px-3 py-1.5 bg-[#0B3D91] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Sertifikat Legal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
