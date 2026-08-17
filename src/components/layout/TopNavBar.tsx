import React, { useState } from 'react';
import { LadderLevel, NavScreen } from '../../types';

interface TopNavBarProps {
  currentScreen: NavScreen;
  activeLevel?: LadderLevel;
  onSelectLevel?: (level: LadderLevel) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onToggleInspector?: () => void;
  isInspectorOpen?: boolean;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentScreen,
  activeLevel = 'L2',
  onSelectLevel,
  onSearch,
  searchQuery = '',
  onToggleInspector,
  isInspectorOpen = false
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showHealthModal, setShowHealthModal] = useState(false);

  const getScreenContext = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'System Overview & Metrics';
      case 'inventory':
        return 'Data Source Manager';
      case 'document-detail':
        return 'Resolution Ladder Inspector';
      case 'query-lab':
        return 'Budgeted Query Execution';
      case 'architecture':
        return 'Data Flow Topology';
      case 'index-hero':
        return 'Technical Video & Resolution Matrix';
      case 'pipelines':
        return 'ETL & Inference Pipelines';
      case 'settings':
        return 'ANN Caching & Thresholds';
      default:
        return 'Industrial Intelligence';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="fixed top-0 right-0 left-[250px] h-16 bg-[#fdf9ee] border-b-2 border-[#1c1c15] flex justify-between items-center px-6 z-40 select-none">
      {/* Left Title & Subtitle */}
      <div className="flex items-center gap-3">
        <span className="font-headline text-lg font-bold text-[#1c1c15] uppercase tracking-tight">
          CALIBER WORKBENCH
        </span>
        <div className="h-4 w-0.5 bg-[#1c1c15] opacity-40 mx-1" />
        <span className="font-mono text-xs text-[#4e4634] uppercase font-semibold hidden sm:inline">
          {getScreenContext()}
        </span>
      </div>

      {/* Center: Resolution Ladder Level Switcher */}
      <nav className="flex items-center gap-6 h-full font-mono text-sm uppercase">
        {(['L0', 'L1', 'L2', 'L3'] as LadderLevel[]).map((lvl) => {
          const isActive = activeLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => onSelectLevel?.(lvl)}
              title={`${lvl}: ${
                lvl === 'L0'
                  ? 'Raw Unstructured Extraction'
                  : lvl === 'L1'
                  ? 'Atomic Propositions & Evidence'
                  : lvl === 'L2'
                  ? 'Proposition Gist & Structured Table'
                  : 'Vector Embedding Space (1536-dim)'
              }`}
              className={`h-full flex items-center px-2 transition-all font-bold cursor-pointer border-b-2 ${
                isActive
                  ? 'text-[#755b00] border-[#755b00]'
                  : 'text-[#4e4634] border-transparent hover:text-[#755b00] hover:border-[#755b00]/40'
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* System Monitoring Action Buttons */}
        <div className="flex items-center gap-1 text-[#4e4634]">
          <button 
            onClick={() => setShowHealthModal(!showHealthModal)}
            title="System Health: 99.99% Nominal"
            className="p-1.5 border-2 border-transparent hover:border-[#111111] hover:bg-[#e6e2d8] transition-all text-[#4e4634] hover:text-[#1c1c15] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
          </button>
          <button 
            onClick={() => setShowHealthModal(!showHealthModal)}
            title="Database Shards: 16/16 Healthy"
            className="p-1.5 border-2 border-transparent hover:border-[#111111] hover:bg-[#e6e2d8] transition-all text-[#4e4634] hover:text-[#1c1c15] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">database</span>
          </button>
          <button 
            onClick={() => setShowHealthModal(!showHealthModal)}
            title="Query Latency: p99 5.2ms"
            className="p-1.5 border-2 border-transparent hover:border-[#111111] hover:bg-[#e6e2d8] transition-all text-[#4e4634] hover:text-[#1c1c15] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">query_stats</span>
          </button>
        </div>

        {/* Global Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[#4e4634] text-[18px]">search</span>
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="SEARCH SYSTEM..."
            className="pl-8 pr-3 py-1.5 bg-[#ffffff] border-2 border-[#1c1c15] font-mono text-xs focus:outline-none focus:shadow-[4px_4px_0px_0px_#111111] transition-shadow w-48 sm:w-60 placeholder-[#4e4634]"
          />
        </div>

        {/* Toggle Evidence Inspector Drawer */}
        <button
          onClick={onToggleInspector}
          title="Toggle Evidence Inspector Drawer"
          className={`px-2.5 py-1.5 border-2 border-[#1c1c15] font-mono text-xs uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isInspectorOpen
              ? 'bg-[#2457c5] text-white shadow-[2px_2px_0px_0px_#111111]'
              : 'bg-[#ffffff] text-[#1c1c15] hover:bg-[#e6e2d8] shadow-[3px_3px_0px_0px_#111111]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span className="hidden lg:inline">Inspector</span>
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#e6e2d8] border-2 border-[#1c1c15] shadow-[2px_2px_0px_0px_#111111] overflow-hidden shrink-0">
          <img
            alt="Operator Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvhdMGFkgA4QIVGxISMV4IGSmm3p6i3b_opFTsR_U0t55E6b94s1kU03jFl-_lS-BGmpI6ANMwv0_r4kieGT8cLqXH_dKI6kimHKazOMgxbtVb9eH9K_sOvd-URt4bqFN-GsDiuAfcfA4uCF2bwkQjeEcnahfxlEeKNTNk1LKAhLCnnNIv_8-9HcPMQrpR-i2wsSSR9ig3hicJw7bmpAewXdrNxKhBHDyeKcnhhrrvEyeAkYcFv4-m"
          />
        </div>
      </div>

      {/* Health Status Quick Popover */}
      {showHealthModal && (
        <div className="absolute right-24 top-16 bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] p-4 w-72 z-50 animate-fadeIn">
          <div className="flex justify-between items-center border-b-2 border-[#1c1c15] pb-2 mb-3">
            <span className="font-headline font-bold text-xs uppercase">CALIBER Engine Cluster</span>
            <button 
              onClick={() => setShowHealthModal(false)}
              className="font-mono text-xs font-bold hover:text-[#ba1a1a]"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-[#4e4634]">Index Shards:</span>
              <span className="font-bold text-[#755b00]">16/16 Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4e4634]">ANN Cache Rate:</span>
              <span className="font-bold text-[#2457c5]">94.8% Hit</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4e4634]">Inference Latency:</span>
              <span className="font-bold text-[#1c1c15]">5.2ms p99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4e4634]">Deduplication:</span>
              <span className="font-bold text-[#755b00]">Enabled (Exact+Sem)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
