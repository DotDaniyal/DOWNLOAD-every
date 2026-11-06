export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'completed' | 'failed' | 'restricted';

export interface FormatOption {
  quality: string;
  ext: 'mp4' | 'mp3' | 'm4a' | 'webm';
  sizeMb: number;
  codec: string;
  fps?: number;
}

export interface VideoMetadata {
  id: string;
  title: string;
  author: string;
  duration: number;
  durationFormatted: string;
  thumbnail: string;
  views: string;
  url: string;
  isAuthorized: boolean;
  category?: string;
  formats: FormatOption[];
  restrictionNotice?: string;
  officialLink?: string;
}

export interface PlaylistItem {
  id: string;
  index: number;
  title: string;
  author: string;
  duration: number;
  durationFormatted: string;
  sizeMb: number;
  thumbnail: string;
  isAuthorized: boolean;
  selected?: boolean;
  status?: DownloadStatus;
  jobId?: string;
}

export interface PlaylistMetadata {
  id: string;
  title: string;
  url: string;
  author: string;
  thumbnail: string;
  itemCount: number;
  items: PlaylistItem[];
}

export interface DownloadJob {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  author: string;
  duration: number;
  durationFormatted: string;
  quality: string;
  ext: string;
  totalSizeMb: number;
  downloadedSizeMb: number;
  speedMbPerSec: number;
  progressPercent: number;
  etaSeconds: number;
  status: DownloadStatus;
  playlistId?: string;
  playlistTitle?: string;
  playlistIndex?: number;
  folderPath: string;
  fileName: string;
  mediaStreamUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AppSettings {
  defaultDownloadDir: string;
  defaultQuality: string;
  maxConcurrentDownloads: number;
  autoCreatePlaylistFolder: boolean;
  fileNamingTemplate: string;
  duplicateAction: 'rename' | 'overwrite' | 'skip';
  speedLimitMb: number; // 0 for unlimited
  notificationSound: boolean;
  theme: 'dark' | 'light';
  acknowledgedLegalTerms: boolean;
}

export interface StorageStats {
  totalDiskMb: number;
  freeDiskMb: number;
  usedByAppMb: number;
  folders: {
    path: string;
    count: number;
    sizeMb: number;
  }[];
}
