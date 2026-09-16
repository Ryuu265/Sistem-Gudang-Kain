'use client';

import React, { useState, useEffect } from 'react';
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
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors duration-300">
      {/* Mobile Drawer Toggle & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileDrawer}
          className="lg:hidden p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors border border-[var(--border)]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <p className="text-[11px] font-semibold text-[var(--text-secondary)] tracking-wide">Sistem Gudang Kain</p>
          <h2 className="text-base lg:text-lg font-extrabold text-[var(--text-primary)] leading-tight">
            Halo, {currentUser.nama_lengkap.split(' ')[0]} 👋
          </h2>
        </div>
      </div>

      {/* Right Controls: Search, Notifications, Role Switcher, Theme */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative hidden md:block w-60 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Cari SKU, nama kain, warna..."
            className="w-full bg-[var(--bg-input)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] pl-9 pr-4 py-2 rounded-full border border-[var(--border)] focus:outline-none focus:border-[#6C5CE7] transition-all"
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
            <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-xl p-2 z-50 text-xs">
              <p className="px-2 py-1 text-[10px] font-bold text-[var(--text-secondary)] uppercase">Simulasi Peran</p>
              {(['admin', 'staff', 'viewer'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-[var(--bg-input)] text-[var(--text-primary)] capitalize font-medium"
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
            className="relative p-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {(lowStock.length > 0 || pendingSj.length > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF8A3D] rounded-full ring-2 ring-[var(--bg-base)]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                <h4 className="font-bold text-xs text-[var(--text-primary)]">Notifikasi Stok & SJ</h4>
                <span className="text-[10px] text-[#FF8A3D] font-bold bg-[#FF8A3D]/15 px-2 py-0.5 rounded-full">
                  {lowStock.length + pendingSj.length} Perlu Perhatian
                </span>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {lowStock.map((p) => (
                  <div key={p.id} className="p-2.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] flex items-start gap-2.5">
                    <Package className="w-4 h-4 text-[#FF5C5C] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[var(--text-primary)] leading-tight">{p.nama}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">Stok sisa: <span className="text-[#FF5C5C] font-bold">{p.stok_saat_ini} {p.unit?.simbol || 'Roll'}</span> (Min: {p.stok_minimum})</p>
                    </div>
                  </div>
                ))}

                {pendingSj.map((d) => (
                  <div key={d.id} className="p-2.5 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#4A9BFF] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold text-[var(--text-primary)] leading-tight">{d.nomor_surat_jalan}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">Dalam Pengiriman ke {d.customer?.nama || 'Customer'}</p>
                    </div>
                  </div>
                ))}

                {lowStock.length === 0 && pendingSj.length === 0 && (
                  <p className="text-xs text-[var(--text-secondary)] text-center py-4">Semua stok aman dan pengiriman lancar!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] transition-all shadow-sm"
          title="Toggle Dark / Light Theme"
        >
          {isLightMode ? <Moon className="w-4 h-4 text-[#6C5CE7]" /> : <Sun className="w-4 h-4 text-[#FF8A3D]" />}
        </button>
      </div>
    </header>
  );
}
