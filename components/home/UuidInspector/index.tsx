'use client';

import { useState, type FC } from 'react';
import { toast } from 'sonner';
import { SearchCode, CheckCircle2, XCircle, Clock, ClipboardPaste } from 'lucide-react';

import { inspectUuid, type UuidInspectionResult } from '../utils';

const SAMPLE_UUIDS = [
  { label: 'Sample v7', val: '018f6f59-7f52-70b9-9e8c-8f92bd33e210' },
  { label: 'Sample v4', val: 'a8098c1a-f86e-11da-bd1a-00112444be1e' },
  { label: 'Sample Nil', val: '00000000-0000-0000-0000-000000000000' },
];

const UuidInspector: FC = () => {
  const [inputVal, setInputVal] = useState<string>('018f6f59-7f52-70b9-9e8c-8f92bd33e210');

  const result: UuidInspectionResult = inspectUuid(inputVal);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputVal(text.trim());
        toast.success('Pasted from clipboard!');
      }
    } catch {
      toast.error('Unable to read clipboard. Please paste manually.');
    }
  };

  return (
    <section
      id="inspector-section"
      className="relative mx-auto w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10"
    >
      {/* Header bar */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <SearchCode className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Live Diagnostic Tool</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">UUID Validator & Decoder</h2>
        </div>

        <span className="text-xs text-slate-400">Analyze version, variant & timestamps</span>
      </div>

      {/* Input container */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="uuid-inspector-input"
            className="text-xs font-semibold tracking-wider text-slate-400 uppercase"
          >
            Paste any UUID / GUID string
          </label>
          <button
            type="button"
            onClick={handlePaste}
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            <span>Paste from clipboard</span>
          </button>
        </div>

        <div className="relative">
          <input
            id="uuid-inspector-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. 018f6f59-7f52-70b9-9e8c-8f92bd33e210 or {a8098c1a-...}"
            className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3.5 font-mono text-base text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Quick test:</span>
          {SAMPLE_UUIDS.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => setInputVal(sample.val)}
              className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostic results */}
      {inputVal.trim() && (
        <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5">
          {/* Validity status badge */}
          <div className="border-slate-850 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              {result.isValid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">Valid RFC Compliant UUID</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <span className="font-semibold text-rose-300">Invalid UUID Format</span>
                </>
              )}
            </div>

            {result.isValid && (
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-semibold text-indigo-300">
                {result.versionName}
              </span>
            )}
          </div>

          {result.isValid ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border-slate-850 rounded-xl border bg-slate-900/40 p-3.5">
                <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Version</span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{result.versionName}</p>
                <p className="mt-1 text-xs text-slate-400">{result.explanation}</p>
              </div>

              <div className="border-slate-850 rounded-xl border bg-slate-900/40 p-3.5">
                <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">Variant Spec</span>
                <p className="mt-1 text-sm font-semibold text-slate-200">{result.variant}</p>
                <p className="mt-1 text-xs text-slate-400">Determines the layout and interpretation of the bits.</p>
              </div>

              <div className="border-slate-850 rounded-xl border bg-slate-900/40 p-3.5">
                <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                  Embedded Timestamp
                </span>
                {result.decodedTimestamp ? (
                  <>
                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-cyan-300">
                      <Clock className="h-4 w-4" />
                      <span>{result.relativeTime || 'Decoded'}</span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-slate-300">{result.decodedTimestamp}</p>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">
                    Not applicable for {result.versionName}. This version uses pseudo-random bits.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-rose-300/80">
              {result.explanation} UUIDs must consist of 32 hexadecimal characters grouped into 8-4-4-4-12 segments.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default UuidInspector;
