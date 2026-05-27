import React from 'react';
import { ZoneData } from '../../store/slotStore';
import ProgressBar from '../ui/ProgressBar';
import { Layers, Shield } from 'lucide-react';

interface ZoneSummaryPanelProps {
  zones: ZoneData[];
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
}

export default function ZoneSummaryPanel({
  zones,
  selectedZone,
  setSelectedZone,
}: ZoneSummaryPanelProps) {
  const getZoneLabel = (name: string) => {
    return name.split(' - ')[0]; // clean up "Zone A - Main Gate" to "Zone A"
  };

  const getZoneSubText = (name: string) => {
    return name.split(' - ')[1] || 'Campus Area';
  };

  // Helper to resolve zone specific glow colors
  const getZoneGlowClass = (name: string) => {
    const lname = name.toLowerCase();
    if (lname.includes('zone a')) return 'border-l-[4px] border-l-[#4F8EF7]';
    if (lname.includes('zone b')) return 'border-l-[4px] border-l-purple-500';
    if (lname.includes('zone c')) return 'border-l-[4px] border-l-teal-500';
    if (lname.includes('zone d') || lname.includes('faculty')) return 'border-l-[4px] border-l-[#FFB300]';
    return 'border-l-[4px] border-l-accent';
  };

  const getZoneTextGlow = (name: string) => {
    const lname = name.toLowerCase();
    if (lname.includes('zone a')) return 'text-[#4F8EF7]';
    if (lname.includes('zone b')) return 'text-purple-400';
    if (lname.includes('zone c')) return 'text-teal-400';
    if (lname.includes('zone d') || lname.includes('faculty')) return 'text-[#FFB300]';
    return 'text-accent';
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-xs font-black uppercase tracking-widest text-text-secondary">
          <Layers className="w-4 h-4 mr-1.5 text-accent" />
          <span>Zone Telemetry</span>
        </h2>
        <span className="text-[10px] font-bold text-text-secondary font-mono bg-bg-base/60 border border-glass-border px-2 py-0.5 rounded-md shadow-inner">
          {zones.length} Zones
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
        {zones.map((zone) => {
          const occupancyRate = Math.round(
            ((zone.occupied + zone.reserved) / (zone.totalSlots || 1)) * 100
          );
          
          const isSelected = 
            selectedZone === 'All' || 
            (selectedZone === 'Zone D' && zone.name.toLowerCase().includes('faculty')) ||
            zone.name.toLowerCase().includes(selectedZone.toLowerCase());

          return (
            <div
              key={zone.id}
              onClick={() => {
                // Toggle selection
                const zoneCode = zone.name.includes('Faculty') ? 'Zone D' : zone.name.split(' - ')[0];
                setSelectedZone(selectedZone === zoneCode ? 'All' : zoneCode);
              }}
              className={`group relative p-4 rounded-2xl border bg-bg-surface/50 backdrop-blur-md transition-all duration-300 cursor-pointer hover:bg-bg-surface/80 hover:scale-[1.02] ${
                isSelected 
                  ? 'border-glass-border shadow-[0_10px_25px_rgba(0,0,0,0.3)] opacity-100' 
                  : 'border-glass-border/40 opacity-40 hover:opacity-75'
              } ${getZoneGlowClass(zone.name)}`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-black text-sm transition-colors ${getZoneTextGlow(zone.name)}`}>
                    {getZoneLabel(zone.name)}
                  </h3>
                  <p className="text-[10px] font-bold text-text-secondary mt-0.5 uppercase tracking-wide">
                    {getZoneSubText(zone.name)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-available font-mono block">
                    {zone.available} free
                  </span>
                  <span className="text-[9px] font-bold text-text-secondary block font-mono">
                    of {zone.totalSlots} slots
                  </span>
                </div>
              </div>

              {/* Progress occupancy bar */}
              <ProgressBar value={occupancyRate} />

              {/* Occupancy Indicator Percent */}
              <div className="flex justify-between items-center mt-2.5">
                <div className="flex flex-wrap gap-1 items-center">
                  <Shield className="w-3 h-3 text-text-muted" />
                  {zone.allowedRoles.map((role) => (
                    <span
                      key={role}
                      className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest bg-bg-base/80 text-text-secondary border border-glass-border/50"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-text-secondary font-mono">
                  {occupancyRate}% Full
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
