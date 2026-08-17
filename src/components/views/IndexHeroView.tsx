import React, { useState, useRef } from 'react';
import { LadderLevel, NavScreen } from '../../types';
import heroVideo from '../../public/hero-visualization.mp4';

interface IndexHeroViewProps {
  onNavigate: (screen: NavScreen) => void;
  onSelectLadderLayer: (level: LadderLevel) => void;
}

const LADDER_LEVELS: LadderLevel[] = ['L0', 'L1', 'L2', 'L3'];

export const IndexHeroView: React.FC<IndexHeroViewProps> = ({
  onNavigate,
  onSelectLadderLayer
}) => {
  const [selectedLayer, setSelectedLayer] = useState<LadderLevel>('L2');
  const videoRef = useRef<HTMLVideoElement>(null);

  const getLayerDetails = () => {
    switch (selectedLayer) {
      case 'L0':
        return {
          title: 'L0: Lossless Raw Text Streams',
          desc: 'Complete source byte stream fidelity with positional formatting and page offsets. Preserved for audits and raw citations.',
          badge: '100% RAW FIDELITY',
          tagColor: 'bg-[#ece8dd] text-[#1c1c15]'
        };
      case 'L1':
        return {
          title: 'L1: Atomic Propositions & Evidence',
          desc: 'Fine-grained standalone semantic assertions extracted with confidence and cross-document attribution vectors.',
          badge: 'STANDALONE FACTLETS',
          tagColor: 'bg-[#ffdf90] text-[#695200]'
        };
      case 'L2':
        return {
          title: 'L2: Proposition Gist Matrix',
          desc: 'Tabular entity matrices, key-value KPI extractions, and semantic chapter digests for rapid structured evaluation.',
          badge: 'STRUCTURED GIST',
          tagColor: 'bg-[#f4c430] text-[#695200]'
        };
      case 'L3':
        return {
          title: 'L3: Vector Space Embeddings',
          desc: '1536-dimensional dense embedding vectors optimized for low-latency HNSW / IVFPQ approximate nearest neighbor search.',
          badge: '1536-DIM SPACE',
          tagColor: 'bg-[#2457c5] text-white'
        };
    }
  };

  const currentDetails = getLayerDetails();

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const progress = video.currentTime / video.duration;
    let newLevel: LadderLevel = 'L0';
    if (progress >= 0.75) {
      newLevel = 'L3';
    } else if (progress >= 0.5) {
      newLevel = 'L2';
    } else if (progress >= 0.25) {
      newLevel = 'L1';
    }

    if (newLevel !== selectedLayer) {
      setSelectedLayer(newLevel);
      onSelectLadderLayer(newLevel);
    }
  };

  const handleSelectLayer = (level: LadderLevel) => {
    setSelectedLayer(level);
    onSelectLadderLayer(level);
    const video = videoRef.current;
    if (video && video.duration) {
      const levelIndex = LADDER_LEVELS.indexOf(level);
      video.currentTime = (levelIndex / LADDER_LEVELS.length) * video.duration;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12 select-none">
      {/* Hero Section Split: Left Typography / Right Video Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Display Branding & Navigation (7 cols) */}
        <div className="lg:col-span-7 border-2 border-[#1c1c15] bg-[#ffffff] p-8 shadow-[6px_6px_0px_0px_#111111] flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs bg-[#f4c430] text-[#695200] px-3 py-1 border-2 border-[#1c1c15] font-bold inline-block mb-4 shadow-[2px_2px_0px_0px_#111111]">
              INDUSTRIAL INTELLIGENCE WORKBENCH
            </span>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold uppercase tracking-tighter text-[#1c1c15] leading-none mb-4">
              CALIBER
            </h1>
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-[#755b00] tracking-tight uppercase mb-4">
              Cache-Aware Layered Index for Budgeted Evidence Retrieval
            </h2>
            <p className="font-body text-base text-[#4e4634] leading-relaxed mb-6">
              Compile evidence once. Select only what the query needs. A raw, functional layer engineered for high-density information environments and enterprise knowledge pipelines.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-[#1c1c15]">
            <button
              onClick={() => onNavigate('query-lab')}
              className="bg-[#f4c430] text-[#695200] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[5px_5px_0px_0px_#111111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111111] font-mono text-xs font-bold uppercase px-5 py-3 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              OPEN QUERY LAB
            </button>

            <button
              onClick={() => onNavigate('architecture')}
              className="bg-[#ffffff] text-[#1c1c15] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:bg-[#e6e2d8] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111111] font-mono text-xs font-bold uppercase px-5 py-3 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              VIEW ARCHITECTURE
            </button>

            <button
              onClick={() => onNavigate('inventory')}
              className="bg-[#ffffff] text-[#1c1c15] border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:bg-[#e6e2d8] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111111] font-mono text-xs font-bold uppercase px-5 py-3 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              EXPLORE INVENTORY
            </button>
          </div>
        </div>

        {/* Right Column: Technical Visualization Video (5 cols) */}
        <div className="lg:col-span-5 border-2 border-[#1c1c15] bg-[#f7f3e8] p-4 shadow-[6px_6px_0px_0px_#111111] flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center border-b-2 border-[#1c1c15] pb-2 mb-2">
            <span className="font-headline font-bold text-xs uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#2457c5]">movie</span>
              Technical Visualization
            </span>
            <span className="font-mono text-[10px] text-[#4e4634] font-bold">CALIBER SYSTEM VIDEO</span>
          </div>

          {/* Interactive Layer Pills */}
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {LADDER_LEVELS.map((lvl) => {
              const isSelected = selectedLayer === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleSelectLayer(lvl)}
                  className={`font-mono text-xs font-bold py-1 px-2 border-2 border-[#111111] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f4c430] text-[#695200] shadow-[2px_2px_0px_0px_#111111] -translate-y-0.5'
                      : 'bg-[#ffffff] text-[#1c1c15] hover:bg-[#ece8dd]'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Video Viewport */}
          <div className="flex-1 w-full min-h-[280px] border-2 border-[#111111] bg-[#ffffff] relative overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover pointer-events-none"
            >
              <source src={heroVideo} type="video/mp4" />
              <source src="/hero-visualization.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Selected Layer Info Strip */}
          <div className="mt-3 p-3 bg-[#ffffff] border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111]">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-headline font-bold text-xs uppercase text-[#1c1c15]">
                {currentDetails.title}
              </h4>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 border border-[#111111] font-bold ${currentDetails.tagColor}`}>
                {currentDetails.badge}
              </span>
            </div>
            <p className="font-body text-xs text-[#4e4634] leading-tight">
              {currentDetails.desc}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Grid Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-[#1c1c15] bg-[#ffffff] p-5 shadow-[4px_4px_0px_0px_#111111]">
          <span className="font-mono text-xs text-[#4e4634] uppercase font-bold block mb-1">
            p99 Inference Latency
          </span>
          <span className="font-mono text-3xl font-bold text-[#1c1c15]">&lt;12ms</span>
        </div>

        <div className="border-2 border-[#1c1c15] bg-[#ffffff] p-5 shadow-[4px_4px_0px_0px_#111111]">
          <span className="font-mono text-xs text-[#4e4634] uppercase font-bold block mb-1">
            Corpus Index Footprint
          </span>
          <span className="font-mono text-3xl font-bold text-[#1c1c15]">4.2 TB</span>
        </div>

        <div className="border-2 border-[#1c1c15] bg-[#ffffff] p-5 shadow-[4px_4px_0px_0px_#111111]">
          <span className="font-mono text-xs text-[#4e4634] uppercase font-bold block mb-1">
            ANN Cache Hit Rate
          </span>
          <span className="font-mono text-3xl font-bold text-[#2457c5]">94.8%</span>
        </div>

        <div className="border-2 border-[#1c1c15] bg-[#ffffff] p-5 shadow-[4px_4px_0px_0px_#111111]">
          <span className="font-mono text-xs text-[#4e4634] uppercase font-bold block mb-1">
            Cluster Availability
          </span>
          <span className="font-mono text-3xl font-bold text-[#755b00]">99.99%</span>
        </div>
      </div>
    </div>
  );
};
