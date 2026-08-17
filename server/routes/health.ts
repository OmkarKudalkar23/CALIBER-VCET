import express from 'express';
import { db } from '../db/store';
import { CONFIG } from '../config';

export const healthRouter = express.Router();

// GET /health and GET /api/health
healthRouter.get('/', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'CALIBER Industrial Intelligence Workbench Server',
    version: '1.4.0-prod',
    embeddingModel: CONFIG.EMBEDDING_MODEL,
    embeddingDimensions: CONFIG.EMBEDDING_DIMENSIONS,
    timestamp: new Date().toISOString(),
    indices: {
      documents: db.documents.size,
      chunks: db.chunks.size,
      propositions: db.propositions.size,
      embeddings: db.embeddings.size
    }
  });
});
