/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Flame, Star, Zap, CheckCircle2, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';
import { UserStats, UserLessonProgress } from '../../types/music';
import { BADGES_LIST, StorageService } from '../../services/storageService';

interface StatsAndBadgesViewProps {
  stats: UserStats;
  lessonsProgress: Record<string, UserLessonProgress>;
  onResetData: () => void;
}

export const StatsAndBadgesView: React.FC<StatsAndBadgesViewProps> = ({
  stats,
  lessonsProgress,
  onResetData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const completedCount = Object.values(lessonsProgress).filter((l) => l.completed).length;
  const totalStars = Object.values(lessonsProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const accuracyPct =
    stats.totalExercisesCompleted > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalExercisesCompleted) * 100)
      : 100;

  const unlockedBadgeIds = new Set(StorageService.getUnlockedBadges());

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-[#1D3557] to-[#0A192F] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#1D3557]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#1D3557] flex items-center justify-center text-3xl font-serif text-white shadow-md">
              𝄞
            </div>
            <div>
              <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
                Perfil de Estudiante
              </span>
              <h1 className="text-2xl font-black">Estadísticas y Logros</h1>
              <p className="text-xs text-slate-300 mt-1">
                Tu progreso y dominio en la lectura de la clave de sol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[11px] text-slate-300 block">Nivel Actual</span>
              <span className="text-lg font-black text-white">
                {completedCount < 10 ? 'Principiante' : completedCount < 50 ? 'Intermedio' : 'Solfeo Avanzado'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Award className="w-4 h-4 text-[#1D3557]" /> Lecciones
          </div>
          <div className="text-2xl font-black text-[#1D3557] font-mono tabular-nums mt-1">
            {completedCount} <span className="text-xs text-slate-600 font-sans font-medium">/ 120</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {Math.round((completedCount / 120) * 100)}% del plan
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Estrellas
          </div>
          <div className="text-2xl font-black text-amber-500 font-mono tabular-nums mt-1">
            {totalStars} <span className="text-xs text-slate-600 font-sans font-medium">/ 360</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Calidad de ejecución
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> Racha Diaria
          </div>
          <div className="text-2xl font-black text-orange-600 font-mono tabular-nums mt-1">
            {stats.currentStreak} <span className="text-xs text-slate-600 font-sans font-medium">días</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Constancia diaria
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Zap className="w-4 h-4 text-[#E63946]" /> Precisión
          </div>
          <div className="text-2xl font-black text-[#E63946] font-mono tabular-nums mt-1">
            {accuracyPct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {stats.totalCorrectAnswers} aciertos totales
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Medallas y Logros Musicales</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {unlockedBadgeIds.size} de {BADGES_LIST.length} desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = unlockedBadgeIds.has(badge.id) || badge.condition(stats, lessonsProgress);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                    isUnlocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-400 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-[#1D3557]">{badge.title}</h3>
                    {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  <span className="text-[10px] font-bold mt-1.5 block uppercase tracking-wider text-slate-600">
                    {isUnlocked ? 'Completado' : 'Por desbloquear'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset progress area */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-700">Restablecer datos locales</h4>
          <p className="text-xs text-slate-500">
            Borra las lecciones completadas y reinicia el progreso a cero.
          </p>
        </div>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 border border-rose-200 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Progreso</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> ¿Seguro?
            </span>
            <button
              onClick={() => {
                onResetData();
                setShowConfirmReset(false);
              }}
              className="px-3 py-1.5 bg-[#E63946] text-white text-xs font-bold rounded-lg hover:bg-[#D62828]"
            >
              Sí, borrar
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
