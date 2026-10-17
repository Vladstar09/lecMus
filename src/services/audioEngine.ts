/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pitch frequencies in Hertz (Standard A4 = 440 Hz)
export const NOTE_FREQUENCIES: Record<string, number> = {
  // Octave 3
  C3: 130.81,
  'C#3': 138.59,
  Db3: 138.59,
  D3: 146.83,
  'D#3': 155.56,
  Eb3: 155.56,
  E3: 164.81,
  F3: 174.61,
  'F#3': 185.0,
  Gb3: 185.0,
  G3: 196.0,
  'G#3': 207.65,
  Ab3: 207.65,
  A3: 220.0,
  'A#3': 233.08,
  Bb3: 233.08,
  B3: 246.94,

  // Octave 4 (Middle C)
  C4: 261.63,
  'C#4': 277.18,
  Db4: 277.18,
  D4: 293.66,
  'D#4': 311.13,
  Eb4: 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  Gb4: 369.99,
  G4: 392.0,
  'G#4': 415.3,
  Ab4: 415.3,
  A4: 440.0,
  'A#4': 466.16,
  Bb4: 466.16,
  B4: 493.88,

  // Octave 5
  C5: 523.25,
  'C#5': 554.37,
  Db5: 554.37,
  D5: 587.33,
  'D#5': 622.25,
  Eb5: 622.25,
  E5: 659.25,
  F5: 698.46,
  'F#5': 739.99,
  Gb5: 739.99,
  G5: 783.99,
  'G#5': 830.61,
  Ab5: 830.61,
  A5: 880.0,
  'A#5': 932.33,
  Bb5: 932.33,
  B5: 987.77,

  // Octave 6
  C6: 1046.5,
  D6: 1174.66,
  E6: 1318.51,
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.8;
  private timbre: 'piano' | 'synth' | 'chime' = 'piano';

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setTimbre(timbre: 'piano' | 'synth' | 'chime') {
    this.timbre = timbre;
  }

  public playNote(pitch: string, durationSec: number = 0.8, startTimeOffset: number = 0) {
    try {
      const ctx = this.initContext();
      const freq = NOTE_FREQUENCIES[pitch];
      if (!freq || !this.masterGain) return;

      const now = ctx.currentTime + startTimeOffset;

      if (this.timbre === 'piano') {
        this.playPianoVoice(ctx, freq, now, durationSec);
      } else if (this.timbre === 'chime') {
        this.playChimeVoice(ctx, freq, now, durationSec);
      } else {
        this.playSynthVoice(ctx, freq, now, durationSec);
      }
    } catch (err) {
      console.warn('Audio playback not allowed or failed:', err);
    }
  }

  private playPianoVoice(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    if (!this.masterGain) return;

    // Rich piano voice: fundamental + 2nd harmonic + 3rd harmonic
    const harmonics = [
      { ratio: 1, gain: 0.75, type: 'triangle' as OscillatorType },
      { ratio: 2, gain: 0.25, type: 'sine' as OscillatorType },
      { ratio: 3, gain: 0.1, type: 'sine' as OscillatorType },
    ];

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, startTime);
    // Fast attack
    voiceGain.gain.exponentialRampToValueAtTime(0.85, startTime + 0.02);
    // Decay to sustain
    voiceGain.gain.exponentialRampToValueAtTime(0.4, startTime + 0.25);
    // Release
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    voiceGain.connect(this.masterGain);

    harmonics.forEach(({ ratio, gain, type }) => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * ratio, startTime);
      hGain.gain.setValueAtTime(gain, startTime);
      osc.connect(hGain);
      hGain.connect(voiceGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  private playSynthVoice(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.4, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private playChimeVoice(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.7, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration * 1.5 + 0.05);
  }

  public playMetronomeTick(isDownbeat: boolean = false) {
    try {
      const ctx = this.initContext();
      if (!this.masterGain) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // Crisp woodblock click
      osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, now);
      osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 400 : 300, now + 0.04);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(isDownbeat ? 0.9 : 0.6, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (err) {
      console.warn('Metronome tick error', err);
    }
  }

  public playSuccessSound() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      // Bright major triad (C5, E5, G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.4, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        if (this.masterGain) {
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        }
      });
    } catch {
      // Audio might be muted
    }
  }

  public playErrorSound() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      // Soft minor chime / low buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      if (this.masterGain) {
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // Audio might be muted
    }
  }

  public playLevelUpSound() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      // Joyful fanfare: C5, G4, C5, E5, G5, C6
      const fanfare = [
        { freq: 523.25, time: 0, dur: 0.12 },
        { freq: 392.0, time: 0.12, dur: 0.12 },
        { freq: 523.25, time: 0.24, dur: 0.12 },
        { freq: 659.25, time: 0.36, dur: 0.18 },
        { freq: 783.99, time: 0.54, dur: 0.22 },
        { freq: 1046.5, time: 0.76, dur: 0.6 },
      ];

      fanfare.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now + time);
        gain.gain.linearRampToValueAtTime(0.45, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        if (this.masterGain) {
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now + time);
          osc.stop(now + time + dur + 0.05);
        }
      });
    } catch {
      // Audio might be muted
    }
  }

  public playRhythmSequence(notes: { pitch?: string; durationBeats: number }[], bpm: number = 90, onProgress?: (idx: number) => void) {
    try {
      const ctx = this.initContext();
      const beatSec = 60 / bpm;
      let curTime = ctx.currentTime + 0.1;

      notes.forEach((item, index) => {
        const itemPitch = item.pitch || 'A4';
        const itemSec = item.durationBeats * beatSec;
        const noteStart = curTime;

        if (onProgress) {
          setTimeout(() => {
            onProgress(index);
          }, (noteStart - ctx.currentTime) * 1000);
        }

        this.playNote(itemPitch, itemSec * 0.9, noteStart - ctx.currentTime);
        curTime += itemSec;
      });
    } catch (err) {
      console.warn('Rhythm sequence error:', err);
    }
  }
}

export const soundEngine = new AudioEngine();
