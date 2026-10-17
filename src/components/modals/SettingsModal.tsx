/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, Sliders, X, Check } from 'lucide-react';
import { AppSettings } from '../../types/music';
import { soundEngine } from '../../services/audioEngine';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleVolumeChange = (vol: number) => {
    const updated = { ...settings, soundVolume: vol };
    onUpdateSettings(updated);
    soundEngine.setVolume(vol);
  };

  const handleTimbreChange = (timbre: 'piano' | 'synth' | 'chime') => {
    const updated = { ...settings, timbre };
    onUpdateSettings(updated);
    soundEngine.setTimbre(timbre);
    soundEngine.playNote('C5', 0.5);
  };

  const handleNotationChange = (notationSystem: 'latin' | 'anglo') => {
    const updated = { ...settings, notationSystem };
    onUpdateSettings(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[#1D3557]">
            <Sliders className="w-5 h-5 text-[#E63946]" />
            <h3 className="font-black text-lg">Ajustes de LecMus</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#1D3557]">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#E63946]" /> Volumen del sintetizador
            </span>
            <span className="font-mono">{Math.round(settings.soundVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.soundVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E63946]"
          />
        </div>

        {/* Instrument Timbre */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1D3557] block">
            Timbre de Instrumento
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'piano', label: 'Piano' },
              { id: 'synth', label: 'Sintetizador' },
              { id: 'chime', label: 'Campana' },
            ].map((t) => {
              const isSelected = settings.timbre === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTimbreChange(t.id as any)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-[#1D3557] border-[#1D3557] text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notation System */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1D3557] block">
            Sistema de Notación
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNotationChange('latin')}
              className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all text-left ${
                settings.notationSystem === 'latin'
                  ? 'bg-[#E63946] border-[#E63946] text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div>Latino (Do, Re, Mi)</div>
              <div className="text-[10px] opacity-80">Estándar en español</div>
            </button>

            <button
              onClick={() => handleNotationChange('anglo')}
              className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all text-left ${
                settings.notationSystem === 'anglo'
                  ? 'bg-[#E63946] border-[#E63946] text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div>Anglosajón (C, D, E)</div>
              <div className="text-[10px] opacity-80">Cifrado internacional</div>
            </button>
          </div>
        </div>

        {/* Footer save */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#1D3557] hover:bg-[#1D3557]/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
