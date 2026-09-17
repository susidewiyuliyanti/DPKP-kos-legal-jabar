import React, { useState } from 'react';
import { KosData } from '../types';
import { formatRupiah } from '../utils/helpers';
import {
  Receipt,
  Building2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

interface PembayaranPajakPageProps {
  kosList: KosData[];
  onOpenPaymentModal: (kos: KosData) => void;
}

export const PembayaranPajakPage: React.FC<PembayaranPajakPageProps> = ({
  kosList,
  onOpenPaymentModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Lunas' | 'Belum Bayar'>('Semua');

  const lunasCount = kosList.filter((k) => k.pajak_status === 'Lunas').length;
  const belumBayarCount = kosList.filter((k) => k.pajak_status === 'Belum Bayar').length;
  const totalRealisasi = lunasCount * 850000;

  const filtered = kosList.filter((k) => {
    const matchSearch =
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.va_bjb && k.va_bjb.includes(searchTerm));
    const matchStatus = statusFilter === 'Semua' || k.pajak_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3D91] uppercase tracking-wider mb-1">
              <Receipt className="w-4 h-4 text-[#0B3D91]" />
              <span>Portal Retribusi Daerah - Bapenda & Bank BJB</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pembayaran Pajak & Retribusi Pemondokan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Integrasi penagihan elektronik retribusi pemondokan sesuai Perda Jabar No. 13/2011 dengan tarif retribusi daerah sebesar <span className="font-bold text-[#0B3D91]">Rp 850.000 / tahun</span> via Virtual Account Bank BJB.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] text-emerald-700 block font-bold uppercase">
                Penerimaan Daerah Terkumpul
              </span>
              <span className="text-lg font-black text-emerald-800">
                {formatRupiah(totalRealisasi + 14200000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              Retribusi Lunas (BJB)
            </span>
            <span className="text-2xl font-black text-emerald-600">{lunasCount}</span>
            <span className="text-xs text-slate-500 ml-1.5">Objek Kos</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              Menunggu Pembayaran VA
            </span>
            <span className="text-2xl font-black text-amber-600">{belumBayarCount}</span>
            <span className="text-xs text-slate-500 ml-1.5">Objek Kos</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              Kanal Pembayaran Resmi
            </span>
            <span className="text-base font-bold text-[#0B3D91]">Virtual Account BJB</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time settlement Bapenda</p>
          </div>
          <div className="p-3 bg-blue-50 text-[#0B3D91] rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tax Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama kos, VA, atau pemilik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white w-64 focus:outline-hidden focus:ring-2 focus:ring-[#0B3D91]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="Semua">Semua Status Pajak</option>
              <option value="Lunas">Pajak Lunas</option>
              <option value="Belum Bayar">Belum Bayar</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Tarif Tetap Retribusi: <span className="font-bold text-slate-800">Rp 850.000 / Tahun</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Objek Pemondokan</th>
                <th className="py-3 px-4">Wajib Retribusi (Pemilik)</th>
                <th className="py-3 px-4">Nomor VA BJB</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Status Retribusi</th>
                <th className="py-3 px-4 text-center">Aksi / Simulasi BJB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => {
                const isPaid = item.pajak_status === 'Lunas';
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.nama}</div>
                      <div className="text-[10px] text-slate-500">{item.kabupaten}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{item.pemilik}</div>
                      <div className="text-[10px] font-mono text-slate-400">NIK: {item.nik || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                      {item.va_bjb || `10878-3273-${item.id.slice(-4)}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      Rp 850.000
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isPaid ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          LUNAS
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          BELUM BAYAR
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenPaymentModal(item)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-2xs ${
                          isPaid
                            ? 'bg-blue-50 hover:bg-blue-100 text-[#0B3D91] border border-blue-200'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isPaid ? 'Bukti Bayar BJB' : 'Simulasi Bayar BJB'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
