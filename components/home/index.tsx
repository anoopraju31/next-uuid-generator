'use client';

import { type FC } from 'react';
import {
  Sparkles,
  Layers,
  SearchCode,
  BookOpen,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import GenerateSingleUUID from './GenerateSingleUUID';
import GenerateMultipleUUID from './GenerateMultipleUUID';
import UuidInspector from './UuidInspector';
import UuidReference from './UuidReference';

const Home: FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative flex w-full flex-col items-center gap-12 px-4 py-8 sm:px-6 md:gap-16 md:px-8 lg:py-16">
      {/* Decorative ambient background lights */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-100 w-125 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-[450px] w-[550px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Top Hero Section */}
      <header className="flex w-full max-w-4xl flex-col items-center text-center">
        {/* Compliance & Status badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          <span>RFC 4122 & RFC 9562 Compliant</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">100% Client-Side</span>
        </div>

        {/* Title */}
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          Online <span className="bg-linear-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">UUID Generator</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
          Generate cryptographically strong Version 4 (random) and modern Version 7 (time-ordered) UUIDs
          with zero latency. Customize casings, hyphens, bulk exports, and inspect timestamp metadata.
        </p>

        {/* Quick Navigation Pills */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollTo('single-uuid-section')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Single Generator</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('bulk-uuid-section')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Bulk Generator</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('inspector-section')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <SearchCode className="h-3.5 w-3.5 text-cyan-400" />
            <span>Validator & Decoder</span>
          </button>

          <button
            type="button"
            onClick={() => scrollTo('specs-section')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Specifications & FAQ</span>
          </button>
        </div>
      </header>

      {/* 1. Single UUID Generator */}
      <GenerateSingleUUID />

      {/* 2. Bulk UUID Generator */}
      <GenerateMultipleUUID />

      {/* 3. UUID Inspector & Validator */}
      <UuidInspector />

      {/* 4. Specifications & Reference */}
      <UuidReference />
    </main>
  );
};

export default Home;
