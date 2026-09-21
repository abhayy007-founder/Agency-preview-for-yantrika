import React, { useState } from 'react';
import { ClientAccount } from '../types';

interface LeakModalProps {
  client: ClientAccount | null;
  onClose: () => void;
  onResolve: (clientId: string, note?: string) => void;
  onShowToast: (msg: string) => void;
}

export const LeakModal: React.FC<LeakModalProps> = ({
  client,
  onClose,
  onResolve,
  onShowToast
}) => {
  const [resolving, setResolving] = useState(false);

  if (!client || !client.leakage) return null;
  const leak = client.leakage;

  const handleResolveAction = () => {
    setResolving(true);
    setTimeout(() => {
      setResolving(false);
      onResolve(client.id);
      onShowToast(`Resolved: ${leak.title} for ${client.name}`);
      onClose();
    }, 700);
  };

  const handleDispatchWhatsApp = () => {
    onShowToast(`WhatsApp diagnostic alert dispatched to ${client.assignedManager}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#10182F]/80 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
      <div 
        className="bg-[#171f36] border border-[#2c344c] rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto shadow-2xl w-full max-w-lg animate-fadeIn"
      >
        {/* Drag Handle on mobile */}
        <div className="w-12 h-1.5 rounded-full bg-[#2c344c] mx-auto sm:hidden"></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                client.severity === 'high' 
                  ? 'bg-[#EF4444]/15 text-[#EF4444]' 
                  : client.severity === 'medium'
                  ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                  : 'bg-[#10B981]/15 text-[#10B981]'
              }`}>
                {client.severity === 'high' ? 'CRITICAL LEAK' : client.severity === 'medium' ? 'WARNING SKEW' : 'HEALTHY FLOW'}
              </span>
              <span className="text-[11px] text-[#cbc3d5] font-mono">{client.code}</span>
            </div>
            <h3 className="text-[18px] font-semibold text-white truncate mt-1">
              {client.name}
            </h3>
            <span className="text-[12px] text-[#cbc3d5]">
              {client.category} • Monthly Retainer: <strong className="text-white">{client.monthlyRetainer}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#212941] flex items-center justify-center text-[#cbc3d5] hover:text-white transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Diagnosis Card */}
        <div className="p-3.5 rounded-xl bg-[#131b32] border border-[#212941] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white font-medium text-[14px]">
              <span className="material-symbols-outlined text-[#EF4444] text-[18px]">
                {leak.actionType === 'inspect' ? 'link_off' : 'campaign'}
              </span>
              <span>{leak.title}</span>
            </div>
            <span className="font-mono text-[13px] font-bold text-[#EF4444]">
              {leak.leakAmount}
            </span>
          </div>

          <p className="text-[13px] text-[#cbc3d5] leading-relaxed">
            {leak.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#212941]">
            <div className="flex flex-col bg-[#171f36] p-2 rounded-lg">
              <span className="text-[10px] text-[#cbc3d5] uppercase font-mono">Platform</span>
              <span className="text-[12px] font-medium text-white flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-[#42A5F5]">hub</span>
                {leak.platform} Ads Suite
              </span>
            </div>
            <div className="flex flex-col bg-[#171f36] p-2 rounded-lg">
              <span className="text-[10px] text-[#cbc3d5] uppercase font-mono">Telemetry Status</span>
              <span className="text-[12px] font-medium text-[#EF4444] mt-0.5">
                {leak.metricBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Algorithmic Recommendation */}
        <div className="p-3 rounded-xl bg-[#212941]/60 border border-[#2c344c] flex flex-col gap-1.5">
          <div className="flex items-center gap-1 text-[#42A5F5] text-[12px] font-semibold">
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            <span>Yantrika Engine Recommendation</span>
          </div>
          <p className="text-[12px] text-[#dbe1ff]">
            {leak.details?.recommendation || 'Pause decaying creatives and rebalance daily budget caps across high-performing ad sets.'}
          </p>
        </div>

        {/* Assigned Manager */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#131b32]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#5D35AF] flex items-center justify-center text-[10px] font-bold text-white">
              {client.assignedManagerAvatar}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-white font-medium">{client.assignedManager}</span>
              <span className="text-[10px] text-[#cbc3d5]">Designated Buyer</span>
            </div>
          </div>
          <button
            onClick={handleDispatchWhatsApp}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#212941] text-[#42A5F5] hover:bg-[#2c344c] text-[11px] font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span>Notify on WhatsApp</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={handleResolveAction}
            disabled={resolving}
            className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
          >
            {resolving ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Applying Mitigation...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Mitigate Leak &amp; Defend Retainer</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-lg bg-[#212941] text-[#cbc3d5] hover:text-white font-medium text-[13px] text-center transition-colors"
          >
            Dismiss for now
          </button>
        </div>
      </div>
    </div>
  );
};
