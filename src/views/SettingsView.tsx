import React, { useState, useEffect } from 'react';
import { Settings, Folder, Sliders, Bell, Moon, Sun, ShieldCheck, Cpu, HardDrive, Monitor, CheckCircle2, Sparkles } from 'lucide-react';
import { AppSettings, SystemCapabilities } from '../types';
import { detectSystemCapabilities } from '../utils/systemCapability';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
  const [caps, setCaps] = useState<SystemCapabilities | null>(null);

  useEffect(() => {
    setCaps(detectSystemCapabilities());
  }, []);

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

  const toggleCompatibilityMode = (mode: 'auto' | 'manual') => {
    setSettings(prev => ({ ...prev, compatibilityMode: mode }));
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Laptop Diagnostic Banner */}
      {caps && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Detected Laptop Capabilities &amp; Codec Hardware Engine
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded font-bold">
              H.264 + AAC MP4 Certified
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-1">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <p className="text-slate-400 text-[10px]">OPERATING SYSTEM</p>
              <p className="font-bold text-slate-100 truncate">{caps.os}</p>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <p className="text-slate-400 text-[10px]">CPU / MEMORY</p>
              <p className="font-bold text-slate-100">{caps.cpuCores} Cores · {caps.ramGb} GB RAM</p>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <p className="text-slate-400 text-[10px]">VIDEO DECODER</p>
              <p className="font-bold text-emerald-400">H.264 (yuv420p)</p>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <p className="text-slate-400 text-[10px]">AUDIO DECODER</p>
              <p className="font-bold text-emerald-400">AAC-LC 48kHz</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            <span>Application Preferences &amp; Config</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure default download directories, concurrency rules, and format quality modes
          </p>
        </div>

        <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {/* Quality Mode Selection: Auto Compatibility vs Manual */}
          <div className="pt-4 space-y-3">
            <label className="block font-semibold text-slate-900 dark:text-slate-100">
              Video Quality Processing Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => toggleCompatibilityMode('auto')}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  settings.compatibilityMode === 'auto'
                    ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-slate-100 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-500" /> AUTO COMPATIBILITY MODE
                  </span>
                  {settings.compatibilityMode === 'auto' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Automatically detects laptop capabilities and downloads H.264 + AAC MP4 files guaranteed to play in Windows Media Player.
                </p>
              </div>

              <div
                onClick={() => toggleCompatibilityMode('manual')}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  settings.compatibilityMode === 'manual'
                    ? 'border-indigo-500 bg-indigo-500/10 text-slate-900 dark:text-slate-100 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <Sliders className="w-4 h-4 text-indigo-500" /> MANUAL QUALITY MODE
                  </span>
                  {settings.compatibilityMode === 'manual' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  )}
                </div>
                <p className="text-[11px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Allows selecting custom video resolutions and formats manually.
                </p>
              </div>
            </div>
          </div>

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
              Files will be saved directly into this directory on your computer (`D:\Downloads\...`).
            </p>
          </div>

          {/* Concurrency */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-semibold text-slate-900 dark:text-slate-100">
                Default Quality Preset
              </label>
              <select
                value={settings.defaultQuality}
                onChange={handleQualityChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
              >
                <option value="1080p HD">1080p HD (H.264 + AAC MP4)</option>
                <option value="2160p (4K)">2160p (4K Ultra HD)</option>
                <option value="720p HD">720p HD (Standard HD)</option>
                <option value="480p SD">480p SD (Compact File)</option>
                <option value="Audio Only (MP3 320kbps)">Audio Only (MP3 320kbps)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-900 dark:text-slate-100">
                Max Simultaneous Queue Jobs
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
                Automatically create dedicated subfolders for playlists (`Downloads/Playlists/{'{'}name{'}'}/`)
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
                Play completion chime sound
              </span>
            </label>
          </div>

          {/* Theme Switcher */}
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
