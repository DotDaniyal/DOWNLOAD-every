import React from 'react';
import { Info, ShieldCheck, CheckCircle2, Code2, HardDrive, Layers, Globe } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5 shadow-sm text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">VeloceFetch Pro Downloader</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Desktop Application Build v2.4.0 (x86_64 / arm64 architecture)
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Multi-Playlist Queue Engine
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Batch processing for complete playlists with automatic subfolder creation and multi-playlist queueing.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
            <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4" /> Local Storage &amp; Database
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Persistent storage retains download state, active jobs, and file organization across application restarts.
            </p>
          </div>
        </div>

        {/* Legal & Terms Compliance Notice */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-500" /> Terms of Service &amp; DRM Compliance Policy
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            VeloceFetch Pro is designed for downloading media where downloading is officially authorized, under Creative Commons licenses, public domain, or with explicit copyright permission.
          </p>
          <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 list-disc list-inside">
            <li>Never bypasses DRM digital rights management or access restriction controls.</li>
            <li>Respects platform terms, copyright owner guidelines, and licensing restrictions.</li>
            <li>Provides direct official viewing and purchasing options for restricted content.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
