import React from 'react';
import { X, Film, Music, Download } from 'lucide-react';
import { DownloadJob } from '../types';

interface MediaPlayerModalProps {
  job: DownloadJob | null;
  onClose: () => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({ job, onClose }) => {
  if (!job) return null;

  const isAudio = job.ext === 'mp3' || job.ext === 'm4a';
  const mediaUrl = job.mediaStreamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-slate-100 space-y-0">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {isAudio ? <Music className="w-5 h-5 text-purple-400" /> : <Film className="w-5 h-5 text-emerald-400" />}
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate text-white">{job.title}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {job.quality} · {job.fileName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Viewing Canvas */}
        <div className="bg-black flex items-center justify-center min-h-[320px]">
          {isAudio ? (
            <div className="p-8 text-center space-y-4 w-full max-w-md">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Music className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{job.title}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{job.author}</p>
              </div>
              <audio controls autoPlay src={mediaUrl} className="w-full" />
            </div>
          ) : (
            <video
              controls
              autoPlay
              src={mediaUrl}
              poster={job.thumbnail}
              className="w-full max-h-[480px] object-contain"
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Folder: {job.folderPath}</span>
          <span>Format: .{job.ext} ({job.totalSizeMb} MB)</span>
        </div>
      </div>
    </div>
  );
};
