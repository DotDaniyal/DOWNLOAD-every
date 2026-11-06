import { DownloadJob, AppSettings, PlaylistMetadata } from '../types';

const DOWNLOADS_KEY = 'velocefetch_downloads_v2';
const PLAYLISTS_KEY = 'velocefetch_playlists_v2';
const SETTINGS_KEY = 'velocefetch_settings_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  defaultDownloadDir: 'D:\\Downloads\\VeloceFetch\\',
  defaultQuality: '1080p HD',
  maxConcurrentDownloads: 3,
  autoCreatePlaylistFolder: true,
  fileNamingTemplate: '{title} [{quality}]',
  duplicateAction: 'rename',
  speedLimitMb: 0, // unlimited
  notificationSound: true,
  theme: 'dark',
  compatibilityMode: 'auto',
  acknowledgedLegalTerms: true
};

// Strict requirement: START WITH ZERO DUMMY DATA (Clean Empty State)
const INITIAL_DOWNLOADS: DownloadJob[] = [];
const INITIAL_PLAYLISTS: PlaylistMetadata[] = [];

export function getStoredDownloads(): DownloadJob[] {
  try {
    const raw = localStorage.getItem(DOWNLOADS_KEY);
    if (!raw) {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(INITIAL_DOWNLOADS));
      return INITIAL_DOWNLOADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load downloads from storage:', e);
    return INITIAL_DOWNLOADS;
  }
}

export function saveStoredDownloads(downloads: DownloadJob[]): void {
  try {
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  } catch (e) {
    console.error('Failed to save downloads to storage:', e);
  }
}

export function getStoredPlaylists(): PlaylistMetadata[] {
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    if (!raw) {
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(INITIAL_PLAYLISTS));
      return INITIAL_PLAYLISTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load playlists from storage:', e);
    return INITIAL_PLAYLISTS;
  }
}

export function saveStoredPlaylists(playlists: PlaylistMetadata[]): void {
  try {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  } catch (e) {
    console.error('Failed to save playlists to storage:', e);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}
