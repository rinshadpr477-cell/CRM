'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Plus, Bell, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProspects } from '@/context/ProspectContext';

interface AppHeaderProps {
  onOpenMobileNav: () => void;
}

export function AppHeader({ onOpenMobileNav }: AppHeaderProps) {
  const pathname = usePathname();
  const { resetData } = useProspects();
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate breadcrumb / title
  const getBreadcrumb = () => {
    if (pathname === '/') {
      return [{ label: 'Dashboard', href: '/' }];
    }
    if (pathname === '/prospects') {
      return [
        { label: 'Dashboard', href: '/' },
        { label: 'Prospects', href: '/prospects' },
      ];
    }
    if (pathname === '/prospects/new') {
      return [
        { label: 'Prospects', href: '/prospects' },
        { label: 'Add Prospect', href: '/prospects/new' },
      ];
    }
    if (pathname.endsWith('/edit')) {
      return [
        { label: 'Prospects', href: '/prospects' },
        { label: 'Edit Prospect', href: pathname },
      ];
    }
    if (pathname.startsWith('/prospects/')) {
      return [
        { label: 'Prospects', href: '/prospects' },
        { label: 'Prospect Details', href: pathname },
      ];
    }
    return [{ label: 'Overview', href: '/' }];
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004e9f]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-sm">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href + idx}>
                {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                {isLast ? (
                  <span className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data button */}
        <button
          onClick={resetData}
          title="Reset to initial sample demo prospects"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004e9f]"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#004e9f] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                <span className="text-xs text-slate-400 font-medium">System Active</span>
              </div>
              <div className="py-3 space-y-2.5">
                <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#34A853] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">Local Storage Active</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      All changes are persisted to browser memory in real time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#004e9f] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">Pipeline Synchronized</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dashboard KPIs and qualification metrics recalculate on CRUD actions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-[#004e9f] hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button (Add Prospect) */}
        {pathname !== '/prospects/new' && (
          <Link href="/prospects/new">
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="hidden sm:inline-flex"
            >
              Add Prospect
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
