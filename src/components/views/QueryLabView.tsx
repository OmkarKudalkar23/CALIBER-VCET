import React, { useState } from 'react';
import { EvidenceNode, PipelineStage } from '../../types';
import { SAMPLE_EVIDENCE_ITEMS, SAMPLE_QUERIES } from '../../data/mockData';

interface QueryLabViewProps {
  onSelectEvidenceNode: (node: EvidenceNode) => void;
  onOpenInspector: () => void;
}

export const QueryLabView: React.FC<QueryLabViewProps> = ({
  onSelectEvidenceNode,
  onOpenInspector
}) => {
  const [queryText, setQueryText] = useState(
    'What are Apple corporate and supply chain carbon neutrality targets for 2030?'
  );
  const [tokenBudget, setTokenBudget] = useState(768);
  const [topK, setTopK] = useState(20);
  const [dedupEnabled, setDedupEnabled] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(5);
  const [copiedContext, setCopiedContext] = useState(false);
  const [evidenceList, setEvidenceList] = useState<EvidenceNode[]>(SAMPLE_EVIDENCE_ITEMS);

  // Live telemetry from backend
  const [currentTokensUsed, setCurrentTokensUsed] = useState(384);
  const [naiveTokens, setNaiveTokens] = useState(2940);
  const [assembledContextText, setAssembledContextText] = useState(
    `[CALIBER ASSEMBLED CONTEXT (BUDGET: 768 TOKENS)]\n\n[EVIDENCE 1 | 10-K_AAPL_2023 | L1]: Apple aims to achieve 100 percent carbon neutrality for its supply chain and products by 2030.\n\n[EVIDENCE 2 | ENV_REPORT_23 | L1]: The company transitioned corporate operations to 100 percent renewable energy.\n\n[EVIDENCE 3 | SUPPLIER_COMMIT_23 | L2]: Over 300 active supplier facilities operate on verified 100% clean power.`
  );
  const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(
    'Apple has established a binding target to achieve 100% carbon neutrality across its entire global supply chain and product life cycle by 2030 [1]. Corporate emissions have already reached net zero since April 2020 through 100% renewable electricity procurement [2], with over 300 active manufacturing suppliers deploying 13.7 GW of clean energy [3].'
  );
  const [latencyMs, setLatencyMs] = useState(6.2);

  const [stages, setStages] = useState<PipelineStage[]>([
    { id: '1', name: 'RETRIEVE', description: 'Dual-sparse & dense ANN index lookup across 16 shards', status: 'completed', durationMs: 2.1, outputCount: 42 },
    { id: '2', name: 'CLEAN', description: 'Strip HTML/XML artifacts, normalizing Unicode characters', status: 'completed', durationMs: 0.8, outputCount: 42 },
    { id: '3', name: 'DEDUP', description: 'Cross-document similarity hash clustering', status: 'completed', durationMs: 1.2, outputCount: 28 },
    { id: '4', name: 'SCORE', description: 'Cross-encoder proposition relevance re-ranking', status: 'completed', durationMs: 2.4, outputCount: 28 },
    { id: '5', name: 'SELECT', description: 'Dynamic resolution ladder knapsack budget selection', status: 'completed', durationMs: 0.9, outputCount: 6 },
    { id: '6', name: 'ASSEMBLE', description: 'Construct minimal context window prompt payload', status: 'completed', durationMs: 0.4, outputCount: 1 }
  ]);

  const handleExecuteQuery = async () => {
    setIsExecuting(true);
    setActiveStageIndex(0);

    // Progressive visual step timer
    let current = 0;
    const stageTimer = setInterval(() => {
      current++;
      if (current < stages.length) {
        setActiveStageIndex(current);
      }
    }, 250);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          token_budget: tokenBudget,
          top_k: topK,
          deduplication: dedupEnabled
        })
      });

      if (response.ok) {
        const data = await response.json();
        clearInterval(stageTimer);
        setActiveStageIndex(5);

        if (data.pipelineStages) {
          setStages(data.pipelineStages);
        }
        if (data.context) {
          setAssembledContextText(data.context.assembledContext);
          setCurrentTokensUsed(data.context.tokenCount || data.caliberTokens || 384);
          if (data.context.selectedCandidates && data.context.selectedCandidates.length > 0) {
            const mappedNodes: EvidenceNode[] = data.context.selectedCandidates.map((c: any, i: number) => ({
              id: c.id,
              sourceDocId: c.documentId,
              sourceDocName: c.documentName,
              score: c.relevanceScore,
              content: c.content,
              level: c.resolution,
              batchId: `BATCH_${data.id.slice(-4)}`,
              tokenCount: c.tokenCost,
              metadata: {
                section: c.metadata?.section || `Section #${i + 1}`,
                tokens: c.tokenCost,
                cosineSim: c.metadata?.cosineSim || c.relevanceScore,
                cacheHit: true,
                hash: c.metadata?.hash || `sha256:${c.id}`
              }
            }));
            setEvidenceList(mappedNodes);
          }
        }
        if (data.naiveTokens) setNaiveTokens(data.naiveTokens);
        if (data.latencyMs) setLatencyMs(data.latencyMs);
        if (data.answer?.answer) {
          setGeneratedAnswer(data.answer.answer);
        }
      }
    } catch (err) {
      console.warn('[CALIBER Client] Query API failed, using fallback:', err);
    } finally {
      clearInterval(stageTimer);
      setIsExecuting(false);
      setActiveStageIndex(5);
    }
  };

  const handleCopyContext = () => {
    navigator.clipboard.writeText(assembledContextText);
    setCopiedContext(true);
    setTimeout(() => setCopiedContext(false), 2000);
  };

  const tokenPercentage = Math.min(100, Math.round((currentTokensUsed / tokenBudget) * 100));
  const reductionPercent = naiveTokens > 0 ? Math.round((1 - (currentTokensUsed / naiveTokens)) * 100) : 86.9;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Top Query Definition Box */}
      <div className="bg-[#ffffff] border-2 border-[#1c1c15] p-6 shadow-[5px_5px_0px_0px_#111111] flex flex-col gap-4">
        <div className="flex justify-between items-baseline border-b-2 border-[#1c1c15] pb-2">
          <h2 className="font-headline text-xl font-bold uppercase tracking-tight text-[#1c1c15] flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#2457c5]">terminal</span>
            Query Execution Lab
          </h2>
          <span className="font-mono text-xs text-[#5f5e5e] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-[#2457c5] rounded-full animate-pulse" />
            CALIBER Live Engine • {latencyMs}ms Latency
          </span>
        </div>

        {/* Input Textarea */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs uppercase font-bold text-[#4e4634]">
            Query Definition Stream
          </label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={2}
            className="w-full p-3 font-mono text-sm bg-[#fdf9ee] border-2 border-[#1c1c15] focus:outline-none focus:shadow-[4px_4px_0px_0px_#111111] transition-shadow resize-none text-[#1c1c15]"
            placeholder="Type search query to test CALIBER layered retrieval..."
          />
        </div>

        {/* Sample Query Presets */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono text-[11px] text-[#4e4634] font-bold">PRESETS:</span>
          {SAMPLE_QUERIES.map((sq, i) => (
            <button
              key={i}
              onClick={() => setQueryText(sq)}
              className="font-mono text-[11px] bg-[#f2eee3] hover:bg-[#f4c430] border border-[#111111] px-2 py-1 transition-colors truncate max-w-[280px] cursor-pointer"
              title={sq}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1c1c15]/20 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-6">
            {/* Token Budget */}
            <div className="flex items-center gap-2">
              <span className="text-[#4e4634] font-bold">TOKEN BUDGET:</span>
              <div className="flex items-center border-2 border-[#111111] bg-[#ffffff] shadow-[2px_2px_0px_0px_#111111]">
                <button
                  onClick={() => setTokenBudget((b) => Math.max(256, b - 128))}
                  className="px-2 py-1 font-bold hover:bg-[#e6e2d8]"
                >
                  -
                </button>
                <span className="px-3 py-1 font-bold bg-[#fdf9ee]">{tokenBudget}</span>
                <button
                  onClick={() => setTokenBudget((b) => Math.min(4096, b + 128))}
                  className="px-2 py-1 font-bold hover:bg-[#e6e2d8]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Top-K */}
            <div className="flex items-center gap-2">
              <span className="text-[#4e4634] font-bold">TOP-K:</span>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="p-1 border-2 border-[#111111] bg-[#ffffff] font-bold shadow-[2px_2px_0px_0px_#111111]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Dedup Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[#4e4634] font-bold">DEDUP:</span>
              <button
                onClick={() => setDedupEnabled(!dedupEnabled)}
                className={`px-2.5 py-1 border-2 border-[#111111] font-bold uppercase transition-all shadow-[2px_2px_0px_0px_#111111] cursor-pointer ${
                  dedupEnabled ? 'bg-[#2457c5] text-white' : 'bg-[#e6e2d8] text-[#1c1c15]'
                }`}
              >
                {dedupEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExecuteQuery}
            disabled={isExecuting}
            className="bg-[#f4c430] text-[#695200] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[5px_5px_0px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111111] px-6 py-2.5 font-mono text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${isExecuting ? 'animate-spin' : ''}`}>
              {isExecuting ? 'sync' : 'play_arrow'}
            </span>
            {isExecuting ? 'EXECUTING PIPELINE...' : 'EXECUTE QUERY'}
          </button>
        </div>
      </div>

      {/* Grounded QA Answer Banner */}
      {generatedAnswer && (
        <div className="bg-[#ffffff] border-2 border-[#1c1c15] p-5 shadow-[5px_5px_0px_0px_#111111] flex flex-col gap-3">
          <div className="flex justify-between items-center border-b-2 border-[#1c1c15] pb-2">
            <h3 className="font-headline text-base font-bold text-[#1c1c15] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#755b00]">psychology</span>
              Synthesized Grounded Answer (Strictly Cited)
            </h3>
            <span className="font-mono text-xs bg-[#e6e2d8] px-2 py-0.5 border border-[#111111] font-bold text-[#4e4634]">
              MODEL: gemini-3.7-flash
            </span>
          </div>
          <p className="font-body text-sm text-[#1c1c15] leading-relaxed bg-[#fdf9ee] p-4 border border-[#1c1c15]/30">
            {generatedAnswer}
          </p>
        </div>
      )}

      {/* 3-Column Execution Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Retrieved Evidence (4 cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] flex flex-col">
          <div className="border-b-2 border-[#1c1c15] p-3 bg-[#e6e2d8] flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-[#1c1c15] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">manage_search</span>
              Retrieved Evidence
            </h3>
            <span className="font-mono text-xs bg-[#f4c430] text-[#695200] px-2 py-0.5 border border-[#111111] font-bold">
              VOL: {evidenceList.length}
            </span>
          </div>

          <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[500px]">
            {evidenceList.map((ev, i) => (
              <div
                key={ev.id}
                onClick={() => {
                  onSelectEvidenceNode(ev);
                  onOpenInspector();
                }}
                className="p-3 bg-[#fdf9ee] border-2 border-[#1c1c15] shadow-[2px_2px_0px_0px_#111111] hover:shadow-[4px_4px_0px_0px_#111111] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col gap-2 group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] bg-[#e6e2d8] px-1.5 py-0.5 border border-[#111111] font-bold text-[#4e4634]">
                    #{i + 1} {ev.sourceDocName}
                  </span>
                  <span className="font-mono text-xs bg-[#2457c5] text-white px-2 py-0.5 border border-[#111111] font-bold">
                    {ev.score}
                  </span>
                </div>

                <p className="font-body text-xs text-[#1c1c15] leading-relaxed">
                  "{ev.content}"
                </p>

                <div className="flex justify-between items-center text-[10px] font-mono text-[#4e4634] pt-1 border-t border-[#1c1c15]/20">
                  <span>LAYER: <strong className="text-[#755b00]">{ev.level}</strong></span>
                  <span className="group-hover:text-[#2457c5] font-bold flex items-center gap-0.5">
                    Inspect Node →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Pipeline Stage Rail (3 cols) */}
        <div className="lg:col-span-3 bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] flex flex-col">
          <div className="border-b-2 border-[#1c1c15] p-3 bg-[#e6e2d8] flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-[#1c1c15] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schema</span>
              Pipeline Rail
            </h3>
            <span className="font-mono text-xs text-[#4e4634] font-bold">
              {isExecuting ? 'RUNNING' : 'IDLE'}
            </span>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {stages.map((stage, idx) => {
              const isCurrent = isExecuting && activeStageIndex === idx;
              const isDone = activeStageIndex >= idx;

              return (
                <div
                  key={stage.id}
                  className={`p-3 border-2 border-[#1c1c15] transition-all flex flex-col gap-1 ${
                    isCurrent
                      ? 'bg-[#f4c430] shadow-[3px_3px_0px_0px_#111111] scale-[1.02]'
                      : isDone
                      ? 'bg-[#f7f3e8]'
                      : 'bg-[#e6e2d8] opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="font-bold uppercase text-[#1c1c15] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">
                        {isDone ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {idx + 1}. {stage.name}
                    </span>
                    <span className="text-[10px] text-[#4e4634] font-semibold">
                      {stage.durationMs}ms
                    </span>
                  </div>
                  <p className="font-body text-[11px] text-[#4e4634] leading-tight">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Context Assembly (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] border-2 border-[#1c1c15] shadow-[5px_5px_0px_0px_#111111] flex flex-col">
          <div className="border-b-2 border-[#1c1c15] p-3 bg-[#e6e2d8] flex justify-between items-center">
            <h3 className="font-headline text-base font-bold text-[#1c1c15] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">dataset</span>
              Context Assembly
            </h3>
            <button
              onClick={handleCopyContext}
              className="font-mono text-xs bg-[#ffffff] border border-[#111111] px-2 py-0.5 hover:bg-[#f4c430] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copiedContext ? 'check' : 'content_copy'}
              </span>
              {copiedContext ? 'COPIED' : 'COPY'}
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4 flex-1">
            {/* Token Budget Gauge */}
            <div className="p-3 bg-[#fdf9ee] border-2 border-[#1c1c15] shadow-[2px_2px_0px_0px_#111111]">
              <div className="flex justify-between font-mono text-xs uppercase font-bold mb-1.5">
                <span>Budget Consumption:</span>
                <span className="text-[#755b00]">
                  {currentTokensUsed} / {tokenBudget} TOKENS ({tokenPercentage}%)
                </span>
              </div>
              <div className="w-full h-3 border-2 border-[#1c1c15] bg-[#e6e2d8] relative overflow-hidden">
                <div
                  className="h-full bg-[#f4c430] border-r-2 border-[#1c1c15] transition-all duration-300"
                  style={{ width: `${tokenPercentage}%` }}
                />
              </div>
            </div>

            {/* Assembled Window Text Box */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="font-mono text-xs font-bold uppercase text-[#4e4634]">
                Optimized Prompt Context Payload
              </label>
              <div className="bg-[#1c1c15] text-[#ffdf90] p-3 font-mono text-xs leading-relaxed border-2 border-[#111111] overflow-y-auto max-h-[300px] flex-1 whitespace-pre-wrap">
                {assembledContextText}
              </div>
            </div>

            {/* Economy Summary Strip */}
            <div className="p-3 bg-[#f7f3e8] border border-[#111111] flex justify-between items-center font-mono text-xs">
              <span className="text-[#4e4634]">Naive Dump: <strong>{naiveTokens} tok</strong></span>
              <span className="text-[#2457c5] font-bold">CALIBER: {currentTokensUsed} tok (-{reductionPercent}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
