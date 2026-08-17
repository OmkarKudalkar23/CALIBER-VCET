import React from 'react';
import { NavScreen } from '../../types';

interface SideNavBarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  onOpenNewPipeline: () => void;
  onOpenDocs: () => void;
  onOpenSupport: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentScreen,
  onNavigate,
  onOpenNewPipeline,
  onOpenDocs,
  onOpenSupport
}) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-[250px] bg-[#fdf9ee] border-r-2 border-[#1c1c15] flex flex-col gap-2 p-6 z-50 select-none overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 
          onClick={() => onNavigate('index-hero')}
          className="font-headline text-2xl font-bold text-[#1c1c15] uppercase tracking-tighter cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-2xl">deployed_code</span>
          CALIBER
        </h1>
        <p className="font-mono text-xs text-[#4e4634] mt-1 font-semibold">V2.0.4-STABLE</p>
        
        {/* Operator Badge */}
        <div className="mt-3 flex items-center gap-2 border-2 border-[#1c1c15] p-1.5 bg-[#f7f3e8] shadow-[2px_2px_0px_0px_#111111]">
          <div className="w-7 h-7 rounded-full bg-[#e6e2d8] border-2 border-[#1c1c15] overflow-hidden shrink-0">
            <img 
              alt="CALIBER System Operator"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCrHSc1dV6k1yVPlXkaITpMOiPbk6425UEkJ-seYo4W6Ms6DKrr89Evv2HWXFilPdEi9c5yCIWTWsJ4t7bGT1ZpzRcOBopV8TiEfUJnaTVuBhg2ajkaWa45F3CE5iOb6d3oQHn7ZaSxiDgoR4VUcG0zhiW9adxc-rffwPGgyGN3qkKwPsYXXHEEaH6QFKYH2rXX8YmlFbzWV4pchJNhU54HxgyfpbVgCXB0F6ptUoxZLWtra8pn-E2" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] font-bold text-[#1c1c15] truncate">OPERATOR_01</span>
            <span className="font-mono text-[9px] text-[#2457c5] font-bold tracking-wider">SYS_ADMIN</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onOpenNewPipeline}
        className="w-full bg-[#f4c430] text-[#695200] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[5px_5px_0px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111111] font-mono text-xs font-bold uppercase py-2.5 px-3 mb-4 transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px] font-bold group-hover:rotate-90 transition-transform">add</span>
        <span>NEW PIPELINE</span>
      </button>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1.5 flex-grow font-headline">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'dashboard'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: currentScreen === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span className="font-mono text-xs uppercase font-semibold">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('inventory')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'inventory' || currentScreen === 'document-detail'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: (currentScreen === 'inventory' || currentScreen === 'document-detail') ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span>
          <span className="font-mono text-xs uppercase font-semibold">Inventory</span>
        </button>

        <button
          onClick={() => onNavigate('query-lab')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'query-lab'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: currentScreen === 'query-lab' ? "'FILL' 1" : "'FILL' 0" }}>terminal</span>
          <span className="font-mono text-xs uppercase font-semibold">Query Lab</span>
        </button>

        <button
          onClick={() => onNavigate('architecture')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'architecture'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: currentScreen === 'architecture' ? "'FILL' 1" : "'FILL' 0" }}>account_tree</span>
          <span className="font-mono text-xs uppercase font-semibold">Architecture</span>
        </button>

        <button
          onClick={() => onNavigate('index-hero')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'index-hero'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: currentScreen === 'index-hero' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="font-mono text-xs uppercase font-semibold">Home & Video</span>
        </button>

        <button
          onClick={() => onNavigate('pipelines')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'pipelines'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: currentScreen === 'pipelines' ? "'FILL' 1" : "'FILL' 0" }}>hub</span>
          <span className="font-mono text-xs uppercase font-semibold">Pipelines</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-3 p-2.5 text-left transition-all border-2 cursor-pointer ${
            currentScreen === 'settings'
              ? 'bg-[#f4c430] text-[#695200] border-[#111111] shadow-[4px_4px_0px_0px_#111111] -translate-x-[2px] -translate-y-[2px] font-bold'
              : 'text-[#4e4634] border-transparent hover:bg-[#e6e2d8] hover:text-[#1c1c15]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: currentScreen === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
          <span className="font-mono text-xs uppercase font-semibold">Settings</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto border-t-2 border-[#1c1c15] pt-3 flex flex-col gap-1">
        <button
          onClick={onOpenDocs}
          className="flex items-center gap-2.5 p-2 text-[#4e4634] hover:bg-[#e6e2d8] hover:text-[#1c1c15] transition-all font-mono text-xs text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span>Docs & Specs</span>
        </button>
        <button
          onClick={onOpenSupport}
          className="flex items-center gap-2.5 p-2 text-[#4e4634] hover:bg-[#e6e2d8] hover:text-[#1c1c15] transition-all font-mono text-xs text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">contact_support</span>
          <span>Support</span>
        </button>

        {/* System Operator Footer Status */}
        <div className="mt-2 flex items-center gap-2 p-2 border-2 border-[#1c1c15] bg-[#f7f3e8] shadow-[2px_2px_0px_0px_#111111]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2457c5] animate-pulse border border-[#111111]" />
          <span className="font-mono text-[10px] uppercase font-bold text-[#1c1c15]">SYS_OP ONLINE</span>
        </div>
      </div>
    </nav>
  );
};
