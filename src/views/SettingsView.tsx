import React from 'react';
import { Settings, Folder, Sliders, Bell, Moon, Sun, ShieldCheck } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, defaultDownloadDir: e.target.value }));
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, defaultQuality: e.target.value }));
  };

  const handleConcurrentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, maxConcurrentDownloads: Number(e.target.value) }));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, fileNamingTemplate: e.target.value }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            <span>Application Preferences &amp; Config</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure default download directories, concurrency rules, and file naming templates
          </p>
        </div>

        <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Default Folder */}
          <div className="pt-4 space-y-2">
            <label className="block font-semibold text-slate-900 dark:text-slate-100">
              Default Download Directory
            </label>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-500 shrink-0" />
              <input
                type="text"
                value={settings.defaultDownloadDir}
                onChange={handleFolderChange}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Files will be saved in this directory root unless overridden by playlist folders.
            </p>
          </div>

          {/* Preset Quality & Concurrency */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-semibold text-slate-900 dark:text-slate-100">
                Default Quality Preference
              </label>
              <select
                value={settings.defaultQuality}
                onChange={handleQualityChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
              >
                <option value="2160p (4K)">2160p (4K Ultra HD)</option>
                <option value="1080p HD">1080p HD (High Definition)</option>
                <option value="720p HD">720p HD (Standard HD)</option>
                <option value="480p SD">480p SD (Compact File)</option>
                <option value="Audio Only (MP3 320kbps)">Audio Only (MP3 320kbps)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-900 dark:text-slate-100">
                Max Simultaneous Downloads
              </label>
              <select
                value={settings.maxConcurrentDownloads}
                onChange={handleConcurrentChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8].map(num => (
                  <option key={num} value={num}>{num} Parallel Downloads</option>
                ))}
              </select>
            </div>
          </div>

          {/* File Naming Syntax */}
          <div className="pt-4 space-y-2">
            <label className="block font-semibold text-slate-900 dark:text-slate-100">
              Automatic File Naming Syntax
            </label>
            <input
              type="text"
              value={settings.fileNamingTemplate}
              onChange={handleTemplateChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 font-mono">
              Live Preview: <span className="text-emerald-400">Big Buck Bunny [1080p HD].mp4</span>
            </p>
          </div>

          {/* Preferences Switches */}
          <div className="pt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoCreatePlaylistFolder}
                onChange={e => setSettings(prev => ({ ...prev, autoCreatePlaylistFolder: e.target.checked }))}
                className="accent-emerald-500 rounded"
              />
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Automatically create subfolders for playlists (`Downloads/Playlists/{'{'}name{'}'}/`)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationSound}
                onChange={e => setSettings(prev => ({ ...prev, notificationSound: e.target.checked }))}
                className="accent-emerald-500 rounded"
              />
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Play completion audio chime notification
              </span>
            </label>
          </div>

          {/* Visual Theme Switcher */}
          <div className="pt-4 space-y-2">
            <label className="block font-semibold text-slate-900 dark:text-slate-100">
              User Interface Theme
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  settings.theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" /> Dark Mode
              </button>

              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  settings.theme === 'light'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 font-bold'
                    : 'border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" /> Light Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
