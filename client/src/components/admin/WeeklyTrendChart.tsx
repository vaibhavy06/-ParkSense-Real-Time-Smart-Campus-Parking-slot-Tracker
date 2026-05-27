'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface WeeklyTrendProps {
  data: Array<{
    date: string;
    entries: number;
    exits: number;
  }>;
}

export default function WeeklyTrendChart({ data }: WeeklyTrendProps) {
  // Show only last 10 days for clarity
  const filteredData = data.slice(-10);

  return (
    <div className="w-full h-80 p-5 rounded-3xl bg-card border border-border-custom shadow-sm dark:bg-bg-dark-card dark:border-border transition-all">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-4">
        Weekly Gate Volume Trend (Entries vs Exits)
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="entries"
              name="Gate Entries"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorEntries)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="exits"
              name="Gate Exits"
              stroke="#F59E0B"
              fillOpacity={1}
              fill="url(#colorExits)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
