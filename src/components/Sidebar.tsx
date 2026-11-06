import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  ListVideo, 
  ListOrdered, 
  FolderOpen, 
  HardDrive, 
  Settings, 
  Info,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';
import { AppSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeQueueCount: number;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeQueueCount,
  settings,
  setSettings
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'single', label: 'Single Video', icon: Video },
    { id: 'playlist', label: 'Playlist Downloader', icon: ListVideo, badge: 'Batch' },
    { id: 'queue', label: 'Download Queue', icon: ListOrdered, count: activeQueueCount },
    { id: 'library', label: 'Media Library', icon: FolderOpen },
    { id: 'storage', label: 'Storage Manager', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About & Compliance', icon: Info }
  ];

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Video className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight leading-none">VeloceFetch Pro</h1>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Desktop v2.4
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase font-mono">
          Main Workspace
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-medium border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[11px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full font-mono">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls & Theme Toggle */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 space-y-3">
        {/* Quick System Info */}
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px]">
          <div className="flex items-center justify-between text-slate-400 mb-1 font-mono">
            <span>Storage Used</span>
            <span className="text-slate-200 font-bold">4.85 GB / 500 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[12%]" />
          </div>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono capitalize">{settings.theme}</span>
        </button>
      </div>
    </aside>
  );
};
