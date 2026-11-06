import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // Mock sample videos with real playable streams for authorized downloads & previews
  const DEMO_MEDIA_LIBRARY = [
    {
      id: 'bbb-1080p',
      title: 'Big Buck Bunny (Official 4K / 1080p Open Movie)',
      author: 'Blender Foundation',
      duration: 596, // seconds
      durationFormatted: '09:56',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      views: '14.2M',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      isAuthorized: true,
      category: 'Animation',
      formats: [
        { quality: '2160p (4K)', ext: 'mp4', sizeMb: 450, codec: 'H.264 / AAC', fps: 60 },
        { quality: '1440p (2K)', ext: 'mp4', sizeMb: 280, codec: 'H.264 / AAC', fps: 60 },
        { quality: '1080p HD', ext: 'mp4', sizeMb: 158, codec: 'H.264 / AAC', fps: 60 },
        { quality: '720p HD', ext: 'mp4', sizeMb: 85, codec: 'H.264 / AAC', fps: 30 },
        { quality: '480p SD', ext: 'mp4', sizeMb: 42, codec: 'H.264 / AAC', fps: 30 },
        { quality: '360p SD', ext: 'mp4', sizeMb: 24, codec: 'H.264 / AAC', fps: 30 },
        { quality: 'Audio Only (MP3 320kbps)', ext: 'mp3', sizeMb: 14, codec: 'MP3', fps: 0 },
        { quality: 'Audio Only (M4A 256kbps)', ext: 'm4a', sizeMb: 11, codec: 'AAC', fps: 0 }
      ]
    },
    {
      id: 'sintel-720p',
      title: 'Sintel - Official Open Source Film Project',
      author: 'Durian Open Movie Team',
      duration: 888,
      durationFormatted: '14:48',
      thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
      views: '8.7M',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      isAuthorized: true,
      category: 'Fantasy',
      formats: [
        { quality: '1080p HD', ext: 'mp4', sizeMb: 210, codec: 'H.264 / AAC', fps: 24 },
        { quality: '720p HD', ext: 'mp4', sizeMb: 120, codec: 'H.264 / AAC', fps: 24 },
        { quality: '480p SD', ext: 'mp4', sizeMb: 60, codec: 'H.264 / AAC', fps: 24 },
        { quality: 'Audio Only (MP3 320kbps)', ext: 'mp3', sizeMb: 20, codec: 'MP3', fps: 0 }
      ]
    },
    {
      id: 'tears-of-steel',
      title: 'Tears of Steel - Sci-Fi Visual Effects Showcase',
      author: 'Mango Open Movie',
      duration: 734,
      durationFormatted: '12:14',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      views: '5.1M',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      isAuthorized: true,
      category: 'Sci-Fi',
      formats: [
        { quality: '2160p (4K)', ext: 'mp4', sizeMb: 520, codec: 'H.264 / AAC', fps: 24 },
        { quality: '1080p HD', ext: 'mp4', sizeMb: 195, codec: 'H.264 / AAC', fps: 24 },
        { quality: '720p HD', ext: 'mp4', sizeMb: 110, codec: 'H.264 / AAC', fps: 24 },
        { quality: 'Audio Only (MP3 320kbps)', ext: 'mp3', sizeMb: 18, codec: 'MP3', fps: 0 }
      ]
    },
    {
      id: 'elephants-dream',
      title: 'Elephants Dream - World 1st Open Source 3D Movie',
      author: 'Orange Open Movie',
      duration: 653,
      durationFormatted: '10:53',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      views: '3.9M',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      isAuthorized: true,
      category: 'Surrealism',
      formats: [
        { quality: '1080p HD', ext: 'mp4', sizeMb: 140, codec: 'H.264 / AAC', fps: 24 },
        { quality: '720p HD', ext: 'mp4', sizeMb: 80, codec: 'H.264 / AAC', fps: 24 },
        { quality: 'Audio Only (MP3 320kbps)', ext: 'mp3', sizeMb: 15, codec: 'MP3', fps: 0 }
      ]
    }
  ];

  const DEMO_PLAYLISTS = [
    {
      id: 'pl-blender-collection',
      title: 'Blender Open Movies Complete Collection (4K)',
      url: 'https://www.youtube.com/playlist?list=PL4K8X-5Z9p9O4b-4k3X2-901',
      author: 'Blender Studio',
      itemCount: 6,
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
      items: [
        { id: 'item-1', index: 1, title: 'Big Buck Bunny (4K Ultra HD)', author: 'Blender Studio', duration: 596, durationFormatted: '09:56', sizeMb: 450, thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-2', index: 2, title: 'Sintel - Dragons & Legends', author: 'Blender Studio', duration: 888, durationFormatted: '14:48', sizeMb: 210, thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-3', index: 3, title: 'Tears of Steel (Sci-Fi Short)', author: 'Blender Studio', duration: 734, durationFormatted: '12:14', sizeMb: 520, thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-4', index: 4, title: 'Elephants Dream (3D Short)', author: 'Blender Studio', duration: 653, durationFormatted: '10:53', sizeMb: 140, thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-5', index: 5, title: 'For Dummies - 3D Animation Breakdown', author: 'Blender Studio', duration: 420, durationFormatted: '07:00', sizeMb: 95, thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-6', index: 6, title: 'Sprite Fright - Open Movie 2021', author: 'Blender Studio', duration: 630, durationFormatted: '10:30', sizeMb: 180, thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', isAuthorized: true }
      ]
    },
    {
      id: 'pl-coding-tutorials',
      title: 'Full-Stack Software Architecture Masterclass',
      url: 'https://www.youtube.com/playlist?list=PL7k7x8z-TechMastery2026',
      author: 'Tech Engineering Channel',
      itemCount: 5,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      items: [
        { id: 'item-10', index: 1, title: '01. React 19 & Concurrent Rendering Principles', author: 'Tech Engineering', duration: 1420, durationFormatted: '23:40', sizeMb: 310, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-11', index: 2, title: '02. Designing High-Throughput Download Engines', author: 'Tech Engineering', duration: 1890, durationFormatted: '31:30', sizeMb: 420, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-12', index: 3, title: '03. SQLite Indexing & High-Performance Caching', author: 'Tech Engineering', duration: 1100, durationFormatted: '18:20', sizeMb: 240, thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-13', index: 4, title: '04. Building Desktop Apps with Tauri & WebViews', author: 'Tech Engineering', duration: 2150, durationFormatted: '35:50', sizeMb: 490, thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
        { id: 'item-14', index: 5, title: '05. Asynchronous Queue Management & Chunk Streaming', author: 'Tech Engineering', duration: 1640, durationFormatted: '27:20', sizeMb: 360, thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80', isAuthorized: true }
      ]
    }
  ];

  // API Routes
  app.post('/api/analyze-url', (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid URL string.' });
    }

    const cleanUrl = url.trim();

    // Check if url is a playlist
    const isPlaylist = cleanUrl.includes('list=') || cleanUrl.includes('playlist') || cleanUrl.includes('album');

    if (isPlaylist) {
      // Find matching demo playlist or generate clean metadata from URL structure
      let matchedPlaylist = DEMO_PLAYLISTS.find(p => cleanUrl.toLowerCase().includes(p.id) || cleanUrl.includes('PL4K8X'));
      if (!matchedPlaylist) {
        // Generate dynamic playlist structure based on URL
        const playlistId = 'pl-' + Date.now().toString().slice(-6);
        const nameMatch = cleanUrl.match(/(?:list=|playlist\/)([^&?]+)/i);
        const playlistName = nameMatch ? `Imported Playlist (${nameMatch[1].slice(0, 10)})` : 'Custom Imported Playlist';

        matchedPlaylist = {
          id: playlistId,
          title: playlistName,
          url: cleanUrl,
          author: 'YouTube Creator',
          itemCount: 4,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          items: [
            { id: `${playlistId}-1`, index: 1, title: 'Video Lesson 01 - System Fundamentals', author: 'YouTube Creator', duration: 640, durationFormatted: '10:40', sizeMb: 145, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
            { id: `${playlistId}-2`, index: 2, title: 'Video Lesson 02 - Queue Management & Optimization', author: 'YouTube Creator', duration: 890, durationFormatted: '14:50', sizeMb: 210, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
            { id: `${playlistId}-3`, index: 3, title: 'Video Lesson 03 - Storage & Data Persistence', author: 'YouTube Creator', duration: 1120, durationFormatted: '18:40', sizeMb: 280, thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80', isAuthorized: true },
            { id: `${playlistId}-4`, index: 4, title: 'Video Lesson 04 - High-Speed Batch Processing', author: 'YouTube Creator', duration: 750, durationFormatted: '12:30', sizeMb: 175, thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80', isAuthorized: true }
          ]
        };
      }

      return res.json({
        type: 'playlist',
        data: matchedPlaylist
      });
    }

    // Check if it's a restricted / official protected music video
    if (cleanUrl.toLowerCase().includes('vevo') || cleanUrl.toLowerCase().includes('officialmusicvideo') || cleanUrl.toLowerCase().includes('restricted')) {
      return res.json({
        type: 'video',
        data: {
          id: 'restricted-' + Date.now(),
          title: 'Official Protected Media Content (DRM / Copyright Restricted)',
          author: 'Protected Record Label / VEVO',
          duration: 230,
          durationFormatted: '03:50',
          thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
          views: '45.8M',
          url: cleanUrl,
          isAuthorized: false,
          restrictionNotice: 'This media contains DRM digital rights management or YouTube YouTube terms download restrictions. Direct file downloading is prohibited by the copyright holder. Official viewing or legal purchasing links are available below.',
          officialLink: cleanUrl
        }
      });
    }

    // Match or create single video info
    let matchedVideo = DEMO_MEDIA_LIBRARY.find(v => cleanUrl.includes(v.id) || cleanUrl.includes('mp4') || cleanUrl.includes('vimeo'));
    if (!matchedVideo) {
      // Dynamic fallback video metadata derived from URL
      matchedVideo = {
        id: 'vid-' + Date.now().toString().slice(-6),
        title: cleanUrl.split('/').pop()?.split('?')[0] || 'Imported High Definition Video',
        author: 'Content Channel',
        duration: 480,
        durationFormatted: '08:00',
        thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
        views: '1.2M',
        url: cleanUrl,
        isAuthorized: true,
        category: 'General Media',
        formats: [
          { quality: '2160p (4K)', ext: 'mp4', sizeMb: 380, codec: 'H.264 / AAC', fps: 60 },
          { quality: '1080p HD', ext: 'mp4', sizeMb: 145, codec: 'H.264 / AAC', fps: 60 },
          { quality: '720p HD', ext: 'mp4', sizeMb: 75, codec: 'H.264 / AAC', fps: 30 },
          { quality: '480p SD', ext: 'mp4', sizeMb: 35, codec: 'H.264 / AAC', fps: 30 },
          { quality: 'Audio Only (MP3 320kbps)', ext: 'mp3', sizeMb: 12, codec: 'MP3', fps: 0 }
        ]
      };
    }

    return res.json({
      type: 'video',
      data: matchedVideo
    });
  });

  // Batch Analyze Multiple URLs / Playlists at once
  app.post('/api/batch-analyze', (req, res) => {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of URL strings.' });
    }

    const results = urls.map((rawUrl: string, idx: number) => {
      const url = rawUrl.trim();
      const isPlaylist = url.includes('list=') || url.includes('playlist');
      if (isPlaylist) {
        return {
          type: 'playlist',
          url,
          data: DEMO_PLAYLISTS[idx % DEMO_PLAYLISTS.length]
        };
      } else {
        return {
          type: 'video',
          url,
          data: DEMO_MEDIA_LIBRARY[idx % DEMO_MEDIA_LIBRARY.length]
        };
      }
    });

    return res.json({ results });
  });

  // Storage info
  app.get('/api/system/storage', (req, res) => {
    res.json({
      totalDiskMb: 512000, // 500 GB
      freeDiskMb: 384000,  // 375 GB
      usedByAppMb: 4850,   // ~4.85 GB
      folders: [
        { path: 'Downloads/Videos/', count: 12, sizeMb: 3420 },
        { path: 'Downloads/Playlists/', count: 2, sizeMb: 1120 },
        { path: 'Downloads/Audio/', count: 8, sizeMb: 310 }
      ]
    });
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VeloceFetch Server] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
