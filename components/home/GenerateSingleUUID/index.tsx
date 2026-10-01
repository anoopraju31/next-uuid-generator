'use client';

import { useEffect, useState, useCallback, type FC } from 'react';
import { toast } from 'sonner';
import {
  Copy,
  Check,
  RefreshCw,
  Clock,
  Shield,
  SlidersHorizontal,
} from 'lucide-react';

import {
  generateRawUuid,
  formatUuidString,
  inspectUuid,
  type UuidVersion,
  type CaseType,
  type EnclosureType,
  type FormatOptions,
} from '../utils';

const VERSION_OPTIONS: { id: UuidVersion; label: string; desc: string; badge?: string }[] = [
  { id: 'v4', label: 'UUID v4', desc: 'Random (Cryptographic)', badge: 'Most Popular' },
  { id: 'v7', label: 'UUID v7', desc: 'Unix Time-ordered (RFC 9562)', badge: 'Recommended' },
  { id: 'v1', label: 'UUID v1', desc: 'Timestamp & MAC' },
  { id: 'nil', label: 'Nil UUID', desc: 'All Zeros' },
];

const ENCLOSURE_OPTIONS: { id: EnclosureType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'braces', label: '{ Braces }' },
  { id: 'quotes', label: '" Double "' },
  { id: 'single-quotes', label: "' Single '" },
  { id: 'urn', label: 'urn:uuid:...' },
];

const GenerateSingleUUID: FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<UuidVersion>('v4');
  const [rawUuid, setRawUuid] = useState<string>('');
  const [hasHyphens, setHasHyphens] = useState<boolean>(true);
  const [caseType, setCaseType] = useState<CaseType>('lower');
  const [enclosure, setEnclosure] = useState<EnclosureType>('none');
  const [copied, setCopied] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const formatOptions: FormatOptions = {
    hasHyphens,
    caseType,
    enclosure,
  };

  const handleGenerate = useCallback(
    (versionToUse: UuidVersion = selectedVersion) => {
      setIsRotating(true);
      const newRaw = generateRawUuid(versionToUse);
      setRawUuid(newRaw);
      setTimeout(() => setIsRotating(false), 300);
    },
    [selectedVersion]
  );

  useEffect(() => {
    handleGenerate('v4');
  }, [handleGenerate]);

  // Keyboard shortcut: Space or 'r' generates, 'c' copies (when not focused on input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleGenerate();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleGenerate();
      } else if (e.key === 'c' || e.key === 'C') {
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handleCopy();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate, rawUuid, formatOptions]);

  const formattedValue = formatUuidString(rawUuid, formatOptions);
  const inspection = inspectUuid(rawUuid);

  const handleCopy = async () => {
    if (!formattedValue) return;
    try {
      await navigator.clipboard.writeText(formattedValue);
      setCopied(true);
      toast.success('UUID copied to clipboard!', { duration: 2000 });
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleVersionChange = (newVer: UuidVersion) => {
    setSelectedVersion(newVer);
    handleGenerate(newVer);
  };

  return (
    <section
      id="single-uuid-section"
      className="relative mx-auto w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10"
    >
      {/* Ambient background glow inside card */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-linear-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/10 blur-3xl" />

      {/* Header bar */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Instant Generator</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Single UUID Generator
          </h2>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="hidden items-center gap-2 text-xs text-slate-400 lg:flex">
          <span>Press</span>
          <kbd className="rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-slate-300 shadow-sm">
            Space
          </kbd>
          <span>to regenerate,</span>
          <kbd className="rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 font-mono text-slate-300 shadow-sm">
            C
          </kbd>
          <span>to copy</span>
        </div>
      </div>

      {/* Version selector buttons */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          UUID Standard Version
        </label>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {VERSION_OPTIONS.map((opt) => {
            const isSelected = selectedVersion === opt.id;
            return (
              <button
                key={opt.id}
                id={`btn-version-${opt.id}`}
                type="button"
                onClick={() => handleVersionChange(opt.id)}
                className={`group relative flex flex-col items-start rounded-xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-600/15 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`font-semibold tracking-wide ${
                      isSelected ? 'text-indigo-300' : 'text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        opt.id === 'v7'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-xs text-slate-400 group-hover:text-slate-300">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Display Box */}
      <div className="mt-6">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b0e17] p-4 shadow-xl transition-all duration-300 hover:border-indigo-500/50 sm:p-6">
          <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
            {/* The UUID code display */}
            <div
              onClick={handleCopy}
              title="Click to copy"
              className="flex-1 cursor-pointer select-all overflow-x-auto py-2 font-mono text-xl font-bold tracking-tight text-indigo-100 transition-colors group-hover:text-white sm:text-2xl md:text-3xl"
            >
              <span className="break-all">{formattedValue || 'Generating...'}</span>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-2.5">
              <button
                id="btn-copy-single-uuid"
                type="button"
                onClick={handleCopy}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm transition-all duration-200 shadow-md ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-500/30 active:scale-98'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy UUID'}</span>
              </button>

              <button
                id="btn-refresh-single-uuid"
                type="button"
                onClick={() => handleGenerate()}
                title="Generate another UUID (Space or R)"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 font-semibold text-sm text-slate-200 transition-all duration-200 hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-98 shadow-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isRotating ? 'rotate-180' : ''
                  }`}
                />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="mt-5 rounded-xl border border-slate-800/70 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
          <span>Output Format Options</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Hyphens Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Hyphens:</span>
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                type="button"
                onClick={() => setHasHyphens(true)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  hasHyphens
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setHasHyphens(false)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  !hasHyphens
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Casing Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Casing:</span>
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
              <button
                type="button"
                onClick={() => setCaseType('lower')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  caseType === 'lower'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                abc (lower)
              </button>
              <button
                type="button"
                onClick={() => setCaseType('upper')}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                  caseType === 'upper'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ABC (UPPER)
              </button>
            </div>
          </div>

          {/* Enclosure Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Enclosure:</span>
            <div className="flex flex-wrap items-center gap-1">
              {ENCLOSURE_OPTIONS.map((enc) => (
                <button
                  key={enc.id}
                  type="button"
                  onClick={() => setEnclosure(enc.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer border ${
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

      {/* UUID Metadata & Live Inspector */}
      {inspection.isValid && (
        <div className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Structure & Metadata Inspector
              </span>
            </div>
            <span className="text-xs text-slate-400">128-Bit Identifier</span>
          </div>

          <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Specification
              </span>
              <p className="mt-1 font-semibold text-slate-200 text-sm">
                {inspection.versionName}
              </p>
            </div>

            <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Variant
              </span>
              <p className="mt-1 font-semibold text-slate-200 text-sm">
                {inspection.variant}
              </p>
            </div>

            <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Entropy / Nature
              </span>
              <p className="mt-1 font-semibold text-slate-200 text-sm">
                {inspection.entropyBits
                  ? `${inspection.entropyBits} bits randomness`
                  : inspection.version === 0
                  ? 'Null constant'
                  : 'Time-based'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-850 bg-slate-900/40 p-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {inspection.decodedTimestamp ? 'Embedded Timestamp' : 'Collision Probability'}
              </span>
              <p className="mt-1 font-semibold text-indigo-300 text-sm truncate" title={inspection.decodedTimestamp || '1 in 5.3 × 10³⁶'}>
                {inspection.decodedTimestamp ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{inspection.relativeTime || inspection.decodedTimestamp}</span>
                  </span>
                ) : (
                  '~1 in 5.3 × 10³⁶'
                )}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            {inspection.explanation}
          </p>
        </div>
      )}
    </section>
  );
};

export default GenerateSingleUUID;
