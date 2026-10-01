'use client';

import { useState, useMemo, type FormEvent, type FC } from 'react';
import { toast } from 'sonner';
import {
  Layers,
  Copy,
  Check,
  Download,
  FileCode,
  FileSpreadsheet,
  Trash2,
  Search,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

import UuidContainer from './UuidContainer';
import {
  generateRawUuid,
  formatUuidString,
  type UuidVersion,
  type CaseType,
  type EnclosureType,
  type FormatOptions,
} from '../utils';

const PRESET_COUNTS = [5, 10, 25, 50, 100];

const VERSION_OPTIONS: { id: UuidVersion; label: string }[] = [
  { id: 'v4', label: 'UUID v4 (Random)' },
  { id: 'v7', label: 'UUID v7 (Time-ordered)' },
  { id: 'v1', label: 'UUID v1 (Timestamp)' },
];

const ENCLOSURE_OPTIONS: { id: EnclosureType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'braces', label: '{...}' },
  { id: 'quotes', label: '"..."' },
  { id: 'single-quotes', label: "'...'" },
  { id: 'urn', label: 'urn:uuid:' },
];

const GenerateMultipleUUID: FC = () => {
  const [count, setCount] = useState<number>(10);
  const [selectedVersion, setSelectedVersion] = useState<UuidVersion>('v4');
  const [hasHyphens, setHasHyphens] = useState<boolean>(true);
  const [caseType, setCaseType] = useState<CaseType>('lower');
  const [enclosure, setEnclosure] = useState<EnclosureType>('none');

  const [rawUuids, setRawUuids] = useState<string[]>([]);
  const [copiedIndices, setCopiedIndices] = useState<Set<number>>(new Set());
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [generationTimeMs, setGenerationTimeMs] = useState<number | null>(null);

  const formatOptions: FormatOptions = {
    hasHyphens,
    caseType,
    enclosure,
  };

  // Compute formatted strings dynamically so format toggles update instantly!
  const formattedUuids = useMemo(() => {
    return rawUuids.map((raw) => formatUuidString(raw, formatOptions));
  }, [rawUuids, hasHyphens, caseType, enclosure]);

  // Filter indices based on search query
  const filteredIndices = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    const query = searchQuery.toLowerCase();
    const indices: number[] = [];
    formattedUuids.forEach((uuid, idx) => {
      if (uuid.toLowerCase().includes(query)) {
        indices.push(idx);
      }
    });
    return indices;
  }, [formattedUuids, searchQuery]);

  const handleCopySingle = async (index: number) => {
    try {
      const textToCopy = formattedUuids[index];
      if (!textToCopy) return;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndices((prev) => new Set(prev).add(index));
      toast.success(`Copied UUID #${index + 1}`);
      setTimeout(() => {
        setCopiedIndices((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }, 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
      toast.error('Failed to copy');
    }
  };

  const handleCopyAll = async () => {
    if (!formattedUuids.length) return;
    try {
      const allText = formattedUuids.join('\n');
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      toast.success(`Copied all ${formattedUuids.length} UUIDs to clipboard!`);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all!', err);
      toast.error('Failed to copy all UUIDs');
    }
  };

  const handleGenerate = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (count <= 0 || count > 500) {
      toast.error('Please enter a quantity between 1 and 500');
      return;
    }

    const t0 = performance.now();
    const newItems: string[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push(generateRawUuid(selectedVersion));
    }
    const t1 = performance.now();

    setRawUuids(newItems);
    setCopiedIndices(new Set());
    setGenerationTimeMs(Number((t1 - t0).toFixed(2)));
    toast.success(`Generated ${count} UUIDs!`);
  };

  const handleDownloadTxt = () => {
    if (!formattedUuids.length) return;
    const blob = new Blob([formattedUuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${selectedVersion}-${formattedUuids.length}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded .txt file');
  };

  const handleDownloadJson = () => {
    if (!formattedUuids.length) return;
    const blob = new Blob([JSON.stringify(formattedUuids, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${selectedVersion}-${formattedUuids.length}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded .json file');
  };

  const handleDownloadCsv = () => {
    if (!formattedUuids.length) return;
    const csvContent = 'index,uuid\n' + formattedUuids.map((u, i) => `${i + 1},"${u}"`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${selectedVersion}-${formattedUuids.length}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded .csv file');
  };

  const handleClear = () => {
    setRawUuids([]);
    setSearchQuery('');
    setGenerationTimeMs(null);
    toast.info('Cleared generated list');
  };

  return (
    <section
      id="bulk-uuid-section"
      className="relative mx-auto w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10"
    >
      {/* Header bar */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Batch Processing</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Bulk UUID Generator</h2>
        </div>

        <span className="text-xs text-slate-400">Generate up to 500 at once</span>
      </div>

      {/* Configuration Controls */}
      <form onSubmit={handleGenerate} className="mt-6 flex flex-col gap-6">
        {/* Version & Count Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Version Selector */}
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">UUID Version</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {VERSION_OPTIONS.map((ver) => (
                <button
                  key={ver.id}
                  id={`btn-bulk-version-${ver.id}`}
                  type="button"
                  onClick={() => setSelectedVersion(ver.id)}
                  className={`cursor-pointer rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                    selectedVersion === ver.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {ver.label}
                </button>
              ))}
            </div>
          </div>

          {/* Count presets and input */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="count-input" className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Quantity (1 – 500)
              </label>
              <span className="font-mono text-xs font-semibold text-indigo-400">{count} UUIDs</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {PRESET_COUNTS.map((preset) => (
                  <button
                    key={preset}
                    id={`btn-preset-${preset}`}
                    type="button"
                    onClick={() => setCount(preset)}
                    className={`cursor-pointer rounded-lg border px-2.5 py-1.5 font-mono text-xs font-semibold transition ${
                      count === preset
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <input
                id="count-input"
                type="number"
                min={1}
                max={500}
                value={count || ''}
                onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value))))}
                placeholder="Count"
                className="w-20 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-center font-mono text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Formatting Options Bar */}
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
            <span>Output Format</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Hyphens */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Hyphens:</span>
              <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                <button
                  type="button"
                  onClick={() => setHasHyphens(true)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    hasHyphens ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setHasHyphens(false)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    !hasHyphens ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Casing */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Casing:</span>
              <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
                <button
                  type="button"
                  onClick={() => setCaseType('lower')}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    caseType === 'lower' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  lowercase
                </button>
                <button
                  type="button"
                  onClick={() => setCaseType('upper')}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    caseType === 'upper' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  UPPERCASE
                </button>
              </div>
            </div>

            {/* Enclosure */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Enclosure:</span>
              <div className="flex flex-wrap items-center gap-1">
                {ENCLOSURE_OPTIONS.map((enc) => (
                  <button
                    key={enc.id}
                    type="button"
                    onClick={() => setEnclosure(enc.id)}
                    className={`cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium transition ${
                      enclosure === enc.id
                        ? 'border-indigo-500/80 bg-indigo-500/20 text-indigo-200'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {enc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div>
          <button
            id="btn-generate-bulk-uuids"
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/35 active:scale-99"
          >
            <Sparkles className="h-5 w-5" />
            <span>
              Generate {count} {selectedVersion.toUpperCase()} UUIDs
            </span>
          </button>
        </div>
      </form>

      {/* Results Section */}
      {formattedUuids.length > 0 && (
        <div className="mt-8 border-t border-slate-800/80 pt-6">
          {/* Results Action Bar */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Summary and generation time */}
            <div className="flex items-center gap-3">
              <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 font-mono text-xs font-bold text-indigo-300">
                {formattedUuids.length} Generated
              </span>
              {generationTimeMs !== null && (
                <span className="text-xs text-slate-400">
                  in <span className="font-mono text-slate-300">{generationTimeMs}ms</span>
                </span>
              )}
            </div>

            {/* Right: Search + Export Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search box */}
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter UUIDs..."
                  className="rounded-xl border border-slate-700 bg-slate-950/80 py-1.5 pr-3 pl-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Copy All */}
              <button
                id="btn-copy-all-uuids"
                type="button"
                onClick={handleCopyAll}
                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                  copiedAll
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-700 bg-slate-800/90 text-slate-200 hover:border-slate-600 hover:bg-slate-700'
                }`}
              >
                {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedAll ? 'Copied!' : 'Copy All'}</span>
              </button>

              {/* Download TXT */}
              <button
                id="btn-download-txt"
                type="button"
                onClick={handleDownloadTxt}
                title="Download as .txt"
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5 text-indigo-400" />
                <span>TXT</span>
              </button>

              {/* Download JSON */}
              <button
                id="btn-download-json"
                type="button"
                onClick={handleDownloadJson}
                title="Download as JSON array"
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                <span>JSON</span>
              </button>

              {/* Download CSV */}
              <button
                id="btn-download-csv"
                type="button"
                onClick={handleDownloadCsv}
                title="Download as CSV"
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>CSV</span>
              </button>

              {/* Clear */}
              <button
                id="btn-clear-uuids"
                type="button"
                onClick={handleClear}
                title="Clear list"
                className="flex cursor-pointer items-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* UUID Grid Container */}
          <div className="mt-5">
            <UuidContainer
              uuids={formattedUuids}
              copiedIndices={copiedIndices}
              handleCopy={handleCopySingle}
              filteredIndices={filteredIndices}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default GenerateMultipleUUID;
