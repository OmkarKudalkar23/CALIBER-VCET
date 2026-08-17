import { db } from '../../db/store';
import { cosineSimilarity } from '../embeddings/vector';
import { getEmbedding } from '../../gemini';
import { QueryCandidate } from '../../types';
import { countTokens } from '../ingestion/parser';

export interface RetrievalResult {
  queryVector: number[];
  candidates: QueryCandidate[];
  retrievedCount: number;
  latencyMs: number;
}

export async function retrieveTopKCandidates(
  queryId: string,
  queryText: string,
  topK = 20
): Promise<RetrievalResult> {
  const startTime = Date.now();
  const queryVector = await getEmbedding(queryText);
  const candidates: QueryCandidate[] = [];

  const chunks = Array.from(db.chunks.values());
  const scoredChunks: { chunkId: string; documentId: string; score: number }[] = [];

  for (const chunk of chunks) {
    const emb = db.getChunkEmbedding(chunk.id);
    let score = 0;
    if (emb) {
      score = cosineSimilarity(queryVector, emb.vector);
    } else {
      // Lexical fallback
      const queryTerms = queryText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const chunkTerms = chunk.rawText.toLowerCase();
      let matchCount = 0;
      queryTerms.forEach(t => {
        if (chunkTerms.includes(t)) matchCount++;
      });
      score = queryTerms.length > 0 ? matchCount / queryTerms.length : 0.5;
    }

    scoredChunks.push({
      chunkId: chunk.id,
      documentId: chunk.documentId,
      score
    });
  }

  // Sort by score descending
  scoredChunks.sort((a, b) => b.score - a.score);
  const topChunks = scoredChunks.slice(0, topK);

  // For each top chunk, gather candidate resolution nodes (L0, L1, L2)
  for (const item of topChunks) {
    const chunk = db.chunks.get(item.chunkId);
    const doc = db.documents.get(item.documentId);
    if (!chunk || !doc) continue;

    // L1 Propositions
    const props = db.getChunkPropositions(chunk.id);
    for (const prop of props) {
      candidates.push({
        id: `cand-${prop.id}`,
        queryId,
        chunkId: chunk.id,
        documentId: doc.id,
        documentName: doc.name,
        propositionId: prop.id,
        resolution: 'L1',
        content: prop.text,
        relevanceScore: Number((item.score * 0.95 + prop.importance * 0.05).toFixed(3)),
        redundancyScore: 0.05,
        tokenCost: prop.tokenCount || countTokens(prop.text),
        selected: false,
        metadata: {
          section: `Chunk #${chunk.chunkIndex + 1}`,
          tokens: prop.tokenCount || countTokens(prop.text),
          cosineSim: Number(item.score.toFixed(3)),
          cacheHit: true,
          hash: prop.contentHash
        }
      });
    }

    // L2 Gist
    const gist = db.getChunkGist(chunk.id);
    if (gist) {
      candidates.push({
        id: `cand-gist-${chunk.id}`,
        queryId,
        chunkId: chunk.id,
        documentId: doc.id,
        documentName: doc.name,
        resolution: 'L2',
        content: gist.gist,
        relevanceScore: Number((item.score * 0.92).toFixed(3)),
        redundancyScore: 0.04,
        tokenCost: gist.tokenCount || countTokens(gist.gist),
        selected: false,
        metadata: {
          section: `Gist Summary Matrix #${chunk.chunkIndex + 1}`,
          tokens: gist.tokenCount || countTokens(gist.gist),
          cosineSim: Number(item.score.toFixed(3)),
          cacheHit: true,
          hash: `sha256:gist_${chunk.id.toLowerCase()}`
        }
      });
    }

    // L0 Raw Fallback candidate
    candidates.push({
      id: `cand-l0-${chunk.id}`,
      queryId,
      chunkId: chunk.id,
      documentId: doc.id,
      documentName: doc.name,
      resolution: 'L0',
      content: chunk.rawText,
      relevanceScore: Number(item.score.toFixed(3)),
      redundancyScore: 0.15,
      tokenCost: chunk.tokenCount || countTokens(chunk.rawText),
      selected: false,
      metadata: {
        section: `Raw Text Chunk #${chunk.chunkIndex + 1}`,
        tokens: chunk.tokenCount || countTokens(chunk.rawText),
        cosineSim: Number(item.score.toFixed(3)),
        cacheHit: false,
        hash: chunk.contentHash
      }
    });
  }

  const latencyMs = Date.now() - startTime;
  return {
    queryVector,
    candidates,
    retrievedCount: candidates.length,
    latencyMs
  };
}
