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
import { getDb } from './mongo';

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
    this.addLog('SYS', 'STORE', 'CALIBER Hybrid Map & MongoDB Atlas Store initialized.');
    this.syncFromMongo().catch(err => console.warn('[CALIBER Store] Initial Mongo sync notice:', err?.message || err));
  }

  public async syncFromMongo() {
    try {
      const db = await getDb();
      const docs = await db.collection<BackendDocument>('documents').find({}).toArray();
      const chunks = await db.collection<BackendChunk>('chunks').find({}).toArray();
      const props = await db.collection<BackendProposition>('propositions').find({}).toArray();
      const gists = await db.collection<BackendGist>('gists').find({}).toArray();
      const embs = await db.collection<BackendEmbedding>('embeddings').find({}).toArray();
      const queries = await db.collection<QueryExecutionRecord>('queries').find({}).toArray();
      const logs = await db.collection<SystemLogEntry>('logs').find({}).sort({ _id: -1 }).limit(200).toArray();

      docs.forEach(d => this.documents.set(d.id, d));
      chunks.forEach(c => this.chunks.set(c.id, c));
      props.forEach(p => this.propositions.set(p.id, p));
      gists.forEach(g => this.gists.set(g.chunkId, g));
      embs.forEach(e => this.embeddings.set(e.chunkId, e));
      queries.forEach(q => this.queries.set(q.id, q));
      this.logs = logs;

      console.log(`[CALIBER Store] Hydrated from MongoDB Atlas: ${this.documents.size} docs, ${this.chunks.size} chunks, ${this.propositions.size} propositions.`);
    } catch (err: any) {
      console.warn('[CALIBER Store] Could not sync from MongoDB Atlas:', err?.message || err);
    }
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
    // Async persist to MongoDB
    getDb().then(db => db.collection('logs').insertOne({ ...entry })).catch(() => {});
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

    // Persist deletes in MongoDB
    getDb().then(db => {
      db.collection('documents').deleteOne({ id });
      db.collection('chunks').deleteMany({ documentId: id });
      db.collection('propositions').deleteMany({ documentId: id });
      db.collection('gists').deleteMany({ documentId: id });
      db.collection('embeddings').deleteMany({ documentId: id });
    }).catch(err => console.warn('Mongo purge error:', err));

    return true;
  }
}

export const db = new CaliberDatabaseStore();
