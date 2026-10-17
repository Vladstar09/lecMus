/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSettings, Badge, UserLessonProgress, UserStats } from '../types/music';

const STORAGE_KEYS = {
  LESSONS: 'lecmus_user_lessons',
  STATS: 'lecmus_user_stats',
  SETTINGS: 'lecmus_user_settings',
  UNLOCKED_BADGES: 'lecmus_unlocked_badges',
};

const DEFAULT_SETTINGS: AppSettings = {
  soundVolume: 0.8,
  timbre: 'piano',
  notationSystem: 'latin', // Do, Re, Mi
  showHelperGuides: true,
  micEnabled: false,
};

const DEFAULT_STATS: UserStats = {
  totalXp: 0,
  currentStreak: 0,
  lastPracticeDate: '',
  totalExercisesCompleted: 0,
  totalCorrectAnswers: 0,
  sightReadingHighScore: 0,
  metronomeMinutesPracticed: 0,
};

export const BADGES_LIST: Badge[] = [
  {
    id: 'first_note',
    title: 'Primera Nota',
    description: 'Completa tu primera lección en LecMus.',
    icon: '🎵',
    condition: (_stats, lessons) => Object.values(lessons).some((l) => l.completed),
  },
  {
    id: 'line_master',
    title: 'Maestro de las Líneas',
    description: 'Completa todas las lecciones del Capítulo 2 (Mi, Sol, Si, Re, Fa).',
    icon: '🎼',
    condition: (_stats, lessons) => {
      for (let i = 1; i <= 10; i++) {
        if (!lessons[`c2-l${i}`]?.completed) return false;
      }
      return true;
    },
  },
  {
    id: 'space_master',
    title: 'Explorador de Espacios',
    description: 'Completa todas las lecciones del Capítulo 3 (Fa, La, Do, Mi).',
    icon: '🌌',
    condition: (_stats, lessons) => {
      for (let i = 1; i <= 10; i++) {
        if (!lessons[`c3-l${i}`]?.completed) return false;
      }
      return true;
    },
  },
  {
    id: 'streak_3',
    title: 'Constancia Musical',
    description: 'Mantén una racha de 3 días consecutivos practicando.',
    icon: '🔥',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Virtuoso Semanal',
    description: 'Alcanza una racha de 7 días seguidos.',
    icon: '⚡',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'perfect_ear',
    title: 'Oído Perfecto',
    description: 'Consigue 3 estrellas en al menos 10 lecciones.',
    icon: '⭐',
    condition: (_stats, lessons) => Object.values(lessons).filter((l) => l.stars === 3).length >= 10,
  },
  {
    id: 'rhythm_guru',
    title: 'Pulsación Impecable',
    description: 'Supera el capítulo de figuras rítmicas (Capítulo 6).',
    icon: '🥁',
    condition: (_stats, lessons) => {
      for (let i = 1; i <= 10; i++) {
        if (!lessons[`c6-l${i}`]?.completed) return false;
      }
      return true;
    },
  },
  {
    id: 'speed_demon',
    title: 'Lector Relámpago',
    description: 'Alcanza más de 15 aciertos en el modo Lectura a Primera Vista.',
    icon: '🚀',
    condition: (stats) => stats.sightReadingHighScore >= 15,
  },
  {
    id: 'xp_500',
    title: 'Acumulador de XP',
    description: 'Consigue 500 puntos de experiencia musical.',
    icon: '🏆',
    condition: (stats) => stats.totalXp >= 500,
  },
];

export class StorageService {
  public static getLessonsProgress(): Record<string, UserLessonProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public static saveLessonProgress(lessonId: string, stars: number, score: number, xpGained: number) {
    const lessons = this.getLessonsProgress();
    const existing = lessons[lessonId] || { lessonId, completed: false, stars: 0, bestScore: 0 };

    lessons[lessonId] = {
      lessonId,
      completed: true,
      stars: Math.max(existing.stars, stars),
      bestScore: Math.max(existing.bestScore, score),
      completedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    } catch (e) {
      console.warn('Storage save error:', e);
    }

    this.updateStatsOnLessonCompletion(xpGained, score >= 4);
    this.checkBadges();
  }

  public static getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      const stats: UserStats = data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : DEFAULT_STATS;

      // Update streak based on date
      const today = new Date().toISOString().split('T')[0];
      if (stats.lastPracticeDate) {
        const lastDate = new Date(stats.lastPracticeDate);
        const currDate = new Date(today);
        const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 1) {
          // Streak broken
          stats.currentStreak = 0;
          this.saveStats(stats);
        }
      }
      return stats;
    } catch {
      return DEFAULT_STATS;
    }
  }

  public static saveStats(stats: UserStats) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  public static updateStatsOnLessonCompletion(xpGained: number, wasGoodPerformance: boolean) {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];

    if (stats.lastPracticeDate !== today) {
      if (stats.lastPracticeDate) {
        const lastDate = new Date(stats.lastPracticeDate);
        const currDate = new Date(today);
        const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          stats.currentStreak += 1;
        } else if (diffDays > 1) {
          stats.currentStreak = 1;
        }
      } else {
        stats.currentStreak = 1;
      }
      stats.lastPracticeDate = today;
    }

    stats.totalXp += xpGained;
    stats.totalExercisesCompleted += 5;
    stats.totalCorrectAnswers += wasGoodPerformance ? 5 : 4;

    this.saveStats(stats);
  }

  public static recordSightReadingScore(score: number) {
    const stats = this.getStats();
    if (score > stats.sightReadingHighScore) {
      stats.sightReadingHighScore = score;
    }
    stats.totalXp += score * 3;
    stats.totalExercisesCompleted += score;
    stats.totalCorrectAnswers += score;
    this.saveStats(stats);
    this.checkBadges();
  }

  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Settings save error:', e);
    }
  }

  public static getUnlockedBadges(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_BADGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static checkBadges(): string[] {
    const stats = this.getStats();
    const lessons = this.getLessonsProgress();
    const currentlyUnlocked = new Set(this.getUnlockedBadges());
    const newlyUnlocked: string[] = [];

    BADGES_LIST.forEach((badge) => {
      if (!currentlyUnlocked.has(badge.id)) {
        if (badge.condition(stats, lessons)) {
          currentlyUnlocked.add(badge.id);
          newlyUnlocked.push(badge.id);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_BADGES, JSON.stringify(Array.from(currentlyUnlocked)));
      } catch (e) {
        console.warn('Badge save error:', e);
      }
    }

    return newlyUnlocked;
  }

  public static resetAllProgress() {
    localStorage.removeItem(STORAGE_KEYS.LESSONS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_BADGES);
  }
}
