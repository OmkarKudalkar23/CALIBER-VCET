import { generateGroundedAnswer } from '../../gemini';
import { QueryAnswerResult, QueryCandidate } from '../../types';
import { countTokens } from '../ingestion/parser';

export async function generateFinalAnswer(
  queryId: string,
  queryText: string,
  assembledContext: string,
  selectedCandidates: QueryCandidate[],
  escapeHatch = false,
  escapeReason?: string
): Promise<QueryAnswerResult> {
  const startTime = Date.now();

  if (escapeHatch) {
    return {
      id: `ans-${queryId}`,
      queryId,
      answer: `The indexed evidence is insufficient to answer this query confidently. ${escapeReason || ''}`,
      model: 'caliber-guardrail-v2',
      inputTokens: countTokens(assembledContext),
      outputTokens: 18,
      latencyMs: Date.now() - startTime,
      citations: [],
      escapeHatchTriggered: true,
      escapeReason,
      createdAt: new Date().toISOString()
    };
  }

  const { answer, rawCitations } = await generateGroundedAnswer(queryText, assembledContext);

  // Build resolved citations
  const citations = rawCitations
    .map(cIdx => {
      const cand = selectedCandidates[cIdx - 1];
      if (!cand) return null;
      return {
        citationIndex: cIdx,
        propositionId: cand.propositionId,
        chunkId: cand.chunkId,
        documentId: cand.documentId,
        documentName: cand.documentName,
        resolution: cand.resolution,
        snippet: cand.content
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const latencyMs = Date.now() - startTime;

  return {
    id: `ans-${queryId}`,
    queryId,
    answer,
    model: 'gemini-3.7-flash',
    inputTokens: countTokens(assembledContext),
    outputTokens: countTokens(answer),
    latencyMs,
    citations,
    escapeHatchTriggered: false,
    createdAt: new Date().toISOString()
  };
}
