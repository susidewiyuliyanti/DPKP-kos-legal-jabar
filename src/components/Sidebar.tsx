import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  BadgeCheck,
  Building,
  Receipt,
  BedDouble,
  MapPin,
  FileBarChart2,
  Search,
  Settings,
  ShieldCheck,
  PhoneCall,
  X
} from 'lucide-react';
import { UserRole } from '../types';

export type NavItemKey =
  | 'dashboard'
  | 'pendaftaran'
  | 'verifikasi_ktp'
  | 'data_kos'
  | 'pembayaran_pajak'
  | 'status_kamar'
  | 'peta_sebaran'
  | 'laporan'
  | 'cek_warga'
  | 'pengaturan';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentRole: UserRole;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  currentRole,
  pendingCount
}) => {
  const menuItems = [
    {
      key: 'dashboard' as NavItemKey,
      label: currentRole === 'owner' ? 'Dashboard Pemilik' : 'Dashboard Utama',
      icon: LayoutDashboard,
      badge: null
    },
    {
      key: 'pendaftaran' as NavItemKey,
      label: 'Pendaftaran Pemilik',
      icon: UserPlus,
      badge: null
    },
    {
      key: 'verifikasi_ktp' as NavItemKey,
      label: 'Verifikasi KTP',
      icon: BadgeCheck,
      badge: pendingCount > 0 ? `${pendingCount} Baru` : null,
      badgeColor: 'bg-amber-500 text-slate-900'
    },
    {
      key: 'data_kos' as NavItemKey,
      label: 'Data Bangunan Kos',
      icon: Building,
      badge: null
    },
    {
      key: 'pembayaran_pajak' as NavItemKey,
      label: 'Pembayaran Pajak',
      icon: Receipt,
      badge: 'BJB'
    },
    {
      key: 'status_kamar' as NavItemKey,
      label: 'Status Kamar',
      icon: BedDouble,
      badge: null
    },
    {
      key: 'peta_sebaran' as NavItemKey,
      label: 'Peta Sebaran',
      icon: MapPin,
      badge: null
    },
    {
      key: 'cek_warga' as NavItemKey,
      label: 'Cek Kos Legal',
      icon: Search,
      badge: 'Publik'
    },
    {
      key: 'laporan' as NavItemKey,
      label: 'Laporan & Ekspor',
      icon: FileBarChart2,
      badge: null
    },
    {
      key: 'pengaturan' as NavItemKey,
      label: 'Pengaturan & Regulasi',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-[84px] bottom-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-84px)] shadow-lg lg:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Menu Navigasi
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Layanan Sistem
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                id={`nav-${item.key}`}
                onClick={() => {
                  onSelectTab(item.key);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#0B3D91] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#0B3D91]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-[#0B3D91]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info Card */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-xl space-y-1.5 text-xs text-blue-900">
            <div className="flex items-center space-x-1.5 font-bold text-[#0B3D91]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pusat Pengaduan Jabar</span>
            </div>
            <p className="text-[11px] text-blue-800">
              Lapor kos ilegal atau kendala perizinan:
            </p>
            <a
              href="tel:087879625033"
              className="inline-flex items-center font-mono font-bold text-[#0B3D91] hover:underline text-[12px]"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              0878-7962-5033
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
