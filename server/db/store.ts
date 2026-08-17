import {
  BackendDocument,
  BackendChunk,
  BackendProposition,
  BackendGist,
  BackendEmbedding,
  DuplicateGroup,
  QueryExecutionRecord,
  SystemLogEntry
} from '../types';

class CaliberDatabaseStore {
  public documents: Map<string, BackendDocument> = new Map();
  public chunks: Map<string, BackendChunk> = new Map();
  public propositions: Map<string, BackendProposition> = new Map();
  public gists: Map<string, BackendGist> = new Map();
  public embeddings: Map<string, BackendEmbedding> = new Map();
  public duplicateGroups: Map<string, DuplicateGroup> = new Map();
  public queries: Map<string, QueryExecutionRecord> = new Map();
  public logs: SystemLogEntry[] = [];

  constructor() {
    this.addLog('SYS', 'STORE', 'CALIBER In-Memory High-Performance Vector & Entity Store initialized.');
  }

  public addLog(level: 'INFO' | 'WARN' | 'ERR!' | 'SYS', stage: string, message: string, queryId?: string, documentId?: string) {
    const entry: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
      level,
      stage,
      message,
      queryId,
      documentId
    };
    this.logs.unshift(entry);
    if (this.logs.length > 500) {
      this.logs.pop();
    }
    return entry;
  }

  public getDocument(id: string): BackendDocument | undefined {
    return this.documents.get(id);
  }

  public getDocumentChunks(documentId: string): BackendChunk[] {
    return Array.from(this.chunks.values()).filter(c => c.documentId === documentId);
  }

  public getChunkPropositions(chunkId: string): BackendProposition[] {
    return Array.from(this.propositions.values()).filter(p => p.chunkId === chunkId);
  }

  public getChunkGist(chunkId: string): BackendGist | undefined {
    return Array.from(this.gists.values()).find(g => g.chunkId === chunkId);
  }

  public getChunkEmbedding(chunkId: string): BackendEmbedding | undefined {
    return Array.from(this.embeddings.values()).find(e => e.chunkId === chunkId);
  }

  public deleteDocument(id: string): boolean {
    if (!this.documents.has(id)) return false;
    this.documents.delete(id);

    // Cascade delete chunks
    const chunkIds = Array.from(this.chunks.values())
      .filter(c => c.documentId === id)
      .map(c => c.id);

    chunkIds.forEach(cid => {
      this.chunks.delete(cid);
      this.gists.delete(cid);
      this.embeddings.delete(cid);
    });

    // Delete propositions
    Array.from(this.propositions.values())
      .filter(p => p.documentId === id)
      .forEach(p => this.propositions.delete(p.id));

    this.addLog('INFO', 'STORE', `Document ${id} and associated L0-L3 indices successfully purged.`);
    return true;
  }
}

export const db = new CaliberDatabaseStore();
