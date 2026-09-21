import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClear: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClear();
    }, 2800);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-[#212941] border border-[#2c344c] px-4 py-2.5 rounded-lg shadow-2xl animate-fadeIn">
      <span className="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
      <span className="text-[12px] text-white font-medium">{message}</span>
    </div>
  );
};
