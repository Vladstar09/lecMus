/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, CheckCircle2, Star, Sparkles, BookOpen, ChevronRight, Award } from 'lucide-react';
import { Chapter, UserLessonProgress, UserStats } from '../../types/music';

interface ChapterMapViewProps {
  chapters: Chapter[];
  lessonsProgress: Record<string, UserLessonProgress>;
  stats: UserStats;
  onSelectChapter: (chapterId: number) => void;
  onStartLesson: (lessonId: string) => void;
  onOpenSightReading: () => void;
}

export const ChapterMapView: React.FC<ChapterMapViewProps> = ({
  chapters,
  lessonsProgress,
  stats,
  onSelectChapter,
  onStartLesson,
  onOpenSightReading,
}) => {
  // Compute global progress
  const totalLessons = chapters.length * 10;
  const completedLessonsCount = Object.values(lessonsProgress).filter((l) => l.completed).length;
  const totalStarsEarned = Object.values(lessonsProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const globalProgressPercent = Math.round((completedLessonsCount / totalLessons) * 100);

  // Find next unfinished lesson
  let nextLessonToResume: string = 'c1-l1';
  let nextLessonTitle: string = '1.1 ¿Qué es el pentagrama?';

  for (const ch of chapters) {
    let found = false;
    for (const les of ch.lessons) {
      if (!lessonsProgress[les.id]?.completed) {
        nextLessonToResume = les.id;
        nextLessonTitle = les.title;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Learning Deck */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3557] via-[#10243E] to-[#0A192F] text-white p-6 sm:p-8 shadow-xl border border-[#1D3557]/30">
        {/* Subtle background musical clef watermark */}
        <div className="absolute -right-8 -bottom-16 text-[220px] font-serif opacity-5 select-none pointer-events-none">
          𝄞
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold text-rose-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
            <span>Método Integral de Lectura en Clave de Sol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Aprende a leer partituras desde <span className="text-[#E63946]">cero</span> hasta el solfeo completo.
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            12 capítulos secuenciales con 120 lecciones interactivas, entrenamiento auditivo con piano real,
            metrónomo de precisión y tapping rítmico.
          </p>

          {/* Quick resume card */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartLesson(nextLessonToResume)}
              className="px-6 py-3.5 rounded-xl bg-[#E63946] hover:bg-[#D62828] text-white font-extrabold text-sm shadow-lg shadow-[#E63946]/30 transition-all flex items-center gap-2.5 active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continuar: {nextLessonTitle}</span>
            </button>

            <button
              onClick={onOpenSightReading}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Desafío a Primera Vista</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Progreso Global
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
              {globalProgressPercent}%
            </span>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#E63946] h-full rounded-full transition-all duration-500"
                style={{ width: `${globalProgressPercent}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Lecciones Completadas
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
              {completedLessonsCount} / {totalLessons}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">10 por capítulo</span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Estrellas Obtenidas
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-amber-400 flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              {totalStarsEarned} / {totalLessons * 3}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Precisión de aciertos</span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
              Puntos de Solfeo
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-rose-300">
              {stats.totalXp} XP
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Racha: {stats.currentStreak} días</span>
          </div>
        </div>
      </section>

      {/* Chapters Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-black text-[#1D3557]">Mapa de Ruta Curricular</h2>
          <p className="text-xs text-slate-500">
            Avanza capítulo a capítulo desbloqueando el lenguaje musical de manera pedagógica y natural.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#1D3557] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
          12 Capítulos · 120 Lecciones Totales
        </div>
      </div>

      {/* 12 Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => {
          // Calculate chapter statistics
          let chapterCompletedCount = 0;
          let chapterStars = 0;

          chapter.lessons.forEach((les) => {
            const prog = lessonsProgress[les.id];
            if (prog?.completed) {
              chapterCompletedCount++;
              chapterStars += prog.stars || 0;
            }
          });

          const chapterPct = Math.round((chapterCompletedCount / 10) * 100);
          const isFullyCompleted = chapterCompletedCount === 10;
          const isInProgress = chapterCompletedCount > 0 && !isFullyCompleted;

          return (
            <div
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className="group bg-white rounded-2xl border border-[#1D3557]/15 hover:border-[#E63946] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isFullyCompleted
                    ? 'bg-emerald-500'
                    : isInProgress
                    ? 'bg-[#E63946]'
                    : 'bg-slate-200'
                }`}
              />

              <div>
                {/* Chapter badge and status */}
                <div className="flex items-center justify-between gap-2 mb-2 pt-1">
                  <span className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider">
                    Capítulo {chapter.id}
                  </span>
                  {isFullyCompleted ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                    </span>
                  ) : isInProgress ? (
                    <span className="text-[11px] font-bold text-[#E63946] bg-rose-50 px-2 py-0.5 rounded-md">
                      En curso ({chapterCompletedCount}/10)
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-500">
                      10 lecciones
                    </span>
                  )}
                </div>

                {/* Chapter Title */}
                <h3 className="font-extrabold text-base text-[#1D3557] group-hover:text-[#E63946] transition-colors leading-snug">
                  {chapter.title}
                </h3>
                <div className="text-xs font-bold text-slate-500 mt-0.5">
                  {chapter.subtitle}
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {chapter.description}
                </p>

                {/* 10 Mini dots indicator */}
                <div className="flex items-center gap-1.5 my-4">
                  {chapter.lessons.map((les, idx) => {
                    const isLesCompleted = lessonsProgress[les.id]?.completed;
                    const stars = lessonsProgress[les.id]?.stars || 0;

                    return (
                      <div
                        key={les.id}
                        title={`Lección ${idx + 1}: ${les.title} (${stars} estrellas)`}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          isLesCompleted
                            ? stars === 3
                              ? 'bg-amber-400'
                              : 'bg-[#E63946]'
                            : 'bg-slate-200'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Progress bar & action button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-slate-700 font-mono tabular-nums">{chapterStars} / 30</span>
                </div>

                <button className="text-xs font-extrabold text-[#1D3557] group-hover:text-[#E63946] flex items-center gap-1 transition-colors">
                  <span>{isFullyCompleted ? 'Repasar' : 'Abrir lecciones'}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
