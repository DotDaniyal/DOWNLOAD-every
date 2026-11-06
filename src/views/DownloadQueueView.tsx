import React, { useState } from 'react';
import { 
  ListOrdered, 
  Pause, 
  Play, 
  X, 
  RotateCcw, 
  Trash2, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  HardDrive,
  Folder
} from 'lucide-react';
import { DownloadJob, AppSettings } from '../types';

interface DownloadQueueViewProps {
  downloads: DownloadJob[];
  isQueuePaused: boolean;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onPauseJob: (id: string) => void;
  onResumeJob: (id: string) => void;
  onCancelJob: (id: string) => void;
  onRetryJob: (id: string) => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onCancelAll: () => void;
  onRetryFailed: () => void;
  onClearCompleted: () => void;
}

export const DownloadQueueView: React.FC<DownloadQueueViewProps> = ({
  downloads,
  isQueuePaused,
  settings,
  setSettings,
  onPauseJob,
  onResumeJob,
  onCancelJob,
  onRetryJob,
  onPauseAll,
  onResumeAll,
  onCancelAll,
  onRetryFailed,
  onClearCompleted
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'downloading' | 'paused' | 'queued' | 'completed' | 'failed'>('all');

  const filteredDownloads = downloads.filter(job => {
    if (filterTab === 'all') return true;
    return job.status === filterTab;
  });

  const countByStatus = {
    all: downloads.length,
    downloading: downloads.filter(d => d.status === 'downloading').length,
    paused: downloads.filter(d => d.status === 'paused').length,
    queued: downloads.filter(d => d.status === 'queued').length,
    completed: downloads.filter(d => d.status === 'completed').length,
    failed: downloads.filter(d => d.status === 'failed' || d.status === 'restricted').length
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Queue Concurrency Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-emerald-500" />
              <span>Advanced Download Queue Manager</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage parallel download tasks, throttle speed limits, and queue priorities
            </p>
          </div>

          {/* Queue Settings Controls */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Simultaneous Jobs:</span>
              <select
                value={settings.maxConcurrentDownloads}
                onChange={e => setSettings(prev => ({ ...prev, maxConcurrentDownloads: Number(e.target.value) }))}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8].map(num => (
                  <option key={num} value={num}>{num} Parallel</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono border-l border-slate-200 dark:border-slate-800 pl-3">
              <span className="text-slate-400">Throttle:</span>
              <select
                value={settings.speedLimitMb}
                onChange={e => setSettings(prev => ({ ...prev, speedLimitMb: Number(e.target.value) }))}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-bold focus:outline-none"
              >
                <option value={0}>Unlimited</option>
                <option value={5}>5 MB/s</option>
                <option value={10}>10 MB/s</option>
                <option value={20}>20 MB/s</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Batch Queue Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {isQueuePaused ? (
              <button
                onClick={onResumeAll}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume All Jobs</span>
              </button>
            ) : (
              <button
                onClick={onPauseAll}
                className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause All Jobs</span>
              </button>
            )}

            <button
              onClick={onRetryFailed}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Failed</span>
            </button>

            <button
              onClick={onClearCompleted}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Finished</span>
            </button>
          </div>

          <button
            onClick={onCancelAll}
            className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel All Jobs</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 max-w-fit">
        {(['all', 'downloading', 'queued', 'paused', 'completed', 'failed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize font-mono flex items-center gap-1.5 ${
              filterTab === tab
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>{tab}</span>
            <span className="text-[10px] opacity-75">({countByStatus[tab]})</span>
          </button>
        ))}
      </div>

      {/* Downloads List Table / Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredDownloads.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <ListOrdered className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
            <p>No download items match the selected filter category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDownloads.map(job => (
              <div
                key={job.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
              >
                {/* Media Thumbnail & Meta Info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <img
                    src={job.thumbnail}
                    alt={job.title}
                    className="w-16 h-11 object-cover rounded border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {job.quality}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Folder className="w-3 h-3" /> {job.folderPath}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Progress Bar */}
                <div className="w-full md:w-72 space-y-1 shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                      {job.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline mr-1" />}
                      {job.status === 'restricted' && <AlertCircle className="w-3.5 h-3.5 text-amber-500 inline mr-1" />}
                      {job.status}
                    </span>
                    <span className="text-slate-500">
                      {job.downloadedSizeMb.toFixed(1)} / {job.totalSizeMb.toFixed(1)} MB ({job.progressPercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        job.status === 'completed' ? 'bg-emerald-500' :
                        job.status === 'paused' ? 'bg-amber-500' :
                        job.status === 'failed' || job.status === 'restricted' ? 'bg-red-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>

                  {job.status === 'downloading' && (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Speed: {job.speedMbPerSec} MB/s</span>
                      <span>ETA: {job.etaSeconds}s</span>
                    </div>
                  )}
                </div>

                {/* Item Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  {job.status === 'downloading' && (
                    <button
                      onClick={() => onPauseJob(job.id)}
                      title="Pause"
                      className="p-1.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}

                  {job.status === 'paused' && (
                    <button
                      onClick={() => onResumeJob(job.id)}
                      title="Resume"
                      className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {(job.status === 'failed' || job.status === 'restricted') && (
                    <button
                      onClick={() => onRetryJob(job.id)}
                      title="Retry"
                      className="p-1.5 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onCancelJob(job.id)}
                    title="Remove Job"
                    className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
