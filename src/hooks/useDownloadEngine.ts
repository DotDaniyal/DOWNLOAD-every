import { useState, useEffect, useCallback, useRef } from 'react';
import { DownloadJob, AppSettings, PlaylistMetadata, PlaylistItem } from '../types';
import { getStoredDownloads, saveStoredDownloads, getStoredPlaylists, saveStoredPlaylists, getStoredSettings, saveStoredSettings, sanitizeFileName } from '../utils/storage';

export function useDownloadEngine() {
  const [downloads, setDownloads] = useState<DownloadJob[]>(getStoredDownloads);
  const [playlists, setPlaylists] = useState<PlaylistMetadata[]>(getStoredPlaylists);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings);
  const [isQueuePaused, setIsQueuePaused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Ref to hold latest state for interval timers
  const downloadsRef = useRef(downloads);
  downloadsRef.current = downloads;

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const isQueuePausedRef = useRef(isQueuePaused);
  isQueuePausedRef.current = isQueuePaused;

  // Save to storage on update
  useEffect(() => {
    saveStoredDownloads(downloads);
  }, [downloads]);

  useEffect(() => {
    saveStoredPlaylists(playlists);
  }, [playlists]);

  useEffect(() => {
    saveStoredSettings(settings);
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Download simulation loop (ticks every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isQueuePausedRef.current) return;

      const currentDownloads = [...downloadsRef.current];
      const maxConcurrent = settingsRef.current.maxConcurrentDownloads;

      // Count currently active downloading jobs
      const activeDownloadingCount = currentDownloads.filter(j => j.status === 'downloading').length;

      let slotsAvailable = maxConcurrent - activeDownloadingCount;
      let stateChanged = false;

      // Promote queued jobs to downloading if slots available
      if (slotsAvailable > 0) {
        for (let i = 0; i < currentDownloads.length; i++) {
          if (slotsAvailable <= 0) break;
          if (currentDownloads[i].status === 'queued') {
            currentDownloads[i] = {
              ...currentDownloads[i],
              status: 'downloading',
              speedMbPerSec: Math.random() * 6 + 4 // initial 4-10 MB/s speed
            };
            slotsAvailable--;
            stateChanged = true;
          }
        }
      }

      // Progress active downloading jobs
      const updatedDownloads = currentDownloads.map(job => {
        if (job.status !== 'downloading') return job;

        // Calculate speed & increment
        const baseSpeed = settingsRef.current.speedLimitMb > 0
          ? Math.min(settingsRef.current.speedLimitMb, Math.random() * 5 + 3)
          : Math.random() * 8 + 4.5; // 4.5 to 12.5 MB/s

        const newDownloaded = Math.min(job.totalSizeMb, job.downloadedSizeMb + baseSpeed);
        const percent = Math.floor((newDownloaded / job.totalSizeMb) * 100);
        const remainingMb = job.totalSizeMb - newDownloaded;
        const eta = baseSpeed > 0 ? Math.ceil(remainingMb / baseSpeed) : 0;

        if (percent >= 100) {
          // Play notification sound if enabled
          if (settingsRef.current.notificationSound) {
            try {
              const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
              gain.gain.setValueAtTime(0.08, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            } catch (e) {
              // ignore audio error if blocked
            }
          }

          return {
            ...job,
            downloadedSizeMb: job.totalSizeMb,
            progressPercent: 100,
            speedMbPerSec: 0,
            etaSeconds: 0,
            status: 'completed' as const,
            completedAt: new Date().toISOString()
          };
        }

        return {
          ...job,
          downloadedSizeMb: newDownloaded,
          progressPercent: percent,
          speedMbPerSec: parseFloat(baseSpeed.toFixed(1)),
          etaSeconds: eta
        };
      });

      if (stateChanged || JSON.stringify(updatedDownloads) !== JSON.stringify(downloadsRef.current)) {
        setDownloads(updatedDownloads);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Action Handlers
  const addSingleJob = useCallback((video: {
    title: string;
    url: string;
    thumbnail: string;
    author: string;
    duration: number;
    durationFormatted: string;
    quality: string;
    ext: string;
    sizeMb: number;
    folderPath?: string;
    isAuthorized: boolean;
    mediaStreamUrl?: string;
  }) => {
    if (!video.isAuthorized) {
      alert("Downloading this content is restricted due to copyright or DRM terms. Official viewing options are available.");
      return;
    }

    const sanitizedTitle = sanitizeFileName(video.title);
    const fileName = `${sanitizedTitle} [${video.quality}].${video.ext}`;
    const folderPath = video.folderPath || (video.ext === 'mp3' ? 'Downloads/Audio/' : 'Downloads/Videos/');

    const newJob: DownloadJob = {
      id: 'job-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      author: video.author,
      duration: video.duration,
      durationFormatted: video.durationFormatted,
      quality: video.quality,
      ext: video.ext,
      totalSizeMb: video.sizeMb,
      downloadedSizeMb: 0,
      speedMbPerSec: 0,
      progressPercent: 0,
      etaSeconds: Math.ceil(video.sizeMb / 6),
      status: 'queued',
      folderPath,
      fileName,
      mediaStreamUrl: video.mediaStreamUrl || video.url,
      createdAt: new Date().toISOString()
    };

    setDownloads(prev => [newJob, ...prev]);
  }, []);

  const addBatchPlaylistJobs = useCallback((
    playlist: PlaylistMetadata,
    selectedItems: PlaylistItem[],
    qualityPreset: string
  ) => {
    const isAudio = qualityPreset.toLowerCase().includes('audio') || qualityPreset.toLowerCase().includes('mp3');
    const ext = isAudio ? 'mp3' : 'mp4';
    const folderName = sanitizeFileName(playlist.title);
    const folderPath = `Downloads/Playlists/${folderName}/`;

    const newJobs: DownloadJob[] = selectedItems.map((item, idx) => {
      const sanitizedTitle = sanitizeFileName(item.title);
      return {
        id: `job-pl-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
        title: item.title,
        url: playlist.url,
        thumbnail: item.thumbnail,
        author: item.author,
        duration: item.duration,
        durationFormatted: item.durationFormatted,
        quality: qualityPreset,
        ext,
        totalSizeMb: item.sizeMb,
        downloadedSizeMb: 0,
        speedMbPerSec: 0,
        progressPercent: 0,
        etaSeconds: Math.ceil(item.sizeMb / 6),
        status: item.isAuthorized ? 'queued' : 'restricted',
        playlistId: playlist.id,
        playlistTitle: playlist.title,
        playlistIndex: item.index,
        folderPath,
        fileName: `${String(item.index).padStart(2, '0')}. ${sanitizedTitle}.${ext}`,
        mediaStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        createdAt: new Date().toISOString()
      };
    });

    setDownloads(prev => [...newJobs, ...prev]);

    // Save or update playlist in stored playlists
    setPlaylists(prev => {
      const exists = prev.find(p => p.id === playlist.id);
      if (exists) return prev;
      return [playlist, ...prev];
    });
  }, []);

  const pauseJob = useCallback((id: string) => {
    setDownloads(prev => prev.map(j => j.id === id ? { ...j, status: 'paused', speedMbPerSec: 0 } : j));
  }, []);

  const resumeJob = useCallback((id: string) => {
    setDownloads(prev => prev.map(j => j.id === id ? { ...j, status: 'queued' } : j));
  }, []);

  const cancelJob = useCallback((id: string) => {
    setDownloads(prev => prev.filter(j => j.id !== id));
  }, []);

  const retryJob = useCallback((id: string) => {
    setDownloads(prev => prev.map(j => j.id === id ? {
      ...j,
      status: 'queued',
      downloadedSizeMb: 0,
      progressPercent: 0,
      error: undefined
    } : j));
  }, []);

  const pauseAll = useCallback(() => {
    setIsQueuePaused(true);
    setDownloads(prev => prev.map(j => j.status === 'downloading' ? { ...j, status: 'paused', speedMbPerSec: 0 } : j));
  }, []);

  const resumeAll = useCallback(() => {
    setIsQueuePaused(false);
    setDownloads(prev => prev.map(j => j.status === 'paused' ? { ...j, status: 'queued' } : j));
  }, []);

  const cancelAll = useCallback(() => {
    if (confirm("Are you sure you want to cancel all active and queued downloads?")) {
      setDownloads(prev => prev.filter(j => j.status === 'completed'));
    }
  }, []);

  const retryFailed = useCallback(() => {
    setDownloads(prev => prev.map(j => j.status === 'failed' ? {
      ...j,
      status: 'queued',
      downloadedSizeMb: 0,
      progressPercent: 0,
      error: undefined
    } : j));
  }, []);

  const clearCompleted = useCallback(() => {
    setDownloads(prev => prev.filter(j => j.status !== 'completed'));
  }, []);

  const deleteFile = useCallback((id: string) => {
    setDownloads(prev => prev.filter(j => j.id !== id));
  }, []);

  const renameFile = useCallback((id: string, newFileName: string) => {
    setDownloads(prev => prev.map(j => j.id === id ? { ...j, fileName: newFileName } : j));
  }, []);

  return {
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
  };
}
