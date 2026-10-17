/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Play, RotateCcw, Volume2, Award, ChevronRight } from 'lucide-react';
import { MusicStave } from './MusicStave';
import { NoteName, PitchName, StaveNote } from '../../types/music';
import { soundEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';

type PoolLevel = 'lines' | 'spaces' | 'octave' | 'full';

const POOL_PRESETS: Record<PoolLevel, { label: string; desc: string; pitches: { pitch: PitchName; name: NoteName }[] }> = {
  lines: {
    label: 'Solo Líneas',
    desc: 'Mi4, Sol4, Si4, Re5, Fa5',
    pitches: [
      { pitch: 'E4', name: 'Mi' },
      { pitch: 'G4', name: 'Sol' },
      { pitch: 'B4', name: 'Si' },
      { pitch: 'D5', name: 'Re' },
      { pitch: 'F5', name: 'Fa' },
    ],
  },
  spaces: {
    label: 'Solo Espacios',
    desc: 'Fa4, La4, Do5, Mi5',
    pitches: [
      { pitch: 'F4', name: 'Fa' },
      { pitch: 'A4', name: 'La' },
      { pitch: 'C5', name: 'Do' },
      { pitch: 'E5', name: 'Mi' },
    ],
  },
  octave: {
    label: 'Líneas y Espacios',
    desc: 'Do4 central hasta Do5',
    pitches: [
      { pitch: 'C4', name: 'Do' },
      { pitch: 'D4', name: 'Re' },
      { pitch: 'E4', name: 'Mi' },
      { pitch: 'F4', name: 'Fa' },
      { pitch: 'G4', name: 'Sol' },
      { pitch: 'A4', name: 'La' },
      { pitch: 'B4', name: 'Si' },
      { pitch: 'C5', name: 'Do' },
    ],
  },
  full: {
    label: 'Rango Completo',
    desc: 'Incluye líneas adicionales (La3 - Sol5)',
    pitches: [
      { pitch: 'A3', name: 'La' },
      { pitch: 'B3', name: 'Si' },
      { pitch: 'C4', name: 'Do' },
      { pitch: 'D4', name: 'Re' },
      { pitch: 'E4', name: 'Mi' },
      { pitch: 'F4', name: 'Fa' },
      { pitch: 'G4', name: 'Sol' },
      { pitch: 'A4', name: 'La' },
      { pitch: 'B4', name: 'Si' },
      { pitch: 'C5', name: 'Do' },
      { pitch: 'D5', name: 'Re' },
      { pitch: 'E5', name: 'Mi' },
      { pitch: 'F5', name: 'Fa' },
      { pitch: 'G5', name: 'Sol' },
      { pitch: 'A5', name: 'La' },
    ],
  },
};

const NOTE_OPTIONS: NoteName[] = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

export const SightReadingTrainer: React.FC = () => {
  const [level, setLevel] = useState<PoolLevel>('octave');
  const [durationSec, setDurationSec] = useState<number>(45);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentNote, setCurrentNote] = useState<{ pitch: PitchName; name: NoteName } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stats = StorageService.getStats();
    setHighScore(stats.sightReadingHighScore);
  }, []);

  const getRandomNote = (lvl: PoolLevel) => {
    const list = POOL_PRESETS[lvl].pitches;
    const randomIdx = Math.floor(Math.random() * list.length);
    return list[randomIdx];
  };

  const startGame = () => {
    setIsActive(true);
    setGameFinished(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(durationSec);

    const firstNote = getRandomNote(level);
    setCurrentNote(firstNote);
    soundEngine.playNote(firstNote.pitch, 0.4);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setIsActive(false);
    setGameFinished(true);
    soundEngine.playLevelUpSound();

    setScore((finalScore) => {
      StorageService.recordSightReadingScore(finalScore);
      const currentBest = StorageService.getStats().sightReadingHighScore;
      setHighScore(currentBest);

      if (finalScore > highScore && finalScore > 5) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E63946', '#1D3557', '#F1FAEE'],
        });
      }
      return finalScore;
    });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectNote = (selectedName: NoteName) => {
    if (!isActive || !currentNote) return;

    if (selectedName === currentNote.name) {
      // Correct!
      soundEngine.playNote(currentNote.pitch, 0.5);
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setFeedback('correct');

      // Next note
      let nextNote = getRandomNote(level);
      while (nextNote.pitch === currentNote.pitch && POOL_PRESETS[level].pitches.length > 1) {
        nextNote = getRandomNote(level);
      }
      setCurrentNote(nextNote);
    } else {
      // Incorrect
      soundEngine.playErrorSound();
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
    }, 250);
  };

  const staveNotes: StaveNote[] = useMemo(() => {
    return currentNote
      ? [{ pitch: currentNote.pitch, name: currentNote.name, octave: 4, duration: 'quarter' }]
      : [];
  }, [currentNote?.pitch, currentNote?.name]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1D3557] to-[#0A192F] text-white p-6 rounded-2xl shadow-md border border-[#1D3557]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#E63946] uppercase tracking-wider">
              <Zap className="w-4 h-4 text-[#E63946]" /> Modo Velocidad
            </div>
            <h2 className="text-2xl font-black mt-1">Lectura a Primera Vista</h2>
            <p className="text-xs text-slate-300 mt-1">
              Identifica las notas en el pentagrama antes de que se agote el tiempo.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <div className="text-center">
              <div className="text-xs text-slate-300">Récord Personal</div>
              <div className="text-xl font-black text-amber-400 font-mono tabular-nums">{highScore} pts</div>
            </div>
          </div>
        </div>
      </div>

      {!isActive && !gameFinished ? (
        /* Configuration Screen */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              1. Selecciona la Dificultad / Grupo de Notas
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(POOL_PRESETS) as PoolLevel[]).map((key) => {
                const item = POOL_PRESETS[key];
                const isSelected = level === key;
                return (
                  <button
                    key={key}
                    onClick={() => setLevel(key)}
                    className={`p-3.5 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#E63946] bg-[#E63946]/5 ring-1 ring-[#E63946]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-[#1D3557] flex items-center justify-between">
                      {item.label}
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#E63946]"></span>}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              2. Duración de la Sesión
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[30, 45, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setDurationSec(sec);
                    setTimeLeft(sec);
                  }}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                    durationSec === sec
                      ? 'bg-[#1D3557] text-white border-[#1D3557]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sec} Segundos
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-[#E63946] hover:bg-[#D62828] text-white font-bold rounded-xl text-base shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-5 h-5 fill-white" />
            ¡Comenzar Desafío!
          </button>
        </div>
      ) : (
        /* Active Game or Summary Screen */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Active Status bar */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-[#E63946] animate-pulse' : 'text-[#1D3557]'}`} />
              <span className="font-mono text-xl font-black tabular-nums text-[#1D3557]">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block uppercase font-bold">Aciertos</span>
                <span className="text-xl font-black text-[#1D3557] font-mono tabular-nums">{score}</span>
              </div>
              {streak > 1 && (
                <div className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2 py-1 rounded-md">
                  x{streak} Racha
                </div>
              )}
            </div>
          </div>

          {/* Stave Display */}
          <div
            className={`transition-all rounded-xl p-2 ${
              feedback === 'correct'
                ? 'bg-emerald-50 ring-2 ring-emerald-500'
                : feedback === 'wrong'
                ? 'bg-rose-50 ring-2 ring-[#E63946]'
                : 'bg-white'
            }`}
          >
            <MusicStave
              notes={staveNotes}
              width={540}
              height={160}
              showLabels={false}
            />
          </div>

          {/* Note Option Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Elige la nota correspondiente:</span>
              {currentNote && (
                <button
                  onClick={() => soundEngine.playNote(currentNote.pitch, 0.6)}
                  className="text-[#1D3557] hover:text-[#E63946] flex items-center gap-1 font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Escuchar de nuevo
                </button>
              )}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {NOTE_OPTIONS.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelectNote(name)}
                  disabled={!isActive}
                  className="py-3.5 rounded-xl font-extrabold text-base bg-slate-50 border border-slate-200 text-[#1D3557] hover:bg-[#1D3557] hover:text-white active:scale-95 transition-all shadow-sm"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Game Over modal / summary */}
          {gameFinished && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <div>
                <h3 className="text-xl font-extrabold text-[#1D3557]">¡Tiempo agotado!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Lograste <strong className="text-[#E63946] font-bold text-base">{score} notas correctas</strong> en {durationSec} segundos.
                </p>
                <div className="text-xs font-semibold text-emerald-700 mt-2">
                  +{score * 3} XP añadidos a tu perfil musical.
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={startGame}
                  className="px-5 py-2.5 bg-[#E63946] text-white font-bold text-xs rounded-xl hover:bg-[#D62828] transition-all flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Intentar de nuevo
                </button>
                <button
                  onClick={() => {
                    setIsActive(false);
                    setGameFinished(false);
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-[#1D3557] font-bold text-xs rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                  Cambiar nivel <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
