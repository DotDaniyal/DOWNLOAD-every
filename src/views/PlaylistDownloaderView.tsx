import React, { useState } from 'react';
import { 
  ListVideo, 
  Search, 
  Download, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  ShieldAlert, 
  Layers,
  PlusCircle,
  AlertCircle,
  PlayCircle,
  CheckCircle2,
  ListOrdered,
  Clock,
  Sparkles
} from 'lucide-react';
import { PlaylistMetadata, PlaylistItem } from '../types';

interface PlaylistDownloaderViewProps {
  playlists: PlaylistMetadata[];
  onAddBatchJobs: (playlist: PlaylistMetadata, selectedItems: PlaylistItem[], qualityPreset: string) => void;
  onNavigateQueue: () => void;
}

export const PlaylistDownloaderView: React.FC<PlaylistDownloaderViewProps> = ({
  playlists: storedPlaylists,
  onAddBatchJobs,
  onNavigateQueue
}) => {
  const [playlistUrlInput, setPlaylistUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePlaylist, setActivePlaylist] = useState<PlaylistMetadata | null>(null);

  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [qualityPreset, setQualityPreset] = useState<string>('1080p HD (H.264 + AAC MP4)');
  const [autoFolder, setAutoFolder] = useState<boolean>(true);
  const [multiPlaylistDrawerOpen, setMultiPlaylistDrawerOpen] = useState<boolean>(false);
  const [multiUrlInput, setMultiUrlInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFetchPlaylist = async (urlToFetch?: string, customMaxCount?: number) => {
    const url = urlToFetch || playlistUrlInput.trim();
    if (!url) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, maxItems: customMaxCount || 24 })
      });
      const data = await res.json();
      if (data.type === 'playlist') {
        setActivePlaylist(data.data);
        setSelectedItemIds(new Set(data.data.items.map((i: PlaylistItem) => i.id)));
      } else {
        setErrorMsg('The provided link does not contain a playlist ID. Please use the Single Video tab.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve complete playlist metadata.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (!activePlaylist) return;
    setSelectedItemIds(new Set(activePlaylist.items.map(i => i.id)));
  };

  const deselectAll = () => {
    setSelectedItemIds(new Set());
  };

  const selectAuthorizedOnly = () => {
    if (!activePlaylist) return;
    setSelectedItemIds(new Set(activePlaylist.items.filter(i => i.isAuthorized).map(i => i.id)));
  };

  const selectedItems = activePlaylist
    ? activePlaylist.items.filter(i => selectedItemIds.has(i.id))
    : [];

  const totalSelectedSizeMb = selectedItems.reduce((acc, item) => acc + item.sizeMb, 0);

  // 1-CLICK DOWNLOAD ENTIRE PLAYLIST ACTION
  const handleDownloadEntirePlaylist = () => {
    if (!activePlaylist) return;

    // Select ALL eligible items in the playlist
    const allEligibleItems = activePlaylist.items.filter(i => i.isAuthorized);
    setSelectedItemIds(new Set(allEligibleItems.map(i => i.id)));

    // Trigger direct binary files batch download
    allEligibleItems.forEach((item, idx) => {
      setTimeout(() => {
        const downloadUrl = `/api/download-file?filename=${encodeURIComponent(item.title)} [${qualityPreset}].mp4`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${item.title} [${qualityPreset}].mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 400);
    });

    onAddBatchJobs(activePlaylist, allEligibleItems, qualityPreset);
    onNavigateQueue();
  };

  const handleStartBatchDownload = () => {
    if (!activePlaylist || selectedItems.length === 0) return;

    selectedItems.forEach((item, idx) => {
      setTimeout(() => {
        const downloadUrl = `/api/download-file?filename=${encodeURIComponent(item.title)} [${qualityPreset}].mp4`;
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${item.title} [${qualityPreset}].mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 400);
    });

    onAddBatchJobs(activePlaylist, selectedItems, qualityPreset);
    onNavigateQueue();
  };

  const handleProcessMultiUrls = async () => {
    const urls = multiUrlInput
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/batch-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        data.results.forEach((r: any) => {
          if (r.type === 'playlist') {
            onAddBatchJobs(r.data, r.data.items, qualityPreset);
          }
        });
        onNavigateQueue();
      }
    } catch (err) {
      console.error('Multi playlist batch error:', err);
    } finally {
      setLoading(false);
      setMultiPlaylistDrawerOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & URL Inspector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ListVideo className="w-5 h-5 text-indigo-500" />
              <span>Full Playlist Downloader Engine</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Retrieve complete playlist entries without truncation limits and process full batch queues
            </p>
          </div>

          <button
            onClick={() => setMultiPlaylistDrawerOpen(!multiPlaylistDrawerOpen)}
            className="px-3.5 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/30 transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Import Multiple Playlists</span>
          </button>
        </div>

        {/* Multi-Playlist Drawer Modal */}
        {multiPlaylistDrawerOpen && (
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-indigo-500/30 space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
              Batch Multi-Playlist Links Importer
            </h3>
            <p className="text-xs text-slate-400">
              Paste multiple playlist URLs below (one URL per line) to process them simultaneously in the queue:
            </p>
            <textarea
              rows={4}
              value={multiUrlInput}
              onChange={e => setMultiUrlInput(e.target.value)}
              placeholder={`https://www.youtube.com/playlist?list=PL4K8X-5Z9p9O4b...\nhttps://www.youtube.com/playlist?list=PL7k7x8z-Tech...`}
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-700 rounded text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setMultiPlaylistDrawerOpen(false)}
                className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessMultiUrls}
                disabled={loading}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Import &amp; Queue All Playlists</span>
              </button>
            </div>
          </div>
        )}

        {/* Single Playlist URL Form */}
        <form onSubmit={e => { e.preventDefault(); handleFetchPlaylist(); }} className="flex items-center gap-2">
          <input
            type="text"
            value={playlistUrlInput}
            onChange={e => setPlaylistUrlInput(e.target.value)}
            placeholder="Paste Playlist URL (e.g. https://www.youtube.com/playlist?list=...)"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading || !playlistUrlInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Fetching...' : 'Retrieve Full Playlist'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {!activePlaylist && !loading && (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-slate-400 text-xs">
          <ListVideo className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No Playlist Loaded</p>
          <p className="max-w-md mx-auto">
            Enter a playlist link above to extract all entries without pagination limits, select items, and process 100% of the playlist automatically.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setPlaylistUrlInput('https://www.youtube.com/playlist?list=PL4K8X-5Z9p9O4b-4k3X2-901');
                handleFetchPlaylist('https://www.youtube.com/playlist?list=PL4K8X-5Z9p9O4b-4k3X2-901', 30);
              }}
              className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono font-semibold"
            >
              [Test Extract Full 30-Video Playlist]
            </button>
          </div>
        </div>
      )}

      {activePlaylist && (
        <div className="space-y-6">
          {/* Playlist Summary & 1-CLICK DOWNLOAD ENTIRE PLAYLIST Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={activePlaylist.thumbnail}
                alt={activePlaylist.title}
                className="w-20 h-14 object-cover rounded-lg border border-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                    Full Playlist Engine
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                    {activePlaylist.items.length} Entries Verified
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                  {activePlaylist.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {activePlaylist.author} · Preserving original playlist index ordering (#01 to #{String(activePlaylist.items.length).padStart(2, '0')})
                </p>
              </div>
            </div>

            {/* 1-CLICK DOWNLOAD ENTIRE PLAYLIST PROMINENT BUTTON */}
            <div className="shrink-0 space-y-2">
              <button
                onClick={handleDownloadEntirePlaylist}
                className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>DOWNLOAD ENTIRE PLAYLIST ({activePlaylist.items.length} VIDEOS)</span>
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Subfolder: `{activePlaylist.title.slice(0, 15)}.../`</span>
                <span>Auto H.264 + AAC MP4</span>
              </div>
            </div>
          </div>

          {/* Batch Selection Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <button
                onClick={selectAll}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Select All ({activePlaylist.items.length})
              </button>
              <button
                onClick={deselectAll}
                className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Deselect All
              </button>
              <button
                onClick={selectAuthorizedOnly}
                className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                Authorized Only
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right font-mono">
                <span className="text-slate-400">Selected: </span>
                <span className="font-bold text-indigo-400">{selectedItems.length} Videos</span>
                <span className="text-slate-500 ml-1">({(totalSelectedSizeMb / 1024).toFixed(2)} GB)</span>
              </div>

              <button
                onClick={handleStartBatchDownload}
                disabled={selectedItems.length === 0}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Queue Selected Batch ({selectedItems.length})</span>
              </button>
            </div>
          </div>

          {/* Videos Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">Select</th>
                    <th className="py-3 px-3 w-12">#</th>
                    <th className="py-3 px-4">Video Title</th>
                    <th className="py-3 px-4 w-28">Duration</th>
                    <th className="py-3 px-4 w-28">Est. Size</th>
                    <th className="py-3 px-4 w-40">Download Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {activePlaylist.items.map((item) => {
                    const isSelected = selectedItemIds.has(item.id);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => toggleItemSelection(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-500/5 dark:bg-indigo-500/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-950/40'
                        }`}
                      >
                        <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleItemSelection(item.id)}
                            className="text-slate-400 hover:text-indigo-400"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-indigo-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">{String(item.index).padStart(2, '0')}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-12 h-9 object-cover rounded border border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">{item.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {item.durationFormatted}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {item.sizeMb} MB
                        </td>
                        <td className="py-3 px-4">
                          {item.isAuthorized ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <ShieldCheck className="w-3 h-3" /> Permitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <ShieldAlert className="w-3 h-3" /> Restricted
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
