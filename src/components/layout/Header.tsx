/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Award, Sliders, Music, Zap, BookOpen } from 'lucide-react';
import { UserStats } from '../../types/music';

interface HeaderProps {
  currentView: 'chapters' | 'chapter-detail' | 'lesson' | 'sight-reading' | 'stats';
  onNavigate: (view: 'chapters' | 'sight-reading' | 'stats') => void;
  onOpenMetronome: () => void;
  onOpenSettings: () => void;
  stats: UserStats;
  onContinueLearning: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenMetronome,
  onOpenSettings,
  stats,
  onContinueLearning,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#1D3557]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => onNavigate('chapters')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#1D3557] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            <span>𝄞</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#1D3557] leading-none">
              Lec<span className="text-[#E63946]">Mus</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-600 tracking-wider">
              Lectura Musical y Solfeo
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#1D3557]/80">
          <button
            onClick={() => onNavigate('chapters')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'chapters' || currentView === 'chapter-detail' || currentView === 'lesson'
                ? 'text-[#E63946] font-bold border-b-2 border-[#E63946]'
                : 'hover:text-[#1D3557]'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Capítulos
          </button>

          <button
            onClick={() => onNavigate('sight-reading')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'sight-reading'
                ? 'text-[#E63946] font-bold border-b-2 border-[#E63946]'
                : 'hover:text-[#1D3557]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" /> Lectura Rápida
          </button>

          <button
            onClick={onOpenMetronome}
            className="whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#E63946] flex items-center gap-1.5"
          >
            <Music className="w-4 h-4 text-[#1D3557]" /> Metrónomo
          </button>

          <button
            onClick={() => onNavigate('stats')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              currentView === 'stats'
                ? 'text-[#E63946] font-bold border-b-2 border-[#E63946]'
                : 'hover:text-[#1D3557]'
            }`}
          >
            <Award className="w-4 h-4" /> Estadísticas
          </button>
        </nav>

        {/* Zone 3: Metrics & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak indicator */}
          <div
            title={`Racha actual: ${stats.currentStreak} días consecutivos`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold font-mono tabular-nums select-none"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{stats.currentStreak}d</span>
          </div>

          {/* XP points */}
          <div
            title={`Experiencia total: ${stats.totalXp} XP`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#1D3557] text-xs font-bold font-mono tabular-nums select-none"
          >
            <span>✨</span>
            <span>{stats.totalXp} XP</span>
          </div>

          {/* Settings icon */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-500 hover:text-[#1D3557] hover:bg-slate-100 transition-colors"
            title="Ajustes de sonido y visualización"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onContinueLearning}
            className="px-4 py-2 text-xs font-bold text-white bg-[#E63946] rounded-xl hover:bg-[#D62828] active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continuar</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 px-2 bg-slate-50 text-xs font-semibold text-slate-700">
        <button
          onClick={() => onNavigate('chapters')}
          className={`flex items-center gap-1 ${
            currentView === 'chapters' || currentView === 'chapter-detail' || currentView === 'lesson'
              ? 'text-[#E63946] font-bold'
              : ''
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Lecciones
        </button>
        <button
          onClick={() => onNavigate('sight-reading')}
          className={`flex items-center gap-1 ${currentView === 'sight-reading' ? 'text-[#E63946] font-bold' : ''}`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Velocidad
        </button>
        <button onClick={onOpenMetronome} className="flex items-center gap-1">
          <Music className="w-3.5 h-3.5" /> Metrónomo
        </button>
        <button
          onClick={() => onNavigate('stats')}
          className={`flex items-center gap-1 ${currentView === 'stats' ? 'text-[#E63946] font-bold' : ''}`}
        >
          <Award className="w-3.5 h-3.5" /> Perfil
        </button>
      </div>
    </header>
  );
};
