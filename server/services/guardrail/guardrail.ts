import { QueryCandidate } from '../../types';
import { CONFIG } from '../../config';

export interface GuardrailCheckResult {
  passed: boolean;
  reason?: string;
  recommendedAction: 'PROCEED' | 'ESCAPE_HATCH' | 'EXPAND_RETRIEVAL';
}

export function evaluateGuardrail(
  candidates: QueryCandidate[],
  selected: QueryCandidate[]
): GuardrailCheckResult {
  if (candidates.length === 0) {
    return {
      passed: false,
      reason: 'Empty retrieval result. No relevant indexed documents found.',
      recommendedAction: 'ESCAPE_HATCH'
    };
  }

  if (selected.length === 0) {
    return {
      passed: false,
      reason: 'Token budget is too restrictive to select even a single atomic proposition.',
      recommendedAction: 'ESCAPE_HATCH'
    };
  }

  const maxRelevance = Math.max(...selected.map(s => s.relevanceScore));
  if (maxRelevance < CONFIG.INSUFFICIENT_EVIDENCE_THRESHOLD) {
    return {
      passed: false,
      reason: `Retrieved evidence relevance (${maxRelevance.toFixed(2)}) is below safety threshold (${CONFIG.INSUFFICIENT_EVIDENCE_THRESHOLD}).`,
      recommendedAction: 'ESCAPE_HATCH'
    };
  }

  return {
    passed: true,
    recommendedAction: 'PROCEED'
  };
}
