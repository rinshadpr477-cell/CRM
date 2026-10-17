'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserPlus, X, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProspects } from '@/context/ProspectContext';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  const { metrics } = useProspects();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isNavActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Prospects',
      href: '/prospects',
      icon: Users,
      badge: metrics?.totalProspects ?? null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#004e9f] to-blue-500 flex items-center justify-center text-white shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Prospect CRM
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-[#004e9f] text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Actions
            </div>
            <Link
              href="/prospects/new"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all border border-dashed border-slate-700"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Add New Prospect</span>
            </Link>
          </div>
        </div>

        {/* User Identity Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#004e9f] to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              AM
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-white truncate">Alex Morgan</span>
              <span className="text-xs text-slate-400 truncate">CRM Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
