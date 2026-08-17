import express from 'express';
import { resolveProvenance } from '../services/provenance/provenance';

export const provenanceRouter = express.Router();

// GET /api/provenance/:id
provenanceRouter.get('/:id', (req, res) => {
  const trace = resolveProvenance(req.params.id);
  if (!trace) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: `Provenance node ${req.params.id} not found.` } });
  }

  res.json({
    citationIndex: trace.citationIndex,
    answerSnippet: trace.answerSnippet,
    proposition: trace.proposition ? {
      id: trace.proposition.id,
      text: trace.proposition.text,
      importance: trace.proposition.importance,
      tokenCount: trace.proposition.tokenCount,
      hash: trace.proposition.contentHash
    } : null,
    gist: trace.gist ? {
      id: trace.gist.id,
      summary: trace.gist.gist,
      entities: trace.gist.structuredData.entities,
      dates: trace.gist.structuredData.dates,
      numbers: trace.gist.structuredData.numbers
    } : null,
    chunk: {
      id: trace.chunk.id,
      chunkIndex: trace.chunk.chunkIndex,
      rawText: trace.chunk.rawText,
      tokenCount: trace.chunk.tokenCount,
      hash: trace.chunk.contentHash
    },
    document: {
      id: trace.document.id,
      name: trace.document.name,
      filename: trace.document.filename,
      source: trace.document.source,
      status: trace.document.status
    },
    duplicateGroup: trace.duplicateGroup || null
  });
});
