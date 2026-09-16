'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, ArrowDownLeft, ArrowUpRight, 
  FileText, SlidersHorizontal, Layers, Users, BarChart3, 
  Building2, Settings, LogOut, ChevronRight, AlertTriangle 
} from 'lucide-react';
import { useApp } from '@/lib/store/app-context';

export function Sidebar() {
  const pathname = usePathname();
  const { products, deliveryNotes, currentUser, setCurrentRole } = useApp();

  // Badges calculation
  const lowStockCount = products.filter((p) => p.is_active && p.stok_saat_ini <= p.stok_minimum).length;
  const pendingSjCount = deliveryNotes.filter((d) => d.status === 'dalam_pengiriman' || d.status === 'diterbitkan').length;

  const operasionalMenu = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Master Barang', href: '/barang', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { name: 'Barang Masuk', href: '/barang-masuk', icon: ArrowDownLeft },
    { name: 'Barang Keluar', href: '/barang-keluar', icon: ArrowUpRight },
    { name: 'Surat Jalan', href: '/surat-jalan', icon: FileText, badge: pendingSjCount > 0 ? pendingSjCount : undefined },
    { name: 'Penyesuaian Stok', href: '/penyesuaian', icon: SlidersHorizontal },
  ];

  const dataSettingsMenu = [
    { name: 'Kategori Kain', href: '/kategori', icon: Layers },
    { name: 'Laporan', href: '/laporan', icon: BarChart3 },
    { name: 'Info Bisnis', href: '/info-bisnis', icon: Building2 },
    { name: 'Pengaturan & User', href: '/pengaturan', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 bg-[#1A1B1F] min-h-screen border-r border-[#2A2B30] p-4 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-[#2A2B30]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7B61FF] to-[#6C5CE7] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#6C5CE7]/20">
          GK
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-wide leading-snug">Gudang Kain</h1>
          <p className="text-[11px] text-[#9A9BA3]">Sistem Distribusi</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
        {/* OPERASIONAL GROUP */}
        <div>
          <p className="px-3 text-[10px] font-bold text-[#6B6C75] tracking-wider uppercase mb-2">
            OPERASIONAL
          </p>
          <nav className="space-y-1">
            {operasionalMenu.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30 font-bold'
                      : 'text-[#9A9BA3] hover:text-white hover:bg-[#2A2B30]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#9A9BA3]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FF8A3D] text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* DATA & PENGATURAN GROUP */}
        <div>
          <p className="px-3 text-[10px] font-bold text-[#6B6C75] tracking-wider uppercase mb-2">
            DATA & PENGATURAN
          </p>
          <nav className="space-y-1">
            {dataSettingsMenu.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30 font-bold'
                      : 'text-[#9A9BA3] hover:text-white hover:bg-[#2A2B30]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#9A9BA3]'}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile Footer Card */}
      <div className="mt-auto pt-4 border-t border-[#2A2B30]">
        <div className="p-3 bg-[#232428] rounded-xl border border-[#33343A] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 border border-[#6C5CE7] flex items-center justify-center text-[#6C5CE7] font-bold text-xs shrink-0">
              {currentUser.nama_lengkap.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser.nama_lengkap}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]"></span>
                <span className="text-[10px] text-[#9A9BA3] uppercase tracking-wider font-semibold">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          <Link href="/login" className="text-[#9A9BA3] hover:text-[#FF5C5C] p-1 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
