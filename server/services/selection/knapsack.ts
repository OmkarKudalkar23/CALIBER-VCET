import { QueryCandidate } from '../../types';
import { calculateJaccardSimilarity } from '../deduplication/minhash';

export interface SelectionResult {
  selectedCandidates: QueryCandidate[];
  totalTokensUsed: number;
  coverageScore: number;
  redundancyScore: number;
  selectionRankMap: Map<string, number>;
}

/**
 * CALIBER Budgeted Evidence Selection Algorithm
 * Submodular greedy knapsack optimizer:
 * Maximizes marginal evidence gain (relevance / token_cost)
 * Penalizes cross-evidence overlap
 * Halts strictly when token budget ceiling is reached.
 */
export function budgetedSelection(
  candidates: QueryCandidate[],
  tokenBudget: number
): SelectionResult {
  const selected: QueryCandidate[] = [];
  let currentTokens = 0;
  const remaining = [...candidates];
  const selectionRankMap = new Map<string, number>();

  let rank = 1;

  while (remaining.length > 0 && currentTokens < tokenBudget) {
    let bestCandidateIdx = -1;
    let bestMarginalUtility = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];

      // Check if candidate fits in remaining budget
      if (currentTokens + candidate.tokenCost > tokenBudget) {
        continue;
      }

      // Calculate redundancy penalty against already selected items
      let maxOverlap = 0;
      for (const sel of selected) {
        const overlap = calculateJaccardSimilarity(candidate.content, sel.content);
        if (overlap > maxOverlap) maxOverlap = overlap;
      }

      // Marginal utility = Relevance * (1 - RedundancyPenalty) / sqrt(TokenCost)
      const redundancyPenalty = maxOverlap * 0.6;
      const effectiveRelevance = candidate.relevanceScore * (1 - redundancyPenalty);
      const costFactor = Math.max(1, Math.sqrt(candidate.tokenCost));

      const marginalUtility = effectiveRelevance / costFactor;

      if (marginalUtility > bestMarginalUtility) {
        bestMarginalUtility = marginalUtility;
        bestCandidateIdx = i;
      }
    }

    // If no candidate fits or positive gain found
    if (bestCandidateIdx === -1) {
      break;
    }

    const chosen = remaining.splice(bestCandidateIdx, 1)[0];
    chosen.selected = true;
    chosen.selectionRank = rank++;
    selectionRankMap.set(chosen.id, chosen.selectionRank);

    selected.push(chosen);
    currentTokens += chosen.tokenCost;
  }

  // Calculate coverage and redundancy statistics
  const avgRelevance = selected.length > 0
    ? selected.reduce((acc, s) => acc + s.relevanceScore, 0) / selected.length
    : 0;

  let totalRedundancy = 0;
  let pairs = 0;
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      totalRedundancy += calculateJaccardSimilarity(selected[i].content, selected[j].content);
      pairs++;
    }
  }
  const avgRedundancy = pairs > 0 ? totalRedundancy / pairs : 0.05;

  return {
    selectedCandidates: selected,
    totalTokensUsed: currentTokens,
    coverageScore: Number(avgRelevance.toFixed(3)),
    redundancyScore: Number(avgRedundancy.toFixed(3)),
    selectionRankMap
  };
}
