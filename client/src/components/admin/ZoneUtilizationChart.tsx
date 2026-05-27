'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ZoneUtilizationProps {
  data: Array<{
    zoneName: string;
    totalSlots: number;
    utilizationRate: number;
    weeklyEntries: number;
    avgDurationMinutes: number;
  }>;
}

export default function ZoneUtilizationChart({ data }: ZoneUtilizationProps) {
  // Format names to keep them concise
  const formattedData = data.map(item => ({
    ...item,
    shortName: item.zoneName.split(' - ')[0],
  }));

  return (
    <div className="w-full h-80 p-5 rounded-3xl bg-card border border-border-custom shadow-sm dark:bg-bg-dark-card dark:border-border transition-all">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-4">
        Zone Utilization Speed (%)
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
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
            <Bar
              dataKey="utilizationRate"
              name="Utilization Rate"
              fill="#10B981" // emerald-500
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
