import React from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1c1c15]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
      <div className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[8px_8px_0px_0px_#111111] max-w-2xl w-full p-6 flex flex-col gap-6 animate-fadeIn max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b-2 border-[#1c1c15] pb-3">
          <div>
            <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1c1c15] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2457c5]">menu_book</span>
              CALIBER Technical Documentation
            </h3>
            <p className="font-mono text-xs text-[#4e4634] mt-1 font-semibold">
              Cache-Aware Layered Index for Budgeted Evidence Retrieval Architecture Specs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#111111] hover:bg-[#e6e2d8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs text-[#1c1c15] leading-relaxed">
          <div className="p-3 bg-[#fdf9ee] border-2 border-[#111111]">
            <h4 className="font-headline font-bold uppercase text-sm mb-1 text-[#755b00]">
              The Core Problem: Context Bloat in RAG
            </h4>
            <p className="font-body text-xs text-[#4e4634]">
              Traditional retrieval-augmented generation dumps hundreds of irrelevant raw chunks into the prompt context window, wasting GPU memory, elevating inference costs, and confusing attention heads.
            </p>
          </div>

          <div className="p-3 bg-[#fdf9ee] border-2 border-[#111111]">
            <h4 className="font-headline font-bold uppercase text-sm mb-1 text-[#2457c5]">
              The Solution: 4-Layer Resolution Ladders
            </h4>
            <div className="space-y-2 font-mono text-xs mt-2">
              <div><strong>L0: Lossless Raw Text</strong> - Preserves exact bytes and provenance offsets for auditing.</div>
              <div><strong>L1: Atomic Propositions</strong> - Standalone verifiable factlets with similarity metrics.</div>
              <div><strong>L2: Proposition Gist Matrix</strong> - Tabular key-value extractions and structured summaries.</div>
              <div><strong>L3: Vector Embeddings</strong> - 1536-dimensional space for sub-millisecond nearest neighbor search.</div>
            </div>
          </div>

          <div className="p-3 bg-[#fdf9ee] border-2 border-[#111111]">
            <h4 className="font-headline font-bold uppercase text-sm mb-1 text-[#1c1c15]">
              Asymmetric Latency Guarantee
            </h4>
            <p className="font-body text-xs text-[#4e4634]">
              Heavy transformation workloads (parsing, chunking, proposition extraction, embedding generation) execute off-line during <strong>Index Time</strong>. Query execution is lightweight (<strong>5.2ms p99</strong>) using knapsack budgeted assembly.
            </p>
          </div>
        </div>

        <div className="flex justify-end font-mono text-xs uppercase font-bold border-t border-[#1c1c15]/20 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border-2 border-[#1c1c15] bg-[#f4c430] text-[#695200] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#e6b82d] cursor-pointer"
          >
            CLOSE SPECS
          </button>
        </div>
      </div>
    </div>
  );
};
