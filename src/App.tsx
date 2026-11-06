import React, { useState } from 'react';
import { useDownloadEngine } from './hooks/useDownloadEngine';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './views/DashboardView';
import { SingleVideoView } from './views/SingleVideoView';
import { PlaylistDownloaderView } from './views/PlaylistDownloaderView';
import { DownloadQueueView } from './views/DownloadQueueView';
import { MediaLibraryView } from './views/MediaLibraryView';
import { StorageView } from './views/StorageView';
import { SettingsView } from './views/SettingsView';
import { AboutView } from './views/AboutView';
import { MediaPlayerModal } from './components/MediaPlayerModal';
import { QuickImportModal } from './components/QuickImportModal';
import { DownloadJob } from './types';

export default function App() {
  const {
    downloads,
    playlists,
    settings,
    setSettings,
    isQueuePaused,
    activeTab,
    setActiveTab,
    addSingleJob,
    addBatchPlaylistJobs,
    pauseJob,
    resumeJob,
    cancelJob,
    retryJob,
    pauseAll,
    resumeAll,
    cancelAll,
    retryFailed,
    clearCompleted,
    deleteFile,
    renameFile
  } = useDownloadEngine();

  const [activeMediaJob, setActiveMediaJob] = useState<DownloadJob | null>(null);
  const [quickImportOpen, setQuickImportOpen] = useState(false);

  const activeDownloadingCount = downloads.filter(d => d.status === 'downloading' || d.status === 'queued').length;

  const handleQuickAnalyzeUrl = (url: string) => {
    if (url.includes('list=') || url.includes('playlist')) {
      setActiveTab('playlist');
    } else {
      setActiveTab('single');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeQueueCount={activeDownloadingCount}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          activeTab={activeTab}
          downloads={downloads}
          isQueuePaused={isQueuePaused}
          onPauseAll={pauseAll}
          onResumeAll={resumeAll}
          onOpenQuickImport={() => setQuickImportOpen(true)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              downloads={downloads}
              playlists={playlists}
              onNavigateTab={setActiveTab}
              onAnalyzeUrl={handleQuickAnalyzeUrl}
              onPauseJob={pauseJob}
              onResumeJob={resumeJob}
              onCancelJob={cancelJob}
              onPlayMedia={setActiveMediaJob}
            />
          )}

          {activeTab === 'single' && (
            <SingleVideoView
              onAddJob={addSingleJob}
              onNavigateQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'playlist' && (
            <PlaylistDownloaderView
              playlists={playlists}
              onAddBatchJobs={addBatchPlaylistJobs}
              onNavigateQueue={() => setActiveTab('queue')}
            />
          )}

          {activeTab === 'queue' && (
            <DownloadQueueView
              downloads={downloads}
              isQueuePaused={isQueuePaused}
              settings={settings}
              setSettings={setSettings}
              onPauseJob={pauseJob}
              onResumeJob={resumeJob}
              onCancelJob={cancelJob}
              onRetryJob={retryJob}
              onPauseAll={pauseAll}
              onResumeAll={resumeAll}
              onCancelAll={cancelAll}
              onRetryFailed={retryFailed}
              onClearCompleted={clearCompleted}
            />
          )}

          {activeTab === 'library' && (
            <MediaLibraryView
              downloads={downloads}
              onDeleteFile={deleteFile}
              onRenameFile={renameFile}
              onPlayMedia={setActiveMediaJob}
            />
          )}

          {activeTab === 'storage' && (
            <StorageView
              downloads={downloads}
              onClearCompleted={clearCompleted}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
            />
          )}

          {activeTab === 'about' && (
            <AboutView />
          )}
        </main>
      </div>

      {/* Media Player Modal Preview */}
      <MediaPlayerModal
        job={activeMediaJob}
        onClose={() => setActiveMediaJob(null)}
      />

      {/* Quick Import Modal */}
      <QuickImportModal
        isOpen={quickImportOpen}
        onClose={() => setQuickImportOpen(false)}
        onAnalyzeUrl={handleQuickAnalyzeUrl}
      />
    </div>
  );
}
