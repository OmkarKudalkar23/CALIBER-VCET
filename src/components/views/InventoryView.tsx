import React, { useState } from 'react';
import { DocumentItem, LadderLevel } from '../../types';

interface InventoryViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  onInspectLadder: (doc: DocumentItem, level?: LadderLevel) => void;
  onOpenIngest: () => void;
  onOpenInspector: (doc: DocumentItem) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  documents,
  onSelectDocument,
  onInspectLadder,
  onOpenIngest,
  onOpenInspector
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['DOC-APP-23-ESG']);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filterType === 'ALL' || doc.type === filterType;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleSelectDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDocs.map((d) => d.id));
    }
  };

  const renderStatusIcon = (status: 'ready' | 'processing' | 'failed' | 'pending') => {
    switch (status) {
      case 'ready':
        return <span className="material-symbols-outlined text-base font-bold text-[#1c1c15]">check</span>;
      case 'processing':
        return <span className="material-symbols-outlined text-base font-bold text-[#755b00] animate-spin">sync</span>;
      case 'failed':
        return <span className="material-symbols-outlined text-base font-bold text-[#ba1a1a]">close</span>;
      case 'pending':
      default:
        return <span className="material-symbols-outlined text-base text-[#807661]">horizontal_rule</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-[#1c1c15] pb-3 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-[#1c1c15] uppercase tracking-tighter leading-none mb-2">
            DOCUMENT INVENTORY
          </h2>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#4e4634]">
            <span className="bg-[#ece8dd] border-2 border-[#1c1c15] px-2 py-0.5 text-[#1c1c15] font-bold">
              TOTAL: 14,204
            </span>
            <span>FILTER: {filterType} TYPES</span>
            <span>•</span>
            <span>SORT: INDEXED (DESC)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="bg-[#ffffff] border-2 border-[#1c1c15] shadow-[3px_3px_0px_0px_#111111] px-4 py-2 font-mono text-xs uppercase font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 hover:bg-[#e6e2d8] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            FILTERS
          </button>

          {showFilterMenu && (
            <div className="absolute right-28 top-12 bg-[#ffffff] border-2 border-[#1c1c15] shadow-[4px_4px_0px_0px_#111111] p-2 z-30 flex flex-col gap-1 font-mono text-xs w-36">
              {['ALL', 'PDF', 'XLSX', 'DOCX', 'TXT'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilterType(t);
                    setShowFilterMenu(false);
                  }}
                  className={`text-left px-2 py-1 hover:bg-[#f4c430] transition-colors cursor-pointer ${
                    filterType === t ? 'bg-[#f4c430] font-bold' : ''
                  }`}
                >
                  {t} Documents
                </button>
              ))}
            </div>
          )}

          <button
            onClick={onOpenIngest}
            className="bg-[#f4c430] border-2 border-[#1c1c15] shadow-[3px_3px_0px_0px_#111111] text-[#695200] px-4 py-2 font-mono text-xs uppercase font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 hover:bg-[#e6b82d] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">upload_file</span>
            INGEST
          </button>
        </div>
      </div>

      {/* Dense Neo-Brutalist Data Table Container */}
      <div className="border-2 border-[#1c1c15] bg-[#ffffff] shadow-[5px_5px_0px_0px_#111111] flex flex-col relative overflow-hidden">
        {/* Table Controls Bar */}
        <div className="bg-[#e6e2d8] border-b-2 border-[#1c1c15] px-3 py-2 flex justify-between items-center font-mono text-xs uppercase">
          <div className="flex gap-3 items-center">
            <span className="text-[#4e4634] font-semibold">PAGE {currentPage} OF 473</span>
            <div className="h-3.5 w-0.5 bg-[#1c1c15]" />
            <span className="text-[#1c1c15] font-bold">
              {selectedIds.length} SELECTED
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border-2 border-transparent hover:border-[#1c1c15] hover:bg-[#ffffff] disabled:opacity-30 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 border-2 border-transparent hover:border-[#1c1c15] hover:bg-[#ffffff] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
            <thead className="bg-[#f2eee3] border-b-2 border-[#1c1c15] font-mono text-xs text-[#1c1c15] uppercase">
              <tr>
                <th className="p-2.5 border-r-2 border-[#1c1c15] w-12 text-center">
                  <button onClick={toggleSelectAll} className="cursor-pointer">
                    <span className="material-symbols-outlined text-base align-middle">
                      {selectedIds.length === filteredDocs.length && filteredDocs.length > 0
                        ? 'check_box'
                        : 'check_box_outline_blank'}
                    </span>
                  </button>
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold min-w-[280px]">
                  DOCUMENT
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-20 text-center">
                  TYPE
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-24 text-right">
                  CHUNKS
                </th>
                {/* L0-L3 Resolution Ladder Status Header */}
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-16 text-center bg-[#e6e2d8]" title="L0: Lossless Raw Extract">
                  L0
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-16 text-center bg-[#e6e2d8]" title="L1: Atomic Propositions">
                  L1
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-16 text-center bg-[#e6e2d8]" title="L2: Proposition Gist">
                  L2
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-16 text-center bg-[#e6e2d8]" title="L3: Vector Embeddings">
                  L3
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-44 text-right">
                  INDEXED
                </th>
                <th className="p-2.5 border-r-2 border-[#1c1c15] font-bold w-32 text-center">
                  STATUS
                </th>
                <th className="p-2.5 font-bold min-w-[220px]">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="font-mono text-xs text-[#1c1c15] bg-[#ffffff] divide-y divide-[#1c1c15]">
              {filteredDocs.map((doc) => {
                const isSelected = selectedIds.includes(doc.id);
                return (
                  <tr
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className={`group transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#f4c430] hover:bg-[#ffdf90]'
                        : 'hover:bg-[#f7f3e8]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-2.5 border-r border-[#1c1c15] text-center" onClick={(e) => toggleSelectDoc(doc.id, e)}>
                      <span className="material-symbols-outlined text-base align-middle text-[#1c1c15]">
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </td>

                    {/* Document Title */}
                    <td className="p-2.5 border-r border-[#1c1c15] font-bold truncate max-w-[320px]" title={doc.name}>
                      {doc.name}
                    </td>

                    {/* Type */}
                    <td className="p-2.5 border-r border-[#1c1c15] text-center font-bold text-[#4e4634]">
                      {doc.type}
                    </td>

                    {/* Chunks */}
                    <td className="p-2.5 border-r border-[#1c1c15] text-right font-semibold">
                      {doc.chunks.toLocaleString()}
                    </td>

                    {/* L0 - L3 Status Columns */}
                    <td className="p-2.5 border-r border-[#1c1c15] text-center">
                      {renderStatusIcon(doc.l0Status)}
                    </td>
                    <td className="p-2.5 border-r border-[#1c1c15] text-center">
                      {renderStatusIcon(doc.l1Status)}
                    </td>
                    <td className="p-2.5 border-r border-[#1c1c15] text-center">
                      {renderStatusIcon(doc.l2Status)}
                    </td>
                    <td className="p-2.5 border-r border-[#1c1c15] text-center">
                      {renderStatusIcon(doc.l3Status)}
                    </td>

                    {/* Indexed Timestamp */}
                    <td className="p-2.5 border-r border-[#1c1c15] text-right font-semibold">
                      {doc.indexedAt}
                    </td>

                    {/* Status Badge */}
                    <td className="p-2.5 border-r border-[#1c1c15] text-center">
                      <span
                        className={`inline-block border-2 border-[#1c1c15] px-2 py-0.5 text-[10px] uppercase font-bold shadow-[2px_2px_0px_0px_#111111] ${
                          doc.status === 'READY'
                            ? 'bg-[#2457c5] text-white'
                            : doc.status === 'PROCESSING'
                            ? 'bg-[#f4c430] text-[#695200]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    {/* Actions on hover */}
                    <td className="p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectLadder(doc, 'L2');
                          }}
                          className="bg-[#ffffff] text-[#1c1c15] border-2 border-[#1c1c15] px-2.5 py-1 text-[10px] uppercase font-bold hover:bg-[#e6e2d8] shadow-[2px_2px_0px_0px_#111111] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                        >
                          INSPECT LADDER
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInspector(doc);
                          }}
                          className="bg-[#ffffff] text-[#1c1c15] border-2 border-[#1c1c15] px-2.5 py-1 text-[10px] uppercase font-bold hover:bg-[#e6e2d8] shadow-[2px_2px_0px_0px_#111111] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                        >
                          PROVENANCE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Floating Contextual Inspector Trigger button in bottom right */}
        <div className="p-3 bg-[#f2eee3] border-t-2 border-[#1c1c15] flex justify-between items-center">
          <span className="font-mono text-xs text-[#4e4634]">
            Showing {filteredDocs.length} of 14,204 total indexed corpus documents
          </span>
          <button
            onClick={() => {
              const current = documents.find((d) => selectedIds.includes(d.id)) || documents[0];
              onOpenInspector(current);
            }}
            className="bg-[#2457c5] text-white border-2 border-[#1c1c15] shadow-[4px_4px_0px_0px_#111111] px-4 py-2 font-mono text-xs uppercase font-bold active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 hover:bg-[#003fa5] cursor-pointer group"
          >
            <span className="material-symbols-outlined text-base group-hover:rotate-12 transition-transform">search_insights</span>
            OPEN INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
