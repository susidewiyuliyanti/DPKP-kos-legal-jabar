import React, { useState, useRef } from 'react';
import { KosData } from '../types';
import { KABUPATEN_KOTA_JABAR } from '../data/initialKos';
import { simulateDukcapilCheck } from '../utils/helpers';
import confetti from 'canvas-confetti';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Building,
  Image as ImageIcon,
  UserCheck,
  CreditCard,
  Send,
  HelpCircle,
  MapPin,
  X
} from 'lucide-react';

interface FormPendaftaranProps {
  onSuccess: (newKos: KosData) => void;
}

export const FormPendaftaran: React.FC<FormPendaftaranProps> = ({ onSuccess }) => {
  const [nik, setNik] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [wa, setWa] = useState('');
  const [namaKos, setNamaKos] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kabupaten, setKabupaten] = useState('Kota Bandung');
  const [jumlahKamar, setJumlahKamar] = useState<number>(8);
  const [hargaSewa, setHargaSewa] = useState<number>(1000000);

  // File uploads with base64 preview
  const [fotoKtp, setFotoKtp] = useState<string>('');
  const [fotoBangunan, setFotoBangunan] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedKos, setSubmittedKos] = useState<KosData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const ktpInputRef = useRef<HTMLInputElement>(null);
  const bangunanInputRef = useRef<HTMLInputElement>(null);

  // Real-time Dukcapil Check
  const dukcapilResult = nik.length >= 4 ? simulateDukcapilCheck(nik, namaLengkap) : null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (nik.trim().replace(/\D/g, '').length !== 16) {
      setErrorMsg('NIK harus tepat 16 digit angka sesuai KTP Elektronik.');
      return;
    }
    if (!namaLengkap.trim()) {
      setErrorMsg('Nama lengkap pemilik wajib diisi.');
      return;
    }
    if (!wa.trim() || wa.trim().length < 9) {
      setErrorMsg('Nomor WhatsApp aktif wajib diisi dengan format yang benar.');
      return;
    }
    if (!namaKos.trim()) {
      setErrorMsg('Nama rumah kos wajib diisi.');
      return;
    }
    if (!alamat.trim()) {
      setErrorMsg('Alamat lengkap bangunan wajib diisi.');
      return;
    }
    if (jumlahKamar < 1) {
      setErrorMsg('Jumlah kamar minimal 1.');
      return;
    }

    setIsSubmitting(true);

    const newId = `KOS-JBR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const randomVa = `10878-3273-${Math.floor(10000 + Math.random() * 90000)}`;

    const newKos: KosData = {
      id: newId,
      nama: namaKos.trim(),
      pemilik: namaLengkap.trim(),
      nik: nik.trim().replace(/\D/g, ''),
      wa: wa.trim(),
      lokasi: alamat.trim(),
      kabupaten: kabupaten,
      jumlah_kamar: Number(jumlahKamar),
      kamar_terisi: Math.min(Math.floor(jumlahKamar * 0.6), jumlahKamar),
      status: 'Menunggu Verifikasi',
      foto_ktp_base64: fotoKtp,
      foto_bangunan_base64:
        fotoBangunan ||
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      pajak_status: 'Belum Bayar',
      izin_valid_until: '-',
      no_izin: 'PROSES-VERIFIKASI-DPKP',
      tanggal_daftar: new Date().toISOString().split('T')[0],
      harga_per_bulan: hargaSewa,
      fasilitas: ['Kamar Mandi Dalam', 'WiFi', 'Ventilasi Sesuai AMDAL'],
      lat: -6.9147 + (Math.random() - 0.5) * 0.08,
      lng: 107.6098 + (Math.random() - 0.5) * 0.08,
      va_bjb: randomVa
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedKos(newKos);
      onSuccess(newKos);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 1000);
  };

  const handleReset = () => {
    setSubmittedKos(null);
    setNik('');
    setNamaLengkap('');
    setWa('');
    setNamaKos('');
    setAlamat('');
    setJumlahKamar(8);
    setFotoKtp('');
    setFotoBangunan('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <Building className="w-4 h-4 text-[#0B3D91]" />
              <span>Pelayanan Terpadu Satu Pintu Pemondokan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Formulir Pendaftaran & Legalisasi Kos Baru
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Daftarkan usaha pemondokan Anda untuk memperoleh Sertifikat Legalitas Resmi Pemprov Jawa Barat, Nomor Induk Pemondokan, dan terintegrasi dalam basis data pemantauan ketertiban warga.
            </p>
          </div>
          <div className="shrink-0 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center sm:text-right">
            <span className="text-[11px] text-blue-700 block font-medium">Dasar Hukum:</span>
            <span className="text-xs font-bold text-[#0B3D91]">Perda Jabar No. 13/2011</span>
          </div>
        </div>
      </div>

      {submittedKos ? (
        /* Success Registration View */
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shadow-inner">
            <FileCheck2 className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-2">
              Status: Menunggu Verifikasi Berkas
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Pendaftaran Berhasil Dikirimkan!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Data usaha kos <span className="font-bold text-slate-900">{submittedKos.nama}</span> telah tersimpan di sistem <span className="font-mono text-[#0B3D91]">KOS_LEGAL_JABAR</span> dan masuk antrean verifikasi petugas Dinas Perumahan & Permukiman Jawa Barat.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs max-w-lg mx-auto space-y-2.5">
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">ID Registrasi:</span>
              <span className="font-mono font-bold text-[#0B3D91]">{submittedKos.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">Nama Pemilik:</span>
              <span className="font-semibold text-slate-900">{submittedKos.pemilik}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">NIK:</span>
              <span className="font-mono text-slate-800">{submittedKos.nik}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">Lokasi:</span>
              <span className="font-medium text-slate-800 text-right">{submittedKos.lokasi}, {submittedKos.kabupaten}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">Kapasitas:</span>
              <span className="font-semibold text-slate-900">{submittedKos.jumlah_kamar} Kamar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Virtual Account BJB Siap:</span>
              <span className="font-mono font-bold text-blue-700">{submittedKos.va_bjb}</span>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-lg mx-auto text-xs text-blue-900 text-left">
            <div className="font-bold flex items-center mb-1 text-[#0B3D91]">
              <AlertCircle className="w-4 h-4 mr-1.5" />
              Langkah Selanjutnya:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800">
              <li>Tim verifikator DPKP akan memeriksa validitas NIK Dukcapil & fisik bangunan.</li>
              <li>Setelah disetujui, Anda dapat melakukan pembayaran retribusi tahunan melalui Virtual Account BJB.</li>
              <li>Badge Hijau Resmi & QR Code Sertifikat Legalitas akan aktif secara otomatis.</li>
            </ol>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Daftarkan Kos Lain
            </button>
          </div>
        </div>
      ) : (
        /* The Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Data Pribadi Pemilik */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0B3D91]">
              <UserCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                1. Data Identitas Pemilik Usaha Kos
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* NIK Input */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 3273011405780003"
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                    required
                  />
                  <div className="absolute right-3 top-2.5 text-slate-400 font-mono text-[10px]">
                    {nik.length}/16
                  </div>
                </div>

                {/* Dukcapil Validation Indicator Box */}
                {dukcapilResult && (
                  <div
                    className={`mt-2 p-2.5 rounded-xl border text-[11px] flex items-start space-x-2 ${
                      dukcapilResult.valid
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    {dukcapilResult.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold">
                        {dukcapilResult.valid
                          ? 'Validasi Dukcapil: NIK Jawa Barat Terdeteksi'
                          : 'Pemeriksaan Format NIK'}
                      </span>
                      <p className="text-[10px] opacity-90 mt-0.5">
                        {dukcapilResult.pesan}
                      </p>
                      {dukcapilResult.valid && (
                        <p className="text-[10px] font-mono text-emerald-800 mt-0.5">
                          Wilayah: {dukcapilResult.kabupaten} | Jenis Kelamin: {dukcapilResult.jenisKelamin} | Tgl Lahir: {dukcapilResult.tanggalLahir}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Pemilik (Sesuai KTP) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: H. Asep Suryana, M.M."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="Contoh: 081223456789"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Bangunan Kos */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0B3D91]">
              <Building className="w-5 h-5" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                2. Data Bangunan Rumah Pemondokan / Kos
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Kos */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Rumah Kos <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaKos}
                  onChange={(e) => setNamaKos(e.target.value)}
                  placeholder="Contoh: Kos Mahasiswa Residence Dago Asri"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Alamat Lengkap */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap Bangunan Kos <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Jl. Dago Asri No. 14B, RT 02 / RW 08, Kel. Dago, Coblong"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Kabupaten / Kota */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kabupaten / Kota di Jawa Barat <span className="text-rose-500">*</span>
                </label>
                <select
                  value={kabupaten}
                  onChange={(e) => setKabupaten(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all bg-white"
                >
                  {KABUPATEN_KOTA_JABAR.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jumlah Kamar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah Kamar Pemondokan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={jumlahKamar}
                  onChange={(e) => setJumlahKamar(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Kisaran Harga Sewa Per Bulan */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimasi Tarif Sewa Kamar Per Bulan (Rp)
                </label>
                <input
                  type="number"
                  step={50000}
                  value={hargaSewa}
                  onChange={(e) => setHargaSewa(parseInt(e.target.value) || 0)}
                  placeholder="1000000"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Upload Dokumen & Foto (Drag & Drop Preview) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0B3D91]">
              <Upload className="w-5 h-5" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                3. Unggah Dokumen Verifikasi (Foto KTP & Foto Bangunan)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload Foto KTP */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-[#0B3D91] transition-colors relative bg-slate-50/50">
                <input
                  ref={ktpInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFotoKtp)}
                  className="hidden"
                />
                {fotoKtp ? (
                  <div className="space-y-2">
                    <img
                      src={fotoKtp}
                      alt="Preview KTP"
                      className="h-32 w-full object-cover rounded-xl border border-slate-200 shadow-2xs"
                    />
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        KTP Siap Diverifikasi
                      </span>
                      <button
                        type="button"
                        onClick={() => setFotoKtp('')}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => ktpInputRef.current?.click()}
                    className="cursor-pointer py-4 space-y-2"
                  >
                    <div className="w-10 h-10 mx-auto bg-blue-100 text-[#0B3D91] rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Unggah Foto KTP Pemilik
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Klik atau seret file (JPG, PNG, maks 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Foto Bangunan Kos */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-[#0B3D91] transition-colors relative bg-slate-50/50">
                <input
                  ref={bangunanInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFotoBangunan)}
                  className="hidden"
                />
                {fotoBangunan ? (
                  <div className="space-y-2">
                    <img
                      src={fotoBangunan}
                      alt="Preview Bangunan"
                      className="h-32 w-full object-cover rounded-xl border border-slate-200 shadow-2xs"
                    />
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Foto Bangunan Siap
                      </span>
                      <button
                        type="button"
                        onClick={() => setFotoBangunan('')}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => bangunanInputRef.current?.click()}
                    className="cursor-pointer py-4 space-y-2"
                  >
                    <div className="w-10 h-10 mx-auto bg-blue-100 text-[#0B3D91] rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Unggah Foto Tampak Depan Bangunan
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Klik atau seret file tampak fasad jalan utama
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data otomatis tersimpan di LocalStorage KOS_LEGAL_JABAR</span>
            </div>

            <button
              id="btn-submit-pendaftaran"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-[#0B3D91] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke Sistem Pemprov...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Kirim Pendaftaran & Dapatkan Izin</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
