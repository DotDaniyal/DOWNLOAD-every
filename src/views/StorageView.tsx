import React from 'react';
import { HardDrive, Trash2, Folder, RefreshCw, Download, Database } from 'lucide-react';
import { DownloadJob } from '../types';

interface StorageViewProps {
  downloads: DownloadJob[];
  onClearCompleted: () => void;
}

export const StorageView: React.FC<StorageViewProps> = ({ downloads, onClearCompleted }) => {
  const totalDownloadedMb = downloads.reduce((sum, d) => sum + d.downloadedSizeMb, 0);
  const totalDiskMb = 512000; // 500 GB
  const freeDiskMb = 384000; // 375 GB
  const appPercent = Math.min(100, Math.max(1, (totalDownloadedMb / totalDiskMb) * 100));

  const videosMb = downloads.filter(d => d.ext === 'mp4').reduce((sum, d) => sum + d.downloadedSizeMb, 0);
  const audioMb = downloads.filter(d => d.ext === 'mp3' || d.ext === 'm4a').reduce((sum, d) => sum + d.downloadedSizeMb, 0);
  const playlistMb = downloads.filter(d => Boolean(d.playlistId)).reduce((sum, d) => sum + d.downloadedSizeMb, 0);

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(downloads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "velocefetch_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-purple-500" />
          <span>Storage Allocation &amp; Maintenance</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor disk space consumption, manage local folders, and run maintenance cleanup routines
        </p>

        {/* Visual Disk Gauge */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">VeloceFetch Storage:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {(totalDownloadedMb / 1024).toFixed(2)} GB / {(totalDiskMb / 1024).toFixed(0)} GB
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-purple-500 h-full"
              style={{ width: `${Math.max(2, appPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Free Space: {(freeDiskMb / 1024).toFixed(0)} GB</span>
            <span>Allocated: {appPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Folder Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
            <Folder className="w-4 h-4 text-sky-500" />
            <span>Downloads/Videos/</span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {(videosMb / 1024).toFixed(2)} GB
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {downloads.filter(d => d.ext === 'mp4').length} MP4 Video Files
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
            <Folder className="w-4 h-4 text-indigo-500" />
            <span>Downloads/Playlists/</span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {(playlistMb / 1024).toFixed(2)} GB
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {downloads.filter(d => Boolean(d.playlistId)).length} Playlist Items
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs">
            <Folder className="w-4 h-4 text-purple-500" />
            <span>Downloads/Audio/</span>
          </div>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {audioMb.toFixed(1)} MB
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {downloads.filter(d => d.ext === 'mp3' || d.ext === 'm4a').length} Audio Tracks
          </p>
        </div>
      </div>

      {/* Maintenance Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Maintenance &amp; Backup Tools</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            <span>Export Database Backup (JSON)</span>
          </button>

          <button
            onClick={onClearCompleted}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Completed Download Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
