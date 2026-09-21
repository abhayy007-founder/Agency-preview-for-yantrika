import React, { useState } from 'react';
import { ClientAccount, TeamMember } from '../types';

interface ReassignModalProps {
  client: ClientAccount | null;
  team: TeamMember[];
  onClose: () => void;
  onReassign: (clientId: string, newManagerName: string, newManagerAvatar: string) => void;
  onShowToast: (msg: string) => void;
}

export const ReassignModal: React.FC<ReassignModalProps> = ({
  client,
  team,
  onClose,
  onReassign,
  onShowToast
}) => {
  const [selectedManager, setSelectedManager] = useState(client?.assignedManager || '');

  if (!client) return null;

  const handleSave = () => {
    const manager = team.find(m => m.name === selectedManager);
    if (manager) {
      onReassign(client.id, manager.name, manager.initials);
      onShowToast(`Client ${client.name} reassigned to ${manager.name}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#10182F]/80 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-[#171f36] border border-[#2c344c] rounded-t-2xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto shadow-2xl w-full max-w-md animate-fadeIn">
        <div className="w-12 h-1.5 rounded-full bg-[#2c344c] mx-auto sm:hidden"></div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#42A5F5]">Routing Governance</span>
            <h3 className="text-[17px] font-semibold text-white">Reassign {client.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#212941] flex items-center justify-center text-[#cbc3d5] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[12px] text-[#cbc3d5]">
          Select which senior media buyer or pod manager receives direct WhatsApp &amp; telemetry triage alerts for this client.
        </p>

        <div className="flex flex-col gap-2">
          {team.map((member) => {
            const isSelected = selectedManager === member.name;
            return (
              <div
                key={member.id}
                onClick={() => setSelectedManager(member.name)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#212941] border-[#42A5F5] shadow-sm'
                    : 'bg-[#131b32] border-transparent hover:border-[#2c344c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#5D35AF] to-[#0045F2] flex items-center justify-center font-bold text-white text-[12px]">
                    {member.initials}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium text-white">{member.name}</span>
                      {member.isCurrentUser && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#2c344c] text-[#42A5F5] font-mono">YOU</span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#cbc3d5]">{member.roleTitle}</span>
                  </div>
                </div>

                <span className={`material-symbols-outlined text-[20px] ${
                  isSelected ? 'text-[#42A5F5]' : 'text-[#cbc3d5]/30'
                }`}>
                  {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#5D35AF] to-[#0045F2] text-white font-semibold text-[13px] shadow-lg active:scale-95 transition-all"
          >
            Confirm Reassignment
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-lg bg-[#212941] text-[#cbc3d5] hover:text-white font-medium text-[13px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
