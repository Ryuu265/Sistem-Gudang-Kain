'use client';

import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Shield, Check, Menu, Package, FileText } from 'lucide-react';
import { useApp } from '@/lib/store/app-context';
import { UserRole } from '@/types';

interface HeaderProps {
  onOpenMobileDrawer?: () => void;
}

export function Header({ onOpenMobileDrawer }: HeaderProps) {
  const { currentUser, setCurrentRole, products, deliveryNotes } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Unread low stock or pending delivery notifications
  const lowStock = products.filter((p) => p.is_active && p.stok_saat_ini <= p.stok_minimum);
  const pendingSj = deliveryNotes.filter((d) => d.status === 'dalam_pengiriman');

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.documentElement.classList.toggle('light', !isLightMode);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1A1B1F]/90 backdrop-blur-md border-b border-[#2A2B30] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Drawer Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileDrawer}
          className="lg:hidden p-2 rounded-xl bg-[#232428] text-white hover:bg-[#2A2B30] transition-colors border border-[#33343A]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <p className="text-[11px] font-semibold text-[#9A9BA3] tracking-wide">Sistem Gudang Kain</p>
          <h2 className="text-base lg:text-lg font-extrabold text-white leading-tight">
            Halo, {currentUser.nama_lengkap.split(' ')[0]} 👋
          </h2>
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Role Switcher, Theme */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative hidden md:block w-60 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9BA3]" />
          <input
            type="text"
            placeholder="Cari SKU, nama kain, warna..."
            className="w-full bg-[#2E2F35] text-xs text-white placeholder-[#6B6C75] pl-9 pr-4 py-2 rounded-full border border-[#33343A] focus:outline-none focus:border-[#6C5CE7] transition-all"
          />
        </div>

        {/* Role Selector Badge */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6C5CE7]/15 text-[#6C5CE7] text-xs font-bold border border-[#6C5CE7]/30 hover:bg-[#6C5CE7]/25 transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="capitalize">{currentUser.role}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-[#2A2B30] border border-[#33343A] rounded-2xl shadow-xl p-2 z-50 text-xs">
              <p className="px-2 py-1 text-[10px] font-bold text-[#9A9BA3] uppercase">Simulasi Peran</p>
              {(['admin', 'staff', 'viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-[#33343A] text-white capitalize font-medium"
                >
                  <span>{r}</span>
                  {currentUser.role === r && <Check className="w-3.5 h-3.5 text-[#6C5CE7]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Panel */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-[#232428] text-[#9A9BA3] hover:text-white hover:bg-[#2A2B30] border border-[#33343A] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {(lowStock.length > 0 || pendingSj.length > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF8A3D] rounded-full ring-2 ring-[#1A1B1F]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#2A2B30] border border-[#33343A] rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-[#33343A] pb-2">
                <h4 className="font-bold text-xs text-white">Notifikasi Stok & SJ</h4>
                <span className="text-[10px] text-[#FF8A3D] font-bold bg-[#FF8A3D]/15 px-2 py-0.5 rounded-full">
                  {lowStock.length + pendingSj.length} Perlu Perhatian
                </span>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {lowStock.map((p) => (
                  <div key={p.id} className="p-2.5 bg-[#232428] rounded-xl border border-[#33343A] flex items-start gap-2.5">
                    <Package className="w-4 h-4 text-[#FF5C5C] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-white leading-tight">{p.nama}</p>
                      <p className="text-[11px] text-[#9A9BA3]">Stok sisa: <span className="text-[#FF5C5C] font-bold">{p.stok_saat_ini} {p.unit?.simbol || 'Roll'}</span> (Min: {p.stok_minimum})</p>
                    </div>
                  </div>
                ))}

                {pendingSj.map((d) => (
                  <div key={d.id} className="p-2.5 bg-[#232428] rounded-xl border border-[#33343A] flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#4A9BFF] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-white leading-tight">{d.nomor_surat_jalan}</p>
                      <p className="text-[11px] text-[#9A9BA3]">Dalam Pengiriman ke {d.customer?.nama || 'Customer'}</p>
                    </div>
                  </div>
                ))}

                {lowStock.length === 0 && pendingSj.length === 0 && (
                  <p className="text-xs text-[#9A9BA3] text-center py-4">Semua stok aman dan pengiriman lancar!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-[#232428] text-[#9A9BA3] hover:text-white hover:bg-[#2A2B30] border border-[#33343A] transition-colors"
          title="Toggle Dark / Light Theme"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#FF8A3D]" />}
        </button>
      </div>
    </header>
  );
}
