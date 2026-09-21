export type Severity = 'high' | 'medium' | 'low';

export interface ClientLeakage {
  id: string;
  title: string;
  category: string;
  description: string;
  leakAmount: string;
  leakAmountRaw: number;
  metricBadge: string;
  reviewedStatus: string;
  platform: 'Meta' | 'Google' | 'Both';
  actionLabel: string;
  actionType: 'review' | 'inspect' | 'rebalance' | 'audit';
  details?: {
    frequency?: string;
    decay?: string;
    untrackedSpend?: string;
    silentSince?: string;
    skewPercentage?: string;
    cpaTarget?: string;
    recommendation: string;
  };
}

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  category: string;
  monthlyRetainer: string;
  monthlyRetainerRaw: number;
  monthlySpend: string;
  code: string;
  severity: Severity;
  assignedManager: string;
  assignedManagerAvatar: string;
  assignedManagerRole: string;
  platforms: ('Meta' | 'Google')[];
  leakage?: ClientLeakage;
  isResolved?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  roleTitle: string;
  accessTier: 'ADMIN' | 'MANAGER';
  email: string;
  initials: string;
  avatarColor: string;
  status: 'online' | 'busy' | 'offline';
  isCurrentUser?: boolean;
  allocatedScope: string;
  clientIds: string[];
  alertSummary?: {
    type: 'critical' | 'warning' | 'clear';
    text: string;
    leakAmount?: string;
  };
}

export interface PendingInvite {
  id: string;
  email: string;
  role: 'Manager' | 'Admin';
  sentAgo: string;
}

export type NavTab = 'overview' | 'alerts' | 'team' | 'reports' | 'settings' | 'add-client';
