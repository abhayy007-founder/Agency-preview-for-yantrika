import React, { useState } from 'react';
import { ClientAccount, NavTab } from '../types';

interface AddClientScreenProps {
  onBack: () => void;
  onClientAdded: (client: ClientAccount) => void;
  onShowToast: (msg: string) => void;
}

export const AddClientScreen: React.FC<AddClientScreenProps> = ({
  onBack,
  onClientAdded,
  onShowToast
}) => {
  const [clientName, setClientName] = useState("Dr. Batra's Dental & Aesthetics");
  const [industry, setIndustry] = useState('clinic');
  const [clientCode, setClientCode] = useState('CL-042');
  const [selectedTier, setSelectedTier] = useState('₹1.5L-5L');
  const [spendAmount, setSpendAmount] = useState('2,50,000');
  const [metaChecked, setMetaChecked] = useState(true);
  const [googleChecked, setGoogleChecked] = useState(true);
  const [manager, setManager] = useState('Rahul Mehta');
  const [connectionMode, setConnectionMode] = useState<'partner' | 'direct'>('partner');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const benchmarks: Record<string, string> = {
    clinic: 'Applies Clinic benchmark models: 11% average portfolio leak threshold',
    edtech: 'Applies EdTech models: 18% leak threshold (high lead fatigue sensitivity)',
    fnb: 'Applies F&B local models: 7% leak threshold (radius bleed detection)',
    realestate: 'Applies Real Estate models: 22% CPL volatility threshold',
    fitness: 'Applies Fitness models: 14% leak threshold (seasonal cohort drift)',
    ecommerce: 'Applies Direct D2C models: 9% ROAS drop threshold',
    services: 'Applies Local Trade models: 12% click-fraud sensitivity'
  };

  const tiers = [
    { label: '< ₹50k', val: '35,000' },
    { label: '₹50k-1.5L', val: '1,00,000' },
    { label: '₹1.5L-5L', val: '2,50,000' },
    { label: '₹5L-15L', val: '8,50,000' },
    { label: '₹15L+', val: '25,00,000' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      onShowToast('Please enter a business or client name');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      const platforms: ('Meta' | 'Google')[] = [];
      if (metaChecked) platforms.push('Meta');
      if (googleChecked) platforms.push('Google');

      const industryLabels: Record<string, string> = {
        clinic: 'Healthcare / Clinic',
        edtech: 'Coaching / EdTech',
        fnb: 'Restaurant / Hospitality',
        realestate: 'Luxury Real Estate',
        fitness: 'Gym & Fitness',
        ecommerce: 'E-commerce Direct',
        services: 'Local Trade'
      };

      const newAccount: ClientAccount = {
        id: 'c_' + Date.now(),
        name: clientName,
        industry: industryLabels[industry] || 'Healthcare / Clinic',
        category: industryLabels[industry] || 'Healthcare / Clinic',
        monthlyRetainer: `₹${spendAmount}`,
        monthlyRetainerRaw: parseInt(spendAmount.replace(/,/g, ''), 10) || 200000,
        monthlySpend: `₹${spendAmount}`,
        code: clientCode || 'CL-999',
        severity: 'low',
        assignedManager: manager,
        assignedManagerAvatar: manager.split(' ').map(n => n[0]).join(''),
        assignedManagerRole: 'Lead Media Buyer',
        platforms: platforms.length > 0 ? platforms : ['Meta'],
        leakage: {
          id: 'leak-' + Date.now(),
          title: 'Initial Telemetry Calibrated',
          category: 'Health Baseline',
          description: 'Initial 14-day tracking baseline connected without algorithmic leaks.',
          leakAmount: '0 Leaks',
          leakAmountRaw: 0,
          metricBadge: 'Telemetry Active',
          reviewedStatus: 'Just Connected',
          platform: platforms[0] || 'Meta',
          actionLabel: 'View Audit Report',
          actionType: 'audit',
          details: {
            recommendation: 'Baseline calibration running. First anomaly scan in 4 hours.'
          }
        }
      };

      onClientAdded(newAccount);
      onShowToast(`Client ${clientName} initialized & audit started!`);
      setTimeout(() => {
        onBack();
      }, 700);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] min-h-screen bg-[#10182F] pb-24">
      {/* Top Header */}
      <div className="sticky top-0 inset-x-0 z-50 bg-[#10182F]/90 backdrop-blur-xl border-b border-[#212941]/60 pt-safe">
        <div className="h-16 px-3 sm:px-4 max-w-xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              aria-label="Go back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#dbe1ff] hover:text-[#42A5F5] hover:bg-[#212941] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[16px] sm:text-[17px] font-semibold text-[#dbe1ff] tracking-tight truncate">
                Client Audit Drilldown
              </h1>
              <span className="font-mono text-[10px] text-[#cbc3d5]">
                PeakScale Media • Action Flow
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#5d35af] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#3c028f] text-[18px]">person</span>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-4 flex flex-col gap-4 max-w-xl mx-auto w-full">
        {/* Agency Managed Notice Card */}
        <div className="bg-[#131b32] border border-[#212941] rounded-xl p-3.5 shadow-md flex items-start gap-3 relative overflow-hidden">
          <div className="w-1.5 self-stretch bg-[#42A5F5] rounded-full shrink-0"></div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[#42A5F5]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                100% Agency Controlled
              </span>
            </div>
            <p className="text-[12px] text-[#cbc3d5] leading-relaxed">
              Clients added here do not receive logins or portal access. All diagnostic flows, AI leak reports, and exports are fully white-labeled for your agency team.
            </p>
          </div>
        </div>

        {/* Multi-Step Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* STEP 1: Entity Details */}
          <section className="bg-[#131b32] border border-[#212941]/70 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#212941]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5d35af] text-[#cdb7ff] font-mono text-[11px] flex items-center justify-center font-bold">
                  1
                </span>
                <h2 className="text-[15px] font-semibold text-[#dbe1ff]">Client Entity Details</h2>
              </div>
              <span className="font-mono text-[10px] text-[#42A5F5] bg-[#212941] px-2 py-0.5 rounded-full font-medium">
                Required
              </span>
            </div>

            {/* Business Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]" htmlFor="client-name">
                Business / Client Name
              </label>
              <div className="relative flex items-center">
                <input
                  id="client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Health Clinic"
                  className="w-full bg-[#212941] text-[#dbe1ff] text-[14px] rounded-lg px-3.5 py-2.5 placeholder:text-[#958e9e] focus:outline-none focus:ring-1 focus:ring-[#42A5F5] transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 text-[#cbc3d5] text-[20px] pointer-events-none">
                  domain
                </span>
              </div>
            </div>

            {/* Industry / Category Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]" htmlFor="industry-select">
                Industry &amp; Diagnostic Model
              </label>
              <div className="relative flex items-center">
                <select
                  id="industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-[#212941] text-[#dbe1ff] text-[14px] rounded-lg px-3.5 py-2.5 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-[#42A5F5] transition-all cursor-pointer"
                >
                  <option value="clinic">Clinic / Healthcare</option>
                  <option value="edtech">Coaching / EdTech</option>
                  <option value="fnb">Restaurant / F&amp;B</option>
                  <option value="realestate">Real Estate</option>
                  <option value="fitness">Gym &amp; Fitness</option>
                  <option value="ecommerce">E-commerce Direct</option>
                  <option value="services">Local Services &amp; Trade</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-[#cbc3d5] text-[20px] pointer-events-none">
                  unfold_more
                </span>
              </div>

              {/* Dynamic Benchmark preview notice */}
              <div className="bg-[#171f36] border border-[#212941] rounded-lg p-2.5 flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-[#42A5F5] text-[16px] shrink-0">
                  analytics
                </span>
                <span className="font-mono text-[10px] text-[#cbc3d5]">
                  {benchmarks[industry] || benchmarks.clinic}
                </span>
              </div>
            </div>

            {/* Internal Agency Code */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]" htmlFor="client-code">
                  Internal Client Code
                </label>
                <span className="font-mono text-[10px] text-[#cbc3d5]/70">Optional tracking ID</span>
              </div>
              <div className="relative flex items-center">
                <input
                  id="client-code"
                  type="text"
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  placeholder="e.g. YAN-902"
                  className="w-full bg-[#212941] text-[#dbe1ff] font-mono text-[14px] rounded-lg px-3.5 py-2.5 placeholder:text-[#958e9e] focus:outline-none focus:ring-1 focus:ring-[#42A5F5] uppercase tracking-wider transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 text-[#cbc3d5] text-[20px] pointer-events-none">
                  tag
                </span>
              </div>
            </div>
          </section>

          {/* STEP 2: Monthly Spend & Channels */}
          <section className="bg-[#131b32] border border-[#212941]/70 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#212941]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5d35af] text-[#cdb7ff] font-mono text-[11px] flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="text-[15px] font-semibold text-[#dbe1ff]">Monthly Spend &amp; Channels</h2>
              </div>
              <span className="font-mono text-[10px] text-[#cbc3d5]">Active Budgets</span>
            </div>

            {/* Budget Range Pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]">
                Budget Tier
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {tiers.map((t, idx) => {
                  const isActive = selectedTier === t.label;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => {
                        setSelectedTier(t.label);
                        setSpendAmount(t.val);
                      }}
                      className={`py-2 px-1.5 rounded-lg font-mono text-[11px] text-center transition-all ${
                        isActive
                          ? 'bg-[#5d35af] text-white font-bold shadow-sm ring-1 ring-[#d1bcff]'
                          : 'bg-[#212941] text-[#cbc3d5] hover:text-white'
                      } ${idx === 4 ? 'col-span-3 sm:col-span-1' : ''}`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exact Estimated Spend */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]" htmlFor="exact-spend">
                  Target Monthly Spend
                </label>
                <span className="font-mono text-[10px] text-[#aac7ff]">INR Currency (₹)</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-mono text-[20px] text-[#42A5F5] pointer-events-none font-bold">
                  ₹
                </span>
                <input
                  id="exact-spend"
                  type="text"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  className="w-full bg-[#212941] text-[#dbe1ff] font-mono text-[20px] font-bold pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#42A5F5] tracking-tight transition-all"
                />
                <span className="material-symbols-outlined absolute right-3 text-[#10B981] text-[20px]">
                  check_circle
                </span>
              </div>
            </div>

            {/* Active Platforms */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]">
                Active Platforms for Audit
              </label>

              {/* Meta Ads */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#212941] cursor-pointer hover:bg-[#2c344c] transition-colors select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#313851] flex items-center justify-center text-[#42A5F5]">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">Meta Ads Engine</span>
                    <span className="font-mono text-[10px] text-[#cbc3d5]">Facebook Feed, Reels &amp; Instagram</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={metaChecked}
                  onChange={(e) => setMetaChecked(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#5d35af] cursor-pointer"
                />
              </label>

              {/* Google Ads */}
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#212941] cursor-pointer hover:bg-[#2c344c] transition-colors select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#313851] flex items-center justify-center text-[#d1bcff]">
                    <span className="material-symbols-outlined text-[20px]">ads_click</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">Google Ads Suite</span>
                    <span className="font-mono text-[10px] text-[#cbc3d5]">Search, Performance Max &amp; YouTube</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={googleChecked}
                  onChange={(e) => setGoogleChecked(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#5d35af] cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* STEP 3: Account Manager Assignment */}
          <section className="bg-[#131b32] border border-[#212941]/70 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#212941]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5d35af] text-[#cdb7ff] font-mono text-[11px] flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-[15px] font-semibold text-[#dbe1ff]">Primary Agency Lead</h2>
              </div>
              <span className="font-mono text-[10px] text-[#cbc3d5]">Alerts Routing</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#cbc3d5]" htmlFor="manager-select">
                Designated Account Manager
              </label>
              <div className="relative flex items-center">
                <select
                  id="manager-select"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full bg-[#212941] text-[#dbe1ff] text-[14px] rounded-lg px-3.5 py-2.5 pr-10 appearance-none focus:outline-none focus:ring-1 focus:ring-[#42A5F5] transition-all cursor-pointer"
                >
                  <option value="Rahul Mehta">Rahul Mehta (Sr. Media Buyer) — 4 active accounts</option>
                  <option value="Priya Sharma">Priya Sharma (Growth Lead) — 2 active accounts</option>
                  <option value="Ankit Kumar">Ankit Kumar (Senior Media Buyer) — 3 active accounts</option>
                  <option value="Sneha Mukherjee">Sneha Mukherjee (Growth Strategist) — 2 active accounts</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-[#cbc3d5] text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>

              <div className="flex items-start gap-1.5 pt-1.5 text-[#cbc3d5]">
                <span className="material-symbols-outlined text-[#F59E0B] text-[16px] shrink-0 mt-0.5">
                  notifications_active
                </span>
                <p className="text-[11px] text-[#cbc3d5]">
                  Designated manager will receive instant WhatsApp &amp; in-app telemetry alerts for critical leakage spikes or uncharacteristic CPM surges.
                </p>
              </div>
            </div>
          </section>

          {/* STEP 4: Live Connection Mode */}
          <section className="bg-[#131b32] border border-[#212941]/70 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#212941]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#5d35af] text-[#cdb7ff] font-mono text-[11px] flex items-center justify-center font-bold">
                  4
                </span>
                <h2 className="text-[15px] font-semibold text-[#dbe1ff]">Telemetry Connection Mode</h2>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {/* Option 1: Partner MCC / BM */}
              <div
                onClick={() => setConnectionMode('partner')}
                className={`p-3.5 rounded-xl cursor-pointer flex flex-col gap-1 transition-all border ${
                  connectionMode === 'partner'
                    ? 'bg-[#212941] border-[#42A5F5] shadow-sm'
                    : 'bg-[#171f36] border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#42A5F5] text-[22px]">
                      corporate_fare
                    </span>
                    <span className="text-[14px] font-semibold text-white">Agency Partner MCC / BM</span>
                  </div>
                  <span className="bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Recommended
                  </span>
                </div>
                <p className="text-[12px] text-[#cbc3d5] mt-1">
                  Link via your agency master dashboard in one click. Discovers all ad accounts already permissioned under your Business Manager.
                </p>
                <div className="flex items-center gap-1 mt-1 text-[#42A5F5] font-mono text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Fastest setup (estimated 30 seconds)</span>
                </div>
              </div>

              {/* Option 2: Direct Account ID */}
              <div
                onClick={() => setConnectionMode('direct')}
                className={`p-3.5 rounded-xl cursor-pointer flex flex-col gap-1 transition-all border ${
                  connectionMode === 'direct'
                    ? 'bg-[#212941] border-[#42A5F5] shadow-sm'
                    : 'bg-[#171f36] border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#958e9e] text-[22px]">
                      pin
                    </span>
                    <span className="text-[14px] font-semibold text-white">Direct Account ID Mapping</span>
                  </div>
                  <span className="bg-[#313851] text-[#cbc3d5] font-mono text-[10px] px-2 py-0.5 rounded-full">
                    Manual
                  </span>
                </div>
                <p className="text-[12px] text-[#cbc3d5] mt-1">
                  Paste standalone Google CID (e.g. 123-456-7890) or Meta Ad Account ID later. Useful for standalone client tokens.
                </p>
              </div>
            </div>
          </section>

          {/* Safeguard / Trust Badge */}
          <div className="bg-[#131b32]/60 border border-[#212941]/50 rounded-lg p-3 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#42A5F5] text-[20px] shrink-0">lock</span>
            <span className="font-mono text-[10px] text-[#cbc3d5] leading-relaxed">
              <strong className="text-white">Read-only ad telemetry.</strong> Yantrika monitors algorithmic variance and leakages. It never modifies your campaigns, bids, or ad spend without explicit manual agency approval.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1 pb-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[14px] text-center tracking-tight shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Provisioning Client Workspace...</span>
                </>
              ) : submitted ? (
                <>
                  <span className="material-symbols-outlined text-[20px] text-[#10B981]">check_circle</span>
                  <span>Client Initialized &amp; Audit Started!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                  <span>Add Client &amp; Start Audit</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 px-4 rounded-lg text-[#cbc3d5] hover:text-[#42A5F5] text-[13px] font-medium text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>Cancel and Return to Roster</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
