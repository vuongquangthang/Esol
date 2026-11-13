// Utility for high-quality audio notifications using Web Audio API
// 100% offline, zero network requests, no external audio files required.

export type SoundTheme = 'zen_bell' | 'marimba' | 'classic_chime';

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.8;
  private theme: SoundTheme = 'zen_bell';

  constructor() {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('focus_sound_enabled');
      if (savedEnabled !== null) {
        this.enabled = savedEnabled === 'true';
      }
      const savedVol = localStorage.getItem('focus_sound_volume');
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol) || 0.8));
      }
      const savedTheme = localStorage.getItem('focus_sound_theme') as SoundTheme | null;
      if (savedTheme && ['zen_bell', 'marimba', 'classic_chime'].includes(savedTheme)) {
        this.theme = savedTheme;
      }
    }
  }

  // Ensure AudioContext is ready & unlocked on user interaction
  public unlockAudio(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isSoundEnabled(): boolean {
    return this.enabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('focus_sound_enabled', String(enabled));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('focus_sound_volume', String(this.volume));
  }

  public getTheme(): SoundTheme {
    return this.theme;
  }

  public setTheme(theme: SoundTheme): void {
    this.theme = theme;
    localStorage.setItem('focus_sound_theme', theme);
  }

  // Play a single harmonic musical note
  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainMult: number = 1
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm overtone for acoustic richness
    const overtone = ctx.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, startTime);

    const mainGain = ctx.createGain();
    const overtoneGain = ctx.createGain();

    const peakGain = Math.max(0.0001, this.volume * 0.35 * gainMult);

    // Envelope: quick gentle attack, long exponential decay
    mainGain.gain.setValueAtTime(0.0001, startTime);
    mainGain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.03);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    overtoneGain.gain.setValueAtTime(0.0001, startTime);
    overtoneGain.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

    osc.connect(mainGain);
    overtone.connect(overtoneGain);
    mainGain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);

    osc.start(startTime);
    overtone.start(startTime);
    osc.stop(startTime + duration + 0.05);
    overtone.stop(startTime + duration + 0.05);
  }

  /**
   * 1. Countdown finished / Focus session complete
   * Plays a soothing, celebratory multi-tone chime chord
   */
  public playCompletionChime(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.unlockAudio();
    const now = ctx.currentTime;

    if (this.theme === 'marimba') {
      // Crisp 4-note marimba arpeggio
      const notes = [
        { freq: 440.0, delay: 0.0, dur: 0.6 },  // A4
        { freq: 554.37, delay: 0.12, dur: 0.7 }, // C#5
        { freq: 659.25, delay: 0.24, dur: 0.8 }, // E5
        { freq: 880.0, delay: 0.38, dur: 1.5 },  // A5
      ];
      notes.forEach((n) => {
        this.playTone(n.freq, now + n.delay, n.dur, 'triangle', 1.1);
      });
    } else if (this.theme === 'classic_chime') {
      // Classic 2-tone doorbell / bell chime (Ding-dong)
      this.playTone(659.25, now, 0.9, 'sine', 1.0);       // E5
      this.playTone(523.25, now + 0.3, 1.8, 'sine', 1.2); // C5
    } else {
      // Default: 'zen_bell' - Serene Singing Bowl / Major chord arpeggio
      const notes = [
        { freq: 523.25, delay: 0.0, dur: 1.2, gain: 0.9 },   // C5
        { freq: 659.25, delay: 0.15, dur: 1.5, gain: 0.95 }, // E5
        { freq: 783.99, delay: 0.3, dur: 1.8, gain: 1.0 },   // G5
        { freq: 1046.5, delay: 0.45, dur: 2.5, gain: 1.2 },  // C6
      ];
      notes.forEach((n) => {
        this.playTone(n.freq, now + n.delay, n.dur, 'sine', n.gain);
      });
    }
  }

  /**
   * 2. Pomodoro cycle complete -> Break starts
   * Gentle reminder that work is done, time to rest
   */
  public playBreakChime(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.unlockAudio();
    const now = ctx.currentTime;
    // G4 -> C5
    this.playTone(392.0, now, 0.7, 'sine', 0.85);
    this.playTone(523.25, now + 0.22, 1.6, 'sine', 1.0);
  }

  /**
   * 3. Break finished -> Resume focus work
   * Encouraging ascending prompt to return to focus
   */
  public playResumeChime(): void {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.unlockAudio();
    const now = ctx.currentTime;
    // E5 -> G#5 -> B5
    this.playTone(659.25, now, 0.6, 'sine', 0.85);
    this.playTone(830.61, now + 0.16, 0.7, 'sine', 0.9);
    this.playTone(987.77, now + 0.32, 1.6, 'sine', 1.0);
  }

  /**
   * Preview current sound
   */
  public testCurrentSound(): void {
    this.playCompletionChime();
  }
}

export const soundManager = new SoundEffectsManager();
