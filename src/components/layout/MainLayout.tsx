'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { MobileNavigation } from './MobileNavigation';
import { ToastContainer } from '@/components/ui/Toast';

function RouteScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      document.body.style.removeProperty('overflow');
      document.body.style.overflow = '';
      document.documentElement.style.removeProperty('overflow');
      document.documentElement.style.overflow = '';
      document.body.classList.remove('modal-open');
    } catch {
      // safe fallback
    }
  }, [pathname]);

  return null;
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f9f9ff] text-slate-900 flex flex-col lg:flex-row relative">
      {/* Route scroll unlocker in Suspense */}
      <Suspense fallback={null}>
        <RouteScrollRestorer />
      </Suspense>

      {/* Desktop Fixed Sidebar */}
      <Suspense fallback={<aside className="hidden lg:flex w-64 fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 z-30" />}>
        <AppSidebar />
      </Suspense>

      {/* Mobile Drawer */}
      <Suspense fallback={null}>
        <MobileNavigation
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
      </Suspense>

      {/* Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 min-h-screen w-full">
        <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
          <AppHeader onOpenMobileNav={() => setMobileNavOpen(true)} />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-28">
          <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading view...</div>}>
            {children}
          </Suspense>
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
