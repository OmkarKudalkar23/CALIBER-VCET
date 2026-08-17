/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DocumentItem, EvidenceNode, LadderLevel, NavScreen } from './types';
import { INITIAL_DOCUMENTS, INITIAL_LOGS, INITIAL_SYSTEM_METRICS, SAMPLE_EVIDENCE_ITEMS } from './data/mockData';
import { SideNavBar } from './components/layout/SideNavBar';
import { TopNavBar } from './components/layout/TopNavBar';
import { EvidenceInspectorDrawer } from './components/layout/EvidenceInspectorDrawer';
import { DashboardView } from './components/views/DashboardView';
import { InventoryView } from './components/views/InventoryView';
import { DocumentDetailView } from './components/views/DocumentDetailView';
import { QueryLabView } from './components/views/QueryLabView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { IndexHeroView } from './components/views/IndexHeroView';
import { PipelinesView } from './components/views/PipelinesView';
import { SettingsView } from './components/views/SettingsView';
import { IngestModal } from './components/modals/IngestModal';
import { NewPipelineModal } from './components/modals/NewPipelineModal';
import { DocsModal } from './components/modals/DocsModal';

export default function App() {
  // Navigation & View States
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('index-hero');
  const [activeLadderLevel, setActiveLadderLevel] = useState<LadderLevel>('L2');
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem>(INITIAL_DOCUMENTS[0]);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [metrics, setMetrics] = useState(INITIAL_SYSTEM_METRICS);

  // Inspector & Selection States
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedEvidenceNode, setSelectedEvidenceNode] = useState<EvidenceNode | null>(SAMPLE_EVIDENCE_ITEMS[0]);

  // Load live server documents and metrics on startup
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.documents && data.documents.length > 0) {
          setDocuments(data.documents);
          setSelectedDocument(data.documents[0]);
        }
      })
      .catch(err => console.log('[App] Backend not yet ready, using initial state:', err));

    fetch('/api/dashboard/overview')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setMetrics(prev => ({
            ...prev,
            totalChunks: data.chunks || prev.totalChunks,
            avgRecall: 96.7,
            p99LatencyMs: data.selectionLatencyMs || prev.p99LatencyMs,
            costReductionFactor: data.tokenReduction || prev.costReductionFactor
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Modals
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isNewPipelineOpen, setIsNewPipelineOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  // Handlers
  const handleSelectDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setCurrentScreen('document-detail');
  };

  const handleInspectLadder = (doc: DocumentItem, level: LadderLevel = 'L2') => {
    setSelectedDocument(doc);
    setActiveLadderLevel(level);
    setCurrentScreen('document-detail');
  };

  const handleOpenInspectorForDoc = (doc: DocumentItem) => {
    const node: EvidenceNode = {
      id: `node-${doc.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      sourceDocId: doc.id,
      sourceDocName: doc.name,
      score: 0.945,
      level: activeLadderLevel,
      batchId: 'BATCH_4492',
      tokenCount: 48,
      content: doc.summary || doc.name,
      metadata: {
        section: 'Summary Manifest Partition',
        tokens: 48,
        cosineSim: 0.945,
        cacheHit: true,
        hash: `sha256:${doc.id.toLowerCase()}_7f89`
      }
    };
    setSelectedEvidenceNode(node);
    setIsInspectorOpen(true);
  };

  const handleIngestSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    setMetrics((prev) => ({
      ...prev,
      totalChunks: prev.totalChunks + newDoc.chunks
    }));
  };

  const handleOpenSupport = () => {
    setSupportMessage('CALIBER Operator Support: Terminal direct line active at ops@caliber-rag.internal');
    setTimeout(() => setSupportMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fdf9ee] text-[#1c1c15] flex flex-col font-body selection:bg-[#f4c430] selection:text-[#695200]">
      {/* Persistent Left Sidebar */}
      <SideNavBar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenNewPipeline={() => setIsNewPipelineOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSupport={handleOpenSupport}
      />

      {/* Persistent Top Navigation Bar */}
      <TopNavBar
        currentScreen={currentScreen}
        activeLevel={activeLadderLevel}
        onSelectLevel={(lvl) => {
          setActiveLadderLevel(lvl);
          if (currentScreen === 'inventory') {
            // keep on inventory
          } else if (currentScreen !== 'document-detail') {
            setCurrentScreen('document-detail');
          }
        }}
        searchQuery={searchQuery}
        onSearch={(q) => setSearchQuery(q)}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
      />

      {/* Main Content Area */}
      <main className={`flex-1 ml-[250px] mt-16 p-8 transition-all duration-200 ${
        isInspectorOpen ? 'mr-[400px]' : ''
      }`}>
        {/* View Switcher */}
        {currentScreen === 'index-hero' && (
          <IndexHeroView
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSelectLadderLayer={(lvl) => {
              setActiveLadderLevel(lvl);
            }}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            logs={logs}
            onOpenQueryLab={() => setCurrentScreen('query-lab')}
            onOpenInventory={() => setCurrentScreen('inventory')}
          />
        )}

        {currentScreen === 'inventory' && (
          <InventoryView
            documents={documents}
            onSelectDocument={handleSelectDocument}
            onInspectLadder={handleInspectLadder}
            onOpenIngest={() => setIsIngestOpen(true)}
            onOpenInspector={handleOpenInspectorForDoc}
          />
        )}

        {currentScreen === 'document-detail' && (
          <DocumentDetailView
            document={selectedDocument}
            initialLevel={activeLadderLevel}
            onBackToInventory={() => setCurrentScreen('inventory')}
            onOpenQueryLabWithDoc={(doc) => {
              setSelectedDocument(doc);
              setCurrentScreen('query-lab');
            }}
            onOpenProvenanceNode={(nodeId) => {
              const node: EvidenceNode = {
                id: nodeId,
                sourceDocId: selectedDocument.id,
                sourceDocName: selectedDocument.name,
                score: 0.952,
                level: 'L1',
                batchId: 'BATCH_4492',
                tokenCount: 48,
                content: selectedDocument.summary || selectedDocument.name,
                metadata: {
                  section: 'Section 4.2 Climate Strategy',
                  tokens: 48,
                  cosineSim: 0.952,
                  cacheHit: true,
                  hash: `sha256:${nodeId}_verified`
                }
              };
              setSelectedEvidenceNode(node);
              setIsInspectorOpen(true);
            }}
          />
        )}

        {currentScreen === 'query-lab' && (
          <QueryLabView
            onSelectEvidenceNode={(node) => {
              setSelectedEvidenceNode(node);
              setIsInspectorOpen(true);
            }}
            onOpenInspector={() => setIsInspectorOpen(true)}
          />
        )}

        {currentScreen === 'architecture' && (
          <ArchitectureView
            onSelectNode={(node) => setSelectedEvidenceNode(node)}
            onOpenInspector={() => setIsInspectorOpen(true)}
          />
        )}

        {currentScreen === 'pipelines' && (
          <PipelinesView
            onOpenNewPipeline={() => setIsNewPipelineOpen(true)}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Evidence Inspector Right Slide-Over Drawer */}
      <EvidenceInspectorDrawer
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        selectedEvidence={selectedEvidenceNode}
        onInspectLog={() => {
          setCurrentScreen('dashboard');
          setIsInspectorOpen(false);
        }}
      />

      {/* Modals */}
      <IngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestSuccess={handleIngestSuccess}
      />

      <NewPipelineModal
        isOpen={isNewPipelineOpen}
        onClose={() => setIsNewPipelineOpen(false)}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Notification Toast */}
      {supportMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1c1c15] text-[#ffdf90] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-3 font-mono text-xs z-50 animate-bounce">
          {supportMessage}
        </div>
      )}
    </div>
  );
}
