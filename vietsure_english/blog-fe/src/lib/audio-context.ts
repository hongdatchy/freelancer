/**
 * Shared AudioContext utility for mobile-friendly audio playback.
 *
 * iOS Safari and Android Chrome suspend AudioContext automatically.
 * This utility:
 * 1. Creates ONE shared AudioContext (singleton)
 * 2. Resumes it on EVERY user touch/click (so it's always ready)
 * 3. Provides playSound() that works reliably on mobile
 */

let _ctx: AudioContext | null = null;
const _bufferCache: Map<string, AudioBuffer> = new Map();

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    try {
      _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      return null;
    }
  }
  return _ctx;
};

// Resume AudioContext on every user interaction (critical for iOS)
if (typeof window !== 'undefined') {
  const resumeCtx = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('touchstart', resumeCtx, { passive: true });
  window.addEventListener('click', resumeCtx, { passive: true });
  window.addEventListener('keydown', resumeCtx, { passive: true });
}

/**
 * Fetch and decode an audio buffer, with caching.
 */
const loadBuffer = async (url: string): Promise<AudioBuffer | null> => {
  const ctx = getAudioContext();
  if (!ctx) return null;

  if (_bufferCache.has(url)) return _bufferCache.get(url)!;

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    _bufferCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (e) {
    return null;
  }
};

/**
 * Play a sound using the shared AudioContext.
 * Falls back to new Audio() if AudioContext is not available.
 * @param url - path to the sound file (e.g. '/Hooray.mp3')
 * @returns the AudioBufferSourceNode (so it can be stopped if needed)
 */
export const playSound = async (url: string): Promise<AudioBufferSourceNode | null> => {
  const ctx = getAudioContext();

  if (ctx) {
    // Resume first in case it was suspended
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
    const buffer = await loadBuffer(url);
    if (buffer) {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      return source;
    }
  }

  // Fallback: new Audio() for environments without AudioContext
  try {
    const audio = new Audio(url);
    audio.play().catch(() => {});
  } catch (e) {}
  return null;
};

/**
 * Pre-unlock audio on a user gesture (call this on first meaningful button click).
 * This ensures the AudioContext is created and running before any game sounds needed.
 */
export const unlockAudio = () => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
};
