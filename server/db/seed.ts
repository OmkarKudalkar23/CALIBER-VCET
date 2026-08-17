import { db } from './store';
import { generateDeterministicEmbedding } from '../gemini';
import { CONFIG } from '../config';

export function seedDatabase() {
  if (db.documents.size > 0) return;

  console.log('[CALIBER Seed] Populating initial benchmark corpus...');

  // 1. Apple ESG Report 2023
  const doc1Id = 'DOC-AAPL-ESG-2023';
  const doc1Chunks = [
    {
      id: `${doc1Id}-C1`,
      raw: 'Apple aims to achieve 100 percent carbon neutrality across its entire business, manufacturing supply chain, and product life cycle by 2030. The company has already reached carbon neutrality for corporate emissions worldwide since April 2020 by sourcing 100 percent renewable electricity for all Apple data centers, retail stores, and offices.',
      propositions: [
        'Apple commits to 100 percent carbon neutrality across supply chain and products by 2030.',
        'Apple corporate emissions have been net zero since April 2020.',
        'All Apple data centers and offices run on 100 percent renewable electricity.'
      ],
      gist: {
        summary: 'Apple 2030 Carbon Neutrality commitment across all operations and supplier pipelines.',
        entities: ['Apple Inc.', 'Supply Chain', 'Data Centers', 'Corporate Operations'],
        relationships: ['Apple -> aims for -> Carbon Neutrality by 2030', 'Corporate Operations -> achieved -> Net Zero in 2020'],
        dates: ['April 2020', '2030'],
        numbers: ['100%', '0 Net Emissions']
      }
    },
    {
      id: `${doc1Id}-C2`,
      raw: 'Over 300 active supplier facilities across 28 countries operate on verified 100% clean power purchase agreements (PPAs), representing over 13.7 gigawatts of clean energy in Apple supply chain. Apple Supplier Clean Energy Program continues to incentivize manufacturing partners to transition away from fossil-fuel grid electricity.',
      propositions: [
        'Over 300 supplier facilities across 28 countries utilize 100 percent clean power agreements.',
        'Apple supply chain accounts for over 13.7 gigawatts of renewable energy capacity.',
        'The Supplier Clean Energy Program accelerates transition from fossil fuels.'
      ],
      gist: {
        summary: 'Supplier Clean Energy Program scaling renewable energy procurement globally.',
        entities: ['Supplier Clean Energy Program', 'Supply Chain Partners', 'PPAs'],
        relationships: ['300 Suppliers -> deploy -> 13.7 GW Clean Energy'],
        dates: ['2023'],
        numbers: ['300 facilities', '28 countries', '13.7 GW']
      }
    },
    {
      id: `${doc1Id}-C3`,
      raw: 'Apple increased recycled gold usage across all printed circuit boards to 100 percent in iPhone 15 models. Furthermore, 100 percent recycled cobalt is now utilized in all Apple-designed batteries, and 100 percent recycled rare earth elements are incorporated into all magnets.',
      propositions: [
        'iPhone 15 printed circuit boards use 100 percent certified recycled gold.',
        'Apple-designed batteries now incorporate 100 percent recycled cobalt.',
        'All device magnets use 100 percent recycled rare earth elements.'
      ],
      gist: {
        summary: 'Recycled materials roadmap including 100% recycled gold, cobalt, and rare earths.',
        entities: ['iPhone 15', 'Printed Circuit Boards', 'Apple-designed Batteries', 'Rare Earth Magnets'],
        relationships: ['iPhone 15 -> features -> 100% recycled cobalt and gold'],
        dates: ['2023'],
        numbers: ['100% recycled gold', '100% recycled cobalt', '100% rare earths']
      }
    }
  ];

  // 2. Acme Compliance Manual 2024
  const doc2Id = 'DOC-ACME-COMPLIANCE-2024';
  const doc2Chunks = [
    {
      id: `${doc2Id}-C1`,
      raw: 'Section 4.1 Data Governance Policy: All customer personally identifiable information (PII) stored across production databases must be encrypted at rest using AES-256 GCM encryption. Keys must be rotated every 90 days using hardware security modules (HSM) with strict zero-trust role-based access control.',
      propositions: [
        'Customer PII must be encrypted at rest using AES-256 GCM encryption.',
        'Encryption keys must be rotated every 90 days via Hardware Security Modules.',
        'Zero-trust role-based access control is mandatory across production clusters.'
      ],
      gist: {
        summary: 'Data Governance and AES-256 encryption standard with 90-day HSM key rotation.',
        entities: ['PII', 'AES-256 GCM', 'Hardware Security Modules', 'RBAC'],
        relationships: ['PII -> encrypted with -> AES-256', 'Keys -> rotated -> every 90 days'],
        dates: ['90-day cycle', '2024'],
        numbers: ['256-bit', '90 days']
      }
    },
    {
      id: `${doc2Id}-C2`,
      raw: 'Section 8.3 Incident Response Protocol: Security incidents classified as Severity-1 must be reported to the Data Protection Officer and Executive Committee within 60 minutes of detection. Affected regulatory authorities and impacted customers must be notified within 72 hours per GDPR Article 33 compliance.',
      propositions: [
        'Severity-1 incidents require DPO and Executive notification within 60 minutes.',
        'GDPR Article 33 mandates customer and regulatory notification within 72 hours.',
        'Incident triage teams must maintain cryptographically signed audit logs.'
      ],
      gist: {
        summary: 'Incident escalation protocol with 60-minute internal and 72-hour regulatory timelines.',
        entities: ['Data Protection Officer', 'Executive Committee', 'GDPR Article 33'],
        relationships: ['Sev-1 -> alerts -> DPO in 60 mins', 'GDPR -> requires notice in -> 72 hours'],
        dates: ['60 minutes', '72 hours'],
        numbers: ['60m', '72h']
      }
    }
  ];

  // 3. Q4 Financial Risk Filing
  const doc3Id = 'DOC-FINANCIAL-RISK-Q4';
  const doc3Chunks = [
    {
      id: `${doc3Id}-C1`,
      raw: 'Interest rate sensitivity analysis demonstrates that a 100 basis point upward parallel shift in the yield curve would result in an estimated $420 million reduction in net interest income over the subsequent twelve-month operating window. Counterparty credit risk is mitigated via credit support annexes with daily margin settlement.',
      propositions: [
        'A 100 bps yield curve increase reduces annual net interest income by $420 million.',
        'Counterparty credit exposure is secured via daily margin settlement under CSAs.'
      ],
      gist: {
        summary: 'Yield curve sensitivity modeling showing $420M NII exposure per 100 bps shift.',
        entities: ['Yield Curve', 'Net Interest Income', 'Credit Support Annexes'],
        relationships: ['100 bps hike -> impacts -> $420M NII'],
        dates: ['Q4 2023', '12-month horizon'],
        numbers: ['100 bps', '$420 Million']
      }
    }
  ];

  // 4. Healthcare Clinical Directives
  const doc4Id = 'DOC-HEALTHCARE-DIR-2024';
  const doc4Chunks = [
    {
      id: `${doc4Id}-C1`,
      raw: 'Guideline 12: Dual antiplatelet therapy (DAPT) comprising aspirin 81mg daily plus ticagrelor 90mg twice daily is indicated for 12 months following acute coronary syndrome in patients undergoing percutaneous coronary intervention, unless high bleeding risk warrants earlier discontinuation at 6 months.',
      propositions: [
        'DAPT with aspirin 81mg and ticagrelor 90mg BID is recommended for 12 months post-ACS.',
        'High bleeding risk patients may reduce DAPT duration to 6 months post-PCI.'
      ],
      gist: {
        summary: 'Standard 12-month post-ACS DAPT protocol with 6-month safety truncation for high bleeding risk.',
        entities: ['DAPT', 'Aspirin', 'Ticagrelor', 'Acute Coronary Syndrome', 'PCI'],
        relationships: ['ACS patients -> receive DAPT for -> 12 months'],
        dates: ['6 months', '12 months'],
        numbers: ['81mg', '90mg BID', '12 months', '6 months']
      }
    }
  ];

  const seedDocs = [
    {
      id: doc1Id,
      name: 'Apple_ESG_Report_2023.pdf',
      filename: 'Apple_ESG_Report_2023.pdf',
      mimeType: 'application/pdf',
      fileSize: 4194304,
      source: 'gs://sec-edgar-filings/aapl-2023-esg.pdf',
      chunks: doc1Chunks,
      summary: 'Comprehensive sustainability report outlining Apple 2030 carbon neutrality roadmap, 13.7 GW clean supplier power, and 100% recycled cobalt batteries.',
      metrics: [
        { name: 'Parsed Sections', target: '44', status: '44/44 (100%)' },
        { name: 'Atomic Propositions', target: '>80', status: '112 Extracted' },
        { name: 'Entity Resolution', target: '99%', status: '99.4% Verified' }
      ]
    },
    {
      id: doc2Id,
      name: 'Acme_Global_Compliance_Manual_2024.docx',
      filename: 'Acme_Global_Compliance_Manual_2024.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 2097152,
      source: 'internal://compliance/manual-2024.docx',
      chunks: doc2Chunks,
      summary: 'Enterprise compliance directives covering AES-256 PII encryption, 90-day HSM key rotation, and 60-min Sev-1 escalation workflows.',
      metrics: [
        { name: 'Parsed Sections', target: '28', status: '28/28 (100%)' },
        { name: 'Atomic Propositions', target: '>50', status: '68 Extracted' },
        { name: 'Entity Resolution', target: '99%', status: '99.8% Verified' }
      ]
    },
    {
      id: doc3Id,
      name: 'Q4_Financial_Risk_Filing_2023.pdf',
      filename: 'Q4_Financial_Risk_Filing_2023.pdf',
      mimeType: 'application/pdf',
      fileSize: 3145728,
      source: 'gs://financial-filings/q4-risk.pdf',
      chunks: doc3Chunks,
      summary: 'SEC 10-Q risk disclosure modeling 100 bps yield curve shift and $420M NII sensitivity with daily CSA margin settlements.',
      metrics: [
        { name: 'Parsed Sections', target: '18', status: '18/18 (100%)' },
        { name: 'Atomic Propositions', target: '>30', status: '42 Extracted' },
        { name: 'Entity Resolution', target: '98%', status: '98.9% Verified' }
      ]
    },
    {
      id: doc4Id,
      name: 'Healthcare_Clinical_Directives_2024.pdf',
      filename: 'Healthcare_Clinical_Directives_2024.pdf',
      mimeType: 'application/pdf',
      fileSize: 1572864,
      source: 'gs://medical-corpus/directives-2024.pdf',
      chunks: doc4Chunks,
      summary: 'Evidence-based cardiology guidelines on dual antiplatelet therapy (DAPT) duration and bleeding risk thresholds post-PCI.',
      metrics: [
        { name: 'Parsed Sections', target: '12', status: '12/12 (100%)' },
        { name: 'Atomic Propositions', target: '>20', status: '34 Extracted' },
        { name: 'Entity Resolution', target: '99%', status: '99.7% Verified' }
      ]
    }
  ];

    for (const sDoc of seedDocs) {
    let totalTokens = 0;

    // Register chunks and layers
    for (let idx = 0; idx < sDoc.chunks.length; idx++) {
      const c = sDoc.chunks[idx];
      const tokenCount = Math.round(c.raw.length / 4);
      totalTokens += tokenCount;

      const chunkData = {
        id: c.id,
        documentId: sDoc.id,
        chunkIndex: idx,
        rawText: c.raw,
        tokenCount,
        contentHash: `sha256:${c.id.toLowerCase()}_hash`,
        createdAt: new Date().toISOString()
      };
      db.chunks.set(c.id, chunkData);

      c.propositions.forEach((pText, pIdx) => {
        const pId = `${c.id}-P${pIdx + 1}`;
        const propData = {
          id: pId,
          chunkId: c.id,
          documentId: sDoc.id,
          text: pText,
          importance: 0.92 - (pIdx * 0.05),
          tokenCount: Math.round(pText.length / 4),
          contentHash: `sha256:${pId.toLowerCase()}`,
          createdAt: new Date().toISOString()
        };
        db.propositions.set(pId, propData);
      });

      const gistData = {
        id: `GIST-${c.id}`,
        chunkId: c.id,
        documentId: sDoc.id,
        gist: c.gist.summary,
        structuredData: {
          entities: c.gist.entities,
          relationships: c.gist.relationships,
          dates: c.gist.dates,
          numbers: c.gist.numbers
        },
        tokenCount: Math.round(c.gist.summary.length / 4),
        createdAt: new Date().toISOString()
      };
      db.gists.set(c.id, gistData);

      const embeddingVec = generateDeterministicEmbedding(c.raw, CONFIG.EMBEDDING_DIMENSIONS);
      const embData = {
        id: `EMB-${c.id}`,
        chunkId: c.id,
        documentId: sDoc.id,
        vector: embeddingVec,
        model: CONFIG.EMBEDDING_MODEL,
        dimensions: CONFIG.EMBEDDING_DIMENSIONS,
        createdAt: new Date().toISOString()
      };
      db.embeddings.set(c.id, embData);
    }

    const docData = {
      id: sDoc.id,
      name: sDoc.name,
      filename: sDoc.filename,
      mimeType: sDoc.mimeType,
      fileSize: sDoc.fileSize,
      source: sDoc.source,
      status: 'READY' as const,
      chunksCount: sDoc.chunks.length,
      totalTokens,
      summary: sDoc.summary,
      metrics: sDoc.metrics,
      createdAt: '2024-03-15T08:00:00.000Z',
      updatedAt: new Date().toISOString(),
      indexedAt: '2024-03-15 08:30:00 UTC',
      l0Status: 'ready' as const,
      l1Status: 'ready' as const,
      l2Status: 'ready' as const,
      l3Status: 'ready' as const
    };
    db.documents.set(sDoc.id, docData);
  }

  // Persist seed data into MongoDB Atlas asynchronously
  import('./mongo').then(({ getDb }) => getDb()).then(async (mongoDb) => {
    await mongoDb.collection('documents').deleteMany({});
    await mongoDb.collection('chunks').deleteMany({});
    await mongoDb.collection('propositions').deleteMany({});
    await mongoDb.collection('gists').deleteMany({});
    await mongoDb.collection('embeddings').deleteMany({});

    await mongoDb.collection('documents').insertMany(Array.from(db.documents.values()));
    await mongoDb.collection('chunks').insertMany(Array.from(db.chunks.values()));
    await mongoDb.collection('propositions').insertMany(Array.from(db.propositions.values()));
    await mongoDb.collection('gists').insertMany(Array.from(db.gists.values()));
    await mongoDb.collection('embeddings').insertMany(Array.from(db.embeddings.values()));
    console.log('[CALIBER Seed] Seed data successfully committed to MongoDB Atlas.');
  }).catch(err => console.warn('[CALIBER Seed Mongo Error]:', err?.message || err));

  db.addLog('SYS', 'SEED', `Corpus seed complete: ${db.documents.size} documents, ${db.chunks.size} chunks, ${db.propositions.size} propositions.`);
  console.log('[CALIBER Seed] Corpus populated successfully.');
}
