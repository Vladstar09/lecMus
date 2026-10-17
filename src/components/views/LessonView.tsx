/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Mic,
  MicOff,
  RotateCcw,
} from 'lucide-react';
import { Lesson, PitchName } from '../../types/music';
import { MusicStave } from '../music/MusicStave';
import { RhythmTapTrainer } from '../music/RhythmTapTrainer';
import { soundEngine } from '../../services/audioEngine';
import { StorageService } from '../../services/storageService';

interface LessonViewProps {
  lesson: Lesson;
  onBackToChapter: () => void;
  onNextLesson?: () => void;
  onRestartLesson?: () => void;
}

type StepMode = 'theory' | 'guided' | 'exercise' | 'completed';

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onBackToChapter,
  onNextLesson,
  onRestartLesson,
}) => {
  const [stepMode, setStepMode] = useState<StepMode>('theory');
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [activeGuidedNoteIndex, setActiveGuidedNoteIndex] = useState<number>(-1);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');
  const [showSuccessPulse, setShowSuccessPulse] = useState<boolean>(false);

  // Subtle celebration confetti burst with LecMus palette for individual correct exercise
  const triggerItemSuccessConfetti = () => {
    confetti({
      particleCount: 35,
      spread: 55,
      startVelocity: 24,
      origin: { y: 0.65 },
      colors: ['#E63946', '#1D3557', '#F59E0B', '#FFFFFF'],
      scalar: 0.85,
      ticks: 110,
    });
  };

  const currentExercise = lesson.exercises[currentExerciseIdx];
  const totalExercises = lesson.exercises.length;

  // Reset exercise states when lesson changes
  useEffect(() => {
    setStepMode('theory');
    setCurrentExerciseIdx(0);
    setUserSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setScoreCount(0);
    setEarnedStars(0);
  }, [lesson.id]);

  // Handle Speech Recognition for voice solfege
  useEffect(() => {
    let recognition: any = null;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListeningMic && SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.trim().toLowerCase();
          setSpeechFeedback(`Voz detectada: "${transcript}"`);

          // Match note name or syllable
          const noteNames = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
          for (const n of noteNames) {
            if (transcript.includes(n)) {
              const capitalized = n.charAt(0).toUpperCase() + n.slice(1);
              handleOptionSelect(capitalized);
              break;
            }
          }

          // Match rhythm syllables
          if (transcript.includes('ta') || transcript.includes('ti')) {
            handleOptionSelect('Ta');
          }
          setIsListeningMic(false);
        };

        recognition.onerror = () => {
          setIsListeningMic(false);
        };

        recognition.onend = () => {
          setIsListeningMic(false);
        };

        recognition.start();
      } catch (e) {
        console.warn('Speech recognition not supported:', e);
        setIsListeningMic(false);
      }
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [isListeningMic]);

  // Audio playback for guided example
  const playGuidedExample = () => {
    soundEngine.playRhythmSequence(
      lesson.guidedExample.notes.map((n) => ({ pitch: n.pitch, durationBeats: 1 })),
      80,
      (idx) => setActiveGuidedNoteIndex(idx)
    );
  };

  // Option selection
  const handleOptionSelect = (optionValue: string) => {
    if (isAnswerSubmitted) return;
    setUserSelectedAnswer(optionValue);
    validateAnswer(optionValue);
  };

  // Interactive stave click validation
  const handleStaveClickSelect = (pitch: PitchName, noteName: string) => {
    if (stepMode !== 'exercise' || isAnswerSubmitted) return;

    if (currentExercise.type === 'stave-click') {
      const isTargetPitch = currentExercise.targetNote?.pitch
        ? currentExercise.targetNote.pitch === pitch
        : currentExercise.targetNote?.name === noteName;

      setUserSelectedAnswer(noteName);
      if (isTargetPitch) {
        markAnswer(true, noteName);
      } else {
        markAnswer(false, noteName);
      }
    }
  };

  const validateAnswer = (answer: string) => {
    const isCorrect = answer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    markAnswer(isCorrect, answer);
  };

  const markAnswer = (isCorrect: boolean, answer: string) => {
    setIsAnswerSubmitted(true);
    setIsAnswerCorrect(isCorrect);
    setUserSelectedAnswer(answer);

    if (isCorrect) {
      soundEngine.playSuccessSound();
      setScoreCount((prev) => prev + 1);
      triggerItemSuccessConfetti();
      setShowSuccessPulse(true);
      setTimeout(() => setShowSuccessPulse(false), 850);
    } else {
      soundEngine.playErrorSound();
    }
  };

  // Proceed to next question or complete lesson
  const handleNextStep = () => {
    if (stepMode === 'theory') {
      setStepMode('guided');
      playGuidedExample();
    } else if (stepMode === 'guided') {
      setStepMode('exercise');
      setCurrentExerciseIdx(0);
      resetQuestionState();
    } else if (stepMode === 'exercise') {
      if (currentExerciseIdx < totalExercises - 1) {
        setCurrentExerciseIdx((prev) => prev + 1);
        resetQuestionState();
      } else {
        // Finished all exercises!
        finishLesson();
      }
    }
  };

  const resetQuestionState = () => {
    setUserSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(null);
    setSpeechFeedback('');
    setShowSuccessPulse(false);
  };

  const finishLesson = () => {
    const finalScore = scoreCount + (isAnswerCorrect ? 0 : 0); // scoreCount already updated
    let stars = 1;
    if (finalScore >= 5) stars = 3;
    else if (finalScore >= 4) stars = 2;

    setEarnedStars(stars);
    setStepMode('completed');
    soundEngine.playLevelUpSound();

    // Save progress and XP
    const xpGained = stars * 15;
    StorageService.saveLessonProgress(lesson.id, stars, finalScore, xpGained);

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E63946', '#1D3557', '#F1FAEE', '#F59E0B'],
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToChapter}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D3557] hover:text-[#E63946] transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Capítulo {lesson.chapterId}</span>
        </button>

        {/* Phase Progress Indicators */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              stepMode === 'theory' ? 'bg-[#E63946] text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            1. Teoría
          </div>
          <div
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              stepMode === 'guided' ? 'bg-[#E63946] text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            2. Ejemplo
          </div>
          <div
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              stepMode === 'exercise' ? 'bg-[#E63946] text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            3. Práctica {stepMode === 'exercise' ? `(${currentExerciseIdx + 1}/${totalExercises})` : ''}
          </div>
        </div>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#E63946] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lección {lesson.lessonNumber} de 10 · Capítulo {lesson.chapterId}</span>
        </div>
        <h1 className="text-2xl font-black text-[#1D3557] mt-1">{lesson.title}</h1>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 mt-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
          <strong className="text-[#1D3557] font-bold">Objetivo:</strong>
          <span>{lesson.objective}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STEP 1: THEORY STAGE                                          */}
      {/* ============================================================ */}
      {stepMode === 'theory' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-[#1D3557] flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Fundamento Teórico Visual</span>
          </h2>

          {/* Theory Text Paragraphs */}
          <div className="space-y-3">
            {lesson.theory.text.map((paragraph, idx) => (
              <p key={idx} className="text-sm text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Stave Diagram */}
          {lesson.theory.diagramNotes && (
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
                <span>Pentagrama Ilustrativo:</span>
                <span className="text-[11px] text-slate-400 font-normal">Toca cualquier nota para escuchar su sonido</span>
              </div>
              <MusicStave
                notes={lesson.theory.diagramNotes}
                showLabels={true}
                width={560}
                height={170}
              />
            </div>
          )}

          {/* Key Takeaway & Mnemonic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-xs font-bold text-[#E63946] block uppercase tracking-wide">
                Regla Clave
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {lesson.theory.keyTakeaway}
              </p>
            </div>

            {lesson.theory.mnemonic && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-xs font-bold text-[#1D3557] block uppercase tracking-wide">
                  Regla Mnemotécnica
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  {lesson.theory.mnemonic}
                </p>
              </div>
            )}
          </div>

          {/* Continue button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-[#E63946] hover:bg-[#D62828] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Ver Ejemplo Guiado</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: GUIDED EXAMPLE STAGE                                 */}
      {/* ============================================================ */}
      {stepMode === 'guided' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-[#1D3557] flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#E63946]" />
              <span>Ejemplo Guiado Interactivo</span>
            </div>
            <button
              onClick={playGuidedExample}
              className="text-xs font-bold text-[#1D3557] hover:text-[#E63946] flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Reproducir de nuevo</span>
            </button>
          </h2>

          <p className="text-sm text-slate-700 font-medium">
            {lesson.guidedExample.instruction}
          </p>

          {/* Interactive Stave playing the sequence */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
            <MusicStave
              notes={lesson.guidedExample.notes}
              activeNoteIndex={activeGuidedNoteIndex}
              showLabels={true}
              width={560}
              height={170}
            />
          </div>

          {/* Pedagogic Hint */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lesson.guidedExample.hint}</span>
          </div>

          {/* Continue button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStepMode('theory')}
              className="text-xs font-bold text-slate-500 hover:text-[#1D3557] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Repasar Teoría
            </button>

            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-[#E63946] hover:bg-[#D62828] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>¡Comenzar Ejercicios! (5 preguntas)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: PRACTICAL EXERCISE STAGE (5 ITEMS)                   */}
      {/* ============================================================ */}
      {stepMode === 'exercise' && currentExercise && (
        <div
          className={`bg-white p-6 sm:p-8 rounded-2xl border shadow-sm space-y-6 transition-all duration-300 ${
            showSuccessPulse
              ? 'border-emerald-500 ring-4 ring-emerald-500/20 shadow-emerald-500/10'
              : 'border-slate-200'
          }`}
        >
          {/* Header of Exercise */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#1D3557] text-white flex items-center justify-center text-xs font-bold">
                {currentExerciseIdx + 1}
              </span>
              <span className="text-xs font-extrabold text-[#1D3557] uppercase tracking-wide">
                Ejercicio {currentExerciseIdx + 1} de {totalExercises}
              </span>
            </div>

            {/* Score pill */}
            <div className="text-xs font-bold text-slate-600">
              Aciertos: <strong className="text-emerald-600">{scoreCount}</strong> / {totalExercises}
            </div>
          </div>

          {/* Exercise Prompt */}
          <div>
            <h3 className="text-base font-extrabold text-[#1D3557] leading-snug">
              {currentExercise.prompt}
            </h3>
            {currentExercise.subPrompt && (
              <p className="text-xs text-slate-500 mt-1">{currentExercise.subPrompt}</p>
            )}
          </div>

          {/* TYPE A: Stave Click (User clicks directly on pentagram!) */}
          {currentExercise.type === 'stave-click' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-[#1D3557] font-semibold">
                Haz clic sobre la línea o espacio correcto en el pentagrama para marcar tu respuesta:
              </div>
              <MusicStave
                interactive={!isAnswerSubmitted}
                onSelectPitch={handleStaveClickSelect}
                highlightPitch={currentExercise.targetNote?.pitch}
                width={560}
                height={170}
              />
            </div>
          )}

          {/* TYPE B: Note Identification (Stave with note head shown) */}
          {currentExercise.type === 'note-identification' && currentExercise.staveNotes && (
            <div className="space-y-4">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <MusicStave
                  notes={currentExercise.staveNotes}
                  width={560}
                  height={170}
                  showLabels={false}
                />
              </div>

              {/* Options Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentExercise.options?.map((opt) => {
                  const isSelected = userSelectedAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect(opt)}
                      disabled={isAnswerSubmitted}
                      className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all border shadow-sm ${
                        isSelected
                          ? isAnswerCorrect
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-[#E63946] border-[#E63946] text-white'
                          : isAnswerSubmitted && opt === currentExercise.correctAnswer
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-white border-slate-200 text-[#1D3557] hover:border-[#1D3557] hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TYPE C: Rhythm Choice (Multiple Choice) */}
          {currentExercise.type === 'rhythm-choice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentExercise.options?.map((opt) => {
                const isSelected = userSelectedAnswer === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={isAnswerSubmitted}
                    className={`p-4 rounded-xl text-left font-bold text-xs sm:text-sm transition-all border shadow-sm ${
                      isSelected
                        ? isAnswerCorrect
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-[#E63946] border-[#E63946] text-white'
                        : isAnswerSubmitted && opt === currentExercise.correctAnswer
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-slate-200 text-[#1D3557] hover:border-[#1D3557] hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE D: Rhythm Tapping Exercise */}
          {currentExercise.type === 'rhythm-tap' && (
            <div className="space-y-3">
              <RhythmTapTrainer
                tempoBpm={currentExercise.tempoBpm || 80}
                targetBeats={currentExercise.rhythmSequence?.map((r) => r.beat) || [1, 2, 3, 4]}
                onComplete={(accuracy) => {
                  const pass = accuracy >= 60;
                  markAnswer(pass, 'tap_completed');
                }}
              />
            </div>
          )}

          {/* Optional Voice recognition bar for solfege */}
          {currentExercise.type === 'note-identification' && !isAnswerSubmitted && (
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">¿Prefieres responder con tu voz?</span>
              <button
                onClick={() => setIsListeningMic(!isListeningMic)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isListeningMic
                    ? 'bg-[#E63946] text-white animate-pulse'
                    : 'bg-white border border-slate-300 text-[#1D3557] hover:bg-slate-100'
                }`}
              >
                {isListeningMic ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isListeningMic ? 'Escuchando... Di la nota' : 'Hablar Nota'}</span>
              </button>
            </div>
          )}

          {speechFeedback && (
            <div className="text-xs text-center font-bold text-[#1D3557]">
              {speechFeedback}
            </div>
          )}

          {/* FEEDBACK BANNER (Green/Blue on correct, Red on error) */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                showSuccessPulse
                  ? 'scale-[1.01] shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500'
                  : 'scale-100'
              } ${
                isAnswerCorrect
                  ? 'bg-emerald-50/95 border-emerald-400 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-900'
              }`}
            >
              {isAnswerCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-black text-sm">
                  {isAnswerCorrect ? '¡Excelente acierto!' : 'Respuesta incorrecta'}
                </div>
                <div className="text-xs mt-1 leading-relaxed opacity-90">
                  {currentExercise.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Action button: Siguiente ejercicio / Finalizar */}
          {isAnswerSubmitted && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-[#E63946] hover:bg-[#D62828] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>
                  {currentExerciseIdx < totalExercises - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: LESSON COMPLETED MODAL / SCREEN                      */}
      {/* ============================================================ */}
      {stepMode === 'completed' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center shadow-inner">
            <Star className="w-9 h-9 text-amber-500 fill-amber-400" />
          </div>

          <div>
            <span className="text-xs font-black text-[#E63946] uppercase tracking-wider block">
              ¡Lección Superada!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1D3557] mt-1">
              {lesson.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Has respondido correctamente {scoreCount} de {totalExercises} ejercicios.
            </p>
          </div>

          {/* 3 Stars Visualizer */}
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`transition-all duration-300 transform ${
                  starIdx <= earnedStars ? 'scale-110' : 'scale-90 opacity-40'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    starIdx <= earnedStars
                      ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                      : 'text-slate-300'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-[#1D3557]">
            +{earnedStars * 15} XP Añadidos a tu Perfil de Solfeo
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            {onRestartLesson && (
              <button
                onClick={onRestartLesson}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-[#1D3557] font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Repetir para mejorar nota</span>
              </button>
            )}

            <button
              onClick={onBackToChapter}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-[#1D3557] font-bold text-xs hover:bg-slate-50 transition-all"
            >
              Lista de lecciones
            </button>

            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#E63946] hover:bg-[#D62828] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Siguiente Lección</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
