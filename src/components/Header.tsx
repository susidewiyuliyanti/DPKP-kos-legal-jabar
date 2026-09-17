import React from 'react';
import { UserRole } from '../types';
import { JabarLogo } from './JabarLogo';
import { ShieldCheck, Menu, User, Shield, Users, Search } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onToggleSidebar: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onToggleSidebar,
  pendingCount
}) => {
  return (
    <header className="bg-[#0B3D91] text-white sticky top-0 z-30 shadow-md border-b-2 border-amber-400">
      {/* Top Banner Notice */}
      <div className="bg-[#082B66] text-[11px] px-4 py-1 flex items-center justify-between text-blue-100 font-medium">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PORTAL RESMI DISPERKIM PROVINSI JAWA BARAT</span>
          <span className="hidden md:inline text-blue-300">|</span>
          <span className="hidden md:inline text-blue-300">Payung Hukum Perda Jabar No. 13/2011</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="hidden sm:inline">Layanan Bantuan Terpadu: 0878-7962-5033</span>
          <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
            SISTEM ONLINE
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-white hover:bg-blue-800 rounded-xl transition-colors focus:outline-hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3">
            <JabarLogo size={42} />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-white">
                  KOS LEGAL <span className="text-amber-400">JABAR</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  LEGAL RESMI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-100 font-medium tracking-wide line-clamp-1">
                Dinas Perumahan & Permukiman Provinsi Jawa Barat
              </p>
            </div>
          </div>
        </div>

        {/* Role Selector Tabs (Switcher between Admin, Owner, Public Citizen) */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#082B66] p-1 rounded-xl border border-blue-700/50 flex items-center space-x-1">
            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
              }`}
              title="Akses Petugas DPKP Jabar"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin DPKP</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onRoleChange('owner')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'owner'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
              }`}
              title="Akses Pemilik Kos"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pemilik Kos</span>
            </button>

            <button
              onClick={() => onRoleChange('warga')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'warga'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-blue-100 hover:text-white hover:bg-blue-800/60'
              }`}
              title="Portal Calon Penghuni / Warga Umum"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cek Warga</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
