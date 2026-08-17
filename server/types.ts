export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
export type ResolutionLevel = 'L0' | 'L1' | 'L2' | 'L3';

export interface BackendDocument {
  id: string;
  name: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  source: string;
  status: DocumentStatus;
  chunksCount: number;
  totalTokens: number;
  summary: string;
  metrics: { name: string; target: string; status: string }[];
  createdAt: string;
  updatedAt: string;
  indexedAt?: string;
  l0Status: 'ready' | 'processing' | 'failed' | 'pending';
  l1Status: 'ready' | 'processing' | 'failed' | 'pending';
  l2Status: 'ready' | 'processing' | 'failed' | 'pending';
  l3Status: 'ready' | 'processing' | 'failed' | 'pending';
}

export interface BackendChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  rawText: string;
  tokenCount: number;
  contentHash: string;
  createdAt: string;
}

export interface BackendProposition {
  id: string;
  chunkId: string;
  documentId: string;
  text: string;
  importance: number;
  tokenCount: number;
  contentHash: string;
  canonicalId?: string; // If duplicate, points to canonical
  isDuplicate?: boolean;
  createdAt: string;
}

export interface BackendGist {
  id: string;
  chunkId: string;
  documentId: string;
  gist: string;
  structuredData: {
    entities: string[];
    relationships: string[];
    dates: string[];
    numbers: string[];
    tables?: { headers: string[]; rows: string[][] }[];
  };
  tokenCount: number;
  createdAt: string;
}

export interface BackendEmbedding {
  id: string;
  chunkId: string;
  documentId: string;
  vector: number[];
  model: string;
  dimensions: number;
  createdAt: string;
}

export interface DuplicateGroup {
  id: string;
  canonicalPropositionId: string;
  duplicatePropositionIds: string[];
  similarityScore: number;
  createdAt: string;
}

export interface QueryCandidate {
  id: string;
  queryId: string;
  chunkId: string;
  documentId: string;
  documentName: string;
  propositionId?: string;
  resolution: ResolutionLevel;
  content: string;
  relevanceScore: number;
  redundancyScore: number;
  tokenCost: number;
  selected: boolean;
  selectionRank?: number;
  metadata: {
    section?: string;
    tokens: number;
    cosineSim: number;
    cacheHit: boolean;
    hash: string;
  };
}

export interface QueryContextResult {
  id: string;
  queryId: string;
  assembledContext: string;
  tokenCount: number;
  budget: number;
  coverageScore: number;
  redundancyScore: number;
  selectedCandidates: QueryCandidate[];
  allCandidates: QueryCandidate[];
  dedupStats: {
    retrievedCount: number;
    duplicateCount: number;
    uniqueClaimCount: number;
  };
}

export interface QueryAnswerResult {
  id: string;
  queryId: string;
  answer: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  citations: {
    citationIndex: number;
    propositionId?: string;
    chunkId: string;
    documentId: string;
    documentName: string;
    resolution: ResolutionLevel;
    snippet: string;
  }[];
  escapeHatchTriggered: boolean;
  escapeReason?: string;
  createdAt: string;
}

export interface QueryExecutionRecord {
  id: string;
  queryText: string;
  tokenBudget: number;
  topK: number;
  deduplication: boolean;
  status: 'PENDING' | 'RETRIEVING' | 'CLEANING' | 'DEDUPLICATING' | 'SCORING' | 'SELECTING' | 'ASSEMBLING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  completedAt?: string;
  latencyMs: number;
  naiveTokens: number;
  caliberTokens: number;
  compressionRatio: number;
  tokenReduction: number;
  context?: QueryContextResult;
  answer?: QueryAnswerResult;
  pipelineStages: {
    id: string;
    name: string;
    description: string;
    status: 'idle' | 'running' | 'completed' | 'skipped';
    durationMs: number;
    outputCount: number;
  }[];
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERR!' | 'SYS';
  stage: string;
  message: string;
  queryId?: string;
  documentId?: string;
}

export interface ProvenanceTrace {
  citationIndex: number;
  answerSnippet: string;
  proposition?: BackendProposition;
  gist?: BackendGist;
  chunk: BackendChunk;
  document: BackendDocument;
  duplicateGroup?: DuplicateGroup;
}
