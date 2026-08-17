import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { seedDatabase } from './server/db/seed';
import { reindexAllEmbeddings } from './server/services/embeddings/vector';
import { documentsRouter } from './server/routes/documents';
import { queriesRouter } from './server/routes/queries';
import { provenanceRouter } from './server/routes/provenance';
import { dashboardRouter } from './server/routes/dashboard';
import { healthRouter } from './server/routes/health';
import { CONFIG } from './server/config';

export const app = express();
const PORT = CONFIG.PORT;

// JSON and form body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static assets from public folders
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.static(path.join(process.cwd(), 'src/public')));

// Seed benchmark corpus data on startup
seedDatabase();

// Re-index embeddings with configured model (gemini-embedding-2 / 768-dim)
reindexAllEmbeddings().catch(err => {
  console.warn('[CALIBER Startup] Background embedding re-index notice:', err?.message || err);
});

// API Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/chunks', documentsRouter);
app.use('/api/query', queriesRouter);
app.use('/api/benchmark', queriesRouter);
app.use('/api/provenance', provenanceRouter);
app.use('/api/dashboard', dashboardRouter);

// Vite Middleware for development vs static serve for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupViteOrStatic();

if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CALIBER Server] Industrial Intelligence Workbench running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
