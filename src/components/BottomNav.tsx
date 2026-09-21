import React from 'react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  openLeaksCount: number;
  seatsText: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  openLeaksCount,
  seatsText
}) => {
  const tabs = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: 'dashboard'
    },
    {
      id: 'alerts' as NavTab,
      label: 'Alerts',
      icon: 'warning',
      badge: openLeaksCount > 0 ? openLeaksCount : undefined
    },
    {
      id: 'team' as NavTab,
      label: 'Team',
      icon: 'group',
      dot: true
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports',
      icon: 'analytics'
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: 'settings'
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#10182F]/95 backdrop-blur-xl border-t border-[#212941]/60 shadow-[0_-4px_24px_rgba(0,0,0,0.55)]">
      <div className="flex justify-between items-center h-16 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-14 relative transition-all duration-200 ${
                isActive
                  ? 'text-[#42A5F5] scale-105 font-medium'
                  : 'text-[#cbc3d5] hover:text-[#dbe1ff]'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">
                  {tab.icon}
                </span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-4 text-[9px] font-bold font-mono rounded-full bg-[#EF4444] text-white flex items-center justify-center ring-1 ring-[#10182F]">
                    {tab.badge}
                  </span>
                )}
                {tab.dot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] ring-1 ring-[#10182F]"></span>
                )}
              </div>
              <span className="font-mono text-[10px] tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
