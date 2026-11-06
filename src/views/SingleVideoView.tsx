import React, { useState } from 'react';
import { 
  Video, 
  Search, 
  Download, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Music, 
  Film,
  ExternalLink,
  Copy,
  Plus
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
  const [urlInput, setUrlInput] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>({
    id: 'bbb-1080p',
    title: 'Big Buck Bunny (Official 4K / 1080p Open Movie)',
    author: 'Blender Foundation',
    duration: 596,
    durationFormatted: '09:56',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    views: '14.2M',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isAuthorized: true,
    category: 'Animation',
    formats: [
      { quality: '2160p (4K)', ext: 'mp4', sizeMb: 450, codec: 'H.264 / AAC', fps: 60 },
      { quality: '1440p (2K)', ext: 'mp4', sizeMb: 280, codec: 'H.264 / AAC', fps: 60 },
      { quality: '1080p HD', ext: 'mp4', sizeMb: 158, codec: 'H.264 / AAC', fps: 60 },
      { quality: '720p HD', ext: 'mp4', sizeMb: 85, codec: 'H.264 / AAC', fps: 30 },
      { quality: '480p SD', ext: 'mp4', sizeMb: 42, codec: 'H.264 / AAC', fps: 30 },
      { quality: '360p SD', ext: 'mp4', sizeMb: 24, codec: 'H.264 / AAC', fps: 30 },
      { quality: 'Audio Only (MP3 320kbps)', ext: 'mp3', sizeMb: 14, codec: 'MP3', fps: 0 },
      { quality: 'Audio Only (M4A 256kbps)', ext: 'm4a', sizeMb: 11, codec: 'AAC', fps: 0 }
    ]
  });

  const [selectedFormat, setSelectedFormat] = useState<FormatOption | null>(
    videoData ? videoData.formats[2] : null // 1080p default
  );

  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() })
      });
      const data = await res.json();
      if (data.type === 'video') {
        setVideoData(data.data);
        setSelectedFormat(data.data.formats ? data.data.formats[0] : null);
      }
    } catch (err) {
      console.error('Failed to analyze video URL:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDownload = () => {
    if (!videoData || !selectedFormat) return;

    if (!videoData.isAuthorized) {
      alert("Downloading this video is restricted due to copyright or DRM terms. Official viewing options are available.");
      return;
    }

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
      mediaStreamUrl: videoData.url
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
          Enter Individual Video Link
        </label>
        <form onSubmit={handleAnalyze} className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="Paste YouTube, Vimeo or MP4 URL (e.g. https://www.youtube.com/watch?v=...)"
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 shadow-sm disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Analyzing...' : 'Analyze Video'}</span>
          </button>
        </form>
      </div>

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
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                  ▶
                </span>
              </div>
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
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{videoData.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{videoData.views} Views</span>
                </div>
              </div>
            </div>

            {!videoData.isAuthorized && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <p className="font-semibold flex items-center gap-1.5 text-amber-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" /> Notice: Copyright Restriction
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
                Select Available Media Quality
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose video resolution or audio-only extraction format
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
                disabled={!videoData.isAuthorized}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Download Selected ({selectedFormat?.quality})</span>
              </button>

              <button
                onClick={copyDirectUrl}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Direct URL' : 'Copy Direct URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
