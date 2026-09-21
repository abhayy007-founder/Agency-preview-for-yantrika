import React, { useState } from 'react';
import { ClientAccount } from '../types';

interface AlertsScreenProps {
  clients: ClientAccount[];
  onOpenLeak: (client: ClientAccount) => void;
  onShowToast: (msg: string) => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  clients,
  onOpenLeak,
  onShowToast
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium'>('all');

  const leakingClients = clients.filter(c => c.leakage && (c.severity === 'high' || c.severity === 'medium'));
  const displayed = leakingClients.filter(c => {
    if (filterSeverity === 'high') return c.severity === 'high';
    if (filterSeverity === 'medium') return c.severity === 'medium';
    return true;
  });

  const totalLeakageAmount = leakingClients.reduce((acc, c) => acc + (c.leakage?.leakAmountRaw || 0), 0);

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] px-3 sm:px-4 max-w-xl mx-auto space-y-4 pt-2 pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#EF4444] text-[18px]">radar</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#EF4444] font-semibold">
              Live Algorithmic Radar
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#42A5F5] bg-[#212941] px-2.5 py-0.5 rounded-full font-medium">
            ₹{totalLeakageAmount.toLocaleString('en-IN')} Active Exposure
          </span>
        </div>

        <h1 className="text-[22px] font-bold text-white tracking-tight">
          Leakage Patterns &amp; Signals
        </h1>
        <p className="text-[12px] text-[#cbc3d5]">
          Real-time anomaly scanner flagging creative fatigue, dead pixel triggers, and uncharacteristic CPM skews.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterSeverity('all')}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-all ${
            filterSeverity === 'all'
              ? 'bg-[#0070dd] text-white font-semibold'
              : 'bg-[#171f36] text-[#cbc3d5]'
          }`}
        >
          All Signals ({leakingClients.length})
        </button>
        <button
          onClick={() => setFilterSeverity('high')}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-all ${
            filterSeverity === 'high'
              ? 'bg-[#EF4444] text-white font-semibold'
              : 'bg-[#171f36] text-[#cbc3d5]'
          }`}
        >
          Critical ({clients.filter(c => c.severity === 'high').length})
        </button>
        <button
          onClick={() => setFilterSeverity('medium')}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-all ${
            filterSeverity === 'medium'
              ? 'bg-[#F59E0B] text-black font-semibold'
              : 'bg-[#171f36] text-[#cbc3d5]'
          }`}
        >
          Warning ({clients.filter(c => c.severity === 'medium').length})
        </button>
      </div>

      {/* Alerts list */}
      <div className="flex flex-col gap-3">
        {displayed.map((client) => {
          const leak = client.leakage!;
          const isHigh = client.severity === 'high';
          return (
            <div
              key={client.id}
              className="bg-[#171f36] border border-[#212941] rounded-xl p-4 flex flex-col gap-3 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-white">{client.name}</span>
                    <span className="font-mono text-[10px] text-[#cbc3d5]">({client.category})</span>
                  </div>
                  <span className="text-[11px] text-[#cbc3d5] mt-0.5">
                    Assigned buyer: <strong className="text-white">{client.assignedManager}</strong>
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                  isHigh ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                }`}>
                  {isHigh ? 'CRITICAL' : 'WARNING'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#131b32] border border-[#212941] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                    <span className={`material-symbols-outlined text-[16px] ${isHigh ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                      {leak.actionType === 'inspect' ? 'link_off' : 'warning'}
                    </span>
                    {leak.title}
                  </span>
                  <span className="font-mono text-[12px] font-bold text-[#EF4444]">
                    {leak.leakAmount}
                  </span>
                </div>
                <p className="text-[12px] text-[#cbc3d5]">
                  {leak.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onShowToast(`Diagnostic WhatsApp sent to ${client.assignedManager}`)}
                  className="flex items-center gap-1 text-[11px] text-[#42A5F5] hover:underline"
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  <span>Alert Media Buyer</span>
                </button>

                <button
                  onClick={() => onOpenLeak(client)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[12px] flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span>Remediate Leak</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
