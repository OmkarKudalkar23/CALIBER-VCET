import React, { useState } from 'react';
import { DocumentItem, LadderLevel } from '../../types';

interface DocumentDetailViewProps {
  document: DocumentItem;
  initialLevel?: LadderLevel;
  onBackToInventory: () => void;
  onOpenQueryLabWithDoc: (doc: DocumentItem) => void;
  onOpenProvenanceNode: (nodeId: string) => void;
}

export const DocumentDetailView: React.FC<DocumentDetailViewProps> = ({
  document,
  initialLevel = 'L2',
  onBackToInventory,
  onOpenQueryLabWithDoc,
  onOpenProvenanceNode
}) => {
  const [sliderValue, setSliderValue] = useState<number>(
    initialLevel === 'L0' ? 0 : initialLevel === 'L1' ? 1 : initialLevel === 'L2' ? 2 : 3
  );
  const [activeBreadcrumb, setActiveBreadcrumb] = useState<string>('PROPOSITION');

  const levels: LadderLevel[] = ['L0', 'L1', 'L2', 'L3'];
  const currentLevel = levels[sliderValue];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));
  };

  const getSliderLabel = () => {
    switch (sliderValue) {
      case 0:
        return 'L0: Lossless Raw Active';
      case 1:
        return 'L1: Atomic Propositions Active';
      case 2:
        return 'L2: Proposition Gist Active';
      case 3:
        return 'L3: Compact Embedding Active';
      default:
        return 'L2: Resolution Active';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Document Header & Navigation */}
      <div className="border-b-2 border-[#1c1c15] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBackToInventory}
              className="font-mono text-xs font-bold text-[#4e4634] hover:text-[#1c1c15] flex items-center gap-1 border border-[#111111] px-2 py-0.5 bg-[#ffffff] shadow-[2px_2px_0px_0px_#111111] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              INVENTORY
            </button>
            <span className="font-mono text-xs bg-[#2457c5] text-white px-2.5 py-0.5 border-2 border-[#1c1c15] uppercase font-bold shadow-[2px_2px_0px_0px_#111111]">
              System Target
            </span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-[#1c1c15] tracking-tight">
            {document.name.replace(/_/g, ' ')}
          </h2>
          <p className="font-mono text-xs text-[#4e4634] mt-1 font-semibold">
            ID: {document.id} | CHUNKS: {document.chunks.toLocaleString()} | TOKENS: {(document.tokens || 384000).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenQueryLabWithDoc(document)}
            className="bg-[#f4c430] text-[#695200] border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] px-4 py-2 font-mono text-xs uppercase font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer hover:bg-[#e6b82d]"
          >
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            QUERY THIS TARGET
          </button>
        </div>
      </div>

      {/* Resolution Slider (Center Physical Control) */}
      <div className="bg-[#ffffff] border-2 border-[#1c1c15] p-6 shadow-[5px_5px_0px_0px_#111111] flex flex-col items-center justify-center gap-3 relative mx-auto w-full max-w-3xl">
        <div className="flex justify-between w-full font-mono text-xs text-[#1c1c15] uppercase font-bold px-4">
          <span className={sliderValue === 0 ? 'text-[#755b00]' : 'text-[#4e4634]'}>Lossless (Raw)</span>
          <span className="text-[#755b00] font-bold bg-[#f4c430] px-2 py-0.5 border border-[#111111]">
            {getSliderLabel()}
          </span>
          <span className={sliderValue === 3 ? 'text-[#755b00]' : 'text-[#4e4634]'}>Compact (Embed)</span>
        </div>

        <div className="w-full relative h-12 bg-[#ece8dd] border-2 border-[#1c1c15] flex items-center px-4 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)]">
          {/* Tick marks */}
          <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
            <div className={`w-[2px] ${sliderValue === 0 ? 'h-7 bg-[#755b00]' : 'h-4 bg-[#807661]'}`} />
            <div className={`w-[2px] ${sliderValue === 1 ? 'h-7 bg-[#755b00]' : 'h-4 bg-[#807661]'}`} />
            <div className={`w-[2px] ${sliderValue === 2 ? 'h-7 bg-[#755b00]' : 'h-4 bg-[#807661]'}`} />
            <div className={`w-[2px] ${sliderValue === 3 ? 'h-7 bg-[#755b00]' : 'h-4 bg-[#807661]'}`} />
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={sliderValue}
            onChange={handleSliderChange}
            aria-label="Resolution Ladder Slider"
            className="w-full appearance-none bg-transparent relative z-10 cursor-pointer accent-[#755b00]"
          />
        </div>

        {/* Level Quick Jump Buttons */}
        <div className="flex justify-between w-full font-mono text-xs px-2 pt-1">
          <button onClick={() => setSliderValue(0)} className="text-[11px] text-[#4e4634] hover:text-[#1c1c15] font-bold">L0 (Raw Text)</button>
          <button onClick={() => setSliderValue(1)} className="text-[11px] text-[#4e4634] hover:text-[#1c1c15] font-bold">L1 (Propositions)</button>
          <button onClick={() => setSliderValue(2)} className="text-[11px] text-[#4e4634] hover:text-[#1c1c15] font-bold">L2 (Gist Matrix)</button>
          <button onClick={() => setSliderValue(3)} className="text-[11px] text-[#4e4634] hover:text-[#1c1c15] font-bold">L3 (Vector State)</button>
        </div>
      </div>

      {/* Asymmetric Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* L2 Gist Module */}
          <div className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] flex flex-col">
            <div className="border-b-2 border-[#1c1c15] p-3 bg-[#e6e2d8] flex justify-between items-center">
              <h3 className="font-headline text-lg font-bold text-[#1c1c15] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#2457c5]">table_chart</span>
                L2: Proposition Gist
              </h3>
              <span className="font-mono text-xs bg-[#f4c430] text-[#695200] px-2 py-0.5 border-2 border-[#1c1c15] font-bold shadow-[2px_2px_0px_0px_#111111]">
                STRUCTURED
              </span>
            </div>

            <div className="p-6">
              <p className="font-body text-base text-[#1c1c15] leading-relaxed mb-6">
                {document.summary ||
                  'Apple claims comprehensive carbon neutrality across its corporate operations and retail footprint for fiscal year 2023, while aggressively targeting a 75% reduction in total value chain emissions by 2030 relative to a 2015 baseline.'}
              </p>

              {/* Structured Data Table */}
              <div className="border-2 border-[#1c1c15] bg-[#fdf9ee]">
                <table className="w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#1c1c15] bg-[#ece8dd]">
                      <th className="text-left p-2.5 border-r-2 border-[#1c1c15] font-bold uppercase">Metric</th>
                      <th className="text-right p-2.5 border-r-2 border-[#1c1c15] font-bold uppercase">Target</th>
                      <th className="text-right p-2.5 font-bold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c15]">
                    {(document.metrics || []).map((m, idx) => (
                      <tr key={idx} className="hover:bg-[#ffffff] transition-colors">
                        <td className="p-2.5 border-r-2 border-[#1c1c15] font-semibold">{m.name}</td>
                        <td className="text-right p-2.5 border-r-2 border-[#1c1c15] text-[#4e4634]">{m.target}</td>
                        <td className="text-right p-2.5 text-[#755b00] font-bold">{m.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* L1 Atomic Propositions Module */}
          <div className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] p-6 flex flex-col gap-4">
            <div className="flex justify-between items-baseline border-b-2 border-[#1c1c15] pb-2">
              <h3 className="font-headline text-lg font-bold text-[#1c1c15] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#755b00]">format_list_numbered</span>
                L1: Atomic Propositions
              </h3>
              <span className="font-mono text-xs text-[#5f5e5e] font-semibold">
                Extracted Evidence ({document.propositions?.length || 4} statements)
              </span>
            </div>

            <div className="space-y-4">
              {(document.propositions || []).map((prop) => (
                <div key={prop.id} className="flex flex-col gap-1.5 p-3 bg-[#fdf9ee] border border-[#111111]">
                  <div className="flex justify-between items-start">
                    <p className="font-body text-sm text-[#1c1c15] font-medium leading-snug">{prop.text}</p>
                    <span className="font-mono text-[10px] bg-[#e6e2d8] px-1.5 border border-[#111111] text-[#4e4634] ml-2 shrink-0">
                      {prop.chunkId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-full border-2 border-[#1c1c15] bg-[#f2eee3] relative">
                      <div
                        className="absolute left-0 top-0 h-full bg-[#f4c430] border-r-2 border-[#1c1c15]"
                        style={{ width: `${Math.round(prop.score * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold w-12 text-right text-[#1c1c15]">
                      {prop.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* L0 Raw Text Extract */}
          {sliderValue === 0 && (
            <div className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] p-6 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b-2 border-[#1c1c15] pb-2">
                <h3 className="font-headline text-lg font-bold text-[#1c1c15] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  L0: Lossless Raw Extract
                </h3>
                <span className="font-mono text-xs bg-[#e6e2d8] px-2 py-0.5 border border-[#111111]">
                  RAW BYTES STREAM
                </span>
              </div>
              <div className="bg-[#f7f3e8] border border-[#111111] p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#1c1c15]">
                {document.rawText}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Columns): L3 Vector State Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#313129] text-[#f4f1e6] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] p-4 flex flex-col h-full overflow-hidden relative min-h-[400px]">
            <div className="flex justify-between items-center mb-3 border-b-2 border-[#f4f1e6]/30 pb-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#ffdf90] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">blur_on</span>
                L3: Vector State
              </h3>
              <span className="font-mono text-[10px] text-[#c8c6c5] bg-[#1c1c15] px-1.5 py-0.5 border border-[#f4f1e6]/20">
                768-DIM (gemini-embedding-2)
              </span>
            </div>

            <div className="font-mono text-[11px] leading-relaxed text-[#c8c6c5] break-all opacity-85 overflow-y-auto max-h-72">
              [ {(document.vectorPreview || []).join(', ')} ... ]
            </div>

            {/* Dimensional Stats */}
            <div className="mt-4 pt-3 border-t border-[#f4f1e6]/20 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#c8c6c5]">ANN Cluster ID:</span>
                <span className="text-[#ffdf90] font-bold">C-784-B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c8c6c5]">Embedding Norm:</span>
                <span className="text-white font-bold">1.0000 (L2 Norm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c8c6c5]">Shard Assignment:</span>
                <span className="text-[#638eff] font-bold">Shard_04 (Asia-E1)</span>
              </div>
            </div>

            {/* Gradient fade out */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#313129] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom: Provenance Chain Breadcrumbs */}
      <div className="mt-4">
        <div className="bg-[#ffffff] border-2 border-[#1c1c15] p-4 shadow-[5px_5px_0px_0px_#111111] flex flex-wrap items-center gap-3 overflow-x-auto">
          <span className="font-mono text-xs text-[#5f5e5e] uppercase font-bold mr-2">
            Provenance:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBreadcrumb('ANSWER')}
              className={`border-2 border-[#1c1c15] px-3 py-1 font-mono text-xs uppercase font-bold transition-all cursor-pointer ${
                activeBreadcrumb === 'ANSWER'
                  ? 'bg-[#f4c430] text-[#695200] shadow-[2px_2px_0px_0px_#111111] -translate-y-[1px]'
                  : 'bg-[#e6e2d8] hover:bg-[#ece8dd]'
              }`}
            >
              ANSWER
            </button>
            <span className="material-symbols-outlined text-sm text-[#4e4634]">arrow_right_alt</span>

            {/* Active Breadcrumb: PROPOSITION */}
            <button
              onClick={() => setActiveBreadcrumb('PROPOSITION')}
              className={`border-2 border-[#1c1c15] px-3 py-1 font-mono text-xs uppercase font-bold transition-all cursor-pointer ${
                activeBreadcrumb === 'PROPOSITION'
                  ? 'bg-[#f4c430] text-[#695200] shadow-[3px_3px_0px_0px_#111111] -translate-y-[2px] -translate-x-[2px]'
                  : 'bg-[#e6e2d8] hover:bg-[#ece8dd]'
              }`}
            >
              PROPOSITION
            </button>
            <span className="material-symbols-outlined text-sm text-[#4e4634]">arrow_right_alt</span>

            <button
              onClick={() => {
                setActiveBreadcrumb('CHUNK (C-104)');
                onOpenProvenanceNode('C-104');
              }}
              className={`border-2 border-[#1c1c15] px-3 py-1 font-mono text-xs uppercase font-bold transition-all cursor-pointer ${
                activeBreadcrumb === 'CHUNK (C-104)'
                  ? 'bg-[#f4c430] text-[#695200] shadow-[2px_2px_0px_0px_#111111] -translate-y-[1px]'
                  : 'bg-[#e6e2d8] hover:bg-[#ece8dd]'
              }`}
            >
              CHUNK (C-104)
            </button>
            <span className="material-symbols-outlined text-sm text-[#4e4634]">arrow_right_alt</span>

            <button
              onClick={() => setActiveBreadcrumb('SOURCE')}
              className={`border-2 border-[#1c1c15] px-3 py-1 font-mono text-xs uppercase font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeBreadcrumb === 'SOURCE'
                  ? 'bg-[#f4c430] text-[#695200] shadow-[2px_2px_0px_0px_#111111] -translate-y-[1px]'
                  : 'bg-[#e6e2d8] hover:bg-[#ece8dd]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">description</span>
              SOURCE ({document.type})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
