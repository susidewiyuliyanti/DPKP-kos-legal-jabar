import React, { useEffect, useState } from 'react';
import { KosData } from '../types';
import { JabarLogo } from './JabarLogo';
import { formatDateIndo, generateQrCodeUrl } from '../utils/helpers';
import { Printer, X, Download, ShieldCheck, CheckCircle2, Building, Calendar, FileText, Check } from 'lucide-react';

interface SertifikatLegalModalProps {
  kos: KosData | null;
  onClose: () => void;
}

export const SertifikatLegalModal: React.FC<SertifikatLegalModalProps> = ({ kos, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (kos) {
      const verificationUrl = `${window.location.origin}/#cek-legal?id=${kos.id}&no_izin=${encodeURIComponent(kos.no_izin)}`;
      generateQrCodeUrl(verificationUrl).then((url) => setQrCodeUrl(url));
    }
  }, [kos]);

  if (!kos) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#cek-legal?id=${kos.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div id="modal-sertifikat" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Control Bar (Non-printable) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B3D91] text-white print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
            <span className="font-semibold text-base tracking-wide">
              Sertifikat Resmi Legalisasi Usaha Kos - Pemprov Jawa Barat
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="btn-salin-tautan"
              onClick={handleCopyLink}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-800 hover:bg-blue-700 rounded-lg transition-colors border border-blue-600/50"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> : <FileText className="w-3.5 h-3.5 mr-1" />}
              {isCopied ? 'Tersalin' : 'Salin Tautan'}
            </button>
            <button
              id="btn-cetak-sertifikat"
              onClick={handlePrint}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Cetak / PDF
            </button>
            <button
              id="btn-tutup-sertifikat"
              onClick={onClose}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-8 sm:p-12 bg-white text-slate-800 relative select-text" id="area-cetak-sertifikat">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
            <JabarLogo size={420} />
          </div>

          {/* Certificate Border Frame */}
          <div className="border-4 border-double border-[#0B3D91] p-6 sm:p-8 rounded-xl relative">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0B3D91]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0B3D91]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0B3D91]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0B3D91]" />

            {/* Official Header / Kop Surat */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900 mb-6">
              <div className="shrink-0 mr-4">
                <JabarLogo size={70} />
              </div>
              <div className="text-center flex-1">
                <h4 className="text-xs sm:text-sm font-semibold tracking-widest text-slate-700 uppercase">
                  Pemerintah Daerah Provinsi Jawa Barat
                </h4>
                <h2 className="text-base sm:text-lg font-extrabold text-[#0B3D91] tracking-tight uppercase">
                  Dinas Perumahan dan Permukiman
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  Jl. Kawaluyaan Indah Raya No. 4, Jatisari, Buahbatu, Kota Bandung, Jawa Barat 40286
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Laman: disperkim.jabarprov.go.id | Pos-el: perkim@jabarprov.go.id
                </p>
              </div>
              <div className="shrink-0 w-[70px] hidden sm:block">
                {/* Visual balance */}
                <div className="w-16 h-16 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center font-mono">
                  JABAR JUARA
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-5">
              <span className="inline-block px-4 py-1 text-[11px] font-bold tracking-widest text-white bg-[#0B3D91] rounded-full uppercase mb-2">
                Surat Keterangan Terdaftar & Laik Operasional
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif uppercase">
                Sertifikat Legalitas Usaha Rumah Kos
              </h1>
              <p className="text-xs text-slate-600 font-mono mt-1">
                Nomor Registrasi: <span className="font-bold text-[#0B3D91]">{kos.no_izin}</span>
              </p>
            </div>

            {/* Legal Foundation Statement */}
            <p className="text-xs text-slate-700 text-justify leading-relaxed mb-5">
              Berdasarkan Peraturan Daerah Provinsi Jawa Barat Nomor 13 Tahun 2011 tentang Penyelenggaraan Pemondokan dan Rumah Sewa, serta pemenuhan standarisasi ketertiban, keselamatan bangunan, dan ketaatan retribusi daerah, Kepala Dinas Perumahan dan Permukiman Provinsi Jawa Barat menerangkan bahwa:
            </p>

            {/* Kos & Owner Details Table */}
            <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/80 mb-6 text-xs leading-normal">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 text-slate-500 font-medium w-36">Nama Rumah Kos</td>
                    <td className="py-1.5 font-bold text-slate-900 text-sm">{kos.nama}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 text-slate-500 font-medium">Nama Pemilik</td>
                    <td className="py-1.5 font-semibold text-slate-800">{kos.pemilik}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 text-slate-500 font-medium">NIK Pemilik</td>
                    <td className="py-1.5 font-mono text-slate-700">
                      {kos.nik ? `${kos.nik.substring(0, 6)}******${kos.nik.substring(12)} (Terverifikasi Dukcapil)` : '-'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 text-slate-500 font-medium">Alamat Bangunan</td>
                    <td className="py-1.5 text-slate-800 font-medium">{kos.lokasi}, {kos.kabupaten}</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 text-slate-500 font-medium">Kapasitas Unit</td>
                    <td className="py-1.5 text-slate-800 font-semibold">{kos.jumlah_kamar} Kamar Pemondokan</td>
                  </tr>
                  <tr className="border-b border-slate-200/60">
                    <td className="py-1.5 text-slate-500 font-medium">Status Pajak Retribusi</td>
                    <td className="py-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        Pajak Daerah Lunas (Virtual Account BJB Terdata)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-500 font-medium">Masa Berlaku Izin</td>
                    <td className="py-1.5 font-bold text-[#0B3D91]">
                      Valid s/d {formatDateIndo(kos.izin_valid_until)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Declaration statement */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2.5 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">STATUS RESMI: TERVERIFIKASI & LAIK OPERASIONAL</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Properti ini telah lolos uji kelayakan tata ruang, data kependudukan pemilik valid, dan terdaftar pada Basis Data Terpadu Kos Legal Jawa Barat. Calon penghuni dijamin aman dan terlindungi payung hukum pemda.
                </p>
              </div>
            </div>

            {/* Signature & QR Verification Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-200 text-xs">
              {/* QR Code Verification */}
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Legalitas"
                    className="w-24 h-24 border-2 border-slate-800 p-1 rounded bg-white shadow-xs"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                    QR Code
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-slate-800 text-[11px]">PINDAI UNTUK VALIDASI</p>
                  <p className="text-[10px] text-slate-500 max-w-[160px] leading-tight mt-0.5">
                    Scan QR Code ini untuk melihat catatan legalitas resmi pada portal Kos Legal Jabar
                  </p>
                  <p className="text-[9px] font-mono text-slate-400 mt-1">
                    ID: {kos.id}
                  </p>
                </div>
              </div>

              {/* Digital Official Signature */}
              <div className="text-center sm:text-right">
                <p className="text-slate-600 text-[11px]">Ditetapkan di Bandung, Jawa Barat</p>
                <p className="text-slate-500 text-[10px] mb-1">
                  Pada tanggal {formatDateIndo(kos.tanggal_daftar || '2024-03-15')}
                </p>
                <p className="font-bold text-slate-800 text-xs">
                  a.n. GUBERNUR JAWA BARAT
                </p>
                <p className="text-[11px] text-slate-700">Kepala Dinas Perumahan dan Permukiman</p>
                
                {/* Digital Stamp Simulation */}
                <div className="my-1 py-1 flex items-center justify-center sm:justify-end">
                  <div className="border border-blue-400 bg-blue-50/60 text-blue-900 rounded px-2.5 py-1 text-[10px] font-mono flex items-center space-x-1.5 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>Ditandatangani secara elektronik (TTE BSrE - BSSN)</span>
                  </div>
                </div>

                <p className="font-bold text-slate-900 text-xs tracking-wide underline mt-1">
                  Dr. Ir. INDRA MAHA, S.T., M.T.
                </p>
                <p className="text-[10px] text-slate-600 font-mono">
                  Pembina Utama Madya - NIP. 19700412 199603 1 002
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in modal */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 print:hidden">
          <span>© 2026 Dinas Perumahan & Permukiman Provinsi Jawa Barat</span>
          <span className="font-mono text-slate-600 mt-1 sm:mt-0">Dokumen Publik Resmi Terproteksi</span>
        </div>
      </div>
    </div>
  );
};
