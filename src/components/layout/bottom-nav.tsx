'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ArrowDownLeft, ArrowUpRight, Menu } from 'lucide-react';

interface BottomNavProps {
  onOpenMobileDrawer: () => void;
}

export function BottomNav({ onOpenMobileDrawer }: BottomNavProps) {
  const pathname = usePathname();

  const items = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Barang', href: '/barang', icon: Package },
    { name: 'Masuk', href: '/barang-masuk', icon: ArrowDownLeft },
    { name: 'Keluar', href: '/barang-keluar', icon: ArrowUpRight },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1A1B1F]/95 backdrop-blur-md border-t border-[#2A2B30] lg:hidden px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-[#6C5CE7] font-bold' : 'text-[#9A9BA3]'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.name}</span>
          </Link>
        );
      })}

      <button
        onClick={onOpenMobileDrawer}
        className="flex flex-col items-center gap-1 py-1 px-3 text-[#9A9BA3] hover:text-white"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px]">Menu</span>
      </button>
    </div>
  );
}
