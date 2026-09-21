import React, { useState } from 'react';
import { ClientAccount, NavTab } from '../types';

interface OverviewScreenProps {
  clients: ClientAccount[];
  onNavigate: (tab: NavTab) => void;
  onOpenLeak: (client: ClientAccount) => void;
  onOpenReassign: (client: ClientAccount) => void;
  onShowToast: (msg: string) => void;
  totalSaved: string;
}

type FilterType = 'urgent' | 'worsening' | 'audited' | 'all';
type SortType = 'severity' | 'retainer' | 'spend';

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  clients,
  onNavigate,
  onOpenLeak,
  onOpenReassign,
  onShowToast,
  totalSaved
}) => {
  const [filter, setFilter] = useState<FilterType>('urgent');
  const [sort, setSort] = useState<SortType>('severity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [emptyStatePreview, setEmptyStatePreview] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Filter clients
  const filteredClients = clients.filter(c => {
    if (emptyStatePreview) return false;
    if (filter === 'urgent') return c.severity === 'high';
    if (filter === 'worsening') return c.severity === 'high' || c.severity === 'medium';
    if (filter === 'audited') return c.severity === 'low';
    return true; // all
  }).sort((a, b) => {
    if (sort === 'retainer') return b.monthlyRetainerRaw - a.monthlyRetainerRaw;
    if (sort === 'spend') return (b.leakage?.leakAmountRaw || 0) - (a.leakage?.leakAmountRaw || 0);
    // default: severity
    const order = { high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  const urgentCount = clients.filter(c => c.severity === 'high').length;
  const worseningCount = clients.filter(c => c.severity === 'high' || c.severity === 'medium').length;
  const auditedCount = clients.filter(c => c.severity === 'low').length;
  const totalCount = clients.length;

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onShowToast('Synced with Meta Ads & Google Marketing Platform (MCC)');
    }, 1200);
  };

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
            <span className="px-2 py-0.5 rounded-full bg-[#2c344c] font-mono text-[11px] text-[#42A5F5] font-semibold">
              OCT 2024
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
              Automated proof-of-work justifying retainers across {clients.length} portfolio accounts.
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

      {/* Agency Performance Metric Chips */}
      <div className="grid grid-cols-3 gap-2">
        <div 
          onClick={() => onNavigate('team')}
          className="flex flex-col bg-[#131b32] p-2.5 rounded-lg border border-[#212941]/60 shadow-sm cursor-pointer hover:border-[#42A5F5]/40 transition-colors"
        >
          <span className="font-mono text-[10px] text-[#cbc3d5] uppercase">Active Clients</span>
          <span className="font-mono text-[16px] text-white font-bold mt-1">{clients.length}</span>
          <span className="text-[11px] text-[#10B981] font-medium mt-0.5">+2 this mo</span>
        </div>

        <div className="flex flex-col bg-[#131b32] p-2.5 rounded-lg border border-[#212941]/60 shadow-sm">
          <span className="font-mono text-[10px] text-[#cbc3d5] uppercase">Managed Spend</span>
          <span className="font-mono text-[16px] text-white font-bold mt-1">₹18.4L</span>
          <span className="font-mono text-[10px] text-[#cbc3d5]/80 mt-0.5">Trailing 30d</span>
        </div>

        <div 
          onClick={() => setFilter('urgent')}
          className="flex flex-col bg-[#131b32] p-2.5 rounded-lg border border-[#212941]/60 shadow-sm cursor-pointer hover:border-[#EF4444]/40 transition-colors"
        >
          <span className="font-mono text-[10px] text-[#EF4444] font-medium uppercase">Open Leaks</span>
          <span className="font-mono text-[16px] text-[#EF4444] font-bold mt-1">
            {urgentCount + worseningCount} <span className="text-white text-[11px] font-normal">pts</span>
          </span>
          <span className="text-[11px] text-[#EF4444] font-medium mt-0.5">{urgentCount} Critical</span>
        </div>
      </div>

      {/* Triage Command Header & Filter Bar */}
      <div className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#42A5F5] text-[20px]">troubleshoot</span>
            <h2 className="text-[18px] text-white font-semibold tracking-tight">Morning Triage</h2>
          </div>

          {/* Sort Control */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#171f36] text-[#cbc3d5] font-mono text-[11px] hover:text-white transition-colors"
            >
              <span>Sort: {sort.charAt(0).toUpperCase() + sort.slice(1)}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 top-8 w-36 bg-[#171f36] border border-[#2c344c] rounded-lg shadow-xl p-1 z-20 flex flex-col text-[11px] font-mono">
                <button
                  onClick={() => { setSort('severity'); setShowSortDropdown(false); }}
                  className={`p-2 rounded text-left ${sort === 'severity' ? 'bg-[#212941] text-[#42A5F5]' : 'text-[#cbc3d5] hover:bg-[#212941]'}`}
                >
                  By Severity
                </button>
                <button
                  onClick={() => { setSort('retainer'); setShowSortDropdown(false); }}
                  className={`p-2 rounded text-left ${sort === 'retainer' ? 'bg-[#212941] text-[#42A5F5]' : 'text-[#cbc3d5] hover:bg-[#212941]'}`}
                >
                  By Retainer Value
                </button>
                <button
                  onClick={() => { setSort('spend'); setShowSortDropdown(false); }}
                  className={`p-2 rounded text-left ${sort === 'spend' ? 'bg-[#212941] text-[#42A5F5]' : 'text-[#cbc3d5] hover:bg-[#212941]'}`}
                >
                  By Leak Amount
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => { setFilter('urgent'); setEmptyStatePreview(false); }}
            className={`px-3 py-1.5 rounded-full font-semibold text-[12px] whitespace-nowrap shadow-sm transition-all ${
              filter === 'urgent' && !emptyStatePreview
                ? 'bg-[#0070dd] text-white'
                : 'bg-[#171f36] text-[#cbc3d5] hover:text-white'
            }`}
          >
            Urgent Triage ({urgentCount})
          </button>

          <button
            onClick={() => { setFilter('worsening'); setEmptyStatePreview(false); }}
            className={`px-3 py-1.5 rounded-full font-semibold text-[12px] whitespace-nowrap transition-all ${
              filter === 'worsening' && !emptyStatePreview
                ? 'bg-[#0070dd] text-white'
                : 'bg-[#171f36] text-[#cbc3d5] hover:text-white'
            }`}
          >
            Worsening Trend ({worseningCount})
          </button>

          <button
            onClick={() => { setFilter('audited'); setEmptyStatePreview(false); }}
            className={`px-3 py-1.5 rounded-full font-semibold text-[12px] whitespace-nowrap transition-all ${
              filter === 'audited' && !emptyStatePreview
                ? 'bg-[#0070dd] text-white'
                : 'bg-[#171f36] text-[#cbc3d5] hover:text-white'
            }`}
          >
            Recently Audited ({auditedCount})
          </button>

          <button
            onClick={() => { setFilter('all'); setEmptyStatePreview(false); }}
            className={`px-3 py-1.5 rounded-full font-semibold text-[12px] whitespace-nowrap transition-all ${
              filter === 'all' && !emptyStatePreview
                ? 'bg-[#0070dd] text-white'
                : 'bg-[#171f36] text-[#cbc3d5] hover:text-white'
            }`}
          >
            All Clients ({totalCount})
          </button>
        </div>
      </div>

      {/* Client Triage Feed */}
      {!emptyStatePreview && filteredClients.length > 0 && (
        <div className="flex flex-col space-y-3">
          {filteredClients.map((client) => {
            const isHigh = client.severity === 'high';
            const isMed = client.severity === 'medium';
            const stripColor = isHigh ? 'bg-[#EF4444]' : isMed ? 'bg-[#F59E0B]' : 'bg-[#10B981]';
            const badgeBg = isHigh 
              ? 'bg-[#EF4444]/15 text-[#EF4444]' 
              : isMed 
              ? 'bg-[#F59E0B]/15 text-[#F59E0B]' 
              : 'bg-[#10B981]/15 text-[#10B981]';
            const badgeIcon = isHigh ? 'error' : isMed ? 'warning' : 'check';
            const badgeText = isHigh ? 'HIGH' : isMed ? 'MEDIUM' : 'STABLE';

            return (
              <div
                key={client.id}
                className="flex flex-col bg-[#171f36] rounded-xl overflow-hidden shadow-lg border border-[#212941]/60 transition-transform active:scale-[0.99]"
              >
                <div className="flex">
                  {/* Severity accent strip */}
                  <div className={`w-1.5 ${stripColor} shrink-0`}></div>

                  <div className="flex flex-col w-full p-3.5 space-y-2.5">
                    {/* Client Meta Bar */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[16px] text-white font-semibold truncate">
                            {client.name}
                          </h3>
                          <span 
                            className="material-symbols-outlined text-[16px] text-[#42A5F5]" 
                            title={client.platforms.join(', ')}
                          >
                            {client.platforms.includes('Google') ? 'sensors' : 'hub'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-[#cbc3d5]">{client.category}</span>
                          <span className="text-[#cbc3d5] text-[8px]">•</span>
                          <span className="font-mono text-[12px] text-[#DDE1E4] font-medium">
                            {client.monthlyRetainer}<span className="text-[10px] text-[#cbc3d5]">/mo</span>
                          </span>
                        </div>
                      </div>

                      {/* Strict Severity Pill */}
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${badgeBg}`}>
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {badgeIcon}
                        </span>
                        {badgeText}
                      </span>
                    </div>

                    {/* Problem Diagnostic Box */}
                    {client.leakage && (
                      <div className="flex flex-col bg-[#131b32] p-2.5 rounded-lg space-y-1 border border-[#212941]/40">
                        <div className={`flex items-center justify-between ${
                          isHigh ? 'text-[#EF4444]' : isMed ? 'text-[#F59E0B]' : 'text-[#10B981]'
                        }`}>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              {client.leakage.actionType === 'inspect' ? 'link_off' : client.leakage.actionType === 'rebalance' ? 'pie_chart' : isHigh ? 'campaign' : 'verified'}
                            </span>
                            <span className="text-[13px] font-semibold">
                              {client.leakage.title}
                            </span>
                          </div>
                          <span className="font-mono text-[12px] font-bold">
                            {client.leakage.leakAmount}
                          </span>
                        </div>

                        <p className="text-[12px] text-[#cbc3d5] leading-snug">
                          {client.leakage.description}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px]">
                          <span className={`flex items-center gap-0.5 font-medium ${
                            isHigh ? 'text-[#EF4444]' : isMed ? 'text-[#cbc3d5]' : 'text-[#cbc3d5]'
                          }`}>
                            <span className="material-symbols-outlined text-[13px]">
                              {isHigh ? 'trending_up' : 'history'}
                            </span>
                            {client.leakage.metricBadge}
                          </span>
                          <span className="text-[#cbc3d5] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">history</span>
                            {client.leakage.reviewedStatus}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <div className="flex items-center gap-1.5 bg-[#2c344c]/40 px-2 py-1 rounded-md">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#5D35AF] to-[#0045F2] flex items-center justify-center text-[10px] font-bold text-white">
                          {client.assignedManagerAvatar}
                        </div>
                        <span className="text-[12px] text-[#DDE1E4]">{client.assignedManager}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenReassign(client)}
                          className="px-2.5 py-1 rounded-md bg-[#2c344c] text-[#dbe1ff] text-[12px] hover:bg-[#313851] transition-colors"
                        >
                          Reassign
                        </button>

                        {client.leakage?.actionType === 'rebalance' ? (
                          <button
                            onClick={() => onOpenLeak(client)}
                            className="px-3 py-1 rounded-md bg-[#212941] text-[#42A5F5] text-[12px] font-semibold hover:bg-[#313851] transition-colors"
                          >
                            Rebalance Spend
                          </button>
                        ) : client.leakage?.actionType === 'audit' ? (
                          <button
                            onClick={() => onOpenLeak(client)}
                            className="px-3 py-1 rounded-md bg-[#212941] text-[#cbc3d5] hover:text-white text-[12px] font-medium transition-colors"
                          >
                            View Audit Report
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenLeak(client)}
                            className="px-3 py-1 rounded-md bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white text-[12px] font-semibold flex items-center gap-1 active:scale-95 transition-transform shadow"
                          >
                            <span>{client.leakage?.actionLabel || 'Review Leak'}</span>
                            <span className="material-symbols-outlined text-[14px]">
                              {client.leakage?.actionType === 'inspect' ? 'tune' : 'arrow_forward'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zero State Block (Toggleable) */}
      {emptyStatePreview && (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl bg-[#171f36] border border-[#212941] text-center space-y-3 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
            <span className="material-symbols-outlined text-[32px]">task_alt</span>
          </div>
          <div className="flex flex-col">
            <h4 className="text-[20px] text-white font-semibold">Triage Queue Clear!</h4>
            <p className="text-[13px] text-[#cbc3d5] mt-1 max-w-xs leading-relaxed">
              Zero critical waste flags across ₹18.4L managed spend. Agency retainer value safely defended.
            </p>
          </div>
          <button
            onClick={() => {
              setEmptyStatePreview(false);
              onShowToast('Restored active client triage queue');
            }}
            className="px-4 py-2 rounded-lg bg-[#212941] text-[#42A5F5] text-[13px] font-semibold hover:bg-[#2c344c] transition-colors"
          >
            Return to Active Accounts
          </button>
        </div>
      )}

      {/* Empty State Switcher / Agency Context Bar */}
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#131b32] border border-[#212941]/50 text-center space-y-2 mb-4">
        <div className="flex items-center gap-2 text-[#cbc3d5]">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="text-[12px]">All {clients.length} active clients continuously polled by Yantrika Engine</span>
        </div>
        <button
          onClick={() => {
            setEmptyStatePreview(!emptyStatePreview);
            if (!emptyStatePreview) {
              onShowToast('Showing empty state simulation');
            } else {
              onShowToast('Restored active client triage queue');
            }
          }}
          className="font-mono text-[11px] text-[#42A5F5] hover:underline py-1"
        >
          {emptyStatePreview 
            ? 'Return to Active Accounts' 
            : 'Simulate all leaks resolved (Empty State preview)'}
        </button>
      </div>
    </div>
  );
};
