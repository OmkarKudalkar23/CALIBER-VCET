import { DocumentItem, EvidenceNode, LogEntry, SystemMetrics } from '../types';

export const INITIAL_SYSTEM_METRICS: SystemMetrics = {
  totalChunks: 24812,
  avgRecall: 96.7,
  p99LatencyMs: 5.2,
  costReductionFactor: 8.1,
  naiveRagTokens: 2940,
  caliberTokens: 384,
  cacheHitRate: 94.8,
  indexSizeTB: 4.2,
  uptime: 99.99,
};

export const MOCK_VECTOR_DATA = [
  0.0412, -0.1983, 0.5512, 0.9910, -0.0012, 0.1145, 0.8821, -0.3312, 
  0.0045, 0.1299, -0.8812, 0.4412, 0.0412, -0.1983, 0.5512, 0.9910, 
  -0.0012, 0.1145, 0.8821, -0.3312, 0.0045, 0.1299, -0.8812, 0.4412, 
  0.0412, -0.1983, 0.5512, 0.9910, -0.0012, 0.1145, 0.8821, -0.3312, 
  0.0045, 0.1299, -0.8812, 0.4412, 0.0412, -0.1983, 0.5512, 0.9910, 
  -0.0012, 0.1145, 0.8821, -0.3312, 0.0045, 0.1299, -0.8812, 0.4412,
  0.0782, -0.0419, 0.6120, 0.3319, -0.5122, 0.4419, 0.9012, -0.1190
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-APP-23-ESG',
    name: 'Apple_ESG_Report_FY23_FINAL.pdf',
    type: 'PDF',
    chunks: 4201,
    tokens: 384200,
    l0Status: 'ready',
    l1Status: 'ready',
    l2Status: 'ready',
    l3Status: 'ready',
    indexedAt: '2023-10-24 14:02Z',
    status: 'READY',
    summary: 'Apple claims comprehensive carbon neutrality across its corporate operations and retail footprint for fiscal year 2023, while aggressively targeting a 75% reduction in total value chain emissions by 2030 relative to a 2015 baseline.',
    metrics: [
      { name: 'Corp Operations', target: 'Neutral', status: 'Achieved' },
      { name: 'Value Chain (2030)', target: '-75%', status: 'On Track' },
      { name: 'Clean Energy', target: '100%', status: '100% Maintained' },
      { name: 'Water Stewardship', target: 'Zero Impact', status: 'In Progress' },
      { name: 'Recycled Aluminum', target: '100% Enclosures', status: 'Achieved (M3 Mac)' },
    ],
    propositions: [
      { id: 'prop-1', text: "Apple's global corporate operations remain carbon neutral.", score: 0.95, chunkId: 'C-104' },
      { id: 'prop-2', text: "The company aims to reduce emissions across entire value chain by 75% by 2030.", score: 0.88, chunkId: 'C-108' },
      { id: 'prop-3', text: "Over 300 suppliers have committed to 100% renewable electricity for Apple production.", score: 0.92, chunkId: 'C-215' },
      { id: 'prop-4', text: "Restorative natural climate solutions cover remaining 25% unavoidable gross footprint.", score: 0.84, chunkId: 'C-312' }
    ],
    rawText: `[DOCUMENT RAW EXTRACT: Apple ESG Report FY23 - Section 4.2 Climate Strategy]
We have been carbon neutral for our corporate operations worldwide since April 2020. Our Apple 2030 roadmap is our plan to make all our products carbon neutral by the end of this decade.
To achieve this, we are cutting emissions by 75% across our entire value chain against our 2015 baseline. The remaining emissions will be addressed through high-quality nature-based carbon removal projects.
In FY2023, we reduced our gross greenhouse gas footprint by more than 55% compared with 2015, while our revenue grew over 64%. Over 300 suppliers are now committed to using 100 percent clean energy for Apple production by 2030.`,
    vectorPreview: MOCK_VECTOR_DATA
  },
  {
    id: 'DOC-ACM-Q3-COMP',
    name: 'Acme_Corp_Compliance_Matrix_Q3.xlsx',
    type: 'XLSX',
    chunks: 845,
    tokens: 92400,
    l0Status: 'ready',
    l1Status: 'ready',
    l2Status: 'processing',
    l3Status: 'pending',
    indexedAt: 'PENDING',
    status: 'PROCESSING',
    summary: 'Enterprise regulatory compliance audit matrix covering SOC2 Type II, ISO 27001:2022, GDPR data residency, and PCI-DSS v4.0 delta assessments across 18 business units.',
    metrics: [
      { name: 'SOC2 Type II Controls', target: '100% Pass', status: '98.4% (3 remediation open)' },
      { name: 'GDPR Data Subject Requests', target: '<48h SLA', status: 'Achieved (avg 18h)' },
      { name: 'Penetration Testing Coverage', target: 'Bi-annual', status: 'Completed Sept 2023' },
    ],
    propositions: [
      { id: 'prop-acm-1', text: "SOC2 Type II controls verified across 18 cloud regions with zero critical deficiencies.", score: 0.91, chunkId: 'C-42' },
      { id: 'prop-acm-2', text: "Data residency controls enforce EU data isolation for EEA customer records.", score: 0.89, chunkId: 'C-87' },
    ],
    rawText: `[TABLE MATRIX DUMP]
ID, STANDARD, CLAUSE, ASSIGNED_UNIT, STATUS, DEFICIENCY_SEVERITY
AUD-01, SOC2-CC6.1, Logical Access Controls, Cloud Eng, PASS, NONE
AUD-02, ISO-A.12.1.2, Change Management, DevOps, REMEDIATION, LOW
AUD-03, GDPR-Art32, Security of Processing, Data Office, PASS, NONE`,
    vectorPreview: MOCK_VECTOR_DATA.slice(5)
  },
  {
    id: 'DOC-GSC-V2-RISK',
    name: 'Global_Supply_Chain_Risk_Assessment_Draft_v2.docx',
    type: 'DOCX',
    chunks: 1209,
    tokens: 142000,
    l0Status: 'ready',
    l1Status: 'failed',
    l2Status: 'pending',
    l3Status: 'pending',
    indexedAt: 'FAILED (L1)',
    status: 'FAILED',
    summary: 'Geopolitical and logistical supply chain single-point-of-failure stress test across tier 1 semiconductor packaging and rare earth mineral refinement pipelines.',
    metrics: [
      { name: 'Single-Source Risk Index', target: '<0.25', status: 'High (0.64)' },
      { name: 'Buffer Stock Inventory', target: '90 Days', status: '45 Days' }
    ],
    propositions: [],
    rawText: `[ERROR IN L1 PARSER: Malformed XML entities detected in WordprocessingML table namespace. Node stream severed at chunk offset 418.]`,
    vectorPreview: []
  },
  {
    id: 'DOC-TSL-22-10K',
    name: 'Tesla_10K_Filing_2022.pdf',
    type: 'PDF',
    chunks: 8932,
    tokens: 789000,
    l0Status: 'ready',
    l1Status: 'ready',
    l2Status: 'ready',
    l3Status: 'ready',
    indexedAt: '2023-10-23 09:15Z',
    status: 'READY',
    summary: 'Annual filing providing comprehensive review of automotive revenue, energy generation/storage deployment (6.5 GWh), Supercharger infrastructure expansion, and 4680 cell manufacturing ramps.',
    metrics: [
      { name: 'Automotive Deliveries', target: '1.31M Units', status: 'Achieved (+40% YoY)' },
      { name: 'Energy Storage Deployed', target: '6.5 GWh', status: '+64% YoY' },
      { name: 'Operating Margin', target: '>15%', status: '16.8% Top Tier' }
    ],
    propositions: [
      { id: 'prop-tsla-1', text: "Total vehicle deliveries reached 1.31 million units in fiscal year 2022.", score: 0.97, chunkId: 'C-552' },
      { id: 'prop-tsla-2', text: "Energy storage deployments grew to 6.5 GWh driven by Megapack factory scaling.", score: 0.94, chunkId: 'C-780' }
    ],
    rawText: `[10-K EXCERPT: Item 7 Management Discussion]
In 2022, we produced 1,369,611 vehicles and delivered 1,313,851 vehicles. Total automotive revenue reached $71.46 billion, compared to $47.23 billion in 2021. Our cost of automotive sales increased to $49.60 billion.`,
    vectorPreview: MOCK_VECTOR_DATA
  },
  {
    id: 'DOC-NV-Q2-CALL',
    name: 'Nvidia_Earnings_Call_Transcript_Q2.txt',
    type: 'TXT',
    chunks: 1024,
    tokens: 118400,
    l0Status: 'ready',
    l1Status: 'ready',
    l2Status: 'ready',
    l3Status: 'ready',
    indexedAt: '2023-10-22 18:40Z',
    status: 'READY',
    summary: 'Executive earnings call transcript detailing generative AI accelerator demand, Hopper H100 architecture deployments, HGX networking attach rates, and Mellanox InfiniBand throughput.',
    metrics: [
      { name: 'Data Center Revenue', target: '$10.32B', status: 'Record (+171% QoQ)' },
      { name: 'Gross Margin', target: '>70%', status: '71.2% GAAP' },
      { name: 'Supply Commitment', target: 'Multi-quarter', status: 'Secured CoWoS capacity' }
    ],
    propositions: [
      { id: 'prop-nv-1', text: "Data Center revenue reached record $10.32 billion, up 171% sequentially.", score: 0.98, chunkId: 'C-12' },
      { id: 'prop-nv-2', text: "Major cloud service providers drove steep demand for HGX systems powered by H100 GPUs.", score: 0.95, chunkId: 'C-38' }
    ],
    rawText: `[TRANSCRIPT AUDIO VERBATIM]
Jensen Huang: Generative AI is the new computing platform. Cloud service providers, consumer internet companies, and enterprise software leaders are transitioning their general-purpose compute to accelerated computing. H100 demand is exceptional across all hyperscalers.`,
    vectorPreview: MOCK_VECTOR_DATA
  },
  {
    id: 'DOC-AZ-HYP-ARCH',
    name: 'Azure_HyperScale_Topology_Whitepaper.pdf',
    type: 'PDF',
    chunks: 3150,
    tokens: 290000,
    l0Status: 'ready',
    l1Status: 'ready',
    l2Status: 'ready',
    l3Status: 'ready',
    indexedAt: '2023-10-21 11:30Z',
    status: 'READY',
    summary: 'Architectural specifications for 800Gbps RDMA networking fabric, liquid-to-chip direct cooling loops, and disaggregated memory tiering in next-generation cloud availability zones.',
    metrics: [
      { name: 'Network Bisection Bandwidth', target: '800 Gbps', status: 'Active' },
      { name: 'PUE Target', target: '<1.15', status: '1.12 Average' }
    ],
    propositions: [
      { id: 'prop-az-1', text: "Direct-to-chip liquid cooling handles thermal dissipation for 1000W+ accelerated silicon.", score: 0.93, chunkId: 'C-204' }
    ],
    rawText: `[TECHNICAL WHITEPAPER]
Disaggregated pooled memory over CXL 3.0 allows dynamic host allocation with sub-150ns latency overhead, eliminating stranded memory stranding in dense virtual machine clusters.`,
    vectorPreview: MOCK_VECTOR_DATA
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: '10:42:01', level: 'INFO', message: 'Ingesting corpus partition gs://caliber-data/batch_74...', module: 'INGEST' },
  { id: 'log-2', timestamp: '10:42:04', level: 'INFO', message: 'Chunking completed. 1,402 new nodes generated.', module: 'CHUNK' },
  { id: 'log-3', timestamp: '10:42:15', level: 'WARN', message: 'High semantic overlap detected in nodes 800-840. Merging...', module: 'DEDUP' },
  { id: 'log-4', timestamp: '10:42:18', level: 'INFO', message: 'Embedding generation via model v3-turbo-dense...', module: 'LADDER' },
  { id: 'log-5', timestamp: '10:42:45', level: 'ERR!', message: 'Vector DB timeout on shard 4. Retrying (1/3)...', module: 'VECTOR_DB' },
  { id: 'log-6', timestamp: '10:42:48', level: 'INFO', message: 'Retry successful. Index updated. Delta latency: 5.2ms', module: 'VECTOR_DB' },
  { id: 'log-7', timestamp: '10:42:50', level: 'SYS', message: 'Awaiting next batch pipeline trigger...', module: 'SUPERVISOR' }
];

export const SAMPLE_QUERIES = [
  'What are Apple corporate and supply chain carbon neutrality targets for 2030?',
  'Summarize SOC2 compliance status and open deficiencies in Q3 audit matrix.',
  'Analyze Nvidia data center revenue growth drivers and Hopper H100 demand in Q2.',
  'What are the energy storage deployment numbers reported by Tesla in 2022?'
];

export const SAMPLE_EVIDENCE_ITEMS: EvidenceNode[] = [
  {
    id: 'ev-01',
    sourceDocId: 'DOC-APP-23-ESG',
    sourceDocName: '10-K_AAPL_2023',
    score: 0.942,
    level: 'L1',
    batchId: 'BATCH_4492',
    tokenCount: 48,
    content: 'Apple aims to achieve 100 percent carbon neutrality for its supply chain and products by 2030, a goal that requires significant investment in renewable energy projects globally.',
    metadata: {
      section: 'Section 4.2 Climate Strategy',
      page: 14,
      tokens: 48,
      cosineSim: 0.942,
      cacheHit: true,
      hash: 'sha256:7f89a9c21'
    }
  },
  {
    id: 'ev-02',
    sourceDocId: 'DOC-APP-23-ESG',
    sourceDocName: 'ENV_REPORT_23',
    score: 0.887,
    level: 'L1',
    batchId: 'BATCH_4492',
    tokenCount: 42,
    content: 'The company has transitioned all of its corporate operations to 100 percent renewable energy and is aggressively pushing suppliers to adopt similar standards.',
    metadata: {
      section: 'Section 2.1 Corporate Footprint',
      page: 8,
      tokens: 42,
      cosineSim: 0.887,
      cacheHit: true,
      hash: 'sha256:b34e8910a'
    }
  },
  {
    id: 'ev-03',
    sourceDocId: 'DOC-APP-23-ESG',
    sourceDocName: 'SUPPLIER_COMMIT_23',
    score: 0.864,
    level: 'L2',
    batchId: 'BATCH_4492',
    tokenCount: 36,
    content: 'Over 300 active supplier facilities across 28 countries are operating on verified 100% clean power power purchase agreements (PPAs).',
    metadata: {
      section: 'Section 5.0 Supplier Responsibility',
      page: 22,
      tokens: 36,
      cosineSim: 0.864,
      cacheHit: false,
      hash: 'sha256:c89a01f44'
    }
  }
];
