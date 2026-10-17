'use client';

import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Prospect } from '@/types/prospect';

interface LeadQualificationChartProps {
  prospects: Prospect[];
}

export function LeadQualificationChart({ prospects }: LeadQualificationChartProps) {
  const data = useMemo(() => {
    const counts = {
      qualified: 0,
      new: 0,
      contacted: 0,
      unqualified: 0,
    };

    prospects.forEach((p) => {
      if (counts[p.status] !== undefined) {
        counts[p.status] += 1;
      }
    });

    return [
      { name: 'Qualified', value: counts.qualified, color: '#34A853' },
      { name: 'Contacted', value: counts.contacted, color: '#f59e0b' },
      { name: 'New', value: counts.new, color: '#004e9f' },
      { name: 'Unqualified', value: counts.unqualified, color: '#e11d48' },
    ];
  }, [prospects]);

  const total = prospects.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Lead Qualification Status
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Distribution across active sales lifecycle stages
        </p>
      </div>

      <div className="relative h-64 sm:h-72 w-full mt-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const entry = payload[0];
                  const percent = total > 0 ? Math.round(((entry.value as number) / total) * 100) : 0;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                      <p className="font-semibold">{entry.name}</p>
                      <p className="text-slate-300">
                        {entry.value} prospects ({percent}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {total}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Leads
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
        {data.map((item) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="text-xs font-semibold text-slate-900">
                {item.value} <span className="text-[10px] text-slate-400 font-normal">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
