import React, { useState } from 'react';

interface PipelinesViewProps {
  onOpenNewPipeline: () => void;
}

export const PipelinesView: React.FC<PipelinesViewProps> = ({ onOpenNewPipeline }) => {
  const [pipelines, setPipelines] = useState([
    {
      id: 'pipe-01',
      name: 'Corpus_Batch_SEC_Filings',
      type: 'INDEX_TIME',
      status: 'RUNNING',
      progress: 68,
      source: 'gs://sec-edgar-filings/q3-2023',
      throughput: '1,420 chunks/sec',
      shards: '16 Shards',
      lastRun: '12 mins ago'
    },
    {
      id: 'pipe-02',
      name: 'Enterprise_ESG_Resolution_Ladder',
      type: 'LADDER_GEN',
      status: 'ACTIVE',
      progress: 100,
      source: 'gs://caliber-esg/annual_reports',
      throughput: '980 props/sec',
      shards: '8 Shards',
      lastRun: '1 hour ago'
    },
    {
      id: 'pipe-03',
      name: 'Inference_Prompt_Assembly_Route',
      type: 'QUERY_TIME',
      status: 'HEALTHY',
      progress: 100,
      source: 'REST /api/v2/query/budgeted',
      throughput: '5.2ms p99',
      shards: 'All Shards',
      lastRun: 'Just now'
    },
    {
      id: 'pipe-04',
      name: 'Cross_Corpus_Dedup_Cluster',
      type: 'MAINTENANCE',
      status: 'SCHEDULED',
      progress: 0,
      source: 'Internal Vector Shards',
      throughput: 'Scheduled 02:00 UTC',
      shards: 'Cluster Wide',
      lastRun: 'Yesterday'
    }
  ]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-[#1c1c15] pb-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-[#1c1c15] uppercase tracking-tighter leading-none mb-2">
            PIPELINE ORCHESTRATION
          </h2>
          <p className="font-body text-sm text-[#4e4634]">
            Monitor and execute continuous batch ETL transformations and real-time inference routing.
          </p>
        </div>

        <button
          onClick={onOpenNewPipeline}
          className="bg-[#f4c430] border-2 border-[#1c1c15] shadow-[3px_3px_0px_0px_#111111] text-[#695200] px-4 py-2 font-mono text-xs uppercase font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 hover:bg-[#e6b82d] cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          CREATE PIPELINE
        </button>
      </div>

      {/* Pipeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pipelines.map((pipe) => (
          <div
            key={pipe.id}
            className="border-2 border-[#1c1c15] bg-[#ffffff] shadow-[5px_5px_0px_0px_#111111] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs bg-[#e6e2d8] px-2 py-0.5 border border-[#111111] font-bold text-[#1c1c15]">
                  {pipe.type}
                </span>
                <span
                  className={`font-mono text-xs px-2 py-0.5 border border-[#111111] font-bold ${
                    pipe.status === 'RUNNING'
                      ? 'bg-[#f4c430] text-[#695200] animate-pulse'
                      : pipe.status === 'HEALTHY' || pipe.status === 'ACTIVE'
                      ? 'bg-[#2457c5] text-white'
                      : 'bg-[#ece8dd] text-[#4e4634]'
                  }`}
                >
                  {pipe.status}
                </span>
              </div>

              <h3 className="font-headline text-lg font-bold text-[#1c1c15] mb-1">
                {pipe.name}
              </h3>
              <p className="font-mono text-xs text-[#4e4634] mb-4 truncate">
                Source: {pipe.source}
              </p>

              {/* Progress bar if running */}
              {pipe.status === 'RUNNING' && (
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] font-mono text-[#4e4634] mb-1">
                    <span>Processing Batch Partition</span>
                    <span>{pipe.progress}%</span>
                  </div>
                  <div className="w-full h-3 border-2 border-[#1c1c15] bg-[#e6e2d8] relative overflow-hidden">
                    <div
                      className="h-full bg-[#f4c430] border-r-2 border-[#1c1c15] transition-all"
                      style={{ width: `${pipe.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 bg-[#fdf9ee] border border-[#111111] p-3 font-mono text-xs">
                <div>
                  <span className="text-[#4e4634] text-[10px] uppercase block">Throughput</span>
                  <span className="font-bold">{pipe.throughput}</span>
                </div>
                <div>
                  <span className="text-[#4e4634] text-[10px] uppercase block">Cluster Allocation</span>
                  <span className="font-bold text-[#755b00]">{pipe.shards}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1c1c15]/20 flex justify-between items-center font-mono text-xs">
              <span className="text-[#5f5e5e]">Last sync: {pipe.lastRun}</span>
              <div className="flex gap-2">
                <button className="px-2 py-1 border border-[#111111] hover:bg-[#e6e2d8] font-bold cursor-pointer">
                  CONFIG
                </button>
                <button className="px-2 py-1 bg-[#f4c430] text-[#695200] border border-[#111111] font-bold hover:bg-[#e6b82d] cursor-pointer">
                  TRIGGER RUN
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
