import { QueryCandidate } from '../../types';
import { countTokens } from '../ingestion/parser';

export function assembleContext(
  selectedCandidates: QueryCandidate[],
  tokenBudget: number
): {
  contextText: string;
  totalTokens: number;
} {
  const header = `[CALIBER ASSEMBLED CONTEXT (BUDGET: ${tokenBudget} TOKENS)]\n`;
  const evidenceBlocks: string[] = [];

  selectedCandidates.forEach((cand, idx) => {
    const citationIndex = idx + 1;
    const block = `[EVIDENCE ${citationIndex} | SOURCE: ${cand.documentName} | RESOLUTION: ${cand.resolution} | CHUNK: ${cand.chunkId}]\n${cand.content}`;
    evidenceBlocks.push(block);
  });

  const fullText = header + evidenceBlocks.join('\n\n');

  return {
    contextText: fullText,
    totalTokens: countTokens(fullText)
  };
}
