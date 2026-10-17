/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Renderer,
  Stave,
  StaveNote as VFStaveNote,
  Voice,
  Formatter,
  Accidental as VFAccidental,
  Dot as VFDot,
  Beam as VFBeam,
} from 'vexflow';
import { PitchName, StaveNote } from '../../types/music';
import { soundEngine } from '../../services/audioEngine';

export interface MusicStaveProps {
  notes?: StaveNote[];
  clef?: 'treble';
  timeSignature?: [number, number];
  interactive?: boolean;
  highlightPitch?: PitchName;
  onSelectPitch?: (pitch: PitchName, noteName: string) => void;
  showLabels?: boolean;
  activeNoteIndex?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const PITCH_CONFIG: Record<
  PitchName,
  { yLine: number; name: string; octave: number; isLine: boolean; lineOrSpaceText: string }
> = {
  C6: { yLine: -2, name: 'Do', octave: 6, isLine: true, lineOrSpaceText: '2ª línea adicional superior' },
  B5: { yLine: -1.5, name: 'Si', octave: 5, isLine: false, lineOrSpaceText: 'Espacio sobre 1ª línea adicional' },
  A5: { yLine: -1, name: 'La', octave: 5, isLine: true, lineOrSpaceText: '1ª línea adicional superior' },
  G5: { yLine: -0.5, name: 'Sol', octave: 5, isLine: false, lineOrSpaceText: 'Espacio sobre la 5ª línea' },
  F5: { yLine: 0, name: 'Fa', octave: 5, isLine: true, lineOrSpaceText: '5ª Línea' },
  E5: { yLine: 0.5, name: 'Mi', octave: 5, isLine: false, lineOrSpaceText: '4º Espacio' },
  D5: { yLine: 1, name: 'Re', octave: 5, isLine: true, lineOrSpaceText: '4ª Línea' },
  C5: { yLine: 1.5, name: 'Do', octave: 5, isLine: false, lineOrSpaceText: '3º Espacio' },
  B4: { yLine: 2, name: 'Si', octave: 4, isLine: true, lineOrSpaceText: '3ª Línea (Línea central)' },
  A4: { yLine: 2.5, name: 'La', octave: 4, isLine: false, lineOrSpaceText: '2º Espacio' },
  G4: { yLine: 3, name: 'Sol', octave: 4, isLine: true, lineOrSpaceText: '2ª Línea (Clave de Sol)' },
  F4: { yLine: 3.5, name: 'Fa', octave: 4, isLine: false, lineOrSpaceText: '1º Espacio' },
  E4: { yLine: 4, name: 'Mi', octave: 4, isLine: true, lineOrSpaceText: '1ª Línea' },
  D4: { yLine: 4.5, name: 'Re', octave: 4, isLine: false, lineOrSpaceText: 'Espacio bajo la 1ª línea' },
  C4: { yLine: 5, name: 'Do', octave: 4, isLine: true, lineOrSpaceText: '1ª línea adicional inferior (Do central)' },
  B3: { yLine: 5.5, name: 'Si', octave: 3, isLine: false, lineOrSpaceText: 'Espacio bajo 1ª línea adicional' },
  A3: { yLine: 6, name: 'La', octave: 3, isLine: true, lineOrSpaceText: '2ª línea adicional inferior' },
  G3: { yLine: 6.5, name: 'Sol', octave: 3, isLine: false, lineOrSpaceText: 'Espacio bajo 2ª línea adicional' },
  F3: { yLine: 7, name: 'Fa', octave: 3, isLine: true, lineOrSpaceText: '3ª línea adicional inferior' },
  E3: { yLine: 7.5, name: 'Mi', octave: 3, isLine: false, lineOrSpaceText: 'Espacio bajo 3ª línea adicional' },
  D3: { yLine: 8, name: 'Re', octave: 3, isLine: true, lineOrSpaceText: '4ª línea adicional inferior' },
  C3: { yLine: 8.5, name: 'Do', octave: 3, isLine: false, lineOrSpaceText: 'Espacio bajo 4ª línea adicional' },
};

// Interactive slots for clicking (Treble Clef common reading range)
const INTERACTIVE_PITCHES: PitchName[] = [
  'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'
];

export const MusicStave: React.FC<MusicStaveProps> = ({
  notes = [],
  timeSignature,
  interactive = false,
  highlightPitch,
  onSelectPitch,
  showLabels = false,
  activeNoteIndex = -1,
  width = 560,
  height = 170,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPitch, setHoveredPitch] = useState<PitchName | null>(null);
  const staveCoordsRef = useRef<{
    topY: number;
    spacing: number;
    startX: number;
    endX: number;
  }>({
    topY: 42,
    spacing: 10,
    startX: 100,
    endX: width - 30,
  });

  const notesKey = JSON.stringify(notes);
  const timeSigKey = timeSignature ? `${timeSignature[0]}/${timeSignature[1]}` : '';

  // Render score using VexFlow 5 SVG Renderer
  const renderVexFlowScore = useCallback(() => {
    if (!containerRef.current) return;

    // Clear previous VexFlow SVG children
    containerRef.current.innerHTML = '';

    try {
      // 1. Initialize VexFlow SVG Renderer
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();

      // Configure high-definition styling
      const staveX = 15;
      const staveY = 32;
      const staveWidth = width - 30;

      // 2. Create Stave
      const stave = new Stave(staveX, staveY, staveWidth);
      stave.addClef('treble');

      if (timeSignature) {
        stave.addTimeSignature(`${timeSignature[0]}/${timeSignature[1]}`);
      }

      // Professional styling: Dark navy blue lines & treble clef (#1D3557)
      stave.setStyle({
        strokeStyle: '#1D3557',
        fillStyle: '#1D3557',
        shadowBlur: 0,
      });

      stave.setContext(context).draw();

      // Store actual stave coordinates in ref (never triggers re-render)
      const lineSpacing = stave.getSpacingBetweenLines() || 10;
      const topStaffY = stave.getYForLine(0);
      staveCoordsRef.current = {
        topY: topStaffY,
        spacing: lineSpacing,
        startX: stave.getNoteStartX() || 100,
        endX: stave.getNoteEndX() || width - 30,
      };

      // 3. Render Notes if provided
      if (notes.length > 0) {
        const vfNotes: VFStaveNote[] = [];

        notes.forEach((n, idx) => {
          // Parse pitch: e.g. "C4" -> "c/4", "F#4" -> "f#/4"
          const step = n.pitch.charAt(0).toLowerCase();
          const octave = n.pitch.slice(-1);
          let keyStr = `${step}/${octave}`;

          let accidentalChar: string | null = null;
          if (n.pitch.includes('#') || n.accidental === 'sharp') {
            accidentalChar = '#';
            keyStr = `${step}#/${octave}`;
          } else if (n.pitch.includes('b') || n.accidental === 'flat') {
            accidentalChar = 'b';
            keyStr = `${step}b/${octave}`;
          } else if (n.accidental === 'natural') {
            accidentalChar = 'n';
          }

          // Duration mapping
          let durationCode = 'q';
          if (n.duration === 'whole') durationCode = 'w';
          else if (n.duration === 'half') durationCode = 'h';
          else if (n.duration === 'quarter') durationCode = 'q';
          else if (n.duration === 'eighth') durationCode = '8';
          else if (n.duration === 'sixteenth') durationCode = '16';

          if (n.syllable === 'rest') {
            durationCode += 'r';
          }

          const vfNote = new VFStaveNote({
            keys: [keyStr],
            duration: durationCode,
            clef: 'treble',
          });

          // Add accidental
          if (accidentalChar) {
            vfNote.addModifier(new VFAccidental(accidentalChar), 0);
          }

          // Add dot if dotted
          if (n.dotted) {
            vfNote.addModifier(new VFDot(), 0);
          }

          // Highlight note in LecMus Red (#E63946) if active/selected
          const isActive = idx === activeNoteIndex;
          if (isActive) {
            vfNote.setStyle({
              fillStyle: '#E63946',
              strokeStyle: '#E63946',
              shadowColor: 'rgba(230, 57, 70, 0.4)',
              shadowBlur: 8,
            });
          } else {
            vfNote.setStyle({
              fillStyle: '#1D3557',
              strokeStyle: '#1D3557',
            });
          }

          vfNotes.push(vfNote);
        });

        // Auto format and draw notes with voice
        const voice = new Voice({
          numBeats: 4,
          beatValue: 4,
        });
        voice.setStrict(false);
        voice.addTickables(vfNotes);

        new Formatter().joinVoices([voice]).format([voice], staveWidth - (stave.getNoteStartX() - staveX) - 20);

        // Auto beam eighth notes
        try {
          const eighthNotes = vfNotes.filter((n) => n.getDuration() === '8');
          if (eighthNotes.length >= 2) {
            const beams = VFBeam.generateBeams(eighthNotes);
            voice.draw(context, stave);
            beams.forEach((beam) => beam.setContext(context).draw());
          } else {
            voice.draw(context, stave);
          }
        } catch {
          voice.draw(context, stave);
        }
      }
    } catch (err) {
      console.warn('VexFlow rendering note exception:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesKey, timeSigKey, width, height, activeNoteIndex]);

  useEffect(() => {
    renderVexFlowScore();
  }, [renderVexFlowScore]);

  // Handle click on staff line/space
  const handleStaveClick = (pitch: PitchName) => {
    soundEngine.playNote(pitch, 0.6);
    if (onSelectPitch) {
      onSelectPitch(pitch, PITCH_CONFIG[pitch].name);
    }
  };

  // Compute precise Y position for interactive line/space overlay
  const getYForPitch = (pitch: PitchName): number => {
    const cfg = PITCH_CONFIG[pitch];
    // yLine: 0 = top line (F5), 4 = bottom line (E4), 5 = middle C (C4)
    return staveCoordsRef.current.topY + cfg.yLine * staveCoordsRef.current.spacing;
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* VexFlow SVG Container */}
      <div
        className="w-full relative drop-shadow-sm bg-white/90 rounded-2xl border border-[#1D3557]/15 p-2 overflow-hidden flex items-center justify-center min-h-[160px]"
        style={{ maxWidth: `${width}px` }}
      >
        {/* VexFlow renders directly into this DOM node */}
        <div ref={containerRef} className="w-full h-auto flex items-center justify-center" />

        {/* Interactive SVG Overlay on top of VexFlow Stave */}
        {interactive && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-auto"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <filter id="vf-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E63946" floodOpacity="0.45" />
              </filter>
            </defs>

            {INTERACTIVE_PITCHES.map((pitch) => {
              const cfg = PITCH_CONFIG[pitch];
              const pitchY = getYForPitch(pitch);
              const isHovered = hoveredPitch === pitch;
              const isTarget = highlightPitch === pitch;

              return (
                <g
                  key={`vf-hotspot-${pitch}`}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPitch(pitch)}
                  onMouseLeave={() => setHoveredPitch(null)}
                  onClick={() => handleStaveClick(pitch)}
                >
                  {/* Invisible wide click corridor across the staff */}
                  <rect
                    x={staveCoordsRef.current.startX}
                    y={pitchY - staveCoordsRef.current.spacing / 2}
                    width={staveCoordsRef.current.endX - staveCoordsRef.current.startX}
                    height={staveCoordsRef.current.spacing}
                    fill={
                      isTarget
                        ? 'rgba(230, 57, 70, 0.18)'
                        : isHovered
                        ? 'rgba(29, 53, 87, 0.08)'
                        : 'transparent'
                    }
                    rx="4"
                  />

                  {/* Ledger lines when outside the standard 5 staff lines */}
                  {(isHovered || isTarget) && (pitch === 'C4' || pitch === 'A5') && (
                    <line
                      x1={width / 2 - 25}
                      y1={pitchY}
                      x2={width / 2 + 25}
                      y2={pitchY}
                      stroke={isTarget ? '#E63946' : '#1D3557'}
                      strokeWidth="2"
                    />
                  )}

                  {/* Note Head Preview when hovered or targeted */}
                  {(isHovered || isTarget) && (
                    <ellipse
                      cx={width / 2}
                      cy={pitchY}
                      rx="8"
                      ry="6"
                      transform={`rotate(-22 ${width / 2} ${pitchY})`}
                      fill={isTarget ? '#E63946' : '#1D3557'}
                      opacity={isTarget ? 0.95 : 0.7}
                      filter={isTarget ? 'url(#vf-glow-red)' : undefined}
                    />
                  )}

                  {/* Tooltip description */}
                  {isHovered && (
                    <g transform={`translate(${width - 150}, ${pitchY + 4})`}>
                      <rect x="-8" y="-12" width="140" height="20" rx="4" fill="#1D3557" />
                      <text
                        x="62"
                        y="2"
                        fill="white"
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                        className="font-sans"
                      >
                        {cfg.name} · {cfg.lineOrSpaceText}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Labels under rendered notes */}
        {showLabels && notes.length > 0 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-around px-12 pointer-events-none">
            {notes.map((n, i) => (
              <span
                key={`label-${i}`}
                className={`text-xs font-bold ${
                  i === activeNoteIndex ? 'text-[#E63946]' : 'text-[#1D3557]'
                }`}
              >
                {n.syllable || `${PITCH_CONFIG[n.pitch]?.name || n.name}${n.octave || ''}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Guide Bar under stave if interactive */}
      {interactive && (
        <div className="mt-2 text-xs text-[#1D3557]/80 flex items-center justify-between w-full px-4 max-w-[560px]">
          <span className="font-medium text-[#1D3557]">
            Haz clic sobre una línea o espacio en la partitura para responder
          </span>
          <span className="text-[#E63946] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E63946] inline-block animate-pulse"></span>
            Partitura Interactiva VexFlow
          </span>
        </div>
      )}
    </div>
  );
};
