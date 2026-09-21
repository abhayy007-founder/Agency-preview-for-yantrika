import React, { useState, useEffect } from 'react';
import { Agency, NavTab } from '../types';

interface SettingsScreenProps {
  agency: Agency;
  onUpdateAgency: (updated: Agency) => void;
  onResetDemo: () => void;
  onNavigate: (tab: NavTab) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  agency,
  onUpdateAgency,
  onResetDemo,
  onNavigate,
  onShowToast
}) => {
  const [agencyName, setAgencyName] = useState(agency.name);
  const [logoUrl, setLogoUrl] = useState(agency.logoUrl || '');
  const [syncFreq, setSyncFreq] = useState('5m');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  useEffect(() => {
    setAgencyName(agency.name);
    setLogoUrl(agency.logoUrl || '');
  }, [agency]);

  const handleSave = () => {
    onUpdateAgency({
      ...agency,
      name: agencyName.trim() || 'PeakScale Media',
      logoUrl: logoUrl.trim()
    });
    onShowToast(`Agency settings updated for ${agencyName}`);
  };

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] px-3 sm:px-4 max-w-xl mx-auto space-y-4 pt-2 pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#42A5F5] text-[18px]">tune</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#42A5F5] font-semibold">
            Infrastructure &amp; Connectors
          </span>
        </div>
        <h1 className="text-[22px] font-bold text-white tracking-tight">Agency Settings</h1>
        <p className="text-[12px] text-[#cbc3d5]">
          Manage Google MCC, Meta Business Manager tokens, and WhatsApp alert routing thresholds.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Architecture & Migration Spec Access (PART 1 & 2) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#171f36] to-[#212941] border border-[#2c344c] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#42A5F5]/20 flex items-center justify-center text-[#42A5F5]">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-white">Engineering Migration Spec</span>
              <span className="text-[11px] text-[#cbc3d5]">Supabase SQL schema &amp; TanStack Start server functions</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('schema-spec')}
            className="px-3 py-1.5 rounded-lg bg-[#0070dd] text-white font-mono text-[11px] hover:brightness-110 transition-all shrink-0"
          >
            Inspect Spec
          </button>
        </div>

        {/* Connected Master Ad Accounts */}
        <div className="p-4 rounded-xl bg-[#131b32] border border-[#212941] flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold text-white">Active Agency Connectors</h2>
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#171f36]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#42A5F5] text-[18px]">hub</span>
                <span>Meta Business Manager ({agency.name} Master BM)</span>
              </div>
              <span className="font-mono text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full font-bold">
                CONNECTED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#171f36]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d1bcff] text-[18px]">ads_click</span>
                <span>Google Ads MCC (#728-192-4401)</span>
              </div>
              <span className="font-mono text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full font-bold">
                CONNECTED
              </span>
            </div>
          </div>
        </div>

        {/* Agency White Label Details */}
        <div className="p-4 rounded-xl bg-[#131b32] border border-[#212941] flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold text-white">White-Label Branding</h2>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase text-[#cbc3d5]">Agency Display Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder="e.g. PeakScale Media"
              className="bg-[#212941] text-white text-[13px] px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#42A5F5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase text-[#cbc3d5]">Logo URL (White-label PDF Header)</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://youragency.com/logo.png"
              className="bg-[#212941] text-white text-[13px] px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#42A5F5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase text-[#cbc3d5]">Sync Polling Cadence</label>
            <select
              value={syncFreq}
              onChange={(e) => setSyncFreq(e.target.value)}
              className="bg-[#212941] text-white text-[13px] px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="5m">Every 5 minutes (Real-time)</option>
              <option value="15m">Every 15 minutes</option>
              <option value="1h">Hourly digest</option>
            </select>
          </div>
        </div>

        {/* Notification Routing */}
        <div className="p-4 rounded-xl bg-[#131b32] border border-[#212941] flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold text-white">WhatsApp &amp; Emergency Escalation</h2>
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div className="flex flex-col">
              <span className="text-[13px] text-white font-medium">WhatsApp Media Buyer Dispatch</span>
              <span className="text-[11px] text-[#cbc3d5]">Instantly ping buyer when CPA spikes &gt; 20% in 24h</span>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="w-5 h-5 rounded accent-[#5d35af]"
            />
          </label>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] shadow-lg active:scale-95 transition-all hover:brightness-110 cursor-pointer"
          >
            Save Agency Configuration
          </button>

          <button
            onClick={() => {
              onResetDemo();
              onShowToast('Demo agency snapshot & accounts re-seeded successfully');
            }}
            className="w-full py-2.5 rounded-lg bg-[#212941] hover:bg-[#2c344c] text-[#cbc3d5] font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Re-seed Demo Agency Portfolio (PART 5 Fallback)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
