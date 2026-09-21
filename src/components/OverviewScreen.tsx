import React, { useState } from 'react';
import { ClientAccount, NavTab, TeamMember } from '../types';
import { getCurrentMonthBadge } from '../utils/formatters';

interface OverviewScreenProps {
  clients: ClientAccount[];
  allClientsCount: number;
  onNavigate: (tab: NavTab) => void;
  onOpenLeak: (client: ClientAccount) => void;
  onOpenReassign: (client: ClientAccount) => void;
  onShowToast: (msg: string) => void;
  totalSaved: string;
  agencyName: string;
  currentUser: TeamMember;
  onSimulateSnapshot: (clientId: string) => void;
  onResetToAdmin?: () => void;
}

type FilterType = 'urgent' | 'worsening' | 'audited' | 'all';
type SortType = 'severity' | 'retainer' | 'spend';

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  clients,
  allClientsCount,
  onNavigate,
  onOpenLeak,
  onOpenReassign,
  onShowToast,
  totalSaved,
  agencyName,
  currentUser,
  onSimulateSnapshot,
  onResetToAdmin
}) => {
  const [filter, setFilter] = useState<FilterType>('urgent');
  const [sort, setSort] = useState<SortType>('severity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [emptyStatePreview, setEmptyStatePreview] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);

  // Dynamic Month Badge computed at render time (Fixing PART 4 Bug 1)
  const currentMonthBadge = getCurrentMonthBadge();

  // Filter clients
  const filteredClients = clients.filter((c) => {
    if (emptyStatePreview) return false;
    if (filter === 'urgent') return c.severity === 'high';
    if (filter === 'worsening') return c.severity === 'medium' || c.severity === 'high';
    if (filter === 'audited') return c.severity === 'low' || c.isResolved;
    return true;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sort === 'severity') {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    }
    if (sort === 'retainer') {
      return b.monthlyRetainerRaw - a.monthlyRetainerRaw;
    }
    if (sort === 'spend') {
      const spendA = parseInt(a.monthlySpend.replace(/[^0-9]/g, '')) || 0;
      const spendB = parseInt(b.monthlySpend.replace(/[^0-9]/g, '')) || 0;
      return spendB - spendA;
    }
    return 0;
  });

  const handleManualSync = () => {
    setSyncing(true);
    onShowToast(`Syncing ad telemetry across ${clients.length} ${agencyName} accounts...`);
    setTimeout(() => {
      setSyncing(false);
      onShowToast('Synced live Meta CAPI & Google Ads telemetry (0 errors)');
    }, 1200);
  };

  const handleRunDiagnostic = (clientId: string, clientName: string) => {
    setScanningId(clientId);
    onShowToast(`Running simulateSnapshot() heuristic on ${clientName}...`);
    setTimeout(() => {
      onSimulateSnapshot(clientId);
      setScanningId(null);
      onShowToast(`Snapshot calibrated for ${clientName}`);
    }, 800);
  };

  const urgentCount = clients.filter((c) => c.severity === 'high').length;
  const worseningCount = clients.filter((c) => c.severity === 'medium' || c.severity === 'high').length;
  const auditedCount = clients.filter((c) => c.severity === 'low' || c.isResolved).length;

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] px-3 sm:px-4 max-w-xl mx-auto space-y-4 pt-2">
      {/* Top Action & Sync Status Header */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleManualSync}
          className="flex items-center gap-2 bg-[#171f36] px-2.5 py-1.5 rounded-full hover:bg-[#212941] transition-colors cursor-pointer select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] ${syncing ? 'opacity-100' : 'opacity-75'}`}></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="font-mono text-[10px] text-[#DDE1E4]/80">
            Meta &amp; Google sync <span className="text-[#42A5F5] font-medium">{syncing ? 'Syncing...' : '4m ago'}</span>
          </span>
        </button>

        <button
          onClick={() => onNavigate('add-client')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] active:scale-95 transition-transform shadow-md hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="tracking-tight">Add Client</span>
        </button>
      </div>

      {/* Manager Silo Scope Banner (if current persona is MANAGER) */}
      {currentUser.accessTier === 'MANAGER' && (
        <div className="p-2.5 rounded-xl bg-[#0070dd]/15 border border-[#0070dd]/40 flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#42A5F5] text-[18px] shrink-0">shield</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold text-white truncate">
                Manager View: {currentUser.name}
              </span>
              <span className="text-[10px] text-[#aac7ff] truncate">
                RLS scoped to {clients.length} of {allClientsCount} total agency clients
              </span>
            </div>
          </div>
          {onResetToAdmin && (
            <button
              onClick={onResetToAdmin}
              className="text-[11px] font-mono text-[#42A5F5] hover:underline shrink-0 bg-[#212941] px-2 py-1 rounded"
            >
              Reset to Admin
            </button>
          )}
        </div>
      )}

      {/* Value Delivered Retainer-Defense Hero Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#171f36] p-4 shadow-xl border border-[#212941]/50">
        {/* Kinetic Ambient Backing Mesh */}
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-[#5D35AF]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-8 -bottom-8 w-44 h-44 bg-[#0045F2]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span 
                className="material-symbols-outlined text-[#42A5F5] text-[18px]" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_with_heart
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#cbc3d5] font-medium">
                Retainer Defense Metric
              </span>
            </div>
            {/* Dynamic Month Badge (PART 4 Bug 1 Fix) */}
            <span className="px-2 py-0.5 rounded-full bg-[#2c344c] font-mono text-[11px] text-[#42A5F5] font-semibold">
              {currentMonthBadge}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[30px] leading-[36px] tracking-tight text-white font-bold">
                {totalSaved}
              </span>
              <span className="text-[12px] text-[#10B981] font-medium flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>18.2%
              </span>
            </div>
            <p className="text-[14px] text-[#DDE1E4] font-medium mt-0.5">
              Ad spend leaks prevented this month
            </p>
            <p className="text-[12px] text-[#cbc3d5] mt-0.5">
              Automated proof-of-work justifying retainers across {clients.length} {agencyName} accounts.
            </p>
          </div>

          {/* Sparkline Visualization */}
          <div className="pt-1 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#2c344c] rounded-full overflow-hidden flex gap-0.5">
              <div className="h-full bg-[#EF4444] w-[32%]" title="Critical Caught"></div>
              <div className="h-full bg-[#F59E0B] w-[44%]" title="Medium Fixed"></div>
              <div className="h-full bg-[#10B981] w-[24%]" title="Optimal Flow"></div>
            </div>
            <span className="font-mono text-[10px] text-[#cbc3d5]">
              {clients.length}/{clients.length} Guarded
            </span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Chips Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-lg bg-[#171f36] border border-[#212941] flex flex-col">
          <span className="text-[10px] font-mono text-[#cbc3d5] uppercase">Active Clients</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono text-[16px] font-bold text-white">{clients.length}</span>
            <span className="font-mono text-[10px] text-[#10B981]">+2 mo</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#171f36] border border-[#212941] flex flex-col">
          <span className="text-[10px] font-mono text-[#cbc3d5] uppercase">Managed Spend</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono text-[16px] font-bold text-white">₹18.4L</span>
            <span className="font-mono text-[10px] text-[#cbc3d5]">30d</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#171f36] border border-[#212941] flex flex-col">
          <span className="text-[10px] font-mono text-[#cbc3d5] uppercase">Open Leaks</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-mono text-[16px] font-bold text-[#EF4444]">{urgentCount} pts</span>
            <span className="font-mono text-[10px] text-[#EF4444]">Critical</span>
          </div>
        </div>
      </div>

      {/* Section Header: Morning Triage */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-white tracking-tight">Morning Triage</h2>
            <p className="text-[11px] text-[#cbc3d5]">Sorted by algorithmic urgency</p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-[11px] font-mono text-[#42A5F5] bg-[#212941] px-2.5 py-1.5 rounded-lg hover:bg-[#2c344c] transition-colors"
            >
              <span>Sort: {sort === 'severity' ? 'Urgency' : sort === 'retainer' ? 'Retainer' : 'Spend'}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 top-9 w-36 bg-[#171f36] border border-[#2c344c] rounded-xl shadow-xl z-30 py-1 text-[11px] font-mono">
                <button
                  onClick={() => { setSort('severity'); setShowSortDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#212941] text-white"
                >
                  Urgency (High First)
                </button>
                <button
                  onClick={() => { setSort('retainer'); setShowSortDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#212941] text-white"
                >
                  Retainer Value
                </button>
                <button
                  onClick={() => { setSort('spend'); setShowSortDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#212941] text-white"
                >
                  Ad Spend Size
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-medium">
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filter === 'urgent'
                ? 'bg-[#EF4444]/20 text-[#EF4444] font-semibold border border-[#EF4444]/40'
                : 'bg-[#171f36] text-[#cbc3d5] hover:bg-[#212941]'
            }`}
          >
            Urgent Triage ({urgentCount})
          </button>
          <button
            onClick={() => setFilter('worsening')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filter === 'worsening'
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] font-semibold border border-[#F59E0B]/40'
                : 'bg-[#171f36] text-[#cbc3d5] hover:bg-[#212941]'
            }`}
          >
            Worsening Trend ({worseningCount})
          </button>
          <button
            onClick={() => setFilter('audited')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filter === 'audited'
                ? 'bg-[#10B981]/20 text-[#10B981] font-semibold border border-[#10B981]/40'
                : 'bg-[#171f36] text-[#cbc3d5] hover:bg-[#212941]'
            }`}
          >
            Recently Audited ({auditedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-[#42A5F5]/20 text-[#42A5F5] font-semibold border border-[#42A5F5]/40'
                : 'bg-[#171f36] text-[#cbc3d5] hover:bg-[#212941]'
            }`}
          >
            All Clients ({clients.length})
          </button>
        </div>
      </div>

      {/* Client Cards List */}
      <div className="flex flex-col space-y-3 pb-8">
        {emptyStatePreview || sortedClients.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#171f36] border border-[#212941] text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[16px] font-bold text-white">All Clear! No Open Leaks</h3>
              <p className="text-[12px] text-[#cbc3d5] max-w-xs mt-1">
                Zero critical anomalies detected across the current active scope. Telemetry is fully calibrated.
              </p>
            </div>
            <button
              onClick={() => setEmptyStatePreview(false)}
              className="text-[12px] text-[#42A5F5] hover:underline font-mono"
            >
              Exit preview mode
            </button>
          </div>
        ) : (
          sortedClients.map((client) => {
            const isHigh = client.severity === 'high';
            const isMedium = client.severity === 'medium';
            const isLow = client.severity === 'low';
            const isScanning = scanningId === client.id;

            const borderColor = isHigh
              ? 'border-l-4 border-l-[#EF4444]'
              : isMedium
              ? 'border-l-4 border-l-[#F59E0B]'
              : 'border-l-4 border-l-[#10B981]';

            return (
              <div
                key={client.id}
                className={`bg-[#171f36] rounded-xl p-3.5 shadow-md border border-[#212941] ${borderColor} flex flex-col space-y-3 transition-all`}
              >
                {/* Client Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[15px] font-bold text-white truncate">
                        {client.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#cbc3d5] px-1.5 py-0.5 rounded bg-[#212941] shrink-0">
                        {client.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#cbc3d5]">
                      {client.category} • Retainer: <strong className="text-white">{client.monthlyRetainer}</strong>
                    </span>
                  </div>

                  {/* Platforms & Reassign Menu */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-1">
                      {client.platforms.map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#212941] text-[#42A5F5]"
                        >
                          {p.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenReassign(client)}
                      title={`Assigned to ${client.assignedManager}. Click to reassign.`}
                      className="w-7 h-7 rounded-full bg-[#212941] flex items-center justify-center text-[10px] font-bold text-[#dbe1ff] hover:bg-[#2c344c] transition-colors"
                    >
                      {client.assignedManagerAvatar}
                    </button>
                  </div>
                </div>

                {/* Leak Signal Detail */}
                {client.leakage ? (
                  <div className="p-2.5 rounded-lg bg-[#131b32] border border-[#212941] flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`material-symbols-outlined text-[16px] ${
                          isHigh ? 'text-[#EF4444]' : isMedium ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }`}>
                          {client.leakage.actionType === 'inspect' ? 'link_off' : client.leakage.actionType === 'audit' ? 'check_circle' : 'warning'}
                        </span>
                        <span className="text-[13px] font-semibold text-white">
                          {client.leakage.title}
                        </span>
                      </div>
                      <span className={`font-mono text-[11px] font-bold ${
                        isHigh ? 'text-[#EF4444]' : isMedium ? 'text-[#F59E0B]' : 'text-[#10B981]'
                      }`}>
                        {client.leakage.leakAmount}
                      </span>
                    </div>

                    <p className="text-[12px] text-[#cbc3d5] leading-relaxed">
                      {client.leakage.description}
                    </p>

                    <div className="flex items-center justify-between pt-0.5 text-[10px] font-mono text-[#cbc3d5]">
                      <span className="text-[#42A5F5]">{client.leakage.metricBadge}</span>
                      <span>{client.leakage.reviewedStatus}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#131b32] text-[12px] text-[#10B981] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>All signals optimal. Zero leakage.</span>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenReassign(client)}
                      className="text-[11px] text-[#cbc3d5] hover:text-[#42A5F5] font-mono flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                      <span>Reassign</span>
                    </button>

                    {/* simulateSnapshot Diagnostic Button (PART 5) */}
                    <button
                      onClick={() => handleRunDiagnostic(client.id, client.name)}
                      disabled={isScanning}
                      className="text-[11px] text-[#42A5F5] hover:underline font-mono flex items-center gap-0.5 cursor-pointer"
                      title="Run fallback diagnostic heuristic (simulateSnapshot)"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${isScanning ? 'animate-spin' : ''}`}>
                        {isScanning ? 'progress_activity' : 'model_training'}
                      </span>
                      <span>{isScanning ? 'Scanning...' : 'Simulate Scan'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {client.leakage && (
                      <button
                        onClick={() => onOpenLeak(client)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-[12px] flex items-center gap-1 active:scale-95 transition-all shadow-sm ${
                          isHigh
                            ? 'bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white hover:brightness-110'
                            : isMedium
                            ? 'bg-[#212941] text-[#42A5F5] hover:bg-[#2c344c]'
                            : 'bg-[#212941] text-[#10B981] hover:bg-[#2c344c]'
                        }`}
                      >
                        <span>{client.leakage.actionLabel}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Empty State / All Resolved Preview Toggle */}
      <div className="pt-2 pb-6 flex justify-center">
        <button
          onClick={() => setEmptyStatePreview(!emptyStatePreview)}
          className="text-[11px] font-mono text-[#cbc3d5] hover:text-[#42A5F5] transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">
            {emptyStatePreview ? 'visibility_off' : 'visibility'}
          </span>
          <span>
            {emptyStatePreview ? 'Restore active leakage feed' : 'Simulate all leaks resolved (Empty State preview)'}
          </span>
        </button>
      </div>
    </div>
  );
};
