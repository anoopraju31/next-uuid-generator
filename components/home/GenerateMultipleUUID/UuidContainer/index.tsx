import { type FC } from 'react';
import { Copy, Check, Hash } from 'lucide-react';

type Props = {
  uuids: string[];
  copiedIndices: Set<number>;
  handleCopy: (index: number) => void;
  filteredIndices?: number[];
};

const UuidContainer: FC<Props> = ({ uuids, copiedIndices, handleCopy, filteredIndices }) => {
  if (!uuids.length) return null;

  const displayIndices = filteredIndices !== undefined ? filteredIndices : uuids.map((_, i) => i);

  if (displayIndices.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-12 text-center">
        <p className="text-sm font-medium text-slate-400">No UUIDs match your search filter.</p>
        <p className="mt-1 text-xs text-slate-500">Try clearing or adjusting the search term above.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-h-150 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {displayIndices.map((origIndex) => {
            const uuid = uuids[origIndex];
            const isCopied = copiedIndices.has(origIndex);

            return (
              <div
                key={`${origIndex}-${uuid}`}
                className="group relative flex items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-sm transition-all duration-150 hover:border-indigo-500/40 hover:bg-slate-850"
              >
                {/* Index badge */}
                <div className="flex shrink-0 items-center gap-1 font-mono text-[11px] font-semibold text-slate-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[10px] text-slate-400">
                    {origIndex + 1}
                  </span>
                </div>

                {/* UUID Value */}
                <div
                  onClick={() => handleCopy(origIndex)}
                  title="Click to copy"
                  className="flex-1 cursor-pointer truncate font-mono text-xs font-medium text-slate-200 transition-colors group-hover:text-indigo-200 select-all"
                >
                  {uuid}
                </div>

                {/* Copy Button */}
                <button
                  id={`btn-copy-item-${origIndex}`}
                  type="button"
                  onClick={() => handleCopy(origIndex)}
                  title="Copy UUID"
                  className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all duration-150 ${
                    isCopied
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UuidContainer;
