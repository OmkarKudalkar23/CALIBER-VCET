import { db } from '../../db/store';
import { ProvenanceTrace } from '../../types';

export function resolveProvenance(identifier: string): ProvenanceTrace | null {
  // identifier could be propositionId or chunkId
  let prop = db.propositions.get(identifier);
  let chunk = prop ? db.chunks.get(prop.chunkId) : db.chunks.get(identifier);

  if (!chunk && !prop) {
    // Try finding by prefix
    for (const p of db.propositions.values()) {
      if (p.id.toLowerCase().includes(identifier.toLowerCase()) || p.text.toLowerCase().includes(identifier.toLowerCase())) {
        prop = p;
        chunk = db.chunks.get(p.chunkId);
        break;
      }
    }
  }

  if (!chunk) return null;

  const doc = db.documents.get(chunk.documentId);
  if (!doc) return null;

  const gist = db.getChunkGist(chunk.id);
  const duplicateGroup = prop ? db.duplicateGroups.get(`DEDUP-${prop.id}`) : undefined;

  return {
    citationIndex: 1,
    answerSnippet: prop ? prop.text : chunk.rawText.slice(0, 140) + '...',
    proposition: prop,
    gist,
    chunk,
    document: doc,
    duplicateGroup
  };
}
