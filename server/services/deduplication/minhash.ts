import { BackendProposition, DuplicateGroup } from '../../types';
import { CONFIG } from '../../config';

export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const wordsB = new Set(textB.toLowerCase().split(/\W+/).filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

export function deduplicatePropositions(
  propositions: BackendProposition[],
  threshold = CONFIG.DEDUP_SIMILARITY_THRESHOLD
): {
  canonicalPropositions: BackendProposition[];
  duplicateGroups: DuplicateGroup[];
  duplicateCount: number;
} {
  const canonicalPropositions: BackendProposition[] = [];
  const duplicateGroups: DuplicateGroup[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < propositions.length; i++) {
    const current = propositions[i];
    if (processed.has(current.id)) continue;

    processed.add(current.id);
    const duplicates: string[] = [];

    for (let j = i + 1; j < propositions.length; j++) {
      const candidate = propositions[j];
      if (processed.has(candidate.id)) continue;

      const sim = calculateJaccardSimilarity(current.text, candidate.text);
      if (sim >= threshold) {
        duplicates.push(candidate.id);
        processed.add(candidate.id);
      }
    }

    canonicalPropositions.push(current);

    if (duplicates.length > 0) {
      duplicateGroups.push({
        id: `DEDUP-${current.id}`,
        canonicalPropositionId: current.id,
        duplicatePropositionIds: duplicates,
        similarityScore: threshold,
        createdAt: new Date().toISOString()
      });
    }
  }

  return {
    canonicalPropositions,
    duplicateGroups,
    duplicateCount: propositions.length - canonicalPropositions.length
  };
}
