/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../../services/audioEngine';

interface RhythmTapTrainerProps {
  tempoBpm?: number;
  timeSignature?: [number, number];
  targetBeats?: number[]; // Beats (1-indexed, e.g. [1, 2, 3, 4] or [1, 2.5, 3, 4])
  targetSyllables?: string[]; // e.g. ["Ta", "Ta", "Ti-Ti", "Ta"]
  onComplete?: (scorePercentage: number) => void;
  className?: string;
}

export const RhythmTapTrainer: React.FC<RhythmTapTrainerProps> = ({
  tempoBpm = 80,
  timeSignature = [4, 4],
  targetBeats = [1, 2, 3, 4],
  targetSyllables = ['Ta', 'Ta', 'Ta', 'Ta'],
  onComplete,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [cursorPercent, setCursorPercent] = useState<number>(0);
  const [tapAccuracyList, setTapAccuracyList] = useState<{ beatIndex: number; deltaMs: number; rating: string }[]>([]);
  const [lastFeedback, setLastFeedback] = useState<{ text: string; color: string } | null>(null);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);

  const totalBeats = timeSignature[0];
  const beatDurationMs = (60 / tempoBpm) * 1000;
  const loopDurationMs = totalBeats * beatDurationMs;

  const animationFrameRef = useRef<number | null>(null);
  const loopStartTimeRef = useRef<number>(0);
  const audioBeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentMeasureRef = useRef<number>(0);
  const userTapsRef = useRef<{ timestamp: number }[]>([]);

  // Start rhythm practice loop
  const startTrainer = () => {
    setIsPlaying(true);
    setRoundCompleted(false);
    setTapAccuracyList([]);
    setLastFeedback(null);
    userTapsRef.current = [];
    currentMeasureRef.current = 0;

    const startTimestamp = performance.now();
    loopStartTimeRef.current = startTimestamp;

    // Metronome tick scheduler
    let nextBeatNumber = 1;
    const scheduleBeats = () => {
      soundEngine.playMetronomeTick(nextBeatNumber === 1);
      setCurrentBeat(nextBeatNumber);
      nextBeatNumber = nextBeatNumber >= totalBeats ? 1 : nextBeatNumber + 1;
    };

    scheduleBeats();
    const intervalId = setInterval(scheduleBeats, beatDurationMs);
    audioBeatTimerRef.current = intervalId;

    // Smooth visual cursor
    const updateCursor = (now: number) => {
      const elapsed = (now - startTimestamp) % loopDurationMs;
      const pct = (elapsed / loopDurationMs) * 100;
      setCursorPercent(pct);

      animationFrameRef.current = requestAnimationFrame(updateCursor);
    };

    animationFrameRef.current = requestAnimationFrame(updateCursor);
  };

  const stopTrainer = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioBeatTimerRef.current) clearInterval(audioBeatTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      stopTrainer();
    };
  }, [stopTrainer]);

  // Handle tap
  const handleUserTap = () => {
    soundEngine.playNote('A4', 0.15); // Crisp tap click/wood percussion
    const now = performance.now();
    userTapsRef.current.push({ timestamp: now });

    // Calculate nearest target beat
    const elapsedInLoop = (now - loopStartTimeRef.current) % loopDurationMs;
    const currentLoopBeat = (elapsedInLoop / beatDurationMs) + 1;

    let closestTarget = targetBeats[0];
    let minDiff = Infinity;
    let targetIdx = 0;

    targetBeats.forEach((tBeat, idx) => {
      const diff = Math.abs(currentLoopBeat - tBeat);
      if (diff < minDiff) {
        minDiff = diff;
        closestTarget = tBeat;
        targetIdx = idx;
      }
    });

    const deltaMs = (currentLoopBeat - closestTarget) * beatDurationMs;
    let rating = '¡Perfecto!';
    let color = '#10B981';

    if (Math.abs(deltaMs) <= 65) {
      rating = '¡Excelente! Precisión perfecta';
      color = '#10B981';
    } else if (Math.abs(deltaMs) <= 130) {
      rating = deltaMs < 0 ? '¡Casi! Ligeramente temprano' : '¡Casi! Ligeramente tarde';
      color = '#1D3557';
    } else {
      rating = deltaMs < 0 ? 'Muy temprano' : 'Muy tarde';
      color = '#E63946';
    }

    setLastFeedback({ text: `${rating} (${deltaMs > 0 ? '+' : ''}${Math.round(deltaMs)}ms)`, color });
    const updated = [...tapAccuracyList, { beatIndex: targetIdx, deltaMs, rating }];
    setTapAccuracyList(updated);

    if (updated.length >= targetBeats.length) {
      // Evaluate result
      const perfectOrGood = updated.filter((item) => Math.abs(item.deltaMs) <= 130).length;
      const scorePct = Math.round((perfectOrGood / targetBeats.length) * 100);
      setRoundCompleted(true);
      stopTrainer();
      if (onComplete) {
        onComplete(scorePct);
      }
    }
  };

  // Keyboard Space listener for tapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          handleUserTap();
        } else {
          startTrainer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  return (
    <div className={`p-4 bg-white rounded-xl border border-[#1D3557]/15 shadow-sm ${className}`}>
      {/* Header controls & tempo */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-[#1D3557]/70 uppercase tracking-wider">Entrenador de Pulso y Tapping</span>
          <h4 className="text-sm font-bold text-[#1D3557]">Compás {timeSignature[0]}/{timeSignature[1]} · Tempo: {tempoBpm} BPM</h4>
        </div>
        <button
          onClick={isPlaying ? stopTrainer : startTrainer}
          className={`px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all shadow-sm ${
            isPlaying ? 'bg-[#1D3557] text-white hover:bg-[#1D3557]/90' : 'bg-[#E63946] text-white hover:bg-[#D62828]'
          }`}
        >
          {isPlaying ? 'Detener Ritmo' : 'Iniciar Metrónomo'}
        </button>
      </div>

      {/* Target Rhythm syllables display */}
      <div className="grid grid-cols-4 gap-2 mb-3 text-center">
        {targetBeats.map((beat, idx) => (
          <div
            key={`syllable-${idx}`}
            className={`p-2 rounded-lg border transition-all ${
              currentBeat === Math.floor(beat) && isPlaying
                ? 'bg-[#E63946]/10 border-[#E63946] text-[#E63946] font-extrabold scale-105'
                : 'bg-slate-50 border-slate-200 text-[#1D3557]'
            }`}
          >
            <div className="text-lg font-black">{targetSyllables[idx] || 'Ta'}</div>
            <div className="text-[11px] text-slate-500 font-medium">Pulso {beat}</div>
          </div>
        ))}
      </div>

      {/* Timeline track with cursor */}
      <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mb-4 flex items-center">
        {/* Beat tick marks */}
        {Array.from({ length: totalBeats }).map((_, idx) => (
          <div
            key={`track-tick-${idx}`}
            className="absolute top-0 bottom-0 border-l border-slate-300 flex items-center pl-1 text-[10px] text-slate-600 font-mono"
            style={{ left: `${(idx / totalBeats) * 100}%` }}
          >
            {idx + 1}
          </div>
        ))}

        {/* Playhead bar */}
        {isPlaying && (
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-[#E63946] shadow-sm z-10"
            style={{ left: `${cursorPercent}%` }}
          />
        )}
      </div>

      {/* Feedback message */}
      {lastFeedback && (
        <div
          className="text-center font-bold text-sm mb-3 py-1.5 rounded-lg transition-all"
          style={{ color: lastFeedback.color, backgroundColor: `${lastFeedback.color}15` }}
        >
          {lastFeedback.text}
        </div>
      )}

      {/* Large Interactive Tap Button */}
      <button
        onClick={isPlaying ? handleUserTap : startTrainer}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all transform active:scale-95 shadow-md flex flex-col items-center justify-center gap-1 ${
          isPlaying
            ? 'bg-[#E63946] hover:bg-[#D62828] text-white cursor-pointer active:ring-4 active:ring-[#E63946]/40'
            : 'bg-[#1D3557] hover:bg-[#1D3557]/90 text-white cursor-pointer'
        }`}
      >
        <span>{isPlaying ? '¡TOCA AQUÍ O PULSA ESPACIO AL RITMO!' : 'Presiona para Comenzar la Práctica'}</span>
        <span className="text-xs opacity-80 font-normal">
          {isPlaying ? `Toques registrados: ${tapAccuracyList.length} / ${targetBeats.length}` : 'Sigue los pulsos del metrónomo'}
        </span>
      </button>

      {roundCompleted && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-center text-sm font-semibold">
          ¡Ejercicio rítmico completado! Has entrenado tu sincronización temporal.
        </div>
      )}
    </div>
  );
};
