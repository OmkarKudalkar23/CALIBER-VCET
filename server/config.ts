import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: 3000,
  HOST: '0.0.0.0',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://kudalkaromkar44_db_user:WqdNA3U5NLd0n4mo@caliber-vcet.nvw8quc.mongodb.net/caliber?retryWrites=true&w=majority',
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'gemini-embedding-2',
  DEFAULT_TOP_K: 20,
  DEFAULT_TOKEN_BUDGET: 768,
  CHUNK_SIZE: 500, // characters per chunk
  CHUNK_OVERLAP: 80,
  INDEX_VERSION: 1,
  EMBEDDING_DIMENSIONS: 768,
  SIMILARITY_THRESHOLD: 0.75,
  DEDUP_SIMILARITY_THRESHOLD: 0.85,
  INSUFFICIENT_EVIDENCE_THRESHOLD: 0.40
};
