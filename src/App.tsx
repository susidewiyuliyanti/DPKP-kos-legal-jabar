import React, { useState, useEffect } from 'react';
import { KosData, LaporanIlegal, UserRole } from './types';
import {
  getStoredKosList,
  saveStoredKosList,
  getStoredLaporanList,
  saveStoredLaporanList
} from './utils/helpers';
import { INITIAL_KOS_LIST, INITIAL_LAPORAN_LIST } from './data/initialKos';

import { Header } from './components/Header';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardOwner } from './components/DashboardOwner';
import { FormPendaftaran } from './components/FormPendaftaran';
import { VerifikasiKtpPage } from './components/VerifikasiKtpPage';
import { DataBangunanKos } from './components/DataBangunanKos';
import { PembayaranPajakPage } from './components/PembayaranPajakPage';
import { StatusKamarPage } from './components/StatusKamarPage';
import { PetaSebaran } from './components/PetaSebaran';
import { CekWarga } from './components/CekWarga';
import { LaporanPage } from './components/LaporanPage';
import { PengaturanPage } from './components/PengaturanPage';
import { SertifikatLegalModal } from './components/SertifikatLegalModal';
import { PembayaranPajakModal } from './components/PembayaranPajakModal';
import { Footer } from './components/Footer';

import confetti from 'canvas-confetti';

export default function App() {
  const [kosList, setKosList] = useState<KosData[]>(() => getStoredKosList());
  const [laporanList, setLaporanList] = useState<LaporanIlegal[]>(() => getStoredLaporanList());
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Modals
  const [selectedCertificateKos, setSelectedCertificateKos] = useState<KosData | null>(null);
  const [selectedPaymentKos, setSelectedPaymentKos] = useState<KosData | null>(null);

  // Save to LocalStorage whenever kosList or laporanList changes
  useEffect(() => {
    saveStoredKosList(kosList);
  }, [kosList]);

  useEffect(() => {
    saveStoredLaporanList(laporanList);
  }, [laporanList]);

  // Handle verification by Admin
  const handleVerifyKos = (kosId: string) => {
    setKosList((prev) =>
      prev.map((item) => {
        if (item.id === kosId) {
          const generatedNoIzin =
            item.no_izin === 'PROSES-VERIFIKASI-DPKP' || item.no_izin === 'MENUNGGU_VERIFIKASI'
              ? `IZN-DPKP-JBR/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`
              : item.no_izin;

          return {
            ...item,
            status: 'Terverifikasi',
            no_izin: generatedNoIzin,
            izin_valid_until: '2025-12-31'
          };
        }
        return item;
      })
    );

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleRejectKos = (kosId: string, reason: string) => {
    setKosList((prev) =>
      prev.map((item) => {
        if (item.id === kosId) {
          return {
            ...item,
            status: 'Ditolak',
            catatan_petugas: reason
          };
        }
        return item;
      })
    );
  };

  // Handle Tax Payment Success via BJB Virtual Account
  const handlePaymentSuccess = (kosId: string) => {
    setKosList((prev) =>
      prev.map((item) => {
        if (item.id === kosId) {
          return {
            ...item,
            pajak_status: 'Lunas',
            terakhir_bayar_pajak: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );
  };

  // Handle registration of new kos
  const handleNewRegistration = (newKos: KosData) => {
    setKosList((prev) => [newKos, ...prev]);
  };

  // Handle update kos
  const handleUpdateKos = (updated: KosData) => {
    setKosList((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Handle citizen complaint
  const handleNewLaporan = (newLaporan: LaporanIlegal) => {
    setLaporanList((prev) => [newLaporan, ...prev]);
  };

  // Handle factory reset of data
  const handleResetData = () => {
    if (window.confirm('Kembalikan seluruh data ke pengaturan awal (128+ Kos Jabar)?')) {
      setKosList(INITIAL_KOS_LIST);
      setLaporanList(INITIAL_LAPORAN_LIST);
      saveStoredKosList(INITIAL_KOS_LIST);
      saveStoredLaporanList(INITIAL_LAPORAN_LIST);
      alert('Data KOS_LEGAL_JABAR berhasil dikembalikan ke pengaturan awal.');
    }
  };

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'warga') {
      setActiveTab('cek_warga');
    } else if (role === 'owner') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  const pendingVerifCount = kosList.filter((k) => k.status === 'Menunggu Verifikasi').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-[#0B3D91] selection:text-white">
      {/* Official Government Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onToggleSidebar={() => setSidebarOpenMobile((prev) => !prev)}
        pendingCount={pendingVerifCount}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
          currentRole={currentRole}
          pendingCount={pendingVerifCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && (
            <>
              {currentRole === 'owner' ? (
                <DashboardOwner
                  kosList={kosList}
                  onOpenPaymentModal={(k) => setSelectedPaymentKos(k)}
                  onOpenCertificateModal={(k) => setSelectedCertificateKos(k)}
                  onUpdateKos={handleUpdateKos}
                  onNavigateRegister={() => setActiveTab('pendaftaran')}
                />
              ) : (
                <DashboardAdmin
                  kosList={kosList}
                  onVerifyKos={handleVerifyKos}
                  onOpenCertificateModal={(k) => setSelectedCertificateKos(k)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}
            </>
          )}

          {activeTab === 'pendaftaran' && (
            <FormPendaftaran onSuccess={handleNewRegistration} />
          )}

          {activeTab === 'verifikasi_ktp' && (
            <VerifikasiKtpPage
              kosList={kosList}
              onVerifyKos={handleVerifyKos}
              onRejectKos={handleRejectKos}
              onOpenCertificateModal={(k) => setSelectedCertificateKos(k)}
            />
          )}

          {activeTab === 'data_kos' && (
            <DataBangunanKos
              kosList={kosList}
              onVerifyKos={handleVerifyKos}
              onOpenCertificateModal={(k) => setSelectedCertificateKos(k)}
            />
          )}

          {activeTab === 'pembayaran_pajak' && (
            <PembayaranPajakPage
              kosList={kosList}
              onOpenPaymentModal={(k) => setSelectedPaymentKos(k)}
            />
          )}

          {activeTab === 'status_kamar' && (
            <StatusKamarPage
              kosList={kosList}
              onUpdateKos={handleUpdateKos}
            />
          )}

          {activeTab === 'peta_sebaran' && (
            <PetaSebaran
              kosList={kosList}
              onOpenCertificateModal={(k) => setSelectedCertificateKos(k)}
            />
          )}

          {activeTab === 'cek_warga' && (
            <CekWarga
              kosList={kosList}
              laporanList={laporanList}
              onSubmitLaporan={handleNewLaporan}
              onOpenCertificateModal={(k) => setSelectedCertificateKos(k)}
            />
          )}

          {activeTab === 'laporan' && (
            <LaporanPage
              kosList={kosList}
              laporanList={laporanList}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanPage onResetData={handleResetData} />
          )}
        </main>
      </div>

      {/* Official Certificate Modal */}
      <SertifikatLegalModal
        kos={selectedCertificateKos}
        onClose={() => setSelectedCertificateKos(null)}
      />

      {/* Virtual Account BJB Payment Modal */}
      <PembayaranPajakModal
        kos={selectedPaymentKos}
        onClose={() => setSelectedPaymentKos(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
