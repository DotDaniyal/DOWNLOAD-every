import React, { useState } from 'react';
import { X, Search, Link as LinkIcon, Download, ListVideo } from 'lucide-react';

interface QuickImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeUrl: (url: string) => void;
}

export const QuickImportModal: React.FC<QuickImportModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeUrl
}) => {
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyzeUrl(url.trim());
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-emerald-400" />
            <span>Fast Import Media or Playlist Link</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Paste Media or Playlist URL
            </label>
            <input
              type="text"
              autoFocus
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Analyze &amp; Process</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
