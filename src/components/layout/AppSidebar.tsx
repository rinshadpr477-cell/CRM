'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserPlus, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProspects } from '@/context/ProspectContext';

export function AppSidebar() {
  const pathname = usePathname();
  const { metrics } = useProspects();

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
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-slate-900 border-r border-slate-800 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#004e9f] to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
            Prospect CRM
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
            Enterprise Hub
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    active
                      ? 'bg-[#004e9f] text-white shadow-sm shadow-[#004e9f]/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-semibold',
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </div>
          <Link
            href="/prospects/new"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all group border border-dashed border-slate-700 hover:border-slate-500"
          >
            <UserPlus className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
            <span>Add New Prospect</span>
          </Link>
        </div>

        {/* System Summary Card */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Lead Insights</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {metrics.qualifiedLeads} qualified prospects active in your sales pipeline.
          </p>
        </div>
      </div>

      {/* User Identity Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#004e9f] to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-slate-800">
            AM
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-white truncate">Alex Morgan</span>
            <span className="text-xs text-slate-400 truncate">CRM Administrator</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] ring-4 ring-slate-900 flex-shrink-0" title="Online" />
        </div>
      </div>
    </aside>
  );
}
