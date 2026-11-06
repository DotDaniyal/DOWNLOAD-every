import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Folder, 
  Film, 
  Music, 
  Play, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Download,
  FileText,
  X,
  Check
} from 'lucide-react';
import { DownloadJob } from '../types';

interface MediaLibraryViewProps {
  downloads: DownloadJob[];
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, newName: string) => void;
  onPlayMedia: (job: DownloadJob) => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  downloads,
  onDeleteFile,
  onRenameFile,
  onPlayMedia
}) => {
  const completedJobs = downloads.filter(d => d.status === 'completed');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'video' | 'audio' | 'playlist'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'duration'>('date');

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Folders list
  const foldersList = Array.from(new Set(completedJobs.map(j => j.folderPath)));

  const filteredJobs = completedJobs.filter(job => {
    // Folder filter
    if (selectedFolder !== 'all' && job.folderPath !== selectedFolder) return false;

    // Category filter
    if (categoryFilter === 'video' && job.ext !== 'mp4') return false;
    if (categoryFilter === 'audio' && job.ext !== 'mp3' && job.ext !== 'm4a') return false;
    if (categoryFilter === 'playlist' && !job.playlistId) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.fileName.toLowerCase().includes(q) ||
        job.author.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.fileName.localeCompare(b.fileName);
    if (sortBy === 'size') return b.totalSizeMb - a.totalSizeMb;
    if (sortBy === 'duration') return b.duration - a.duration;
    // default date
    return new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime();
  });

  const handleStartRename = (job: DownloadJob) => {
    setEditingJobId(job.id);
    setRenameInput(job.fileName);
  };

  const handleSaveRename = (id: string) => {
    if (renameInput.trim()) {
      onRenameFile(id, renameInput.trim());
    }
    setEditingJobId(null);
  };

  const handleExportBlob = (job: DownloadJob) => {
    const streamUrl = job.mediaStreamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const a = document.createElement('a');
    a.href = streamUrl;
    a.download = job.fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Search / Sort Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-500" />
              <span>Media Library &amp; File Organizer</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedJobs.length} Downloaded media files organized on local filesystem
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search downloaded content..."
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by File Size</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
        </div>

        {/* Category Filters & Folder Tree Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            {(['all', 'video', 'audio', 'playlist'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-md transition-colors capitalize font-mono ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Formats' : cat}
              </button>
            ))}
          </div>

          {/* Directory Selector */}
          <div className="flex items-center gap-2 font-mono text-slate-400">
            <Folder className="w-3.5 h-3.5 text-amber-500" />
            <span>Folder:</span>
            <select
              value={selectedFolder}
              onChange={e => setSelectedFolder(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
            >
              <option value="all">All Locations (/Downloads)</option>
              {foldersList.map((f, idx) => (
                <option key={idx} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Files List / Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <Film className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
            <p>No media files match the selected search filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors"
              >
                {/* Media info */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative group shrink-0 cursor-pointer" onClick={() => onPlayMedia(job)}>
                    <img
                      src={job.thumbnail}
                      alt={job.title}
                      className="w-16 h-11 object-cover rounded border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    {editingJobId === job.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={renameInput}
                          onChange={e => setRenameInput(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-950 border border-emerald-500 rounded px-2 py-1 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveRename(job.id)}
                          className="p-1 rounded bg-emerald-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingJobId(null)}
                          className="p-1 rounded bg-slate-700 text-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {job.fileName}
                      </h4>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{job.quality}</span>
                      <span>·</span>
                      <span>{job.totalSizeMb.toFixed(1)} MB</span>
                      <span>·</span>
                      <span>{job.durationFormatted}</span>
                      <span>·</span>
                      <span className="text-slate-400">{job.folderPath}</span>
                    </div>
                  </div>
                </div>

                {/* File Action Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onPlayMedia(job)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>

                  <button
                    onClick={() => handleExportBlob(job)}
                    title="Save File to Disk"
                    className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartRename(job)}
                    title="Rename File"
                    className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteFile(job.id)}
                    title="Delete File"
                    className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-500/20 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
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
