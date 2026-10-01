import { type FC } from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#06080d]/80 px-4 py-10 backdrop-blur-md sm:px-6 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-slate-400 md:flex-row">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Client-Side Only (No Tracking)
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            RFC 4122 & RFC 9562
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Crafted with</span>
          <Heart className="inline h-3.5 w-3.5 fill-rose-500 text-rose-500" />
          <span>by</span>
          <a
            href="https://anoopraju.xyz/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-200 transition-colors hover:text-indigo-400 hover:underline"
          >
            Anoop Raju
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
