'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, LayoutDashboard, Package, ArrowDownLeft, ArrowUpRight, 
  FileText, SlidersHorizontal, Layers, BarChart3, Building2, Settings 
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const menus = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Master Barang', href: '/barang', icon: Package },
    { name: 'Barang Masuk', href: '/barang-masuk', icon: ArrowDownLeft },
    { name: 'Barang Keluar', href: '/barang-keluar', icon: ArrowUpRight },
    { name: 'Surat Jalan', href: '/surat-jalan', icon: FileText },
    { name: 'Penyesuaian Stok', href: '/penyesuaian', icon: SlidersHorizontal },
    { name: 'Kategori Kain', href: '/kategori', icon: Layers },
    { name: 'Laporan', href: '/laporan', icon: BarChart3 },
    { name: 'Info Bisnis', href: '/info-bisnis', icon: Building2 },
    { name: 'Pengaturan & User', href: '/pengaturan', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer Body */}
      <div className="relative w-72 bg-[#1A1B1F] border-r border-[#2A2B30] h-full p-4 flex flex-col z-10">
        <div className="flex items-center justify-between border-b border-[#2A2B30] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center text-white font-black text-base">
              GK
            </div>
            <h2 className="font-bold text-white text-sm">Gudang Kain</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#232428] text-[#9A9BA3] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
          {menus.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-[#6C5CE7] text-white font-bold' : 'text-[#9A9BA3] hover:bg-[#232428]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
