import React, { useState, useRef } from 'react';
import { KosData, LaporanIlegal } from '../types';
import { KABUPATEN_KOTA_JABAR } from '../data/initialKos';
import { formatDateIndo } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Building,
  Upload,
  Camera,
  MapPin,
  Send,
  Phone,
  FileWarning,
  X,
  QrCode
} from 'lucide-react';

interface CekWargaProps {
  kosList: KosData[];
  laporanList: LaporanIlegal[];
  onSubmitLaporan: (laporan: LaporanIlegal) => void;
  onOpenCertificateModal: (kos: KosData) => void;
}

export const CekWarga: React.FC<CekWargaProps> = ({
  kosList,
  laporanList,
  onSubmitLaporan,
  onOpenCertificateModal
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedKab, setSelectedKab] = useState('Semua');
  const [hasSearched, setHasSearched] = useState(false);

  // Modal Lapor Kos Ilegal State
  const [showModalLapor, setShowModalLapor] = useState(false);
  const [laporNamaKos, setLaporNamaKos] = useState('');
  const [laporAlamat, setLaporAlamat] = useState('');
  const [laporKab, setLaporKab] = useState('Kota Bandung');
  const [laporNamaPelapor, setLaporNamaPelapor] = useState('');
  const [laporKontak, setLaporKontak] = useState('');
  const [laporDeskripsi, setLaporDeskripsi] = useState('');
  const [laporFoto, setLaporFoto] = useState('');
  const [laporSuccess, setLaporSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  // Matching logic
  const searchResults = kosList.filter((k) => {
    if (!keyword.trim()) return false;
    const cleanKey = keyword.toLowerCase().trim();
    const matchName = k.nama.toLowerCase().includes(cleanKey);
    const matchLoc = k.lokasi.toLowerCase().includes(cleanKey);
    const matchPermit = k.no_izin.toLowerCase().includes(cleanKey);
    const matchOwner = k.pemilik.toLowerCase().includes(cleanKey);
    const matchKab = selectedKab === 'Semua' || k.kabupaten === selectedKab;

    return (matchName || matchLoc || matchPermit || matchOwner) && matchKab;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLaporFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!laporNamaKos.trim() || !laporAlamat.trim() || !laporDeskripsi.trim()) {
      alert('Mohon lengkapi nama kos, alamat, dan deskripsi pelanggaran.');
      return;
    }

    const newReport: LaporanIlegal = {
      id: `LAP-JBR-${Date.now().toString().slice(-6)}`,
      nama_kos_terduga: laporNamaKos.trim(),
      alamat_lengkap: laporAlamat.trim(),
      kabupaten: laporKab,
      nama_pelapor: laporNamaPelapor.trim() || 'Warga Masyarakat (Anonim)',
      kontak_pelapor: laporKontak.trim() || '-',
      deskripsi: laporDeskripsi.trim(),
      foto_base64: laporFoto,
      tanggal_lapor: new Date().toISOString().split('T')[0],
      status: 'Menunggu Investigasi'
    };

    onSubmitLaporan(newReport);
    setLaporSuccess(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setLaporSuccess(false);
      setShowModalLapor(false);
      setLaporNamaKos('');
      setLaporAlamat('');
      setLaporDeskripsi('');
      setLaporFoto('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Search Section for Citizens */}
      <div className="bg-gradient-to-br from-[#0B3D91] via-[#092B66] to-[#041E42] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Background ambient pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200">LAYANAN PUBLIK PERLINDUNGAN KONSUMEN PEMONDOKAN</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Cek Keabsahan & Legalitas Rumah Kos di Jawa Barat
          </h2>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Sebelum membayar uang muka (DP) atau sewa kos, pastikan kos pilihan Anda memiliki izin resmi dari Dinas Perumahan dan Permukiman Jawa Barat demi keamanan, kenyamanan, dan perlindungan hukum.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl shadow-xl">
              <div className="flex-1 flex items-center px-3">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Ketik nama kos, jalan, atau no. izin..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    if (e.target.value.length > 2) setHasSearched(true);
                  }}
                  className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-2"
                />
              </div>

              <select
                value={selectedKab}
                onChange={(e) => setSelectedKab(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl px-3 py-2.5 focus:outline-hidden border-0"
              >
                <option value="Semua">Semua Wilayah</option>
                {KABUPATEN_KOTA_JABAR.map((kab) => (
                  <option key={kab} value={kab}>
                    {kab}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-6 py-3 bg-[#0B3D91] hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm shrink-0"
              >
                Periksa Status
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-blue-200">
              <span className="font-semibold text-white">Contoh Cari:</span>
              <button
                type="button"
                onClick={() => {
                  setKeyword('Dago Asri');
                  setHasSearched(true);
                }}
                className="underline hover:text-white"
              >
                Dago Asri
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setKeyword('Cikutra');
                  setHasSearched(true);
                }}
                className="underline hover:text-white"
              >
                Cikutra
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setKeyword('Sukajadi');
                  setHasSearched(true);
                }}
                className="underline hover:text-white"
              >
                Sukajadi
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setKeyword('Margonda');
                  setHasSearched(true);
                }}
                className="underline hover:text-white"
              >
                Margonda
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Lapor Kos Ilegal Floating Action Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-rose-950 text-sm">
              Menemukan Kos Liar / Tidak Berizin di Lingkungan Anda?
            </h4>
            <p className="text-xs text-rose-800 mt-0.5">
              Bantu Pemprov Jabar menjaga ketertiban umum. Laporkan kos yang tidak berizin atau meresahkan warga dengan menyertakan bukti foto.
            </p>
          </div>
        </div>

        <button
          id="btn-buka-lapor-kos"
          onClick={() => setShowModalLapor(true)}
          className="shrink-0 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center space-x-2"
        >
          <Camera className="w-4 h-4" />
          <span>Lapor Kos Ilegal Sekarang</span>
        </button>
      </div>

      {/* Verification Result Display */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Hasil Penelusuran Basis Data Resmi ({searchResults.length} Ditemukan)
            </h3>
            <span className="text-xs text-slate-500">
              Kata Kunci: &ldquo;<span className="font-semibold">{keyword}</span>&rdquo;
            </span>
          </div>

          {searchResults.length > 0 ? (
            /* Registered Kos Found */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((kos) => {
                const isVerified = kos.status === 'Terverifikasi';
                return (
                  <div
                    key={kos.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                      isVerified ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-amber-300'
                    }`}
                  >
                    {/* Badge Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      {isVerified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          BADGE HIJAU: AMAN & TERDATA PEMPROV
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                          PROSES VERIFIKASI
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-slate-400">
                        {kos.no_izin}
                      </span>
                    </div>

                    {/* Kos Info */}
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={kos.foto_bangunan_base64}
                        alt={kos.nama}
                        className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {kos.nama}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 flex items-start">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0 mt-0.5" />
                          <span>{kos.lokasi}, {kos.kabupaten}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Pemilik Terdaftar: <span className="font-semibold text-slate-800">{kos.pemilik}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom row actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kamar Tersedia:</span>
                        <span className="font-bold text-emerald-700">
                          {kos.jumlah_kamar - kos.kamar_terisi} Kamar Kosong
                        </span>
                      </div>

                      {isVerified && (
                        <button
                          onClick={() => onOpenCertificateModal(kos)}
                          className="px-3.5 py-1.5 bg-[#0B3D91] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Lihat Sertifikat Sah</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* NO DATA FOUND -> RED BADGE ILEGAL WARNING */
            <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-rose-300 shadow-sm space-y-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-10 h-10" />
              </div>

              <div className="max-w-md mx-auto">
                <span className="inline-block px-4 py-1 rounded-full text-xs font-black bg-rose-600 text-white uppercase tracking-wider mb-2">
                  BADGE MERAH: ILEGAL / BELUM TERDAFTAR PEMPROV
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  Data Tidak Ditemukan dalam Register Resmi Jawa Barat
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Properti yang Anda cari dengan kata kunci &ldquo;<span className="font-semibold text-rose-700">{keyword}</span>&rdquo; belum memiliki izin operasional pemondokan dari Dinas Perumahan & Permukiman Jawa Barat atau beroperasi tanpa izin.
                </p>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl max-w-lg mx-auto text-xs text-rose-900 text-left space-y-1.5">
                <p className="font-bold flex items-center text-rose-950">
                  <FileWarning className="w-4 h-4 mr-1.5 text-rose-600" />
                  Himbauan Kewaspadaan Bagi Calon Penyewa:
                </p>
                <ul className="list-disc list-inside text-[11px] text-rose-800 space-y-0.5">
                  <li>Jangan transfer DP tanpa bukti fisik Nomor Induk Pemondokan / Sertifikat Legal Jabar.</li>
                  <li>Kos tanpa izin berpotensi melanggar ketertiban umum dan rentan disegel Satpol PP.</li>
                  <li>Anda dapat melaporkan kos ini agar ditindaklanjuti tim inspeksi daerah.</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setLaporNamaKos(keyword);
                  setShowModalLapor(true);
                }}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Laporkan Lokasi Ini ke Petugas DPKP</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Lapor Kos Ilegal with Foto Upload */}
      {showModalLapor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-base">Laporan Pengaduan Kos Ilegal</h3>
              </div>
              <button
                onClick={() => setShowModalLapor(false)}
                className="text-rose-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {laporSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">
                  Laporan Berhasil Disimpan & Diteruskan!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Terima kasih atas partisipasi Anda. Laporan telah masuk ke antrean investigasi Satuan Pengawas DPKP dan Satpol PP Provinsi Jawa Barat.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLaporan} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Kos yang Dilaporkan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={laporNamaKos}
                    onChange={(e) => setLaporNamaKos(e.target.value)}
                    placeholder="Contoh: Kos Liar Tanpa Izin Dago Barat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kabupaten / Kota <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={laporKab}
                    onChange={(e) => setLaporKab(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    {KABUPATEN_KOTA_JABAR.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Lengkap Bangunan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={laporAlamat}
                    onChange={(e) => setLaporAlamat(e.target.value)}
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deskripsi / Keluhan Warga <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={laporDeskripsi}
                    onChange={(e) => setLaporDeskripsi(e.target.value)}
                    placeholder="Jelaskan dugaan pelanggaran (contoh: tidak memiliki izin, saluran limbah liar, mengganggu ketertiban umum)..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                {/* Upload Foto Pelanggaran */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unggah Bukti Foto Lokasi / Bangunan
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {laporFoto ? (
                    <div className="relative">
                      <img
                        src={laporFoto}
                        alt="Bukti"
                        className="h-28 w-full object-cover rounded-xl border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setLaporFoto('')}
                        className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-lg hover:bg-black"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-rose-500 transition-colors bg-slate-50"
                    >
                      <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span className="text-slate-600 font-semibold block text-[11px]">
                        Klik untuk Lampirkan Foto
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-medium text-slate-600 text-[11px] mb-1">
                      Nama Pelapor (Opsional / Boleh Anonim)
                    </label>
                    <input
                      type="text"
                      value={laporNamaPelapor}
                      onChange={(e) => setLaporNamaPelapor(e.target.value)}
                      placeholder="Anonim"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 text-[11px] mb-1">
                      No. Kontak / WA
                    </label>
                    <input
                      type="tel"
                      value={laporKontak}
                      onChange={(e) => setLaporKontak(e.target.value)}
                      placeholder="08..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModalLapor(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl transition-all flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Pengaduan Resmi</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
