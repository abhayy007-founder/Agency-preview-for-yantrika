import { ClientAccount, TeamMember, PendingInvite } from '../types';

export const INITIAL_CLIENTS: ClientAccount[] = [
  {
    id: 'c1',
    name: 'Apex Dental Care',
    industry: 'Clinic / Healthcare',
    category: 'Healthcare / Clinic',
    monthlyRetainer: '₹1,50,000',
    monthlyRetainerRaw: 150000,
    monthlySpend: '₹2,50,000',
    code: 'CL-042',
    severity: 'high',
    assignedManager: 'Rahul Mehta',
    assignedManagerAvatar: 'RM',
    assignedManagerRole: 'Lead Media Buyer',
    platforms: ['Meta'],
    leakage: {
      id: 'leak-1',
      title: 'Creative Fatigue in 3 Adsets',
      category: 'Creative Fatigue',
      description: 'Frequency exceeded 4.8x on top acquisition adset. CTR decayed by 41% in last 72 hours.',
      leakAmount: '₹18,400 leak',
      leakAmountRaw: 18400,
      metricBadge: '↑ 24% cost/lead (Meta)',
      reviewedStatus: 'Reviewed 4d ago (Stale)',
      platform: 'Meta',
      actionLabel: 'Review Leak',
      actionType: 'review',
      details: {
        frequency: '4.85x average',
        decay: '-41.2% CTR in 72h',
        recommendation: 'Rotate in 2 fresh UGC video hooks and pause stale Carousel Adset #03.'
      }
    }
  },
  {
    id: 'c2',
    name: 'Zenith IAS Academy',
    industry: 'Coaching / EdTech',
    category: 'Coaching / EdTech',
    monthlyRetainer: '₹4,00,000',
    monthlyRetainerRaw: 400000,
    monthlySpend: '₹4,50,000',
    code: 'ED-109',
    severity: 'high',
    assignedManager: 'Priya Sharma',
    assignedManagerAvatar: 'PS',
    assignedManagerRole: 'Performance Marketer',
    platforms: ['Meta', 'Google'],
    leakage: {
      id: 'leak-2',
      title: 'Dead Conversion Event',
      category: 'Pixel Failure',
      description: "Meta Pixel fired 0 'CompleteRegistration' tags since Friday deployment. Ads continuing to spend blind.",
      leakAmount: '48h Silent',
      leakAmountRaw: 42000,
      metricBadge: '₹42,000 untracked spend',
      reviewedStatus: 'Reviewed yesterday',
      platform: 'Meta',
      actionLabel: 'Inspect Pixel',
      actionType: 'inspect',
      details: {
        silentSince: '48 hours (Friday 18:30)',
        untrackedSpend: '₹42,000',
        recommendation: 'Verify GTM trigger on thank-you page. Reconnect CAPI gateway endpoint.'
      }
    }
  },
  {
    id: 'c3',
    name: 'Spice Route Bistro',
    industry: 'Restaurant / F&B',
    category: 'Restaurant & Hospitality',
    monthlyRetainer: '₹85,000',
    monthlyRetainerRaw: 85000,
    monthlySpend: '₹1,20,000',
    code: 'FB-012',
    severity: 'medium',
    assignedManager: 'Ankit Kumar',
    assignedManagerAvatar: 'AK',
    assignedManagerRole: 'Senior Media Buyer',
    platforms: ['Meta'],
    leakage: {
      id: 'leak-3',
      title: 'Budget Concentration',
      category: 'Budget Skew',
      description: 'Single lookalike audience eating 82% daily cap with 0 table reservations in 5 days.',
      leakAmount: '82% Skew',
      leakAmountRaw: 12500,
      metricBadge: 'Reviewed 2d ago',
      reviewedStatus: 'Rebalance rec ready',
      platform: 'Meta',
      actionLabel: 'Rebalance Spend',
      actionType: 'rebalance',
      details: {
        skewPercentage: '82% of ₹4,000/day limit',
        recommendation: 'Redistribute ₹1,500/day into Retargeting & Local Radius campaigns (3km radius).'
      }
    }
  },
  {
    id: 'c4',
    name: 'Prestige Villas Bengaluru',
    industry: 'Real Estate',
    category: 'Luxury Real Estate',
    monthlyRetainer: '₹6,50,000',
    monthlyRetainerRaw: 650000,
    monthlySpend: '₹8,00,000',
    code: 'RE-881',
    severity: 'low',
    assignedManager: 'Sneha Mukherjee',
    assignedManagerAvatar: 'SM',
    assignedManagerRole: 'Growth Strategist',
    platforms: ['Google', 'Meta'],
    leakage: {
      id: 'leak-4',
      title: 'CPA in Target Zone',
      category: 'Health Benchmark',
      description: 'All 5 campaigns performing well. Minor ₹3,200 search keyword negative match recommended.',
      leakAmount: '₹840 / Site Visit',
      leakAmountRaw: 3200,
      metricBadge: 'Reviewed today at 09:15 AM',
      reviewedStatus: 'Stable',
      platform: 'Google',
      actionLabel: 'View Audit Report',
      actionType: 'audit',
      details: {
        cpaTarget: '₹840 vs ₹1,100 SLA',
        recommendation: 'Add negative keywords: "cheap rentals", "pg accommodation".'
      }
    }
  },
  {
    id: 'c5',
    name: 'Horizon FinTech App',
    industry: 'Finance / Technology',
    category: 'Finance / FinTech',
    monthlyRetainer: '₹3,20,000',
    monthlyRetainerRaw: 320000,
    monthlySpend: '₹6,00,000',
    code: 'FT-303',
    severity: 'medium',
    assignedManager: 'Priya Sharma',
    assignedManagerAvatar: 'PS',
    assignedManagerRole: 'Performance Marketer',
    platforms: ['Google', 'Meta'],
    leakage: {
      id: 'leak-5',
      title: 'App Install CPI Creep',
      category: 'Audience Saturation',
      description: 'Google UAC campaign CPI climbed from ₹42 to ₹78 over the last 10 days in Tier 1 cities.',
      leakAmount: '₹14,200 leak',
      leakAmountRaw: 14200,
      metricBadge: '↑ 85% CPI surge',
      reviewedStatus: 'Reviewed yesterday',
      platform: 'Google',
      actionLabel: 'Review Leak',
      actionType: 'review',
      details: {
        recommendation: 'Expand asset pack with 1:1 portrait video creative and target Tier 2 hub regions.'
      }
    }
  },
  {
    id: 'c6',
    name: 'CultFit Franchise Hub',
    industry: 'Gym & Fitness',
    category: 'Health & Fitness',
    monthlyRetainer: '₹1,20,000',
    monthlyRetainerRaw: 120000,
    monthlySpend: '₹1,80,000',
    code: 'CF-009',
    severity: 'low',
    assignedManager: 'Ankit Kumar',
    assignedManagerAvatar: 'AK',
    assignedManagerRole: 'Senior Media Buyer',
    platforms: ['Meta'],
    leakage: {
      id: 'leak-6',
      title: 'Trial Signups on Target',
      category: 'Optimal Performance',
      description: 'Met target 140 free trial bookings this week at ₹280/lead.',
      leakAmount: 'Optimized',
      leakAmountRaw: 0,
      metricBadge: 'Reviewed today at 11:30 AM',
      reviewedStatus: 'Stable',
      platform: 'Meta',
      actionLabel: 'View Audit Report',
      actionType: 'audit',
      details: {
        recommendation: 'Scale daily spend by 15% cautiously without changing bid strategy.'
      }
    }
  },
  {
    id: 'c7',
    name: 'Nirvana Ayurvedic Care',
    industry: 'Clinic / Healthcare',
    category: 'Wellness & D2C',
    monthlyRetainer: '₹95,000',
    monthlyRetainerRaw: 95000,
    monthlySpend: '₹1,50,000',
    code: 'NV-204',
    severity: 'medium',
    assignedManager: 'Sneha Mukherjee',
    assignedManagerAvatar: 'SM',
    assignedManagerRole: 'Growth Strategist',
    platforms: ['Meta'],
    leakage: {
      id: 'leak-7',
      title: 'Cart Abandonment Spike',
      category: 'Checkout Leakage',
      description: 'Initiate Checkout to Purchase drop-off increased by 28% following payment gateway change.',
      leakAmount: '₹9,800 leak',
      leakAmountRaw: 9800,
      metricBadge: 'Reviewed 3d ago',
      reviewedStatus: 'Needs Action',
      platform: 'Meta',
      actionLabel: 'Review Leak',
      actionType: 'review',
      details: {
        recommendation: 'Trigger automated WhatsApp recovery workflow for dropped transactions.'
      }
    }
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'm1',
    name: 'Rahul Mehta',
    roleTitle: 'Lead Media Buyer • Lead Admin',
    accessTier: 'ADMIN',
    email: 'rahul@peakscale.agency',
    initials: 'RM',
    avatarColor: 'from-[#5D35AF] to-[#0045F2]',
    status: 'online',
    isCurrentUser: true,
    allocatedScope: 'All 14 Clients (Global)',
    clientIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
    alertSummary: {
      type: 'clear',
      text: 'Live Monitoring'
    }
  },
  {
    id: 'm2',
    name: 'Priya Sharma',
    roleTitle: 'Performance Marketer',
    accessTier: 'MANAGER',
    email: 'priya.s@peakscale.agency',
    initials: 'PS',
    avatarColor: 'bg-[#212941]',
    status: 'busy',
    allocatedScope: 'Apex Dental +3 more',
    clientIds: ['c1', 'c2', 'c5'],
    alertSummary: {
      type: 'critical',
      text: '1 Critical Leakage Unreviewed (Apex)',
      leakAmount: '₹18.4K'
    }
  },
  {
    id: 'm3',
    name: 'Ankit Kumar',
    roleTitle: 'Senior Media Buyer',
    accessTier: 'MANAGER',
    email: 'ankit@peakscale.agency',
    initials: 'AK',
    avatarColor: 'bg-[#212941]',
    status: 'online',
    allocatedScope: 'Spice Route +4 more',
    clientIds: ['c3', 'c6'],
    alertSummary: {
      type: 'clear',
      text: 'All 5 Accounts Clear (0 Leaks)',
      leakAmount: '0 Leaks'
    }
  },
  {
    id: 'm4',
    name: 'Sneha Mukherjee',
    roleTitle: 'Growth Strategist',
    accessTier: 'MANAGER',
    email: 'sneha.m@peakscale.agency',
    initials: 'SM',
    avatarColor: 'bg-[#212941]',
    status: 'busy',
    allocatedScope: 'Prestige Villas +2 more',
    clientIds: ['c4', 'c7'],
    alertSummary: {
      type: 'warning',
      text: '1 Warning Under Review',
      leakAmount: '₹4.2K'
    }
  },
  {
    id: 'm5',
    name: 'Vikram Das',
    roleTitle: 'Agency Partner',
    accessTier: 'ADMIN',
    email: 'vikram@peakscale.agency',
    initials: 'VD',
    avatarColor: 'from-[#5D35AF] to-[#0045F2]',
    status: 'online',
    allocatedScope: 'Global (14 Accounts)',
    clientIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
    alertSummary: {
      type: 'clear',
      text: 'Billing + White Label'
    }
  }
];

export const INITIAL_PENDING_INVITES: PendingInvite[] = [
  {
    id: 'inv-1',
    email: 'karan.m@peakscale.agency',
    role: 'Manager',
    sentAgo: 'Sent 2 days ago'
  }
];
