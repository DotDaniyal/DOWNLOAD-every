import { DownloadJob, AppSettings, PlaylistMetadata } from '../types';

const DOWNLOADS_KEY = 'velocefetch_downloads_v1';
const PLAYLISTS_KEY = 'velocefetch_playlists_v1';
const SETTINGS_KEY = 'velocefetch_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  defaultDownloadDir: 'Downloads/VeloceFetch/',
  defaultQuality: '1080p HD',
  maxConcurrentDownloads: 3,
  autoCreatePlaylistFolder: true,
  fileNamingTemplate: '{title} [{quality}]',
  duplicateAction: 'rename',
  speedLimitMb: 0, // unlimited
  notificationSound: true,
  theme: 'dark',
  acknowledgedLegalTerms: true
};

const INITIAL_DOWNLOADS: DownloadJob[] = [
  {
    id: 'job-101',
    title: 'Big Buck Bunny (Official 4K / 1080p Open Movie)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    author: 'Blender Foundation',
    duration: 596,
    durationFormatted: '09:56',
    quality: '1080p HD',
    ext: 'mp4',
    totalSizeMb: 158.0,
    downloadedSizeMb: 158.0,
    speedMbPerSec: 0,
    progressPercent: 100,
    etaSeconds: 0,
    status: 'completed',
    folderPath: 'Downloads/Videos/',
    fileName: 'Big Buck Bunny (Official 4K 1080p Open Movie) [1080p HD].mp4',
    mediaStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 4.8).toISOString()
  },
  {
    id: 'job-102',
    title: 'Sintel - Official Open Source Film Project',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    author: 'Durian Open Movie Team',
    duration: 888,
    durationFormatted: '14:48',
    quality: '720p HD',
    ext: 'mp4',
    totalSizeMb: 120.0,
    downloadedSizeMb: 68.4,
    speedMbPerSec: 4.8,
    progressPercent: 57,
    etaSeconds: 11,
    status: 'downloading',
    folderPath: 'Downloads/Videos/',
    fileName: 'Sintel - Official Open Source Film Project [720p HD].mp4',
    mediaStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    createdAt: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: 'job-103',
    title: 'Tears of Steel - Sci-Fi Visual Effects Showcase',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    author: 'Mango Open Movie',
    duration: 734,
    durationFormatted: '12:14',
    quality: 'Audio Only (MP3 320kbps)',
    ext: 'mp3',
    totalSizeMb: 18.0,
    downloadedSizeMb: 0,
    speedMbPerSec: 0,
    progressPercent: 0,
    etaSeconds: 0,
    status: 'queued',
    folderPath: 'Downloads/Audio/',
    fileName: 'Tears of Steel - Audio Soundtrack.mp3',
    mediaStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    createdAt: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: 'job-104',
    title: 'Elephants Dream - World 1st Open Source 3D Movie',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    author: 'Orange Open Movie',
    duration: 653,
    durationFormatted: '10:53',
    quality: '1080p HD',
    ext: 'mp4',
    totalSizeMb: 140.0,
    downloadedSizeMb: 140.0,
    speedMbPerSec: 0,
    progressPercent: 100,
    etaSeconds: 0,
    status: 'completed',
    folderPath: 'Downloads/Videos/',
    fileName: 'Elephants Dream [1080p HD].mp4',
    mediaStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 23.5).toISOString()
  }
];

const INITIAL_PLAYLISTS: PlaylistMetadata[] = [
  {
    id: 'pl-blender-collection',
    title: 'Blender Open Movies Complete Collection (4K)',
    url: 'https://www.youtube.com/playlist?list=PL4K8X-5Z9p9O4b-4k3X2-901',
    author: 'Blender Studio',
    itemCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    items: [
      { id: 'item-1', index: 1, title: 'Big Buck Bunny (4K Ultra HD)', author: 'Blender Studio', duration: 596, durationFormatted: '09:56', sizeMb: 450, thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80', isAuthorized: true, selected: true, status: 'completed' },
      { id: 'item-2', index: 2, title: 'Sintel - Dragons & Legends', author: 'Blender Studio', duration: 888, durationFormatted: '14:48', sizeMb: 210, thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80', isAuthorized: true, selected: true, status: 'downloading' },
      { id: 'item-3', index: 3, title: 'Tears of Steel (Sci-Fi Short)', author: 'Blender Studio', duration: 734, durationFormatted: '12:14', sizeMb: 520, thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', isAuthorized: true, selected: true, status: 'queued' },
      { id: 'item-4', index: 4, title: 'Elephants Dream (3D Short)', author: 'Blender Studio', duration: 653, durationFormatted: '10:53', sizeMb: 140, thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80', isAuthorized: true, selected: true, status: 'completed' },
      { id: 'item-5', index: 5, title: 'For Dummies - 3D Animation Breakdown', author: 'Blender Studio', duration: 420, durationFormatted: '07:00', sizeMb: 95, thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', isAuthorized: true, selected: true, status: 'queued' },
      { id: 'item-6', index: 6, title: 'Sprite Fright - Open Movie 2021', author: 'Blender Studio', duration: 630, durationFormatted: '10:30', sizeMb: 180, thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', isAuthorized: true, selected: true, status: 'queued' }
    ]
  }
];

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
