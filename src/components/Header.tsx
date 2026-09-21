import React, { useState } from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  openLeaksCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, openLeaksCount }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#10182F]/90 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.4)] pt-safe border-b border-[#212941]/50">
      <div className="h-16 px-3 sm:px-4 max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Logo & Agency Name */}
        <div 
          className="flex items-center gap-2 min-w-0 cursor-pointer select-none"
          onClick={() => onNavigate('overview')}
        >
          <img
            alt="Yantrika Agency Logo"
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1W89mzLpJnwWpE1gQX_UylOfZXEXmY6KVdEAzd1IKVg6m5U0zsA4DfwNK6fUw175s5b-rROqbGYNf_HAQ9ZqSnz1Ar02jMTToBuxYp4CD1BJRN8MKpiZkj00YfoYl50JRNdSS4n5oqzi-xUZ186U_K44fZhewLpHaPQB2hoQm_IRvpne21ofPmQsKMGf9ox1R2y5W8d1JLtlbVxo7EPE7PJDhy38GD0Dw6vvzSKZyW-wcSn2avX4qSv66U"
            onError={(e) => {
              // Graceful SVG render if network is restricted
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[15px] sm:text-[16px] text-[#dbe1ff] tracking-tight truncate">
                Yantrika
              </span>
              <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-[#2c344c] text-[#42A5F5] font-medium shrink-0">
                Agency
              </span>
            </div>
            <span className="text-[11px] text-[#cbc3d5]/80 truncate">
              PeakScale Media • Portal
            </span>
          </div>
        </div>

        {/* Right: Live Radar Alert Pulse & Account Avatar */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          <button
            aria-label="Live waste signal notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#171f36]/70 text-[#cbc3d5] active:text-[#dbe1ff] hover:bg-[#212941] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">radar</span>
            {openLeaksCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#10182F] animate-pulse"></span>
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 bg-[#171f36] border border-[#2c344c] rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#212941]">
                <span className="text-[12px] font-semibold text-[#dbe1ff]">Live Waste Telemetry</span>
                <span className="text-[10px] bg-[#EF4444]/20 text-[#EF4444] px-1.5 py-0.5 rounded-full font-mono">
                  {openLeaksCount} Active
                </span>
              </div>
              <div className="flex flex-col gap-1.5 text-[12px]">
                <div className="p-2 rounded-lg bg-[#131b32] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#EF4444] text-[16px] shrink-0 mt-0.5">error</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#dbe1ff] truncate">Apex Dental Care</span>
                    <span className="text-[11px] text-[#cbc3d5]">Creative fatigue in 3 adsets (₹18.4K)</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#131b32] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#EF4444] text-[16px] shrink-0 mt-0.5">link_off</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#dbe1ff] truncate">Zenith IAS Academy</span>
                    <span className="text-[11px] text-[#cbc3d5]">Pixel 48h silent (₹42K blind spend)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate('alerts');
                }}
                className="w-full py-1.5 text-center text-[11px] text-[#42A5F5] hover:underline font-medium"
              >
                View all leak alerts →
              </button>
            </div>
          )}

          <div 
            onClick={() => onNavigate('team')} 
            className="flex items-center gap-1.5 pl-1 cursor-pointer"
            title="Rahul Mehta (Lead Admin)"
          >
            <div className="w-8 h-8 rounded-full bg-[#5d35af] flex items-center justify-center shrink-0 ring-2 ring-[#10182F] hover:ring-[#42A5F5] transition-all">
              <span className="material-symbols-outlined text-[#3c028f] text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
