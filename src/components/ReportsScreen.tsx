import React, { useState } from 'react';
import { ClientAccount, Agency } from '../types';
import { getCurrentMonthFull } from '../utils/formatters';

interface ReportsScreenProps {
  clients: ClientAccount[];
  totalSaved: string;
  agency: Agency;
  onShowToast: (msg: string) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  clients,
  totalSaved,
  agency,
  onShowToast
}) => {
  const [exporting, setExporting] = useState(false);
  const [activeDossier, setActiveDossier] = useState<{
    clientName?: string;
    isPortfolio: boolean;
  } | null>(null);

  // Dynamic Current Month (PART 4 Bug 1 Fix)
  const currentMonthFull = getCurrentMonthFull();

  const handleExport = (clientName?: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setActiveDossier({
        clientName,
        isPortfolio: !clientName
      });
      onShowToast(
        clientName
          ? `Generated White-label PDF Audit for ${clientName}`
          : `Generated ${agency.name} Retainer Defense Master Dossier`
      );
    }, 700);
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
          Automated client-facing briefs showing ad spend saved, pixel anomalies fixed, and retainer value justified under <strong className="text-white">{agency.name}</strong> branding.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#171f36] to-[#131b32] border border-[#212941] flex flex-col gap-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#cbc3d5]">Portfolio Waste Stopped</span>
          {/* Dynamic Month (PART 4 Bug 1 Fix) */}
          <span className="font-mono text-[11px] text-[#10B981] font-semibold">
            {currentMonthFull}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[28px] font-bold text-white">{totalSaved}</span>
          <span className="text-[12px] text-[#10B981] font-medium">
            Justified across {clients.length} retainers
          </span>
        </div>

        <button
          onClick={() => handleExport()}
          disabled={exporting}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow cursor-pointer hover:brightness-110"
        >
          {exporting ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Compiling Master PDF...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export {agency.name} Master Defense Dossier</span>
            </>
          )}
        </button>
      </div>

      {/* Individual Client Statements */}
      <div className="flex flex-col gap-2.5 pt-2">
        <h3 className="text-[14px] font-semibold text-white">Client Retainer Slips</h3>
        {clients.slice(0, 6).map((client) => (
          <div
            key={client.id}
            className="p-3.5 rounded-xl bg-[#131b32] border border-[#212941] flex items-center justify-between gap-2 shadow-sm"
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

      {/* White-Label Dossier Preview Modal */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 bg-[#10182F]/80 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-[#171f36] border border-[#2c344c] rounded-t-2xl sm:rounded-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#212941]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5D35AF]/30 flex items-center justify-center text-[#d1bcff]">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    {activeDossier.isPortfolio
                      ? `${agency.name} Master Retainer Defense`
                      : `Retainer Defense: ${activeDossier.clientName}`}
                  </h3>
                  <span className="font-mono text-[10px] text-[#cbc3d5]">
                    White-label output • {currentMonthFull}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveDossier(null)}
                className="w-8 h-8 rounded-full bg-[#212941] flex items-center justify-center text-[#cbc3d5] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-4 rounded-xl bg-[#0d1326] border border-[#212941] flex flex-col gap-3 font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-[#212941]/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-bold text-white tracking-wider uppercase">
                    {agency.name}
                  </span>
                  <span className="text-[9px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded font-mono">
                    CONFIDENTIAL AUDIT
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#cbc3d5]">{currentMonthFull}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#cbc3d5]">Total Ad Spend Waste Mitigated</span>
                <span className="font-mono text-[24px] font-bold text-[#10B981]">
                  {activeDossier.isPortfolio ? totalSaved : '₹18,400'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#131b32] text-[11px] text-[#cbc3d5] space-y-1">
                <p className="font-semibold text-white">Proof-of-Work Retainer Justification:</p>
                <p>• Automated anomaly detection caught 3 high-frequency creative drops before audience burn.</p>
                <p>• Pixel tracking integrity audited continuously; 0 silent drops over 30 days.</p>
                <p>• CPA kept within target tolerance, providing 3.4x ROI on agency monthly retainer.</p>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-[#cbc3d5]/70">
                <span>Issued by: {agency.name} Governance</span>
                <span>Yantrika Algorithmic Engine</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  window.print();
                  onShowToast('Printing PDF...');
                }}
                className="flex-1 py-2.5 rounded-lg bg-[#0070dd] hover:bg-[#0070dd]/90 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print / Download PDF</span>
              </button>
              <button
                onClick={() => setActiveDossier(null)}
                className="px-4 py-2.5 rounded-lg bg-[#212941] text-[#cbc3d5] hover:text-white font-semibold text-[12px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
