import { getEmbedding } from '../../gemini';
import { db } from '../../db/store';
import { CONFIG } from '../../config';

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function generateVectorEmbedding(text: string): Promise<number[]> {
  return await getEmbedding(text, CONFIG.EMBEDDING_MODEL);
}

/**
 * Re-indexes all existing chunks across the entire database with the configured model.
 * Preserves the 768-dimensional pgvector schema and CALIBER L3 vector layer.
 */
export async function reindexAllEmbeddings(): Promise<{
  reindexedCount: number;
  model: string;
  dimensions: number;
  durationMs: number;
}> {
  const startTime = Date.now();
  const chunks = Array.from(db.chunks.values());
  const activeModel = CONFIG.EMBEDDING_MODEL;
  const targetDimensions = CONFIG.EMBEDDING_DIMENSIONS;

  console.log(`[CALIBER L3] Re-indexing ${chunks.length} chunks with model '${activeModel}' (${targetDimensions} dimensions)...`);

  let count = 0;
  for (const chunk of chunks) {
    const vector = await getEmbedding(chunk.rawText, activeModel);
    
    db.embeddings.set(chunk.id, {
      id: `EMB-${chunk.id}`,
      chunkId: chunk.id,
      documentId: chunk.documentId,
      vector,
      model: activeModel,
      dimensions: targetDimensions,
      createdAt: new Date().toISOString()
    });

    count++;
  }

  // Update all documents L3 status to ready
  for (const doc of db.documents.values()) {
    doc.l3Status = 'ready';
    doc.updatedAt = new Date().toISOString();
  }

  const durationMs = Date.now() - startTime;
  db.addLog(
    'SYS',
    'L3-REINDEX',
    `Successfully re-indexed ${count} embeddings using '${activeModel}' (${targetDimensions}-dim) in ${durationMs}ms.`
  );

  console.log(`[CALIBER L3] Re-index complete: ${count} embeddings updated in ${durationMs}ms.`);

  return {
    reindexedCount: count,
    model: activeModel,
    dimensions: targetDimensions,
    durationMs
  };
}

