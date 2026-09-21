import React, { useState } from 'react';
import { TeamMember, PendingInvite, ClientAccount, Agency } from '../types';

interface TeamScreenProps {
  team: TeamMember[];
  pendingInvites: PendingInvite[];
  clients: ClientAccount[];
  agency: Agency;
  onInviteSent: (invite: PendingInvite) => void;
  onRevokeInvite: (id: string) => void;
  onUpdateMemberScope?: (memberId: string, clientIds: string[]) => void;
  onShowToast: (msg: string) => void;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({
  team,
  pendingInvites,
  clients,
  agency,
  onInviteSent,
  onRevokeInvite,
  onUpdateMemberScope,
  onShowToast
}) => {
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Admin'>('Manager');
  const [dispatching, setDispatching] = useState(false);

  // Scope modal state
  const [activeScopeMember, setActiveScopeMember] = useState<TeamMember | null>(null);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [savingScope, setSavingScope] = useState(false);

  const activeSeats = team.length;
  const maxSeats = 8;
  const availableSeats = maxSeats - activeSeats;

  const adminCount = team.filter(m => m.accessTier === 'ADMIN').length;
  const managerCount = team.filter(m => m.accessTier === 'MANAGER').length;

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      onShowToast('Please provide an email or WhatsApp phone');
      return;
    }

    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      const newInv: PendingInvite = {
        id: 'inv_' + Date.now(),
        email: inviteEmail,
        role: inviteRole,
        sentAgo: 'Sent just now'
      };
      onInviteSent(newInv);
      onShowToast(`Invite dispatched via WhatsApp & Email to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteDrawer(false);
    }, 800);
  };

  const handleOpenScope = (member: TeamMember) => {
    setActiveScopeMember(member);
    setSelectedClientIds(member.clientIds || []);
  };

  const handleToggleClientScope = (clientId: string) => {
    if (selectedClientIds.includes(clientId)) {
      setSelectedClientIds(selectedClientIds.filter(id => id !== clientId));
    } else {
      setSelectedClientIds([...selectedClientIds, clientId]);
    }
  };

  const handleSaveScope = () => {
    if (!activeScopeMember) return;
    setSavingScope(true);
    setTimeout(() => {
      setSavingScope(false);
      if (onUpdateMemberScope) {
        onUpdateMemberScope(activeScopeMember.id, selectedClientIds);
      }
      onShowToast(`Updated telemetry scope for ${activeScopeMember.name} (${selectedClientIds.length} accounts)`);
      setActiveScopeMember(null);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] px-3 sm:px-4 max-w-xl mx-auto space-y-4 pt-2 pb-24">
      {/* Header Context & Quick Metrics */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#42A5F5] text-[18px]">badge</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#42A5F5] font-semibold">
              Agency Governance
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#212941]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-mono text-[11px] text-white">
              {activeSeats}/{maxSeats} Seats
            </span>
          </div>
        </div>

        <h1 className="text-[22px] font-bold text-white tracking-tight">
          Team &amp; Permissions
        </h1>
        <p className="text-[12px] text-[#cbc3d5] leading-relaxed">
          Multi-seat control for {agency.name}. Manage buyers, isolate ad account telemetry, and route leakage alerts.
        </p>
      </div>

      {/* Seat Capacity Bento Card */}
      <div className="bg-[#131b32] border border-[#212941] rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#cbc3d5]">
              Active Seat Utilization
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-[24px] font-bold text-white leading-none">
                {activeSeats}
              </span>
              <span className="font-mono text-[14px] text-[#cbc3d5]">
                / {maxSeats} Tier Pro
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] uppercase text-[#cbc3d5]">Distribution</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-[#5d35af]/30 font-mono text-[10px] text-[#d1bcff] font-semibold">
                {adminCount} Admins
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#0070dd]/20 font-mono text-[10px] text-[#aac7ff] font-semibold">
                {managerCount} Managers
              </span>
            </div>
          </div>
        </div>

        {/* Linear Seat Capacity Meter */}
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-2 rounded-full bg-[#2c344c] overflow-hidden flex">
            <div className="h-full bg-[#5D35AF]" style={{ width: `${(adminCount / maxSeats) * 100}%` }}></div>
            <div className="h-full bg-[#0045F2]" style={{ width: `${(managerCount / maxSeats) * 100}%` }}></div>
            <div className="h-full bg-[#313851]/40" style={{ width: `${(availableSeats / maxSeats) * 100}%` }}></div>
          </div>
          <div className="flex justify-between items-center font-mono text-[10px] text-[#cbc3d5]">
            <span>{availableSeats} Available Seats</span>
            <span className="text-[#42A5F5]">Pro Agency Tier</span>
          </div>
        </div>

        {/* Invite CTA Button */}
        <button
          onClick={() => setShowInviteDrawer(!showInviteDrawer)}
          className="w-full h-11 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.99] transition-transform hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Invite Team Member</span>
        </button>
      </div>

      {/* Quick Invite Drawer / Card (Collapsible) */}
      {showInviteDrawer && (
        <div className="bg-[#171f36] border border-[#2c344c] rounded-xl p-4 flex flex-col gap-3.5 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-1 border-b border-[#212941]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#42A5F5]/15 flex items-center justify-center text-[#42A5F5]">
                <span className="material-symbols-outlined text-[18px]">outgoing_mail</span>
              </div>
              <h2 className="text-[14px] font-semibold text-white">Add Specialist or Admin</h2>
            </div>
            <button
              onClick={() => setShowInviteDrawer(false)}
              className="w-7 h-7 rounded-lg bg-[#212941] flex items-center justify-center text-[#cbc3d5] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase text-[#cbc3d5]">
              Work Email or WhatsApp Phone
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-[#212941]">
              <span className="material-symbols-outlined text-[#cbc3d5] text-[18px] mr-2">
                alternate_email
              </span>
              <input
                type="text"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="e.g. adbuyer@peakscale.agency"
                className="bg-transparent font-mono text-[12px] text-white placeholder:text-[#cbc3d5]/40 focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Role Selector Radios */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase text-[#cbc3d5]">Access Tier</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInviteRole('Manager')}
                className={`p-2.5 rounded-lg text-left flex flex-col gap-0.5 transition-all border ${
                  inviteRole === 'Manager'
                    ? 'bg-[#212941] border-[#42A5F5]'
                    : 'bg-[#131b32] border-transparent opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white">Manager</span>
                  <span className={`material-symbols-outlined text-[16px] ${
                    inviteRole === 'Manager' ? 'text-[#42A5F5]' : 'text-[#cbc3d5]/40'
                  }`}>
                    {inviteRole === 'Manager' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <span className="text-[11px] text-[#cbc3d5]">
                  Siloed view. Only sees assigned client telemetry.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInviteRole('Admin')}
                className={`p-2.5 rounded-lg text-left flex flex-col gap-0.5 transition-all border ${
                  inviteRole === 'Admin'
                    ? 'bg-[#212941] border-[#42A5F5]'
                    : 'bg-[#131b32] border-transparent opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-white">Admin</span>
                  <span className={`material-symbols-outlined text-[16px] ${
                    inviteRole === 'Admin' ? 'text-[#42A5F5]' : 'text-[#cbc3d5]/40'
                  }`}>
                    {inviteRole === 'Admin' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <span className="text-[11px] text-[#cbc3d5]">
                  Full access to all 14 accounts, white-label, &amp; billing.
                </span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendInvite}
            disabled={dispatching}
            className="w-full h-10 rounded-lg bg-[#0070dd] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 active:brightness-110 transition-all cursor-pointer"
          >
            {dispatching ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Dispatching Invite...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send WhatsApp &amp; Email Invite</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Access Governance Scope Callout */}
      <div className="bg-[#212941] border border-[#2c344c]/70 rounded-xl p-3.5 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-lg bg-[#5D35AF]/30 flex items-center justify-center shrink-0 text-[#d1bcff]">
          <span className="material-symbols-outlined text-[20px]">security</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-white">Client Privacy Isolator Active</span>
          <p className="text-[11px] text-[#cbc3d5] leading-relaxed">
            Ad buyers only triage alerts for clients explicitly routed to their seat. Cross-brand leakage telemetry remains completely firewalled.
          </p>
        </div>
      </div>

      {/* Section Heading: Team Roster */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-white">Active Roster</h2>
          <span className="px-2 py-0.5 rounded-full bg-[#212941] font-mono text-[11px] text-[#cbc3d5]">
            {team.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#cbc3d5]">
          <span className="material-symbols-outlined text-[16px]">filter_list</span>
          <span className="font-mono text-[10px] uppercase">All Seats</span>
        </div>
      </div>

      {/* Team Members List */}
      <div className="flex flex-col gap-3">
        {team.map((member) => {
          const isLeadAdmin = member.isCurrentUser;
          const hasCritical = member.alertSummary?.type === 'critical';
          const hasWarning = member.alertSummary?.type === 'warning';
          const stripColor = hasCritical
            ? 'bg-[#EF4444]'
            : isLeadAdmin
            ? 'bg-[#5D35AF]'
            : hasWarning
            ? 'bg-[#313851]'
            : 'bg-[#10B981]';

          return (
            <div
              key={member.id}
              className="bg-[#131b32] border border-[#212941] rounded-xl p-3.5 flex flex-col gap-3 shadow-sm relative overflow-hidden"
            >
              {/* Left accent strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripColor}`}></div>

              <div className="flex items-start justify-between gap-2 pl-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#212941] border border-[#2c344c] flex items-center justify-center font-bold text-white text-[13px]">
                      {member.initials}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#131b32] ${
                      hasCritical ? 'bg-[#EF4444] animate-ping' : 'bg-[#10B981]'
                    }`}></span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[14px] font-semibold text-white truncate">
                        {member.name}
                      </span>
                      {member.isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#2c344c] font-mono text-[9px] text-[#42A5F5] font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#cbc3d5] truncate">
                      {member.roleTitle}
                    </span>
                    <span className="font-mono text-[10px] text-[#cbc3d5]/70 truncate">
                      {member.email}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wide shrink-0 ${
                  member.accessTier === 'ADMIN'
                    ? 'bg-[#5d35af]/25 text-[#d1bcff]'
                    : 'bg-[#0070dd]/20 text-[#aac7ff]'
                }`}>
                  {member.accessTier}
                </span>
              </div>

              {/* Scope & Alert row */}
              <div className="flex flex-col gap-1.5 ml-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-mono text-[10px] uppercase text-[#cbc3d5]">
                      {member.accessTier === 'ADMIN' ? 'Allocated:' : 'Scope:'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#212941] font-mono text-[10px] text-[#42A5F5] font-semibold">
                      {member.allocatedScope}
                    </span>
                  </div>

                  {member.accessTier !== 'ADMIN' && (
                    <button
                      onClick={() => handleOpenScope(member)}
                      className="font-mono text-[10px] uppercase text-[#42A5F5] flex items-center gap-0.5 hover:underline"
                    >
                      <span>Reassign</span>
                      <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                    </button>
                  )}
                </div>

                {/* Alert or telemetry indicator */}
                {member.alertSummary && (
                  <div className={`p-2 rounded-lg flex items-center justify-between text-[11px] ${
                    hasCritical
                      ? 'bg-[#EF4444]/10 text-white'
                      : 'bg-[#171f36] text-[#cbc3d5]'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`material-symbols-outlined text-[16px] ${
                        hasCritical ? 'text-[#EF4444]' : hasWarning ? 'text-[#F59E0B]' : 'text-[#10B981]'
                      }`}>
                        {hasCritical ? 'error' : hasWarning ? 'schedule' : 'check_circle'}
                      </span>
                      <span className="truncate">{member.alertSummary.text}</span>
                    </div>
                    {member.alertSummary.leakAmount && (
                      <span className={`font-mono text-[11px] font-bold ${
                        hasCritical ? 'text-[#EF4444]' : 'text-white'
                      }`}>
                        {member.alertSummary.leakAmount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Invitations Section */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#F59E0B] text-[18px]">
              mark_email_unread
            </span>
            <h3 className="text-[14px] font-semibold text-white">Pending Invites</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/15 font-mono text-[10px] text-[#F59E0B] font-semibold">
            {pendingInvites.length} Awaiting Action
          </span>
        </div>

        {pendingInvites.map((inv) => (
          <div
            key={inv.id}
            className="bg-[#131b32] border border-[#212941] rounded-xl p-3 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[12px] text-white font-medium truncate">
                  {inv.email}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#cbc3d5]">
                  <span>Role: {inv.role}</span>
                  <span className="w-1 h-1 rounded-full bg-[#cbc3d5]/40"></span>
                  <span className="font-mono text-[10px]">{inv.sentAgo}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#212941] font-mono text-[10px] uppercase text-[#cbc3d5]">
                Pending
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onShowToast(`Invitation re-sent to ${inv.email}`)}
                className="flex-1 h-8 rounded-lg bg-[#212941] hover:bg-[#2c344c] font-semibold text-[11px] text-[#42A5F5] flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">sync</span>
                <span>Resend Invite</span>
              </button>
              <button
                onClick={() => {
                  onRevokeInvite(inv.id);
                  onShowToast(`Revoked invite for ${inv.email}`);
                }}
                className="px-3 h-8 rounded-lg bg-[#93000a]/20 hover:bg-[#93000a]/30 font-semibold text-[11px] text-[#ffb4ab] flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                <span>Revoke</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agency Isolation Guarantee Callout */}
      <div className="bg-[#050d24] border border-[#212941]/60 rounded-xl p-3.5 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#cbc3d5] text-[18px] shrink-0 mt-0.5">
          shield_lock
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-medium text-white">Zero Direct Client Portal Access</span>
          <p className="text-[11px] text-[#cbc3d5] leading-relaxed">
            End-clients never receive raw logins or direct team visibility. All reporting remains white-labeled under {agency.name} with automated PDF exports.
          </p>
        </div>
      </div>

      {/* Scope Reassignment Modal */}
      {activeScopeMember && (
        <div className="fixed inset-0 z-50 bg-[#10182F]/80 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-[#171f36] border border-[#2c344c] rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 max-h-[80vh] overflow-y-auto shadow-2xl w-full max-w-md">
            <div className="w-12 h-1.5 rounded-full bg-[#2c344c] mx-auto sm:hidden"></div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase text-[#42A5F5]">Client Isolation Scope</span>
                <h3 className="text-[16px] font-semibold text-white">{activeScopeMember.name}</h3>
              </div>
              <button
                onClick={() => setActiveScopeMember(null)}
                className="w-8 h-8 rounded-full bg-[#212941] flex items-center justify-center text-[#cbc3d5] hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#cbc3d5]">
              Select which client ad accounts route their live leakage alerts to this specialist&apos;s WhatsApp triage queue.
            </p>

            <div className="flex flex-col gap-2">
              {clients.map((c) => {
                const isChecked = selectedClientIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleToggleClientScope(c.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#212941] cursor-pointer hover:bg-[#2c344c] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`material-symbols-outlined text-[18px] shrink-0 ${
                        c.severity === 'high' ? 'text-[#EF4444]' : 'text-[#10B981]'
                      }`}>
                        {c.severity === 'high' ? 'warning' : 'check_circle'}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-white truncate">{c.name}</span>
                        <span className="font-mono text-[10px] text-[#cbc3d5] truncate">
                          {c.category} • Retainer: {c.monthlyRetainer}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by parent div
                      className="w-5 h-5 rounded accent-[#5d35af] shrink-0 ml-2"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveScope}
                disabled={savingScope}
                className="flex-1 h-11 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                {savingScope ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Saving Scope...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Update Account Routing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
