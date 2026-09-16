'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileDrawer } from '@/components/layout/mobile-drawer';
import { BottomNav } from '@/components/layout/bottom-nav';
import { AppProvider } from '@/lib/store/app-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
        </div>

        {/* Mobile Components */}
        <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
        <BottomNav onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />
      </div>
    </AppProvider>
  );
}
