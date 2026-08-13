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
  if (!ctx) {
    console.error(`[AudioContext] No context available for loadBuffer(${url})`);
    return null;
  }

  if (_bufferCache.has(url)) return _bufferCache.get(url)!;

  try {
    console.log(`[AudioContext] Fetching sound file: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[AudioContext] Fetch failed with status ${response.status} for: ${url}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type') || '';
    console.log(`[AudioContext] Fetch response Content-Type for ${url}: ${contentType}`);
    
    if (contentType.includes('text/html') || contentType.includes('application/json') || contentType.includes('text/plain')) {
      const text = await response.text();
      console.error(`[AudioContext] Expected audio but got text response for ${url}: ${text.substring(0, 300)}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log(`[AudioContext] Decoding audio data for: ${url} (${arrayBuffer.byteLength} bytes)`);
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    _bufferCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (e) {
    console.error(`[AudioContext] Error loading or decoding buffer for ${url}:`, e);
    return null;
  }
};

/**
 * Play a sound using the shared AudioContext.
 * Falls back to new Audio() if AudioContext is not available.
 * @param url - path to the sound file (e.g. '/Hooray.mp3')
 * @returns the AudioBufferSourceNode (so it can be stopped if needed)
 */
export const playSound = async (url: string, playbackRate: number = 1.0): Promise<AudioBufferSourceNode | null> => {
  console.log(`[AudioContext] playSound() requested for: ${url} (rate: ${playbackRate})`);
  const ctx = getAudioContext();

  if (ctx) {
    console.log(`[AudioContext] Shared context state is: ${ctx.state}`);
    // Resume first in case it was suspended
    if (ctx.state === 'suspended') {
      console.log(`[AudioContext] Resuming suspended context...`);
      await ctx.resume().catch((err) => console.error('[AudioContext] resume() failed:', err));
      console.log(`[AudioContext] Context state after resume attempt: ${ctx.state}`);
    }
    
    const buffer = await loadBuffer(url);
    if (buffer) {
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        if (playbackRate !== 1.0) {
          source.playbackRate.value = playbackRate;
        }
        source.connect(ctx.destination);
        source.start(0);
        console.log(`[AudioContext] Playback started successfully for: ${url}`);
        return source;
      } catch (err) {
        console.error(`[AudioContext] Error creating/starting buffer source for ${url}:`, err);
      }
    } else {
      console.error(`[AudioContext] Failed to load sound buffer for: ${url}`);
    }
  }

  // Fallback: new Audio() for environments without AudioContext
  console.log(`[AudioContext] Falling back to HTML5 new Audio() for: ${url}`);
  try {
    const audio = new Audio(url);
    if (playbackRate !== 1.0) audio.playbackRate = playbackRate;
    audio.play().catch((err) => {
      console.error(`[AudioContext] HTML5 Audio play() failed for ${url}:`, err);
    });
  } catch (e) {
    console.error(`[AudioContext] HTML5 Audio creation failed for ${url}:`, e);
  }
  return null;
};

export const ALL_GAME_SOUNDS = [
  '/Hooray.mp3',
  '/dragon-studio-fireworks.mp3',
  '/floraphonic-spin-whoosh.mp3',
  '/freesound_community-diceshake.mp3',
  '/phone-ring-medium.mp3',
  '/quartz-clock.mp3',
  '/scottishperson-sound-effect-happy-birthday-music-box.mp3'
];

/**
 * Preload all game sound files into memory ahead of time.
 * Decodes audio data into RAM cache so playback is instant (0ms delay).
 */
export const preloadAllSounds = async () => {
  if (typeof window === 'undefined') return;
  console.log(`[AudioContext] Preloading all game sounds...`);
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    console.log(`[AudioContext] Context is suspended during preloading. Attempting resume...`);
    ctx.resume().catch(() => {});
  }
  await Promise.all(ALL_GAME_SOUNDS.map(url => loadBuffer(url)));
  console.log(`[AudioContext] All game sounds preloaded!`);
};

/**
 * Pre-unlock audio on a user gesture and preload all game sounds into RAM.
 * Call this on first button click ("Vào lớp học").
 */
export const unlockAudio = () => {
  console.log(`[AudioContext] unlockAudio() called. Unlocking context and preloading sounds...`);
  const ctx = getAudioContext();
  if (ctx) {
    console.log(`[AudioContext] Current context state before unlock: ${ctx.state}`);
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        console.log(`[AudioContext] Context unlocked successfully! State: ${ctx.state}`);
      }).catch((err) => {
        console.error(`[AudioContext] Context unlock failed:`, err);
      });
    }
  } else {
    console.error(`[AudioContext] No context available to unlock!`);
  }
  preloadAllSounds().catch(() => {});
};

let _tickSource: AudioBufferSourceNode | null = null;
let _isAlarmPlaying = false;

/**
 * Unified single-instance timer ticking sound player.
 * Plays directly from RAM bufferCache (0ms delay, 0 network requests)
 * Supports 3.0x speed up for last 10 seconds of countdown and protects alarm playback on finish.
 */
export const playTickSound = async (isAlarm: boolean, isFast: boolean = false) => {
  if (typeof window === 'undefined') return;

  if (isAlarm) {
    stopTickSound(true); // force stop ticking
    _isAlarmPlaying = true;
    _tickSource = await playSound('/phone-ring-medium.mp3');
    return;
  }

  stopTickSound(false);
  const rate = isFast ? 3.0 : 1.0;
  _tickSource = await playSound('/quartz-clock.mp3', rate);
};

/**
 * Stop active timer ticking sound cleanly.
 * @param forceStopAlarm - set to true to force kill alarm ringtone when user resets or closes timer
 */
export const stopTickSound = (forceStopAlarm: boolean = false) => {
  if (_tickSource) {
    if (_isAlarmPlaying && !forceStopAlarm) {
      // Do not kill alarm ringtone when timer naturally finishes at 0s
      return;
    }
    try {
      _tickSource.stop();
    } catch (_) {}
    _tickSource = null;
    _isAlarmPlaying = false;
  }
};
