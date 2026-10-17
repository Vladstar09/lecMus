/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Minus, Plus, Music } from 'lucide-react';
import { soundEngine } from '../../services/audioEngine';

interface MetronomeToolProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const MetronomeTool: React.FC<MetronomeToolProps> = ({ onClose, isModal = false }) => {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeSignature, setTimeSignature] = useState<[number, number]>([4, 4]);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tapTimesRef = useRef<number[]>([]);

  // Italian tempo markings
  const getTempoTerm = (tempo: number): string => {
    if (tempo < 60) return 'Largo (Muy lento y solemne)';
    if (tempo < 76) return 'Adagio (Lento y tranquilo)';
    if (tempo < 108) return 'Andante (Al paso, fluido)';
    if (tempo < 120) return 'Moderato (Moderado)';
    if (tempo < 168) return 'Allegro (Rápido y animado)';
    return 'Presto (Muy veloz)';
  };

  useEffect(() => {
    if (isPlaying) {
      const beatDuration = (60 / bpm) * 1000;
      let nextBeat = 1;

      const tick = () => {
        if (!isMuted) {
          soundEngine.playMetronomeTick(nextBeat === 1);
        }
        setCurrentBeat(nextBeat);
        nextBeat = nextBeat >= timeSignature[0] ? 1 : nextBeat + 1;
      };

      tick();
      timerRef.current = setInterval(tick, beatDuration);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setCurrentBeat(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isPlaying, bpm, timeSignature[0], timeSignature[1], isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTapTempo = () => {
    const now = performance.now();
    const taps = tapTimesRef.current.filter((t) => now - t < 3000);
    taps.push(now);
    tapTimesRef.current = taps;

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      const clampedBpm = Math.max(40, Math.min(220, calculatedBpm));
      setBpm(clampedBpm);
    }
  };

  const changeBpm = (delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(220, prev + delta)));
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#1D3557]/15 shadow-xl p-6 ${isModal ? 'max-w-md w-full mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-[#1D3557]">
          <Music className="w-5 h-5 text-[#E63946]" />
          <h3 className="font-bold text-lg">Metrónomo Profesional LecMus</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 rounded-md"
          >
            ✕
          </button>
        )}
      </div>

      {/* BPM Big Display */}
      <div className="py-6 text-center">
        <div className="text-6xl font-black tracking-tight text-[#1D3557] font-mono tabular-nums">
          {bpm}
        </div>
        <div className="text-xs font-semibold text-[#E63946] uppercase tracking-wider mt-1">
          Pulsos Por Minuto (BPM)
        </div>
        <div className="text-sm font-medium text-slate-500 mt-1">
          {getTempoTerm(bpm)}
        </div>
      </div>

      {/* Beat Dots indicator */}
      <div className="flex justify-center items-center gap-3 my-4">
        {Array.from({ length: timeSignature[0] }).map((_, index) => {
          const beatNum = index + 1;
          const isActive = currentBeat === beatNum && isPlaying;
          const isAccent = beatNum === 1;

          return (
            <div
              key={`dot-${beatNum}`}
              className={`w-4 h-4 rounded-full transition-all duration-100 ${
                isActive
                  ? isAccent
                    ? 'bg-[#E63946] scale-135 shadow-md shadow-[#E63946]/50'
                    : 'bg-[#1D3557] scale-125 shadow-sm shadow-[#1D3557]/40'
                  : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>

      {/* BPM Controls */}
      <div className="space-y-4">
        {/* Slider */}
        <input
          type="range"
          min="40"
          max="220"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E63946]"
        />

        {/* Quick adjustments */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeBpm(-5)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-[#1D3557] hover:bg-slate-50 active:bg-slate-100"
            >
              -5
            </button>
            <button
              onClick={() => changeBpm(-1)}
              className="p-1.5 rounded-lg border border-slate-200 text-[#1D3557] hover:bg-slate-50"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleTapTempo}
            className="px-4 py-1.5 rounded-lg border-2 border-dashed border-[#1D3557]/30 text-xs font-bold text-[#1D3557] hover:border-[#E63946] hover:text-[#E63946] active:scale-95 transition-all"
          >
            TAP TEMPO
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => changeBpm(1)}
              className="p-1.5 rounded-lg border border-slate-200 text-[#1D3557] hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => changeBpm(5)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-[#1D3557] hover:bg-slate-50 active:bg-slate-100"
            >
              +5
            </button>
          </div>
        </div>

        {/* Time Signature Selector */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-500 block mb-1.5">Compás</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: [2, 4], label: '2/4' },
              { val: [3, 4], label: '3/4' },
              { val: [4, 4], label: '4/4' },
              { val: [6, 8], label: '6/8' },
            ].map(({ val, label }) => {
              const isSelected = timeSignature[0] === val[0] && timeSignature[1] === val[1];
              return (
                <button
                  key={label}
                  onClick={() => setTimeSignature(val as [number, number])}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#1D3557] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 pt-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl border border-slate-200 text-[#1D3557] hover:bg-slate-50 transition-colors ${
              isMuted ? 'text-[#E63946]' : ''
            }`}
            title={isMuted ? 'Sonido silenciado' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            onClick={togglePlay}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              isPlaying
                ? 'bg-[#1D3557] hover:bg-[#1D3557]/90 active:scale-98'
                : 'bg-[#E63946] hover:bg-[#D62828] active:scale-98'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 fill-white" /> Detener Metrónomo
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Iniciar Metrónomo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
