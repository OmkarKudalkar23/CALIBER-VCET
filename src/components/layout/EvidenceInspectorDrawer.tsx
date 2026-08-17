import React, { useState } from 'react';
import { EvidenceNode } from '../../types';

interface EvidenceInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvidence?: EvidenceNode | null;
  onInspectLog?: () => void;
}

export const EvidenceInspectorDrawer: React.FC<EvidenceInspectorDrawerProps> = ({
  isOpen,
  onClose,
  selectedEvidence,
  onInspectLog
}) => {
  const [activeTab, setActiveTab] = useState<'chain' | 'metadata' | 'raw'>('chain');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const node = selectedEvidence || {
    id: 'x7f_89a',
    sourceDocId: 'DOC-APP-23-ESG',
    sourceDocName: 'Apple_ESG_Report_FY23_FINAL.pdf',
    score: 0.942,
    level: 'L1' as const,
    batchId: 'BATCH_4492',
    tokenCount: 48,
    content: 'Apple aims to achieve 100 percent carbon neutrality for its supply chain and products by 2030, a goal that requires significant investment in renewable energy projects globally.',
    metadata: {
      section: 'Section 4.2 Climate Strategy',
      page: 14,
      tokens: 48,
      cosineSim: 0.942,
      cacheHit: true,
      hash: 'sha256:7f89a9c21884e901a'
    }
  };

  const handleCopyNodeId = () => {
    navigator.clipboard.writeText(`node_id: ${node.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-[400px] bg-[#ffffff] border-l-2 border-[#111111] shadow-[-5px_0px_0px_0px_#111111] flex flex-col z-45 select-none animate-slideLeft">
      {/* Header */}
      <div className="p-6 border-b-2 border-[#111111] bg-[#f7f3e8] flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline text-xl font-bold text-[#1c1c15] uppercase tracking-tight">
              EVIDENCE INSPECTOR
            </h2>
            <p className="font-mono text-xs text-[#4e4634]">Source Verification Engine</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#e6e2d8] border-2 border-[#111111] bg-[#ffffff] transition-colors cursor-pointer"
            title="Close Inspector"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#111111] bg-[#ffffff]">
        <button
          onClick={() => setActiveTab('chain')}
          className={`flex-1 py-3 border-r-2 border-[#111111] font-mono text-xs uppercase font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'chain'
              ? 'bg-[#2457c5] text-white shadow-[inset_0px_-4px_0px_0px_#111111]'
              : 'text-[#4e4634] hover:bg-[#f2eee3]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">link</span>
          Chain
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex-1 py-3 border-r-2 border-[#111111] font-mono text-xs uppercase font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'metadata'
              ? 'bg-[#2457c5] text-white shadow-[inset_0px_-4px_0px_0px_#111111]'
              : 'text-[#4e4634] hover:bg-[#f2eee3]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">info</span>
          Metadata
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`flex-1 py-3 font-mono text-xs uppercase font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'raw'
              ? 'bg-[#2457c5] text-white shadow-[inset_0px_-4px_0px_0px_#111111]'
              : 'text-[#4e4634] hover:bg-[#f2eee3]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          Raw
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-grow p-6 bg-[#ffffff] overflow-y-auto font-mono">
        {/* Selected Node Box */}
        <div className="mb-6">
          <label className="text-[10px] uppercase text-[#4e4634] mb-1 block font-bold">
            Selected Node Identifier
          </label>
          <div className="p-3 bg-[#fdf9ee] border-2 border-[#111111] flex justify-between items-center shadow-[3px_3px_0px_0px_#111111]">
            <span className="text-xs font-bold text-[#1c1c15]">node_id: {node.id}</span>
            <button
              onClick={handleCopyNodeId}
              className="text-[#755b00] hover:text-[#1c1c15] cursor-pointer"
              title="Copy ID"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: Chain */}
        {activeTab === 'chain' && (
          <div className="space-y-4">
            <h4 className="font-headline font-bold uppercase text-xs border-b-2 border-[#111111] pb-1">
              DAG Trace Path
            </h4>
            <div className="pl-4 border-l-2 border-[#111111] space-y-4 relative ml-2">
              <div className="absolute top-0 -left-[7px] w-3 h-3 bg-[#755b00] border border-[#111111] rounded-full" />
              <div className="absolute bottom-0 -left-[7px] w-3 h-3 bg-[#2457c5] border border-[#111111] rounded-full" />

              <div className="pb-2">
                <span className="text-[10px] bg-[#f4c430] text-[#695200] px-1.5 py-0.5 border border-[#111111] inline-block mb-1 font-bold">
                  SRC
                </span>
                <p className="font-body text-xs font-semibold text-[#1c1c15]">
                  Ingest Batch #{node.batchId || '4492'}
                </p>
                <p className="text-[10px] text-[#4e4634]">{node.sourceDocName}</p>
              </div>

              <div className="pb-2">
                <span className="text-[10px] bg-[#ece8dd] px-1.5 py-0.5 border border-[#111111] inline-block mb-1 font-bold">
                  RESOLUTION STEP ({node.level})
                </span>
                <p className="font-body text-xs text-[#1c1c15] leading-relaxed">
                  "{node.content}"
                </p>
              </div>

              <div>
                <span className="text-[10px] bg-[#638eff] text-[#00276c] px-1.5 py-0.5 border border-[#111111] inline-block mb-1 font-bold">
                  DEST
                </span>
                <p className="font-body text-xs font-semibold text-[#1c1c15]">
                  Query Context Assembled
                </p>
                <div className="mt-2 p-2 bg-[#f7f3e8] border border-[#111111] text-[11px] text-[#4e4634]">
                  Cosine Similarity: <strong className="text-[#2457c5]">{node.score}</strong> | Tokens: {node.tokenCount}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Metadata */}
        {activeTab === 'metadata' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-headline font-bold uppercase text-xs border-b-2 border-[#111111] pb-1">
              Node Manifest
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-[#fdf9ee] border border-[#111111]">
                <div className="text-[9px] text-[#4e4634] uppercase">Source Doc</div>
                <div className="font-bold truncate" title={node.sourceDocName}>{node.sourceDocName}</div>
              </div>
              <div className="p-2 bg-[#fdf9ee] border border-[#111111]">
                <div className="text-[9px] text-[#4e4634] uppercase">Ladder Layer</div>
                <div className="font-bold text-[#755b00]">{node.level} Active</div>
              </div>
              <div className="p-2 bg-[#fdf9ee] border border-[#111111]">
                <div className="text-[9px] text-[#4e4634] uppercase">Token Length</div>
                <div className="font-bold">{node.tokenCount} Tokens</div>
              </div>
              <div className="p-2 bg-[#fdf9ee] border border-[#111111]">
                <div className="text-[9px] text-[#4e4634] uppercase">ANN Cache Hit</div>
                <div className="font-bold text-[#2457c5]">
                  {node.metadata.cacheHit ? 'TRUE (Sub-5ms)' : 'FALSE (ANN Search)'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#f7f3e8] border border-[#111111]">
              <div className="text-[9px] text-[#4e4634] uppercase mb-1">Cryptographic Fingerprint</div>
              <div className="text-[10px] break-all bg-white p-1.5 border border-[#111111]">
                {node.metadata.hash}
              </div>
            </div>

            <div className="p-3 bg-[#f7f3e8] border border-[#111111]">
              <div className="text-[9px] text-[#4e4634] uppercase mb-1">Extraction Section</div>
              <div className="font-body text-xs text-[#1c1c15]">
                {node.metadata.section || 'General Content Partition'}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Raw */}
        {activeTab === 'raw' && (
          <div className="space-y-3">
            <h4 className="font-headline font-bold uppercase text-xs border-b-2 border-[#111111] pb-1">
              Raw Buffer Stream
            </h4>
            <div className="bg-[#1c1c15] text-[#ffdf90] p-3 text-[11px] leading-relaxed overflow-x-auto border border-[#111111] max-h-72">
              <pre className="font-mono">{JSON.stringify(node, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t-2 border-[#111111] bg-[#f7f3e8] mt-auto flex justify-end gap-3 font-mono text-xs font-bold uppercase">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#ffffff] border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#e6e2d8] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={onInspectLog}
          className="px-4 py-2 bg-[#755b00] text-white border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111111] hover:bg-[#584400] transition-all cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">terminal</span>
          Inspect Log
        </button>
      </div>
    </aside>
  );
};
