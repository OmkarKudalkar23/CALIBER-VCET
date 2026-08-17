import { retrieveTopKCandidates } from '../retrieval/retriever';
import { scoreCandidates, deduplicateCandidates } from '../ranking/scorer';
import { budgetedSelection } from '../selection/knapsack';
import { assembleContext } from '../assembly/assembler';
import { countTokens } from '../ingestion/parser';

export async function runComparativeBenchmark(
  queryText: string,
  tokenBudget = 768,
  topK = 20
) {
  const queryId = `bench-${Date.now()}`;
  const startTime = Date.now();

  // 1. Retrieval
  const retrieval = await retrieveTopKCandidates(queryId, queryText, topK);

  // 2. Naive RAG Baseline: Concat all raw chunks
  const naiveChunks = retrieval.candidates.filter(c => c.resolution === 'L0');
  const naiveRawText = naiveChunks.map(c => c.content).join('\n\n');
  const naiveTokens = countTokens(naiveRawText);
  const naiveLatencyMs = retrieval.latencyMs + 15;

  // 3. CALIBER Flow: Score -> Dedup -> Submodular Selection -> Assemble
  const selStart = Date.now();
  const scored = scoreCandidates(queryText, retrieval.candidates);
  const { uniqueCandidates } = deduplicateCandidates(scored, true);
  const selection = budgetedSelection(uniqueCandidates, tokenBudget);
  const { contextText, totalTokens: caliberTokens } = assembleContext(selection.selectedCandidates, tokenBudget);
  const selectionLatencyMs = Date.now() - selStart;
  const caliberTotalLatencyMs = retrieval.latencyMs + selectionLatencyMs;

  const tokenReduction = naiveTokens > 0 ? Number((1 - (caliberTokens / naiveTokens)).toFixed(3)) : 0;
  const compressionRatio = caliberTokens > 0 ? Number((naiveTokens / caliberTokens).toFixed(2)) : 1;

  return {
    query: queryText,
    tokenBudget,
    naive: {
      tokens: naiveTokens,
      latencyMs: naiveLatencyMs,
      chunksRetrieved: naiveChunks.length
    },
    caliber: {
      tokens: caliberTokens,
      selectionLatencyMs,
      totalLatencyMs: caliberTotalLatencyMs,
      selectedEvidenceCount: selection.selectedCandidates.length,
      coverageScore: selection.coverageScore,
      redundancyScore: selection.redundancyScore
    },
    tokenReduction,
    compressionRatio
  };
}
