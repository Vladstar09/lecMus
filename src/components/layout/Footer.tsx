/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  onNavigate: (view: 'chapters' | 'sight-reading' | 'stats') => void;
  onOpenMetronome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenMetronome }) => {
  return (
    <footer className="border-t border-[#1D3557]/10 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-[#1D3557]">
            Lec<span className="text-[#E63946]">Mus</span>
          </span>
          <span>·</span>
          <span>Educación Musical Progresiva en Clave de Sol</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button onClick={() => onNavigate('chapters')} className="hover:text-[#E63946] transition-colors">
            12 Capítulos
          </button>
          <button onClick={() => onNavigate('sight-reading')} className="hover:text-[#E63946] transition-colors">
            Lectura a Primera Vista
          </button>
          <button onClick={onOpenMetronome} className="hover:text-[#E63946] transition-colors">
            Metrónomo
          </button>
          <button onClick={() => onNavigate('stats')} className="hover:text-[#E63946] transition-colors">
            Estadísticas
          </button>
        </div>

        <div className="text-slate-600">
          Diseñado para el aprendizaje activo del lenguaje musical.
        </div>
      </div>
    </footer>
  );
};
