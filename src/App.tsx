/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ChapterMapView } from './components/views/ChapterMapView';
import { ChapterDetailView } from './components/views/ChapterDetailView';
import { LessonView } from './components/views/LessonView';
import { SightReadingTrainer } from './components/music/SightReadingTrainer';
import { StatsAndBadgesView } from './components/views/StatsAndBadgesView';
import { MetronomeTool } from './components/music/MetronomeTool';
import { SettingsModal } from './components/modals/SettingsModal';
import { CHAPTERS_DATA, ALL_LESSONS } from './data/lessonsData';
import { StorageService } from './services/storageService';
import { soundEngine } from './services/audioEngine';
import { AppSettings, UserLessonProgress, UserStats } from './types/music';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'chapters' | 'chapter-detail' | 'lesson' | 'sight-reading' | 'stats'
  >('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [activeLessonId, setActiveLessonId] = useState<string>('c1-l1');
  const [isMetronomeOpen, setIsMetronomeOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [lessonsProgress, setLessonsProgress] = useState<Record<string, UserLessonProgress>>({});
  const [stats, setStats] = useState<UserStats>({
    totalXp: 0,
    currentStreak: 0,
    lastPracticeDate: '',
    totalExercisesCompleted: 0,
    totalCorrectAnswers: 0,
    sightReadingHighScore: 0,
    metronomeMinutesPracticed: 0,
  });
  const [settings, setSettings] = useState<AppSettings>({
    soundVolume: 0.8,
    timbre: 'piano',
    notationSystem: 'latin',
    showHelperGuides: true,
    micEnabled: false,
  });

  // Load persistent user data on mount
  const refreshUserData = useCallback(() => {
    setLessonsProgress(StorageService.getLessonsProgress());
    setStats(StorageService.getStats());
    const savedSettings = StorageService.getSettings();
    setSettings(savedSettings);
    soundEngine.setVolume(savedSettings.soundVolume);
    soundEngine.setTimbre(savedSettings.timbre);
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Navigate to chapter details
  const handleSelectChapter = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setCurrentView('chapter-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch a specific lesson
  const handleStartLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    const les = ALL_LESSONS[lessonId];
    if (les) {
      setSelectedChapterId(les.chapterId);
    }
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle "Siguiente Lección"
  const handleNextLesson = () => {
    refreshUserData();
    const currentLesson = ALL_LESSONS[activeLessonId];
    if (!currentLesson) {
      setCurrentView('chapters');
      return;
    }

    if (currentLesson.lessonNumber < 10) {
      // Next lesson in current chapter
      const nextId = `c${currentLesson.chapterId}-l${currentLesson.lessonNumber + 1}`;
      if (ALL_LESSONS[nextId]) {
        handleStartLesson(nextId);
        return;
      }
    } else if (currentLesson.chapterId < 12) {
      // First lesson of next chapter!
      const nextId = `c${currentLesson.chapterId + 1}-l1`;
      if (ALL_LESSONS[nextId]) {
        handleStartLesson(nextId);
        return;
      }
    }

    // Finished entire curriculum or back to map
    setCurrentView('chapters');
  };

  // Continue learning button in header
  const handleContinueLearning = () => {
    // Find first incomplete lesson
    for (const ch of CHAPTERS_DATA) {
      for (const les of ch.lessons) {
        if (!lessonsProgress[les.id]?.completed) {
          handleStartLesson(les.id);
          return;
        }
      }
    }
    // If all completed, open sight reading trainer
    setCurrentView('sight-reading');
  };

  const handleResetData = () => {
    StorageService.resetAllProgress();
    refreshUserData();
    setCurrentView('chapters');
  };

  const selectedChapter =
    CHAPTERS_DATA.find((c) => c.id === selectedChapterId) || CHAPTERS_DATA[0];
  const activeLesson = ALL_LESSONS[activeLessonId] || CHAPTERS_DATA[0].lessons[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1D3557]">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMetronome={() => setIsMetronomeOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        stats={stats}
        onContinueLearning={handleContinueLearning}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'chapters' && (
          <ChapterMapView
            chapters={CHAPTERS_DATA}
            lessonsProgress={lessonsProgress}
            stats={stats}
            onSelectChapter={handleSelectChapter}
            onStartLesson={handleStartLesson}
            onOpenSightReading={() => setCurrentView('sight-reading')}
          />
        )}

        {currentView === 'chapter-detail' && (
          <ChapterDetailView
            chapter={selectedChapter}
            lessonsProgress={lessonsProgress}
            onBack={() => setCurrentView('chapters')}
            onSelectLesson={handleStartLesson}
          />
        )}

        {currentView === 'lesson' && (
          <LessonView
            lesson={activeLesson}
            onBackToChapter={() => {
              refreshUserData();
              setCurrentView('chapter-detail');
            }}
            onNextLesson={handleNextLesson}
            onRestartLesson={() => {
              // Trigger reload
              setActiveLessonId(activeLessonId);
            }}
          />
        )}

        {currentView === 'sight-reading' && <SightReadingTrainer />}

        {currentView === 'stats' && (
          <StatsAndBadgesView
            stats={stats}
            lessonsProgress={lessonsProgress}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMetronome={() => setIsMetronomeOpen(true)}
      />

      {/* Standalone Metronome Modal */}
      {isMetronomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <MetronomeTool onClose={() => setIsMetronomeOpen(false)} isModal={true} />
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            StorageService.saveSettings(newSettings);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
