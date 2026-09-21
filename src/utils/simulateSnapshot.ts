import { ClientAccount, Agency, TeamMember, PendingInvite } from '../types';

/**
 * Fallback Diagnostic Heuristic Engine (simulateSnapshot)
 * Emulates the background worker analyzing telemetry when OAuth credentials
 * are simulated or in staging/demo mode without live API connections.
 */
export function simulateClientSnapshot(client: ClientAccount): ClientAccount {
  const isHealthy = Math.random() > 0.45;

  if (isHealthy) {
    return {
      ...client,
      severity: 'low',
      isResolved: true,
      leakage: {
        id: 'leak-' + Date.now(),
        title: 'Algorithmic Flow Optimized',
        category: 'Balanced Delivery',
        description: 'Pacing within 3.2% of target CPA. All conversion tags verified active.',
        leakAmount: '0 Leaks',
        leakAmountRaw: 0,
        metricBadge: 'Zero Leakage',
        reviewedStatus: 'Audited just now',
        platform: client.platforms[0] || 'Meta',
        actionLabel: 'View Audit Report',
        actionType: 'audit',
        details: {
          recommendation: 'Current budget pacing is optimal. Maintain bidding rules.'
        }
      }
    };
  }

  // Detected an algorithmic anomaly
  const anomalyTypes = [
    {
      title: 'Audience Overlap Saturation',
      category: 'Audience Bleed',
      description: 'Auction overlap reached 34.2% across Prospecting and Retargeting ad sets.',
      amount: '₹14,200 leak',
      amountRaw: 14200,
      badge: '↑ 31% CPM surge',
      action: 'rebalance' as const,
      actionLabel: 'Rebalance Spend'
    },
    {
      title: 'Conversion Pixel Latency Drop',
      category: 'Tag Signal Drop',
      description: 'Server CAPI event delivery delayed by >45 minutes. Attribution skewing negative.',
      amount: 'Delayed Tag',
      amountRaw: 22500,
      badge: '₹22.5k blind spend',
      action: 'inspect' as const,
      actionLabel: 'Inspect Pixel'
    },
    {
      title: 'Creative Fatigue & CTR Decay',
      category: 'Creative Fatigue',
      description: 'Top hook CTR decreased by 38.6% in 48 hours. Frequency index at 5.2x.',
      amount: '₹16,800 leak',
      amountRaw: 16800,
      badge: '↑ 28% cost/lead',
      action: 'review' as const,
      actionLabel: 'Review Leak'
    }
  ];

  const picked = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];

  return {
    ...client,
    severity: picked.amountRaw > 18000 ? 'high' : 'medium',
    isResolved: false,
    leakage: {
      id: 'leak-' + Date.now(),
      title: picked.title,
      category: picked.category,
      description: picked.description,
      leakAmount: picked.amount,
      leakAmountRaw: picked.amountRaw,
      metricBadge: picked.badge,
      reviewedStatus: 'Scanned 1m ago',
      platform: client.platforms[0] || 'Meta',
      actionLabel: picked.actionLabel,
      actionType: picked.action,
      details: {
        recommendation: 'Re-align creative hooks or suppress duplicate audience exclusions.'
      }
    }
  };
}

/**
 * Seed script for demo agency account (PART 5)
 */
export function getDemoAgencySeed() {
  const agency: Agency = {
    id: 'agency_demo_peakscale',
    name: 'PeakScale Media',
    logoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1W89mzLpJnwWpE1gQX_UylOfZXEXmY6KVdEAzd1IKVg6m5U0zsA4DfwNK6fUw175s5b-rROqbGYNf_HAQ9ZqSnz1Ar02jMTToBuxYp4CD1BJRN8MKpiZkj00YfoYl50JRNdSS4n5oqzi-xUZ186U_K44fZhewLpHaPQB2hoQm_IRvpne21ofPmQsKMGf9ox1R2y5W8d1JLtlbVxo7EPE7PJDhy38GD0Dw6vvzSKZyW-wcSn2avX4qSv66U',
    ownerUserId: 'usr_rahul_admin',
    activeSeats: 5,
    maxSeats: 8,
    tier: 'Tier Pro',
    createdAt: new Date().toISOString()
  };

  return agency;
}
