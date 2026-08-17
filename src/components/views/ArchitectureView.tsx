import React, { useState } from 'react';
import { EvidenceNode } from '../../types';

interface ArchitectureViewProps {
  onSelectNode: (node: EvidenceNode) => void;
  onOpenInspector: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  onSelectNode,
  onOpenInspector
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'ALL' | 'INDEX' | 'QUERY'>('ALL');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExportSvg = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleNodeClick = (nodeName: string, phase: string, desc: string) => {
    const node: EvidenceNode = {
      id: `node-${nodeName.toLowerCase()}`,
      sourceDocId: 'DOC-APP-23-ESG',
      sourceDocName: 'Corpus Architecture Graph',
      score: 0.965,
      level: 'L2',
      batchId: 'DAG_TOPOLOGY_V2',
      tokenCount: 64,
      content: `[ARCH NODE: ${nodeName}] ${desc}`,
      metadata: {
        section: `${phase} Phase Execution Graph`,
        tokens: 64,
        cosineSim: 0.965,
        cacheHit: true,
        hash: `sha256:${nodeName.toLowerCase()}_commit_hash_99`
      }
    };
    onSelectNode(node);
    onOpenInspector();
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#1c1c15] pb-4 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-[#1c1c15] uppercase tracking-tighter leading-none mb-2">
            ARCHITECTURE DIAGRAM
          </h2>
          <p className="font-body text-sm text-[#4e4634] max-w-2xl">
            Visualizing the distinct operational phases: Heavy indexing workloads versus lightweight, optimized query execution paths within the CALIBER ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="border-2 border-[#1c1c15] bg-[#ffffff] shadow-[3px_3px_0px_0px_#111111] p-1 flex font-mono text-xs">
            {(['ALL', 'INDEX', 'QUERY'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPhase(p)}
                className={`px-3 py-1 font-bold uppercase transition-colors cursor-pointer ${
                  selectedPhase === p ? 'bg-[#f4c430] text-[#695200]' : 'hover:bg-[#e6e2d8]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportSvg}
            className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[3px_3px_0px_0px_#111111] px-4 py-2 font-mono text-xs uppercase font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 hover:bg-[#e6e2d8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            {copiedNotification ? 'SVG EXPORTED' : 'EXPORT SVG'}
          </button>
        </div>
      </div>

      {/* Data Flow Topology Banner */}
      <div className="w-full bg-[#fdf9ee] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] p-4 flex justify-between items-center relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-3 h-3 bg-[#755b00] border border-[#111111]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1c1c15]">
            DATA FLOW TOPOLOGY: ASYMMETRIC LATENCY MATRIX
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#4e4634] relative z-10 hidden sm:inline">
          SYS_CONF // LADDER_TOPOLOGY_V2.1
        </span>
      </div>

      {/* Visual Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: INDEX TIME (HEAVY) */}
        {(selectedPhase === 'ALL' || selectedPhase === 'INDEX') && (
          <div className="border-2 border-[#1c1c15] bg-[#ffffff] shadow-[5px_5px_0px_0px_#111111] p-6 flex flex-col justify-between relative group hover:border-[#755b00] transition-colors">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1c1c15] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#755b00]">dns</span>
                    INDEX TIME (HEAVY)
                  </h3>
                  <p className="font-mono text-xs text-[#5f5e5e] mt-1 font-semibold">
                    Off-line Asynchronous Transformation Pipeline
                  </p>
                </div>
                <span className="border-2 border-[#1c1c15] bg-[#ece8dd] px-2.5 py-1 font-mono text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_#111111]">
                  BATCH PROCESSING
                </span>
              </div>

              {/* Steps Flow */}
              <div className="space-y-4 relative pl-4 border-l-2 border-dashed border-[#1c1c15]">
                {/* Step 1 */}
                <div 
                  onClick={() => handleNodeClick('INGEST', 'INDEX', 'Raw unstructured data parsing. High CPU overhead.')}
                  className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[3px_3px_0px_0px_#111111] relative hover:bg-[#f4c430] transition-all cursor-pointer"
                >
                  <div className="absolute -left-[23px] top-3.5 w-3 h-3 bg-[#1c1c15] rounded-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-[#1c1c15]">1. INGEST</span>
                    <span className="font-mono text-[10px] text-[#4e4634]">PDF, XLSX, DOCX</span>
                  </div>
                  <p className="font-body text-xs text-[#4e4634]">
                    Raw unstructured data parsing. High CPU overhead.
                  </p>
                </div>

                {/* Step 2 */}
                <div 
                  onClick={() => handleNodeClick('CHUNK', 'INDEX', 'Semantic segmentation. Token limit awareness critical.')}
                  className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[3px_3px_0px_0px_#111111] relative hover:bg-[#f4c430] transition-all cursor-pointer"
                >
                  <div className="absolute -left-[23px] top-3.5 w-3 h-3 bg-[#1c1c15] rounded-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-[#1c1c15]">2. CHUNK</span>
                    <span className="font-mono text-[10px] text-[#4e4634]">SEMANTIC BOUNDS</span>
                  </div>
                  <p className="font-body text-xs text-[#4e4634]">
                    Semantic segmentation. Token limit awareness critical.
                  </p>
                </div>

                {/* Step 3 */}
                <div 
                  onClick={() => handleNodeClick('LADDER', 'INDEX', 'Hierarchical indexing mechanism. Generates metadata layers L0, L1, L2, L3.')}
                  className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[3px_3px_0px_0px_#111111] relative hover:bg-[#f4c430] transition-all cursor-pointer"
                >
                  <div className="absolute -left-[23px] top-3.5 w-3 h-3 bg-[#1c1c15] rounded-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-[#755b00]">3. RESOLUTION LADDER</span>
                    <span className="font-mono text-[10px] text-[#755b00] font-bold">L0 - L3</span>
                  </div>
                  <p className="font-body text-xs text-[#4e4634]">
                    Hierarchical indexing mechanism. Generates metadata layers & atomic propositions.
                  </p>
                </div>

                {/* Step 4: Vector DB */}
                <div 
                  onClick={() => handleNodeClick('VECTOR_DB', 'INDEX', 'High latency write operations. Durable storage layer.')}
                  className="bg-[#1c1c15] text-white border-2 border-[#1c1c15] p-3 shadow-[3px_3px_0px_0px_#111111] relative hover:bg-[#313129] transition-all cursor-pointer"
                >
                  <div className="absolute -left-[23px] top-3.5 w-3 h-3 bg-[#f4c430] rounded-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-[#ffdf90]">4. VECTOR DB (PERSIST)</span>
                    <span className="font-mono text-[10px] bg-[#f4c430] text-[#695200] px-1 font-bold">COMMIT</span>
                  </div>
                  <p className="font-body text-xs text-[#c8c6c5]">
                    High latency write operations. Sharded index storage layer.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="mt-8 pt-4 border-t-2 border-[#1c1c15] flex justify-between font-mono text-xs">
              <span className="text-[#5f5e5e]">Throughput: <strong>1.4k docs/min</strong></span>
              <span className="text-[#755b00] font-bold">Latency: ~450ms</span>
            </div>
          </div>
        )}

        {/* Right Side: QUERY TIME (LIGHT) */}
        {(selectedPhase === 'ALL' || selectedPhase === 'QUERY') && (
          <div className="border-2 border-[#1c1c15] bg-[#ffffff] shadow-[5px_5px_0px_0px_#111111] p-6 flex flex-col justify-between relative group hover:border-[#2457c5] transition-colors">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1c1c15] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#2457c5]">bolt</span>
                    QUERY TIME (LIGHT)
                  </h3>
                  <p className="font-mono text-xs text-[#5f5e5e] mt-1 font-semibold">
                    Real-time Inference Path & Minimal Context Window
                  </p>
                </div>
                <span className="border-2 border-[#1c1c15] bg-[#f4c430] text-[#695200] px-2.5 py-1 font-mono text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_#111111]">
                  REAL-TIME INFERENCE
                </span>
              </div>

              {/* Execution Flow Steps */}
              <div className="space-y-4 relative pl-4 border-l-2 border-dashed border-[#1c1c15]">
                {/* Step 1 & 2 */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => handleNodeClick('RETRIEVE', 'QUERY', 'Dual sparse + dense lookup from ANN cache.')}
                    className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[2px_2px_0px_0px_#111111] hover:bg-[#638eff]/20 transition-all cursor-pointer"
                  >
                    <span className="font-mono text-xs font-bold block mb-1">RETRIEVE</span>
                    <p className="font-body text-[11px] text-[#4e4634]">Dense ANN & BM25</p>
                  </div>
                  <div 
                    onClick={() => handleNodeClick('CLEAN', 'QUERY', 'De-noise raw text and normalize encodings.')}
                    className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[2px_2px_0px_0px_#111111] hover:bg-[#638eff]/20 transition-all cursor-pointer"
                  >
                    <span className="font-mono text-xs font-bold block mb-1">CLEAN</span>
                    <p className="font-body text-[11px] text-[#4e4634]">De-noise & filter</p>
                  </div>
                </div>

                {/* Step 3 & 4 */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => handleNodeClick('DEDUP', 'QUERY', 'Semantic hash cluster deduplication.')}
                    className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[2px_2px_0px_0px_#111111] hover:bg-[#638eff]/20 transition-all cursor-pointer"
                  >
                    <span className="font-mono text-xs font-bold block mb-1">DEDUP</span>
                    <p className="font-body text-[11px] text-[#4e4634]">Cluster prune</p>
                  </div>
                  <div 
                    onClick={() => handleNodeClick('SELECT', 'QUERY', 'Dynamic resolution layer budget selection.')}
                    className="bg-[#fdf9ee] border-2 border-[#1c1c15] p-3 shadow-[2px_2px_0px_0px_#111111] hover:bg-[#638eff]/20 transition-all cursor-pointer"
                  >
                    <span className="font-mono text-xs font-bold block mb-1 text-[#755b00]">SELECT</span>
                    <p className="font-body text-[11px] text-[#4e4634]">Ladder knapsack</p>
                  </div>
                </div>

                {/* Step 5: Assemble */}
                <div 
                  onClick={() => handleNodeClick('ASSEMBLE', 'QUERY', 'Construct final prompt context window. Low latency execution.')}
                  className="bg-[#2457c5] text-white border-2 border-[#1c1c15] p-3.5 shadow-[3px_3px_0px_0px_#111111] relative hover:bg-[#003fa5] transition-all cursor-pointer"
                >
                  <div className="absolute -left-[23px] top-3.5 w-3 h-3 bg-[#2457c5] rounded-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-white">ASSEMBLE CONTEXT</span>
                    <span className="font-mono text-[10px] bg-white text-[#00276c] px-1 font-bold">EMIT</span>
                  </div>
                  <p className="font-body text-xs text-[#dbe1ff]">
                    Construct final prompt context window. Low latency execution.
                  </p>
                </div>

                {/* Sys Note Box */}
                <div className="p-3 bg-[#ece8dd] border border-[#111111] font-mono text-[11px] text-[#4e4634]">
                  <strong className="text-[#1c1c15]">SYS_NOTE:</strong> Query path bypasses raw document disk reads entirely, streaming directly from pre-compiled L1/L2 proposition memory partitions.
                </div>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="mt-8 pt-4 border-t-2 border-[#1c1c15] flex justify-between font-mono text-xs">
              <span className="text-[#5f5e5e]">Token Budget: <strong>768 Max</strong></span>
              <span className="text-[#2457c5] font-bold">Latency: 5.2ms p99</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
