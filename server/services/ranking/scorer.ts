import { QueryCandidate } from '../../types';
import { calculateJaccardSimilarity } from '../deduplication/minhash';

/**
 * CALIBER transparent relevance scorer
 * Combines vector cosine similarity, query keyword coverage, and resolution specificity.
 */
export function scoreCandidates(
  queryText: string,
  candidates: QueryCandidate[]
): QueryCandidate[] {
  const queryTerms = queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  return candidates.map(cand => {
    const text = cand.content.toLowerCase();
    let termMatches = 0;
    queryTerms.forEach(t => {
      if (text.includes(t)) termMatches++;
    });

    const lexicalOverlap = queryTerms.length > 0 ? termMatches / queryTerms.length : 0.5;
    const vectorScore = cand.metadata.cosineSim || 0.7;

    // Weighting: 70% vector + 30% lexical keyword grounding
    let finalRelevance = (vectorScore * 0.7) + (lexicalOverlap * 0.3);

    // Resolution bonus: L1 atomic propositions have highest precision
    if (cand.resolution === 'L1') {
      finalRelevance *= 1.05;
    } else if (cand.resolution === 'L2') {
      finalRelevance *= 0.98;
    } else if (cand.resolution === 'L0') {
      finalRelevance *= 0.90; // Raw text penalized slightly for high token bulk
    }

    return {
      ...cand,
      relevanceScore: Number(Math.min(0.999, Math.max(0.1, finalRelevance)).toFixed(3))
    };
  });
}

/**
 * Deduplicate query candidates while tracking redundancy score
 */
export function deduplicateCandidates(
  candidates: QueryCandidate[],
  enabled = true
): {
  uniqueCandidates: QueryCandidate[];
  retrievedCount: number;
  duplicateCount: number;
  uniqueClaimCount: number;
} {
  const retrievedCount = candidates.length;
  if (!enabled) {
    return {
      uniqueCandidates: candidates,
      retrievedCount,
      duplicateCount: 0,
      uniqueClaimCount: retrievedCount
    };
  }

  const uniqueCandidates: QueryCandidate[] = [];
  const processed = new Set<string>();
  let duplicates = 0;

  // Sort by relevance score descending so we keep highest-ranking representative
  const sorted = [...candidates].sort((a, b) => b.relevanceScore - a.relevanceScore);

  for (let i = 0; i < sorted.length; i++) {
    const cand = sorted[i];
    if (processed.has(cand.id)) continue;

    processed.add(cand.id);
    let isRedundant = false;

    for (const chosen of uniqueCandidates) {
      const sim = calculateJaccardSimilarity(cand.content, chosen.content);
      if (sim > 0.65) {
        isRedundant = true;
        duplicates++;
        cand.redundancyScore = Number(sim.toFixed(2));
        break;
      }
    }

    if (!isRedundant) {
      uniqueCandidates.push(cand);
    }
  }

  return {
    uniqueCandidates,
    retrievedCount,
    duplicateCount: duplicates,
    uniqueClaimCount: uniqueCandidates.length
  };
}
