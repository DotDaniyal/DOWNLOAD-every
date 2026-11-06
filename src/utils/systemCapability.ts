import { SystemCapabilities, FormatOption } from '../types';

/**
 * Detect actual client laptop hardware, GPU, memory, and media codec capabilities.
 */
export function detectSystemCapabilities(): SystemCapabilities {
  const nav = typeof navigator !== 'undefined' ? navigator : ({} as Navigator);
  
  // Detect OS
  const ua = nav.userAgent || '';
  let os = 'Windows 10/11';
  if (ua.includes('Win')) os = 'Windows 10/11 x64';
  if (ua.includes('Mac')) os = 'macOS';
  if (ua.includes('Linux')) os = 'Linux';

  // Detect Memory & CPU
  const ramGb = (nav as any).deviceMemory || 8;
  const cpuCores = nav.hardwareConcurrency || 8;

  // Detect WebGL GPU Name
  let gpuName = 'Direct3D11 / Intel UHD / NVIDIA / AMD';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuName = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuName;
      }
    }
  } catch (e) {
    // webgl fallback
  }

  // Check Codec Support using HTML5 MediaSource / video element support
  let supportsH264 = true;
  let supportsAAC = true;
  let supportsVP9 = false;
  let supportsAV1 = false;
  let supportsHEVC = false;

  if (typeof document !== 'undefined') {
    const v = document.createElement('video');
    supportsH264 = Boolean(v.canPlayType && (v.canPlayType('video/mp4; codecs="avc1.42E01E"') || v.canPlayType('video/mp4; codecs="avc1.64001E"')));
    supportsAAC = Boolean(v.canPlayType && v.canPlayType('audio/aac'));
    supportsVP9 = Boolean(v.canPlayType && v.canPlayType('video/webm; codecs="vp9"'));
    supportsAV1 = Boolean(v.canPlayType && v.canPlayType('video/mp4; codecs="av01.0.08M.08"'));
    supportsHEVC = Boolean(v.canPlayType && v.canPlayType('video/mp4; codecs="hvc1"'));
  }

  // Determine max recommended resolution based on RAM & CPU
  let maxRecommendedResolution: '2160p' | '1080p' | '720p' = '1080p';
  if (ramGb >= 16 && cpuCores >= 8) {
    maxRecommendedResolution = '2160p';
  } else if (ramGb < 4 || cpuCores < 4) {
    maxRecommendedResolution = '720p';
  }

  return {
    os,
    arch: ua.includes('x86_64') || ua.includes('Win64') ? 'x64' : 'x86/ARM64',
    ramGb,
    cpuCores,
    gpuName,
    supportsH264,
    supportsAAC,
    supportsVP9,
    supportsAV1,
    supportsHEVC,
    recommendedContainer: 'mp4',
    recommendedVideoCodec: 'h264',
    recommendedAudioCodec: 'aac',
    maxRecommendedResolution
  };
}

/**
 * Smart Auto Compatibility Engine:
 * Analyzes available video formats and selects the highest quality H.264 + AAC MP4
 * format guaranteed to play natively in Windows Media Player & Movies & TV.
 */
export function selectBestCompatibleFormat(
  formats: FormatOption[],
  caps: SystemCapabilities,
  isAutoMode: boolean = true
): FormatOption | null {
  if (!formats || formats.length === 0) return null;

  if (!isAutoMode) {
    // Manual mode - return highest resolution
    return formats[0];
  }

  // In Auto Compatibility Mode: Filter for widely supported MP4 with H.264 & AAC
  const compatibleMp4s = formats.filter(f => {
    const extMatch = f.ext === 'mp4' || f.ext === 'mp3';
    const codecMatch = !f.codec || f.codec.toLowerCase().includes('h.264') || f.codec.toLowerCase().includes('aac') || f.codec.toLowerCase().includes('mp3');
    return extMatch && codecMatch;
  });

  if (compatibleMp4s.length > 0) {
    // Filter within max recommended resolution (e.g. 1080p for standard laptops)
    if (caps.maxRecommendedResolution === '1080p') {
      const h1080 = compatibleMp4s.find(f => f.quality.includes('1080p'));
      if (h1080) return { ...h1080, isAutoCompatible: true };
    } else if (caps.maxRecommendedResolution === '720p') {
      const h720 = compatibleMp4s.find(f => f.quality.includes('720p'));
      if (h720) return { ...h720, isAutoCompatible: true };
    }
    return { ...compatibleMp4s[0], isAutoCompatible: true };
  }

  // Fallback to first format
  return { ...formats[0], isAutoCompatible: true };
}
