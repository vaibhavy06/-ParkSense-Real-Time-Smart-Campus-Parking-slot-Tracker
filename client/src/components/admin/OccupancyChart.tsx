'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface OccupancyChartProps {
  data: Array<{
    time: string;
    occupancy: number;
    capacity: number;
  }>;
}

export default function OccupancyChart({ data }: OccupancyChartProps) {
  return (
    <div className="w-full h-80 p-5 rounded-3xl bg-card border border-border-custom shadow-sm dark:bg-bg-dark-card dark:border-border transition-all">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-gray-400 mb-4">
        24h Hourly Occupancy Density (%)
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="time"
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
            <Line
              type="monotone"
              dataKey="occupancy"
              name="Occupancy Rate"
              stroke="#2563EB"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
