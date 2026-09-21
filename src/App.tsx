import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OverviewScreen } from './components/OverviewScreen';
import { AddClientScreen } from './components/AddClientScreen';
import { TeamScreen } from './components/TeamScreen';
import { AlertsScreen } from './components/AlertsScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LeakModal } from './components/LeakModal';
import { ReassignModal } from './components/ReassignModal';
import { Toast } from './components/Toast';
import { INITIAL_CLIENTS, INITIAL_TEAM, INITIAL_PENDING_INVITES } from './data/mockData';
import { ClientAccount, NavTab, TeamMember, PendingInvite } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [clients, setClients] = useState<ClientAccount[]>(INITIAL_CLIENTS);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(INITIAL_PENDING_INVITES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [activeLeakClient, setActiveLeakClient] = useState<ClientAccount | null>(null);
  const [activeReassignClient, setActiveReassignClient] = useState<ClientAccount | null>(null);

  // Retainer defense prevented leak counter
  const [totalSavedRaw, setTotalSavedRaw] = useState(184600);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleClientAdded = (newClient: ClientAccount) => {
    setClients(prev => [newClient, ...prev]);
    showToast(`Added ${newClient.name} to portfolio`);
  };

  const handleResolveLeak = (clientId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const savedAmount = c.leakage?.leakAmountRaw || 15000;
        setTotalSavedRaw(curr => curr + savedAmount);
        return {
          ...c,
          severity: 'low',
          isResolved: true,
          leakage: c.leakage ? {
            ...c.leakage,
            title: `${c.leakage.title} (Mitigated)`,
            description: 'Algorithmic waste stopped. Campaign normalized within target benchmark.',
            leakAmount: 'Mitigated',
            metricBadge: 'Zero Leakage',
            reviewedStatus: 'Fixed just now',
            actionLabel: 'View Audit Report',
            actionType: 'audit'
          } : undefined
        };
      }
      return c;
    }));
  };

  const handleReassign = (clientId: string, newManagerName: string, newManagerAvatar: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          assignedManager: newManagerName,
          assignedManagerAvatar: newManagerAvatar
        };
      }
      return c;
    }));
  };

  const handleInviteSent = (invite: PendingInvite) => {
    setPendingInvites(prev => [invite, ...prev]);
  };

  const handleRevokeInvite = (id: string) => {
    setPendingInvites(prev => prev.filter(inv => inv.id !== id));
  };

  const openLeaksCount = clients.filter(c => c.severity === 'high').length;
  const formattedTotalSaved = `₹${totalSavedRaw.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-[#10182F] text-[#dbe1ff] flex flex-col font-sans selection:bg-[#5d35af] selection:text-white">
      {/* Toast notification */}
      <Toast message={toastMessage} onClear={() => setToastMessage(null)} />

      {/* Main App Header (hidden on full-screen Add Client wizard, shown on others) */}
      {currentTab !== 'add-client' && (
        <Header
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          openLeaksCount={openLeaksCount}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col w-full ${currentTab !== 'add-client' ? 'pt-16' : ''}`}>
        {currentTab === 'overview' && (
          <OverviewScreen
            clients={clients}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenLeak={(client) => setActiveLeakClient(client)}
            onOpenReassign={(client) => setActiveReassignClient(client)}
            onShowToast={showToast}
            totalSaved={formattedTotalSaved}
          />
        )}

        {currentTab === 'add-client' && (
          <AddClientScreen
            onBack={() => setCurrentTab('overview')}
            onClientAdded={handleClientAdded}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'team' && (
          <TeamScreen
            team={team}
            pendingInvites={pendingInvites}
            clients={clients}
            onInviteSent={handleInviteSent}
            onRevokeInvite={handleRevokeInvite}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsScreen
            clients={clients}
            onOpenLeak={(client) => setActiveLeakClient(client)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsScreen
            clients={clients}
            totalSaved={formattedTotalSaved}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen onShowToast={showToast} />
        )}
      </main>

      {/* Bottom Nav (visible on standard tabs) */}
      {currentTab !== 'add-client' && (
        <BottomNav
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          openLeaksCount={openLeaksCount}
          seatsText={`${team.length}/8`}
        />
      )}

      {/* Modals */}
      <LeakModal
        client={activeLeakClient}
        onClose={() => setActiveLeakClient(null)}
        onResolve={handleResolveLeak}
        onShowToast={showToast}
      />

      <ReassignModal
        client={activeReassignClient}
        team={team}
        onClose={() => setActiveReassignClient(null)}
        onReassign={handleReassign}
        onShowToast={showToast}
      />
    </div>
  );
}
