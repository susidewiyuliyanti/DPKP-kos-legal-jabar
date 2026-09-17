import React, { useState } from 'react';
import { KosData } from '../types';
import { formatRupiah } from '../utils/helpers';
import confetti from 'canvas-confetti';
import { CreditCard, CheckCircle2, Copy, Check, X, ShieldAlert, ArrowRight, Building2 } from 'lucide-react';

interface PembayaranPajakModalProps {
  kos: KosData | null;
  onClose: () => void;
  onPaymentSuccess: (kosId: string) => void;
}

export const PembayaranPajakModal: React.FC<PembayaranPajakModalProps> = ({
  kos,
  onClose,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!kos) return null;

  const vaNumber = kos.va_bjb || `10878-3273-${kos.id.replace(/\D/g, '').padEnd(5, '0').slice(0, 5)}`;
  const nominal = 850000; // Rp 850.000 / tahun as specified in prompt

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaid(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      onPaymentSuccess(kos.id);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0B3D91] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-800 rounded-lg">
              <CreditCard className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Pembayaran Pajak Retribusi Daerah
              </h3>
              <p className="text-xs text-blue-200">
                Bapenda Jabar & Bank BJB (Virtual Account)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paid ? (
          /* Payment Success State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">
                Pembayaran Berhasil Diverifikasi!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Retribusi Usaha Pemondokan tahun berjalan untuk <span className="font-semibold">{kos.nama}</span> telah lunas tercatat pada kas daerah Bapenda Provinsi Jawa Barat.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>No. Transaksi (NTPD):</span>
                <span className="font-bold text-slate-900">BJB-JBR-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Waktu Pembayaran:</span>
                <span className="text-slate-800">{new Date().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nominal Dibayar:</span>
                <span className="font-bold text-emerald-600">{formatRupiah(nominal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status Retribusi:</span>
                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  LUNAS / SAH
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-[#0B3D91] hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              Selesai & Tutup
            </button>
          </div>
        ) : (
          /* Payment Invoice State */
          <div className="p-6 space-y-5">
            {/* Kos summary banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Objek Retribusi</p>
                <p className="text-sm font-bold text-slate-900">{kos.nama}</p>
                <p className="text-xs text-slate-600">{kos.lokasi}, {kos.kabupaten}</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                Tahunan 2025/2026
              </span>
            </div>

            {/* Virtual Account Box */}
            <div className="border border-blue-200 bg-blue-50/70 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-blue-900 text-xs font-semibold mb-1">
                <Building2 className="w-4 h-4 text-[#0B3D91]" />
                <span>Nomor Rekening Virtual Account (BJB)</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-[#0B3D91] tracking-wider">
                  {vaNumber}
                </span>
                <button
                  onClick={handleCopy}
                  title="Salin Nomor VA"
                  className="p-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                Atas Nama: <span className="font-bold">BAPENDA JABAR - KOS {kos.id}</span>
              </p>
            </div>

            {/* Nominal summary */}
            <div className="border-t border-b border-slate-200 py-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Retribusi Izin Penyelenggaraan Pemondokan:</span>
                <span>Rp 800.000</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Pembinaan & Pengawasan Perda:</span>
                <span>Rp 50.000</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-dashed border-slate-200">
                <span>Total Tagihan (1 Tahun):</span>
                <span className="text-[#0B3D91]">{formatRupiah(nominal)}</span>
              </div>
            </div>

            {/* Simulation Instructions */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Simulasi Virtual Account BJB resmi. Tekan tombol simulasi di bawah untuk mengonfirmasi pembayaran secara instan tanpa perlu transfer manual.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="w-1/3 py-2.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-2/3 py-2.5 px-4 bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses Transaksi...</span>
                  </>
                ) : (
                  <>
                    <span>Simulasi Bayar Pajak BJB</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
