import React, { useState } from 'react';

interface NewPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPipelineModal: React.FC<NewPipelineModalProps> = ({ isOpen, onClose }) => {
  const [pipelineName, setPipelineName] = useState('Corpus_Ingest_Custom_Batch');
  const [sourceUri, setSourceUri] = useState('gs://enterprise-lakehouse/unstructured_v2');
  const [pipelineType, setPipelineType] = useState('INDEX_TIME');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    setIsCreated(true);
    setTimeout(() => {
      setIsCreated(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#1c1c15]/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
      <div className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[8px_8px_0px_0px_#111111] max-w-lg w-full p-6 flex flex-col gap-6 animate-fadeIn">
        <div className="flex justify-between items-start border-b-2 border-[#1c1c15] pb-3">
          <div>
            <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#1c1c15] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#755b00]">add_circle</span>
              New Indexing Pipeline
            </h3>
            <p className="font-mono text-xs text-[#4e4634] mt-1 font-semibold">
              Configure automated corpus batch processing and resolution compilation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border border-[#111111] hover:bg-[#e6e2d8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div>
            <label className="text-[#4e4634] font-bold block mb-1">PIPELINE IDENTIFIER</label>
            <input
              type="text"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className="w-full p-2.5 border-2 border-[#111111] bg-[#fdf9ee] font-bold"
            />
          </div>

          <div>
            <label className="text-[#4e4634] font-bold block mb-1">STORAGE SOURCE URI</label>
            <input
              type="text"
              value={sourceUri}
              onChange={(e) => setSourceUri(e.target.value)}
              className="w-full p-2.5 border-2 border-[#111111] bg-[#fdf9ee]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#4e4634] font-bold block mb-1">EXECUTION TYPE</label>
              <select
                value={pipelineType}
                onChange={(e) => setPipelineType(e.target.value)}
                className="w-full p-2 border-2 border-[#111111] bg-[#ffffff] font-bold"
              >
                <option value="INDEX_TIME">Index Time (Heavy)</option>
                <option value="QUERY_TIME">Real-time Route</option>
                <option value="DEDUP">Dedup Maintenance</option>
              </select>
            </div>
            <div>
              <label className="text-[#4e4634] font-bold block mb-1">CLUSTER ALLOCATION</label>
              <select className="w-full p-2 border-2 border-[#111111] bg-[#ffffff] font-bold">
                <option>16 Shards (Full Cluster)</option>
                <option>8 Shards (Standard)</option>
                <option>4 Shards (Low Priority)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 font-mono text-xs uppercase font-bold border-t border-[#1c1c15]/20 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-[#1c1c15] bg-[#ffffff] hover:bg-[#e6e2d8] cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2 border-2 border-[#1c1c15] bg-[#f4c430] text-[#695200] shadow-[3px_3px_0px_0px_#111111] hover:bg-[#e6b82d] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            {isCreated ? 'PIPELINE SPAWNED!' : 'DEPLOY PIPELINE'}
          </button>
        </div>
      </div>
    </div>
  );
};
