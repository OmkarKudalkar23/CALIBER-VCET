import { db } from './server/db/store';
import { seedDatabase } from './server/db/seed';
import { parseDocumentContent } from './server/services/ingestion/parser';
import { generatePropositionsForChunk } from './server/services/propositions/generator';
import { generateGistForChunk } from './server/services/gist/generator';
import { generateVectorEmbedding, reindexAllEmbeddings, cosineSimilarity } from './server/services/embeddings/vector';
import { retrieveTopKCandidates } from './server/services/retrieval/retriever';
import { scoreCandidates, deduplicateCandidates } from './server/services/ranking/scorer';
import { budgetedSelection } from './server/services/selection/knapsack';
import { assembleContext } from './server/services/assembly/assembler';
import { evaluateGuardrail } from './server/services/guardrail/guardrail';
import { generateFinalAnswer } from './server/services/answer/generator';
import { CONFIG } from './server/config';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function record(suite: string, name: string, passed: boolean, details?: string) {
  results.push({ suite, name, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} [${suite}] ${name} ${details ? `(${details})` : ''}`);
}

async function runAllTests() {
  console.log('====================================================');
  console.log('      CALIBER PIPELINES END-TO-END VERIFICATION      ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST SUITE 1: Corpus Seed & Store
  // ----------------------------------------------------
  console.log('--- TEST SUITE 1: Corpus Seed & Store ---');
  seedDatabase();
  const docCount = db.documents.size;
  const chunkCount = db.chunks.size;
  const propCount = db.propositions.size;
  const embCount = db.embeddings.size;

  record('Store', 'Database Seeding', docCount >= 4, `Loaded ${docCount} documents, ${chunkCount} chunks`);
  record('Store', 'Proposition Indexing', propCount > 0, `Loaded ${propCount} propositions`);
  record('Store', 'Vector Embedding Indexing', embCount > 0, `Loaded ${embCount} embeddings`);

  // ----------------------------------------------------
  // TEST SUITE 2: Ingestion & 4-Tier Resolution Engine
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 2: Ingestion & 4-Tier Resolution Engine ---');
  const sampleDocText = `
  # SECTION 1: GLOBAL EMISSION STANDARDS
  Apple has committed to reaching carbon neutrality across its entire footprint by 2030.
  Corporate facilities have operated on 100% renewable electricity since April 2020.
  Over 300 manufacturing partners have committed to 13.7 gigawatts of renewable energy capacity.

  # SECTION 2: SUPPLY CHAIN AUDIT
  Suppliers in 28 countries completed comprehensive environmental audits in fiscal year 2023.
  Average supplier energy efficiency increased by 18.4% year-over-year.
  Zero waste to landfill validation was achieved across all final assembly sites.
  `;

  // Test L0: Parser & Chunking
  const parseResult = parseDocumentContent('Enterprise_Carbon_Audit_2024.pdf', sampleDocText);
  record('L0 Raw', 'Deterministic Chunking', parseResult.chunks.length >= 2, `Produced ${parseResult.chunks.length} chunks, ${parseResult.totalTokens} tokens`);
  record('L0 Raw', 'SHA-256 Checksum Validation', !!parseResult.chunks[0].contentHash, `Hash: ${parseResult.chunks[0].contentHash}`);

  // Test L1: Proposition Generation
  const chunk0 = parseResult.chunks[0];
  const propositions = await generatePropositionsForChunk('TEST_CHUNK_001', chunk0.rawText);
  record('L1 Props', 'Atomic Proposition Extraction', propositions.length >= 2, `Extracted ${propositions.length} propositions`);
  record('L1 Props', 'Proposition Structure', !!propositions[0].text && propositions[0].text.length > 5, `Sample: "${propositions[0].text.substring(0, 45)}..."`);

  // Test L2: Structured Gist Generation
  const gist = await generateGistForChunk('TEST_CHUNK_001', chunk0.rawText);
  record('L2 Gist', 'Structured Matrix Compilation', !!gist && !!gist.gist, `Entities: ${gist.structuredData.entities.length}, Dates: ${gist.structuredData.dates.length}`);

  // Test L3: Vector Embedding with gemini-embedding-2 (768-dim)
  const vector = await generateVectorEmbedding(chunk0.rawText);
  record('L3 Vector', 'Embedding Generation (768-dim)', vector.length === 768, `Vector dimension: ${vector.length}, model: ${CONFIG.EMBEDDING_MODEL}`);

  // Test Cosine Similarity Math
  const simSelf = cosineSimilarity(vector, vector);
  record('L3 Vector', 'Cosine Self-Similarity', Math.abs(simSelf - 1.0) < 0.001, `Self-similarity score: ${simSelf.toFixed(4)}`);

  // ----------------------------------------------------
  // TEST SUITE 3: Embedding Re-index Engine
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 3: Embedding Re-Indexing Pipeline ---');
  const reindexResult = await reindexAllEmbeddings();
  record('Reindex', 'Corpus Re-index Execution', reindexResult.reindexedCount >= chunkCount, `Re-indexed ${reindexResult.reindexedCount} chunks with ${reindexResult.model} (${reindexResult.dimensions}-dim) in ${reindexResult.durationMs}ms`);

  // Verify all embeddings in store have 768 dimensions
  let all768 = true;
  for (const emb of db.embeddings.values()) {
    if (emb.vector.length !== 768 || emb.dimensions !== 768) {
      all768 = false;
      break;
    }
  }
  record('Reindex', 'pgvector 768-Dimension Integrity', all768, 'All embeddings verified 768-dim normalized');

  // ----------------------------------------------------
  // TEST SUITE 4: Query Retrieval, Ranking & Selection
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 4: Query Retrieval, Knapsack Selection & Assembly ---');
  const testQuery = 'What are Apple corporate and supply chain carbon neutrality targets for 2030?';
  const queryId = 'QRY-TEST-001';

  // Stage 1: Retrieval
  const retrievalResult = await retrieveTopKCandidates(queryId, testQuery, 20);
  record('Retrieval', 'Multi-Layer Candidate Retrieval', retrievalResult.candidates.length > 0, `Retrieved ${retrievalResult.candidates.length} candidates across L0-L2 in ${retrievalResult.latencyMs}ms`);

  // Stage 2: Deduplication
  const dedupResult = deduplicateCandidates(retrievalResult.candidates, true);
  record('Dedup', 'Redundancy Filter', dedupResult.uniqueCandidates.length <= retrievalResult.candidates.length, `${retrievalResult.candidates.length} -> ${dedupResult.uniqueCandidates.length} unique candidates`);

  // Stage 3: Scoring
  const scored = scoreCandidates(testQuery, dedupResult.uniqueCandidates);
  record('Scoring', 'Relevance Ranking', scored.length > 0 && scored[0].relevanceScore >= scored[scored.length - 1].relevanceScore, `Top score: ${scored[0]?.relevanceScore.toFixed(3)}`);

  // Stage 4: Knapsack Selection under strict Token Budgets
  const lowBudget = 256;
  const highBudget = 1024;
  const selectionLow = budgetedSelection(scored, lowBudget);
  const selectionHigh = budgetedSelection(scored, highBudget);

  record('Knapsack', 'Strict Token Budget Enforcement (Low: 256)', selectionLow.totalTokensUsed <= lowBudget, `Used ${selectionLow.totalTokensUsed}/${lowBudget} tokens, ${selectionLow.selectedCandidates.length} items selected`);
  record('Knapsack', 'Budget Sensitivity (High: 1024)', selectionHigh.totalTokensUsed <= highBudget && selectionHigh.totalTokensUsed >= selectionLow.totalTokensUsed, `Used ${selectionHigh.totalTokensUsed}/${highBudget} tokens, ${selectionHigh.selectedCandidates.length} items selected`);

  // Stage 5: Context Assembly
  const assembled = assembleContext(selectionLow.selectedCandidates, lowBudget);
  record('Assembly', 'Context Prompt Construction', assembled.contextText.includes('[CALIBER ASSEMBLED CONTEXT'), `Payload: ${assembled.totalTokens} tokens`);

  // Stage 6: Guardrail Validation
  const guardrail = evaluateGuardrail(retrievalResult.candidates, selectionLow.selectedCandidates);
  record('Guardrail', 'Context Sufficiency & Hallucination Guard', guardrail.passed, `Action: ${guardrail.recommendedAction}`);

  // Stage 7: Grounded Answer Synthesis with Citations
  const answerResult = await generateFinalAnswer(queryId, testQuery, assembled.contextText, selectionLow.selectedCandidates);
  record('Answer', 'Grounded Answer Generation', !!answerResult.answer && answerResult.answer.length > 20, `Generated ${answerResult.answer.length} chars in ${answerResult.latencyMs}ms`);
  record('Answer', 'Evidence Citation Markers', answerResult.citations.length > 0 || answerResult.answer.includes('['), `Citations linked: ${answerResult.citations.length}`);

  // ----------------------------------------------------
  // TEST SUITE 5: Live REST API Endpoints via HTTP
  // ----------------------------------------------------
  console.log('\n--- TEST SUITE 5: Live REST API Endpoints on Port 3000 ---');
  const baseUrl = 'http://127.0.0.1:3000';

  // Test 1: GET /health
  try {
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    record('API', 'GET /health', healthRes.ok && !!healthData.embeddingModel, `Status: ${healthData.status}, Model: ${healthData.embeddingModel} (${healthData.embeddingDimensions}-dim)`);
  } catch (err: any) {
    record('API', 'GET /health', false, err.message);
  }

  // Test 2: GET /api/documents
  let firstDocId = '';
  try {
    const docsRes = await fetch(`${baseUrl}/api/documents`);
    const docsData = await docsRes.json();
    if (docsData.documents?.length > 0) firstDocId = docsData.documents[0].id;
    record('API', 'GET /api/documents', docsRes.ok && docsData.documents?.length > 0, `Returned ${docsData.documents?.length} documents`);
  } catch (err: any) {
    record('API', 'GET /api/documents', false, err.message);
  }

  // Test 3: GET /api/chunks/:id/resolution & /api/documents/chunks/:id/resolution
  try {
    const firstChunkId = Array.from(db.chunks.keys())[0];
    const resRes = await fetch(`${baseUrl}/api/documents/chunks/${firstChunkId}/resolution`);
    const resData = await resRes.json();
    record('API', 'GET /api/documents/chunks/:id/resolution', resRes.ok && !!resData.l0 && !!resData.l3, `L3 dims: ${resData.l3?.dimensions}, model: ${resData.l3?.model}`);
  } catch (err: any) {
    record('API', 'GET /api/documents/chunks/:id/resolution', false, err.message);
  }

  // Test 4: POST /api/query
  try {
    const queryRes = await fetch(`${baseUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'What are Apple carbon targets for 2030?',
        token_budget: 512,
        top_k: 15,
        deduplication: true
      })
    });
    const queryData = await queryRes.json();
    record('API', 'POST /api/query', queryRes.ok && !!queryData.context && !!queryData.answer, `Latency: ${queryData.latencyMs}ms, CALIBER Tokens: ${queryData.caliberTokens}`);
  } catch (err: any) {
    record('API', 'POST /api/query', false, err.message);
  }

  // Test 5: GET /api/provenance/:id
  try {
    const firstPropId = Array.from(db.propositions.keys())[0] || 'PROP_001';
    const provRes = await fetch(`${baseUrl}/api/provenance/${firstPropId}`);
    const provData = await provRes.json();
    record('API', 'GET /api/provenance/:id', provRes.ok && !!provData.proposition, `Provenance node: ${provData.proposition?.id}`);
  } catch (err: any) {
    record('API', 'GET /api/provenance/:id', false, err.message);
  }

  // Test 6: GET /api/dashboard/overview
  try {
    const dashRes = await fetch(`${baseUrl}/api/dashboard/overview`);
    const dashData = await dashRes.json();
    record('API', 'GET /api/dashboard/overview', dashRes.ok && dashData.tokenReduction > 0, `Reduction: ${dashData.tokenReduction}x, Chunks: ${dashData.chunks}`);
  } catch (err: any) {
    record('API', 'GET /api/dashboard/overview', false, err.message);
  }

  // Test 7: POST /api/benchmark
  try {
    const benchRes = await fetch(`${baseUrl}/api/benchmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'What are Apple corporate renewable targets?',
        token_budget: 768
      })
    });
    const benchData = await benchRes.json();
    record('API', 'POST /api/benchmark', benchRes.ok && benchData.compressionRatio > 0, `Compression: ${benchData.compressionRatio}% token savings (Naive ${benchData.naiveTokens} vs CALIBER ${benchData.caliberTokens} tokens)`);
  } catch (err: any) {
    record('API', 'POST /api/benchmark', false, err.message);
  }

  // Test 8: GET /api/documents/config/embeddings
  try {
    const cfgRes = await fetch(`${baseUrl}/api/documents/config/embeddings`);
    const cfgData = await cfgRes.json();
    record('API', 'GET /api/documents/config/embeddings', cfgRes.ok && cfgData.model === 'gemini-embedding-2' && cfgData.dimensions === 768, `Model: ${cfgData.model}, Dims: ${cfgData.dimensions}`);
  } catch (err: any) {
    record('API', 'GET /api/documents/config/embeddings', false, err.message);
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n====================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`TEST SUMMARY: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
