import React, { useState, useEffect } from 'react';
import { LogEntry, SystemMetrics } from '../../types';

interface DashboardViewProps {
  metrics: SystemMetrics;
  logs: LogEntry[];
  onOpenQueryLab: () => void;
  onOpenInventory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  logs: initialLogs,
  onOpenQueryLab,
  onOpenInventory
}) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isLive, setIsLive] = useState(true);
  const [tokenSavingsMultiplier, setTokenSavingsMultiplier] = useState(1);

  // Live log simulation generator
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const sampleMessages: { level: LogEntry['level']; message: string; module: string }[] = [
        { level: 'INFO', message: `ANN Cache query served in ${(Math.random() * 2 + 3).toFixed(1)}ms. Zero DB hit.`, module: 'ANN_CACHE' },
        { level: 'INFO', message: `Resolution ladder L2 active for query context budget ${(Math.floor(Math.random() * 200) + 300)} tokens.`, module: 'LADDER' },
        { level: 'WARN', message: 'Token budget tight on shard 02. Pruning low-relevance L0 chunks.', module: 'SELECT' },
        { level: 'INFO', message: `Batch ingest completed for shard partition gs://caliber-data/batch_${Math.floor(Math.random() * 90 + 10)}.`, module: 'INGEST' },
        { level: 'SYS', message: 'Heartbeat: All 16 vector partitions synced with zero drift.', module: 'SUPERVISOR' }
      ];

      const chosen = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const newLog: LogEntry = {
        id: `live-${Date.now()}`,
        timestamp: time,
        level: chosen.level,
        message: chosen.message,
        module: chosen.module
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 40)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Top Header: System Status */}
      <header className="w-full flex items-center justify-between border-2 border-[#1c1c15] bg-[#ffffff] p-4 shadow-[5px_5px_0px_0px_#1c1c15]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-[#1c1c15]">terminal</span>
          <h2 className="font-headline text-xl font-bold uppercase tracking-tight text-[#1c1c15]">
            System Overview
          </h2>
        </div>
        <div className="flex items-center gap-2 border-2 border-[#1c1c15] bg-[#f7f3e8] px-3 py-1.5 shadow-[2px_2px_0px_0px_#111111]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2457c5] animate-pulse border border-[#111111]" />
          <span className="font-mono text-xs font-bold uppercase text-[#2457c5] tracking-wider">
            PRODUCTION INDEX: HEALTHY
          </span>
        </div>
      </header>

      {/* Metric Strip (4 Cards) */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-2 border-[#1c1c15] bg-[#ffffff] divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#1c1c15] shadow-[5px_5px_0px_0px_#1c1c15]">
        {/* Metric 1 */}
        <div className="p-6 flex flex-col justify-center bg-[#ffffff] hover:bg-[#f7f3e8] transition-colors">
          <span className="font-mono text-xs text-[#5f5e5e] uppercase mb-2 flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[15px]">view_in_ar</span> Total Chunks
          </span>
          <span className="font-mono text-4xl font-bold tracking-tighter text-[#1c1c15]">
            {metrics.totalChunks.toLocaleString()}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-6 flex flex-col justify-center bg-[#ffffff] hover:bg-[#f7f3e8] transition-colors">
          <span className="font-mono text-xs text-[#5f5e5e] uppercase mb-2 flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[15px]">gps_fixed</span> Avg Recall
          </span>
          <span className="font-mono text-4xl font-bold tracking-tighter text-[#1c1c15]">
            {metrics.avgRecall}
            <span className="text-xl text-[#4e4634] font-normal">%</span>
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-6 flex flex-col justify-center bg-[#ffffff] hover:bg-[#f7f3e8] transition-colors">
          <span className="font-mono text-xs text-[#5f5e5e] uppercase mb-2 flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[15px]">speed</span> p99 Latency
          </span>
          <span className="font-mono text-4xl font-bold tracking-tighter text-[#1c1c15]">
            {metrics.p99LatencyMs}
            <span className="text-xl text-[#4e4634] font-normal">ms</span>
          </span>
        </div>

        {/* Metric 4 (Highlight) */}
        <div className="p-6 flex flex-col justify-center bg-[#f4c430] hover:bg-[#e6b82d] transition-colors">
          <span className="font-mono text-xs text-[#695200] uppercase mb-2 flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-[15px]">compress</span> Cost Reduction
          </span>
          <span className="font-mono text-4xl font-bold tracking-tighter text-[#695200]">
            {metrics.costReductionFactor}
            <span className="text-xl opacity-80 font-normal">x</span>
          </span>
        </div>
      </section>

      {/* Bottom Row: Context Efficiency Chart & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Context Efficiency Chart */}
        <section className="lg:col-span-6 border-2 border-[#1c1c15] bg-[#ffffff] p-6 shadow-[5px_5px_0px_0px_#1c1c15] flex flex-col">
          <div className="flex justify-between items-end border-b-2 border-[#1c1c15] pb-3 mb-6">
            <div>
              <h3 className="font-headline text-lg font-bold uppercase text-[#1c1c15]">
                Context Efficiency
              </h3>
              <p className="font-body text-sm text-[#5f5e5e] mt-1">
                Token consumption per generated inference.
              </p>
            </div>
            <div className="border-2 border-[#1c1c15] bg-[#f4c430] text-[#695200] px-3 py-1 font-mono text-xs font-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_#111111]">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              -86.9% REDUCTION
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6 py-2">
            {/* Bar 1: Naive RAG */}
            <div className="relative w-full">
              <div className="flex justify-between font-mono text-xs uppercase mb-1.5 text-[#1c1c15] font-semibold">
                <span>Naive RAG Approach (Full Document Dumps)</span>
                <span className="text-[#5f5e5e] font-bold">2,940 Tokens</span>
              </div>
              <div className="w-full h-8 border-2 border-[#1c1c15] bg-[#e6e2d8] relative overflow-hidden shadow-[2px_2px_0px_0px_#111111]">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#1c1c15] transition-all duration-500" 
                  style={{ width: '90%' }}
                />
              </div>
            </div>

            {/* Bar 2: CALIBER Engine */}
            <div className="relative w-full">
              <div className="flex justify-between font-mono text-xs uppercase mb-1.5 text-[#1c1c15] font-semibold">
                <span>CALIBER Engine (Resolution Layered Assembly)</span>
                <span className="text-[#755b00] font-bold">384 Tokens</span>
              </div>
              <div className="w-full h-8 border-2 border-[#1c1c15] bg-[#e6e2d8] relative overflow-hidden shadow-[2px_2px_0px_0px_#111111]">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#f4c430] border-r-2 border-[#1c1c15] flex items-center justify-end px-2 transition-all duration-500"
                  style={{ width: '15%' }}
                >
                  <div className="w-1 h-4 bg-[#1c1c15] opacity-50" />
                </div>
              </div>
            </div>

            {/* Quick Interactive Slider Simulator */}
            <div className="mt-4 p-4 border-2 border-[#1c1c15] bg-[#f7f3e8]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold uppercase text-[#1c1c15]">
                  Live Token Economy Multiplier:
                </span>
                <span className="font-mono text-xs font-bold text-[#2457c5]">
                  {tokenSavingsMultiplier}x Workload Scale
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={tokenSavingsMultiplier}
                onChange={(e) => setTokenSavingsMultiplier(Number(e.target.value))}
                className="w-full accent-[#755b00] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#5f5e5e] mt-1">
                <span>1M queries/day: Save ${(1820 * tokenSavingsMultiplier).toLocaleString()} USD</span>
                <button
                  onClick={onOpenQueryLab}
                  className="text-[#755b00] font-bold hover:underline cursor-pointer"
                >
                  Test In Query Lab →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* System Logs (Terminal) */}
        <section className="lg:col-span-6 border-2 border-[#1c1c15] bg-[#1c1c15] shadow-[5px_5px_0px_0px_#1c1c15] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center border-b-2 border-[#1c1c15] bg-[#ffffff] p-3">
            <h3 className="font-headline text-base font-bold uppercase text-[#1c1c15] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Pipeline Logs
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`font-mono text-xs px-2 py-0.5 border border-[#111111] uppercase font-bold cursor-pointer transition-colors ${
                  isLive ? 'bg-[#2457c5] text-white' : 'bg-[#e6e2d8] text-[#1c1c15]'
                }`}
              >
                {isLive ? '● LIVE' : '❚❚ PAUSED'}
              </button>
              <button
                onClick={() => setLogs([])}
                className="font-mono text-xs text-[#5f5e5e] hover:text-[#1c1c15] px-1 font-bold cursor-pointer"
                title="Clear Logs"
              >
                CLEAR
              </button>
            </div>
          </div>

          <div className="flex-1 p-3.5 bg-[#1c1c15] text-[#ffdf90] font-mono text-xs leading-relaxed overflow-y-auto max-h-[340px] space-y-2">
            {logs.length === 0 ? (
              <div className="text-center text-[#c8c6c5] py-8">No log events in buffer.</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-2.5 opacity-85 hover:opacity-100 transition-opacity hover:bg-[#313129] p-1 rounded-none border-b border-[#313129]"
                >
                  <span className="w-16 shrink-0 text-[#c8c6c5] font-mono text-[11px]">
                    {log.timestamp}
                  </span>
                  <span
                    className={`font-bold shrink-0 text-[11px] ${
                      log.level === 'ERR!'
                        ? 'text-[#ffdad6] bg-[#ba1a1a] px-1'
                        : log.level === 'WARN'
                        ? 'text-[#f4c430]'
                        : log.level === 'SYS'
                        ? 'text-[#b3c5ff]'
                        : 'text-[#638eff]'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="break-all text-white text-[11px] flex-1">
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div className="flex gap-2 text-[#b3c5ff] opacity-80 pt-1">
              <span className="w-16 shrink-0 text-[#c8c6c5]">--:--:--</span>
              <span className="font-bold">[SYS]</span>
              <span className="animate-pulse">Awaiting next batch stream..._</span>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="flex flex-wrap gap-4 pt-2">
        <button
          onClick={onOpenInventory}
          className="flex-1 min-w-[200px] p-4 bg-[#ffffff] border-2 border-[#1c1c15] shadow-[4px_4px_0px_0px_#111111] hover:bg-[#f7f3e8] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-between font-headline font-bold uppercase cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#755b00]">inventory_2</span>
            <span>Browse Document Inventory</span>
          </div>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <button
          onClick={onOpenQueryLab}
          className="flex-1 min-w-[200px] p-4 bg-[#f4c430] border-2 border-[#1c1c15] shadow-[4px_4px_0px_0px_#111111] hover:bg-[#e6b82d] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-between font-headline font-bold uppercase cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#695200]">play_arrow</span>
            <span>Execute Budgeted Query Lab</span>
          </div>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
