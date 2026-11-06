import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  ListOrdered, 
  HardDrive, 
  Link as LinkIcon, 
  Search, 
  ArrowRight,
  Pause,
  Play,
  X,
  ListVideo,
  PlaySquare,
  FileText
} from 'lucide-react';
import { DownloadJob, PlaylistMetadata } from '../types';

interface DashboardViewProps {
  downloads: DownloadJob[];
  playlists: PlaylistMetadata[];
  onNavigateTab: (tab: string) => void;
  onAnalyzeUrl: (url: string) => void;
  onPauseJob: (id: string) => void;
  onResumeJob: (id: string) => void;
  onCancelJob: (id: string) => void;
  onPlayMedia: (job: DownloadJob) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  downloads,
  playlists,
  onNavigateTab,
  onAnalyzeUrl,
  onPauseJob,
  onResumeJob,
  onCancelJob,
  onPlayMedia
}) => {
  const [urlInput, setUrlInput] = useState('');

  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const activeCount = downloads.filter(d => d.status === 'downloading').length;
  const queuedCount = downloads.filter(d => d.status === 'queued').length;
  const totalStorageMb = downloads.reduce((sum, d) => sum + d.downloadedSizeMb, 0);

  const activeJobs = downloads.filter(d => d.status === 'downloading' || d.status === 'paused');
  const recentCompleted = downloads.filter(d => d.status === 'completed').slice(0, 5);

  const handleQuickAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onAnalyzeUrl(urlInput.trim());
    setUrlInput('');
  };

  const handleDemoTestClick = (demoUrl: string) => {
    onAnalyzeUrl(demoUrl);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Quick URL Input Hero Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              FAST IMPORT ENGINE
            </span>
            <span className="text-xs text-slate-400">Supports YouTube, Vimeo &amp; Playlist Links</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Import Any Video or Playlist URL
          </h2>
          <form onSubmit={handleQuickAnalyze} className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="Paste video or playlist link (e.g. https://www.youtube.com/playlist?list=...)"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Media</span>
            </button>
          </form>

          {/* Test Link Shortcuts */}
          <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
            <span>Quick Test Links:</span>
            <button
              type="button"
              onClick={() => handleDemoTestClick('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
              className="text-emerald-400 hover:underline"
            >
              [Sample HD Video]
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleDemoTestClick('https://www.youtube.com/playlist?list=PL4K8X-5Z9p9O4b-4k3X2-901')}
              className="text-indigo-400 hover:underline"
            >
              [Sample Playlist]
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Jobs</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {downloads.length}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">{queuedCount} waiting in queue</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Download className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {completedCount}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">100% verified integrity</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Downloads</p>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 font-mono tabular-nums">
              {activeCount}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">Running in parallel</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <ListOrdered className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Downloaded</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono tabular-nums">
              {(totalStorageMb / 1024).toFixed(2)} GB
            </p>
            <p className="text-[11px] text-slate-400 font-mono">Local storage allocated</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Download Jobs Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-emerald-500" />
              <span>Active &amp; Queue Jobs ({activeJobs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time download speed &amp; byte progress</p>
          </div>
          <button
            onClick={() => onNavigateTab('queue')}
            className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 font-mono"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs space-y-2">
            <PlaySquare className="w-8 h-8 mx-auto text-slate-500 opacity-50" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No active downloads in queue</p>
            <p className="text-slate-500 max-w-sm mx-auto">
              Paste a URL above or switch to Single Video / Playlist Downloader to queue media downloads directly to your device.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.map(job => (
              <div
                key={job.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={job.thumbnail}
                    alt={job.title}
                    className="w-14 h-10 object-cover rounded border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      <span>{job.quality}</span>
                      <span>·</span>
                      <span>{job.downloadedSizeMb.toFixed(1)} / {job.totalSizeMb.toFixed(1)} MB</span>
                      <span>·</span>
                      <span className="text-emerald-500 font-bold">{job.speedMbPerSec} MB/s</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Actions */}
                <div className="w-full sm:w-64 space-y-1 shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <span className="capitalize">{job.status}</span>
                    <span>{job.progressPercent}% {job.status === 'downloading' && `(ETA ${job.etaSeconds}s)`}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        job.status === 'paused' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {job.status === 'downloading' ? (
                    <button
                      onClick={() => onPauseJob(job.id)}
                      title="Pause Download"
                      className="p-1.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <Pause className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onResumeJob(job.id)}
                      title="Resume Download"
                      className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={() => onCancelJob(job.id)}
                    title="Cancel Job"
                    className="p-1.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-red-500/20 text-slate-700 dark:text-slate-200 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Completed Downloads */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Recently Completed Downloads</span>
          </h3>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
          >
            Go to Media Library
          </button>
        </div>

        {recentCompleted.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs">
            No completed downloads yet. Import a link to save your first video file!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentCompleted.map(job => (
              <div key={job.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={job.thumbnail}
                    alt={job.title}
                    className="w-10 h-8 object-cover rounded border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {job.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {job.quality} · {job.totalSizeMb} MB · {job.fileName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onPlayMedia(job)}
                  className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded border border-emerald-500/30 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Media</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
