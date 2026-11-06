import React, { useState } from 'react';
import { 
  Video, 
  Search, 
  Download, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  Eye, 
  Music, 
  Film,
  ExternalLink,
  Copy,
  Folder,
  AlertCircle
} from 'lucide-react';
import { VideoMetadata, FormatOption } from '../types';

interface SingleVideoViewProps {
  onAddJob: (video: {
    title: string;
    url: string;
    thumbnail: string;
    author: string;
    duration: number;
    durationFormatted: string;
    quality: string;
    ext: string;
    sizeMb: number;
    isAuthorized: boolean;
    mediaStreamUrl?: string;
  }) => void;
  onNavigateQueue: () => void;
}

export const SingleVideoView: React.FC<SingleVideoViewProps> = ({
  onAddJob,
  onNavigateQueue
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatOption | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.type === 'video') {
        setVideoData(data.data);
        setSelectedFormat(data.data.formats && data.data.formats.length > 0 ? data.data.formats[0] : null);
      } else {
        setErrorMsg('The provided URL appears to be a playlist. Please use the Playlist Downloader tab.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch video metadata from the provided URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDownload = () => {
    if (!videoData || !selectedFormat) return;

    if (!videoData.isAuthorized) {
      alert("Downloading this video is restricted due to YouTube terms or copyright. Official viewing options are available.");
      return;
    }

    // Trigger local browser binary download to user's hard drive
    const downloadUrl = `/api/download-file?filename=${encodeURIComponent(videoData.title)} [${selectedFormat.quality}].${selectedFormat.ext}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${videoData.title} [${selectedFormat.quality}].${selectedFormat.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Queue in app download manager
    onAddJob({
      title: videoData.title,
      url: videoData.url,
      thumbnail: videoData.thumbnail,
      author: videoData.author,
      duration: videoData.duration,
      durationFormatted: videoData.durationFormatted,
      quality: selectedFormat.quality,
      ext: selectedFormat.ext,
      sizeMb: selectedFormat.sizeMb,
      isAuthorized: videoData.isAuthorized,
      mediaStreamUrl: downloadUrl
    });

    onNavigateQueue();
  };

  const copyDirectUrl = () => {
    if (!videoData) return;
    navigator.clipboard.writeText(videoData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* URL Input Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-sm">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Enter Exact Video Link
        </label>
        <form onSubmit={handleAnalyze} className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Paste exact YouTube, Vimeo or MP4 URL (e.g. https://www.youtube.com/watch?v=...)"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading || !urlInput.trim()}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Fetching...' : 'Analyze Media'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {!videoData && !loading && (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-slate-400 text-xs">
          <Video className="w-10 h-10 mx-auto text-slate-500 opacity-60" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No Video Selected</p>
          <p className="max-w-md mx-auto">
            Paste an exact video URL above to retrieve real metadata, format quality options, and download directly to your local device.
          </p>
        </div>
      )}

      {videoData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Metadata Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-sm h-fit">
            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group">
              <img
                src={videoData.thumbnail}
                alt={videoData.title}
                className="w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                {videoData.durationFormatted}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {videoData.category || 'HD Video'}
                </span>
                {videoData.isAuthorized ? (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authorized Download
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-500 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> DRM Restricted
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {videoData.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 truncate">
                  <Film className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{videoData.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{videoData.views}</span>
                </div>
              </div>
            </div>

            {!videoData.isAuthorized && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <p className="font-semibold flex items-center gap-1.5 text-amber-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" /> Copyright Protection Notice
                </p>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  {videoData.restrictionNotice}
                </p>
                <a
                  href={videoData.officialLink || videoData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline font-mono"
                >
                  Open Official Platform <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Quality Picker & Actions */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Select Available Media Format
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select video resolution or audio extraction quality
              </p>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {videoData.formats.map((fmt, idx) => {
                const isSelected = selectedFormat?.quality === fmt.quality;
                const isAudio = fmt.ext === 'mp3' || fmt.ext === 'm4a';

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex items-center gap-2">
                        {isAudio ? <Music className="w-4 h-4 text-purple-400" /> : <Film className="w-4 h-4 text-sky-400" />}
                        <span className="text-xs font-bold font-mono">{fmt.quality}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono uppercase">
                          .{fmt.ext}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      {fmt.fps && fmt.fps > 0 && <span>{fmt.fps} FPS</span>}
                      <span>{fmt.codec}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmt.sizeMb} MB</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartDownload}
                disabled={!videoData.isAuthorized || !selectedFormat}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Save Directly to Device ({selectedFormat?.quality})</span>
              </button>

              <button
                onClick={copyDirectUrl}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Direct Link' : 'Copy Direct Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
