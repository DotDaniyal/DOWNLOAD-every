import React from 'react';
import { Pause, Play, Plus, HardDrive, ShieldCheck, Download } from 'lucide-react';
import { DownloadJob } from '../types';

interface TopBarProps {
  activeTab: string;
  downloads: DownloadJob[];
  isQueuePaused: boolean;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onOpenQuickImport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  downloads,
  isQueuePaused,
  onPauseAll,
  onResumeAll,
  onOpenQuickImport
}) => {
  const activeDownloading = downloads.filter(d => d.status === 'downloading');
  const totalSpeed = activeDownloading.reduce((acc, curr) => acc + curr.speedMbPerSec, 0);

  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard & Quick Analysis',
    single: 'Single Video Downloader',
    playlist: 'Full Playlist Manager & Batch Importer',
    queue: 'Advanced Download Queue',
    library: 'Media Library & Local Files',
    storage: 'Storage Allocation & Maintenance',
    settings: 'Application Preferences & Configuration',
    about: 'Software Info & Legal Terms Compliance'
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between gap-8 shrink-0 select-none">
      {/* Zone 1: Contextual Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
          Workspace
        </span>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {tabTitles[activeTab] || 'Workspace'}
        </h2>
      </div>

      {/* Zone 2: Real-time Status Counter */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
          <Download className="w-3.5 h-3.5 text-emerald-500" />
          <span>Active Jobs:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{activeDownloading.length}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-sky-500" />
          <span>Speed:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {totalSpeed.toFixed(1)} MB/s
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[11px]">DRM Compliance Enabled</span>
        </div>
      </div>

      {/* Zone 3: Quick Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {isQueuePaused ? (
          <button
            onClick={onResumeAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Queue</span>
          </button>
        ) : (
          <button
            onClick={onPauseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause Queue</span>
          </button>
        )}

        <button
          onClick={onOpenQuickImport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Import Link</span>
        </button>
      </div>
    </header>
  );
};
