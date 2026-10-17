/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PitchName =
  | 'C3' | 'D3' | 'E3' | 'F3' | 'G3' | 'A3' | 'B3'
  | 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4' | 'B4'
  | 'C5' | 'D5' | 'E5' | 'F5' | 'G5' | 'A5' | 'B5'
  | 'C6';

export type NoteName = 'Do' | 'Re' | 'Mi' | 'Fa' | 'Sol' | 'La' | 'Si';
export type Accidental = 'none' | 'sharp' | 'flat' | 'natural';
export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

export interface StaveNote {
  pitch: PitchName;
  name: NoteName;
  octave: number;
  duration?: NoteDuration;
  accidental?: Accidental;
  dotted?: boolean;
  tieWithNext?: boolean;
  syllable?: string; // e.g. "Ta", "Ti", "Do"
}

export type ExerciseType =
  | 'note-identification'   // identify note displayed on stave
  | 'stave-click'           // click on the right line/space on the stave
  | 'rhythm-tap'            // tap along with rhythm
  | 'rhythm-choice'         // multiple choice for duration / time signature / rests
  | 'interval-identification' // 2da, 3ra, 4ta, 5ta, 8va
  | 'solfege-syllable'      // spoken/chosen rhythm syllables (Ta, Ti-ti, etc.)
  | 'ear-training';         // hear pitch and select note

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  prompt: string;
  subPrompt?: string;
  staveNotes?: StaveNote[];
  clef?: 'treble';
  timeSignature?: [number, number];
  targetNote?: {
    name: NoteName;
    octave?: number;
    pitch?: PitchName;
  };
  options?: string[];
  correctAnswer: string;
  explanation: string;
  rhythmSequence?: { beat: number; duration: number }[]; // for rhythm tap exercises
  tempoBpm?: number;
}

export interface Lesson {
  id: string;
  chapterId: number;
  lessonNumber: number;
  title: string;
  objective: string;
  theory: {
    text: string[];
    diagramNotes?: StaveNote[];
    keyTakeaway: string;
    mnemonic?: string;
  };
  guidedExample: {
    instruction: string;
    notes: StaveNote[];
    hint: string;
  };
  exercises: ExerciseItem[];
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  iconName: string;
  lessons: Lesson[];
}

export interface UserLessonProgress {
  lessonId: string;
  completed: boolean;
  stars: number; // 0 to 3
  bestScore: number;
  completedAt?: string;
}

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  lastPracticeDate: string;
  totalExercisesCompleted: number;
  totalCorrectAnswers: number;
  sightReadingHighScore: number;
  metronomeMinutesPracticed: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: (stats: UserStats, lessons: Record<string, UserLessonProgress>) => boolean;
}

export interface AppSettings {
  soundVolume: number; // 0 to 1
  timbre: 'piano' | 'synth' | 'chime';
  notationSystem: 'latin' | 'anglo'; // Do Re Mi vs C D E
  showHelperGuides: boolean;
  micEnabled: boolean;
}
