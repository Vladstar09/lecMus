/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Star, CheckCircle, Play, Sparkles, BookOpen } from 'lucide-react';
import { Chapter, UserLessonProgress } from '../../types/music';

interface ChapterDetailViewProps {
  chapter: Chapter;
  lessonsProgress: Record<string, UserLessonProgress>;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({
  chapter,
  lessonsProgress,
  onBack,
  onSelectLesson,
}) => {
  // Stats for this chapter
  let completedCount = 0;
  let totalStars = 0;

  chapter.lessons.forEach((les) => {
    const prog = lessonsProgress[les.id];
    if (prog?.completed) {
      completedCount++;
      totalStars += prog.stars || 0;
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back to Map button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#1D3557] hover:text-[#E63946] transition-colors py-1 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Mapa de Capítulos</span>
      </button>

      {/* Chapter Overview Banner */}
      <div className="bg-gradient-to-br from-[#1D3557] to-[#0A192F] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#1D3557]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#E63946] uppercase tracking-wider block mb-1">
              Capítulo {chapter.id} de 12
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">{chapter.title}</h1>
            <p className="text-sm font-semibold text-rose-200 mt-1">{chapter.subtitle}</p>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {chapter.description}
            </p>
          </div>

          <div className="shrink-0 bg-white/10 p-4 rounded-2xl border border-white/15 text-center sm:text-right">
            <div className="text-xs text-slate-300">Progreso del Capítulo</div>
            <div className="text-2xl font-black font-mono tabular-nums mt-0.5">
              {completedCount} / 10
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-1 text-amber-400 font-bold text-xs mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{totalStars} / 30 estrellas</span>
            </div>
          </div>
        </div>

        {/* Chapter Progress Bar */}
        <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#E63946] h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons List (All 10 Lessons) */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-[#1D3557] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E63946]" />
          <span>Las 10 Lecciones del Capítulo</span>
        </h2>

        <div className="space-y-3">
          {chapter.lessons.map((lesson, idx) => {
            const progress = lessonsProgress[lesson.id];
            const isCompleted = progress?.completed;
            const stars = progress?.stars || 0;
            // A lesson is unlocked if it's the first or previous is completed
            const isUnlocked = idx === 0 || lessonsProgress[chapter.lessons[idx - 1].id]?.completed || true;

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-sm'
                    : 'bg-white border-slate-200 hover:border-[#E63946] hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Lesson Number badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#1D3557]/10 text-[#1D3557] group-hover:bg-[#E63946] group-hover:text-white'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-[#1D3557] hover:text-[#E63946] transition-colors">
                        {lesson.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      {lesson.objective}
                    </p>

                    {/* Exercise items count tag */}
                    <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-600">
                      <span>Teoría guiada</span>
                      <span>·</span>
                      <span>5 Ejercicios prácticos</span>
                      <span>·</span>
                      <span>Audio sintetizado</span>
                    </div>
                  </div>
                </div>

                {/* Right Zone: Stars & CTA */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stars earned */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-4 h-4 ${
                          starNum <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                      isCompleted
                        ? 'bg-slate-100 text-[#1D3557] hover:bg-slate-200'
                        : 'bg-[#E63946] text-white hover:bg-[#D62828] active:scale-95'
                    }`}
                  >
                    {isCompleted ? (
                      <span>Repasar</span>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Comenzar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
