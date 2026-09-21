import React, { useState } from 'react';
import { ClientAccount } from '../types';

interface ReportsScreenProps {
  clients: ClientAccount[];
  totalSaved: string;
  onShowToast: (msg: string) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  clients,
  totalSaved,
  onShowToast
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = (clientName?: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      onShowToast(
        clientName
          ? `Generated White-label PDF Audit for ${clientName}`
          : 'Generated PeakScale Media Retainer Defense Master Dossier'
      );
    }, 900);
  };

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] px-3 sm:px-4 max-w-xl mx-auto space-y-4 pt-2 pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#42A5F5] text-[18px]">verified</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#42A5F5] font-semibold">
              Proof-Of-Work Engine
            </span>
          </div>
          <span className="font-mono text-[10px] bg-[#212941] text-[#DDE1E4] px-2 py-0.5 rounded-full">
            White-Label Ready
          </span>
        </div>

        <h1 className="text-[22px] font-bold text-white tracking-tight">
          Retainer Defense Reports
        </h1>
        <p className="text-[12px] text-[#cbc3d5]">
          Automated client-facing briefs showing ad spend saved, pixel anomalies fixed, and retainer value justified under PeakScale Media branding.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#171f36] to-[#131b32] border border-[#212941] flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#cbc3d5]">Portfolio Waste Stopped</span>
          <span className="font-mono text-[11px] text-[#10B981] font-semibold">October 2024</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[28px] font-bold text-white">{totalSaved}</span>
          <span className="text-[12px] text-[#10B981] font-medium">Justified across 14 retainers</span>
        </div>

        <button
          onClick={() => handleExport()}
          disabled={exporting}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow cursor-pointer"
        >
          {exporting ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Compiling Master PDF...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Agency Master Defense Dossier</span>
            </>
          )}
        </button>
      </div>

      {/* Individual Client Statements */}
      <div className="flex flex-col gap-2.5 pt-2">
        <h3 className="text-[14px] font-semibold text-white">Client Retainer Slips</h3>
        {clients.slice(0, 5).map((client) => (
          <div
            key={client.id}
            className="p-3.5 rounded-xl bg-[#131b32] border border-[#212941] flex items-center justify-between gap-2"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-white truncate">{client.name}</span>
              <span className="font-mono text-[11px] text-[#cbc3d5]">
                Retainer: {client.monthlyRetainer} • Protected: {client.leakage?.leakAmount || '₹14,500'}
              </span>
            </div>

            <button
              onClick={() => handleExport(client.name)}
              className="px-3 py-1.5 rounded-lg bg-[#212941] text-[#42A5F5] hover:bg-[#2c344c] font-semibold text-[11px] flex items-center gap-1 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
              <span>PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
