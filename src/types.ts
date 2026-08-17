export type LadderLevel = 'L0' | 'L1' | 'L2' | 'L3';

export type NavScreen = 
  | 'dashboard'
  | 'inventory'
  | 'document-detail'
  | 'query-lab'
  | 'architecture'
  | 'index-hero'
  | 'pipelines'
  | 'settings';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | 'XLSX' | 'DOCX' | 'TXT' | 'JSON' | 'CSV';
  chunks: number;
  tokens: number;
  l0Status: 'ready' | 'processing' | 'failed' | 'pending';
  l1Status: 'ready' | 'processing' | 'failed' | 'pending';
  l2Status: 'ready' | 'processing' | 'failed' | 'pending';
  l3Status: 'ready' | 'processing' | 'failed' | 'pending';
  indexedAt: string;
  status: 'READY' | 'PROCESSING' | 'FAILED';
  summary?: string;
  metrics?: {
    name: string;
    target: string;
    status: string;
  }[];
  propositions?: {
    id: string;
    text: string;
    score: number;
    chunkId: string;
  }[];
  rawText?: string;
  vectorPreview?: number[];
}

export interface EvidenceNode {
  id: string;
  sourceDocId: string;
  sourceDocName: string;
  score: number;
  content: string;
  level: LadderLevel;
  batchId?: string;
  tokenCount: number;
  metadata: {
    section?: string;
    page?: number;
    tokens: number;
    cosineSim: number;
    cacheHit: boolean;
    hash: string;
  };
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'skipped';
  durationMs?: number;
  outputCount?: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERR!' | 'SYS';
  message: string;
  module?: string;
}

export interface SystemMetrics {
  totalChunks: number;
  avgRecall: number;
  p99LatencyMs: number;
  costReductionFactor: number;
  naiveRagTokens: number;
  caliberTokens: number;
  cacheHitRate: number;
  indexSizeTB: number;
  uptime: number;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
