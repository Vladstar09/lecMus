/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, Lesson, ExerciseItem, StaveNote } from '../types/music';

// Helper to create standardized questions
function createNoteIdExercise(
  id: string,
  prompt: string,
  pitch: StaveNote['pitch'],
  name: StaveNote['name'],
  explanation: string,
  distractors: string[]
): ExerciseItem {
  return {
    id,
    type: 'note-identification',
    prompt,
    staveNotes: [{ pitch, name, octave: 4, duration: 'quarter' }],
    options: [name, ...distractors].sort(() => 0.5 - Math.random()),
    correctAnswer: name,
    explanation,
  };
}

function createStaveClickExercise(
  id: string,
  prompt: string,
  targetName: StaveNote['name'],
  targetPitch: StaveNote['pitch'],
  explanation: string
): ExerciseItem {
  return {
    id,
    type: 'stave-click',
    prompt,
    targetNote: { name: targetName, pitch: targetPitch },
    correctAnswer: targetName,
    explanation,
  };
}

function createRhythmChoiceExercise(
  id: string,
  prompt: string,
  subPrompt: string,
  options: string[],
  correctAnswer: string,
  explanation: string
): ExerciseItem {
  return {
    id,
    type: 'rhythm-choice',
    prompt,
    subPrompt,
    options,
    correctAnswer,
    explanation,
  };
}

function createRhythmTapExercise(
  id: string,
  prompt: string,
  targetBeats: number[],
  targetSyllables: string[],
  tempoBpm: number = 80,
  explanation: string = 'Sigue el pulso marcando con precisión sobre el metrónomo.'
): ExerciseItem {
  return {
    id,
    type: 'rhythm-tap',
    prompt,
    subPrompt: `Tempo: ${tempoBpm} BPM. Pulsa la barra de espacio o el botón al ritmo de los tiempos indicados.`,
    targetNote: { name: 'Sol' },
    correctAnswer: 'tap_completed',
    explanation,
    tempoBpm,
    rhythmSequence: targetBeats.map((b) => ({ beat: b, duration: 1 })),
  };
}

// ----------------------------------------------------
// CHAPTER 1: Fundamentos del pentagrama y la clave de sol
// ----------------------------------------------------
const chapter1Lessons: Lesson[] = [
  {
    id: 'c1-l1',
    chapterId: 1,
    lessonNumber: 1,
    title: '1.1 ¿Qué es el pentagrama?',
    objective: 'Comprender qué es el pentagrama, cómo se cuentan sus 5 líneas y 4 espacios de abajo hacia arriba.',
    theory: {
      text: [
        'La palabra "pentagrama" proviene del griego penta (cinco) y gramma (línea o escrito).',
        'El pentagrama es la pauta musical formada por 5 líneas horizontales, paralelas y equidistantes, que definen 4 espacios entre ellas.',
        'Regla de oro: Tanto las líneas como los espacios se cuentan SIEMPRE de abajo hacia arriba (la línea 1 es la inferior, y la línea 5 es la superior).',
      ],
      diagramNotes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'whole', syllable: 'Línea 1' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'whole', syllable: 'Línea 2' },
        { pitch: 'B4', name: 'Si', octave: 4, duration: 'whole', syllable: 'Línea 3' },
        { pitch: 'D5', name: 'Re', octave: 5, duration: 'whole', syllable: 'Línea 4' },
        { pitch: 'F5', name: 'Fa', octave: 5, duration: 'whole', syllable: 'Línea 5' },
      ],
      keyTakeaway: 'El pentagrama tiene 5 líneas y 4 espacios contados desde la base hacia arriba.',
      mnemonic: 'Cuenta siempre de abajo hacia arriba: 1, 2, 3, 4, 5.',
    },
    guidedExample: {
      instruction: 'Observa las 5 líneas del pentagrama. Haz clic sobre cada una para familiarizarte con su altura.',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'B4', name: 'Si', octave: 4, duration: 'quarter' },
        { pitch: 'F5', name: 'Fa', octave: 5, duration: 'quarter' },
      ],
      hint: 'La línea más grave o baja es la línea 1. La línea más aguda o alta es la línea 5.',
    },
    exercises: [
      createRhythmChoiceExercise(
        'c1-l1-q1',
        '¿Cuántas líneas componen un pentagrama musical?',
        'Cuenta las líneas horizontales principales.',
        ['3 líneas', '4 líneas', '5 líneas', '6 líneas'],
        '5 líneas',
        '¡Correcto! El pentagrama está formado exactamente por 5 líneas paralelas.'
      ),
      createRhythmChoiceExercise(
        'c1-l1-q2',
        '¿En qué dirección se cuentan las líneas y espacios del pentagrama?',
        'Piensa en la convención universal de la notación musical.',
        ['De arriba hacia abajo', 'De abajo hacia arriba', 'De izquierda a derecha', 'En cualquier orden'],
        'De abajo hacia arriba',
        '¡Exacto! Siempre se numeran desde abajo (la más grave) hacia arriba (la más aguda).'
      ),
      createRhythmChoiceExercise(
        'c1-l1-q3',
        '¿Cuántos espacios interiores se forman entre las 5 líneas de un pentagrama?',
        'Espacios entre línea y línea.',
        ['3 espacios', '4 espacios', '5 espacios', '2 espacios'],
        '4 espacios',
        '¡Muy bien! Cinco líneas paralelas delimitan exactamente 4 espacios.'
      ),
      createStaveClickExercise(
        'c1-l1-q4',
        'Haz clic sobre la 1ª línea (la línea inferior del pentagrama).',
        'Mi',
        'E4',
        '¡Perfecto! La 1ª línea es la que se encuentra en la base del pentagrama (nota Mi4).'
      ),
      createStaveClickExercise(
        'c1-l1-q5',
        'Haz clic sobre la 5ª línea (la línea superior del pentagrama).',
        'Fa',
        'F5',
        '¡Excelente! La 5ª línea es la línea más alta del pentagrama (nota Fa5).'
      ),
    ],
  },
  {
    id: 'c1-l2',
    chapterId: 1,
    lessonNumber: 2,
    title: '1.2 La Clave de Sol: El origen de las notas',
    objective: 'Reconocer el símbolo de la clave de sol y entender por qué fija la nota Sol en la 2ª línea.',
    theory: {
      text: [
        'Sin una clave al inicio, las líneas del pentagrama no tienen nombres de notas fijos.',
        'La Clave de Sol (también llamada clave de G) se dibuja comenzando con un espiral en la SEGUNDA LÍNEA.',
        'Por esta razón, la 2ª línea del pentagrama recibe automáticamente el nombre de Sol (Sol4).',
        'A partir de esta nota de referencia, todas las demás notas se deducen subiendo o bajando en la escala.',
      ],
      diagramNotes: [{ pitch: 'G4', name: 'Sol', octave: 4, duration: 'whole', syllable: 'Sol (Línea 2)' }],
      keyTakeaway: 'La clave de sol se origina en la 2ª línea y le da su nombre a dicha línea.',
      mnemonic: 'El centro del caracol de la clave de sol abraza la 2ª línea.',
    },
    guidedExample: {
      instruction: 'Escucha la nota Sol en la segunda línea, el punto de partida de toda la lectura en clave de sol.',
      notes: [{ pitch: 'G4', name: 'Sol', octave: 4, duration: 'half' }],
      hint: 'Sol4 vibra a una frecuencia de aproximadamente 392 Hz.',
    },
    exercises: [
      createRhythmChoiceExercise(
        'c1-l2-q1',
        '¿En qué línea del pentagrama nace y se fija la clave de Sol?',
        'Observa el centro del espiral de la clave.',
        ['1ª línea', '2ª línea', '3ª línea', '4ª línea'],
        '2ª línea',
        '¡Correcto! La clave de sol se apoya y nace en la 2ª línea del pentagrama.'
      ),
      createNoteIdExercise(
        'c1-l2-q2',
        '¿Qué nota musical está escrita en la 2ª línea del pentagrama con clave de sol?',
        'G4',
        'Sol',
        '¡Exacto! Como la clave es de Sol en 2ª línea, cualquier nota en esa línea es Sol.',
        ['Do', 'Mi', 'Si']
      ),
      createStaveClickExercise(
        'c1-l2-q3',
        'Encuentra y pulsa en el pentagrama la nota Sol (2ª línea).',
        'Sol',
        'G4',
        '¡Genial! Has localizado la nota Sol de referencia.'
      ),
      createRhythmChoiceExercise(
        'c1-l2-q4',
        '¿Cuál es la función principal de una clave musical al inicio del pentagrama?',
        '¿Para qué sirve la clave?',
        ['Indicar el volumen de la música', 'Asignar nombre y altura fija a las líneas y espacios', 'Medir el tiempo del compás', 'Decorar la partitura'],
        'Asignar nombre y altura fija a las líneas y espacios',
        '¡Brillante! Sin la clave, las notas no tendrían un tono definido.'
      ),
      createNoteIdExercise(
        'c1-l2-q5',
        'Identifica esta nota situada en la 2ª línea:',
        'G4',
        'Sol',
        '¡Bien hecho! Es la nota Sol.',
        ['La', 'Fa', 'Re']
      ),
    ],
  },
  {
    id: 'c1-l3',
    chapterId: 1,
    lessonNumber: 3,
    title: '1.3 Altura musical: Graves y Agudos',
    objective: 'Comprender cómo la posición vertical en el pentagrama se relaciona con el tono acústico.',
    theory: {
      text: [
        'En la música, la altura indica si un sonido es grave (bajo) o agudo (alto).',
        'En el pentagrama, cuanto más ABAJO se escribe una nota, más GRAVE suena.',
        'Cuanto más ARRIBA se escribe una nota, más AGUDA suena.',
      ],
      diagramNotes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter', syllable: 'Grave' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: 'Medio' },
        { pitch: 'F5', name: 'Fa', octave: 5, duration: 'quarter', syllable: 'Agudo' },
      ],
      keyTakeaway: 'Hacia arriba = más agudo; hacia abajo = más grave.',
    },
    guidedExample: {
      instruction: 'Compara una nota grave con una aguda. Haz clic para escuchar la diferencia de tono.',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'half' },
        { pitch: 'F5', name: 'Fa', octave: 5, duration: 'half' },
      ],
      hint: 'Mi4 (línea 1) suena mucho más grave que Fa5 (línea 5).',
    },
    exercises: [
      createRhythmChoiceExercise(
        'c1-l3-q1',
        'Si una nota está escrita más arriba en el pentagrama que otra, su sonido será:',
        'Relación vertical.',
        ['Más grave', 'Más agudo', 'Más lento', 'De menor volumen'],
        'Más agudo',
        '¡Correcto! Una mayor elevación en el pentagrama equivale a una frecuencia más aguda.'
      ),
      createRhythmChoiceExercise(
        'c1-l3-q2',
        '¿Cuál de las siguientes líneas contiene el sonido más grave del pentagrama estándar?',
        'Compara las 5 líneas.',
        ['La 1ª línea', 'La 3ª línea', 'La 4ª línea', 'La 5ª línea'],
        'La 1ª línea',
        '¡Exacto! La 1ª línea es la más baja y por tanto la más grave.'
      ),
      createRhythmChoiceExercise(
        'c1-l3-q3',
        '¿Cuál de las siguientes líneas contiene el sonido más agudo?',
        'Línea superior.',
        ['La 1ª línea', 'La 2ª línea', 'La 5ª línea', 'La 3ª línea'],
        'La 5ª línea',
        '¡Muy bien! La 5ª línea alberga la nota Fa5, la más aguda de las cinco líneas.'
      ),
      createStaveClickExercise(
        'c1-l3-q4',
        'Toca la nota más grave del pentagrama (1ª línea, Mi).',
        'Mi',
        'E4',
        '¡Perfecto! Mi en 1ª línea.'
      ),
      createStaveClickExercise(
        'c1-l3-q5',
        'Toca la nota más aguda del pentagrama (5ª línea, Fa).',
        'Fa',
        'F5',
        '¡Excelente! Fa en 5ª línea.'
      ),
    ],
  },
];

// Helper to fill all 10 lessons for Chapter 1
for (let i = 4; i <= 10; i++) {
  chapter1Lessons.push({
    id: `c1-l${i}`,
    chapterId: 1,
    lessonNumber: i,
    title: `1.${i} Dominio de las 5 líneas y 4 espacios`,
    objective: `Reforzar la ubicación visual de líneas y espacios (${i <= 7 ? 'Líneas 1 a 4' : 'Espacios 1 a 4'}) y discriminación auditiva.`,
    theory: {
      text: [
        `En esta lección consolidamos el mapa espacial del pentagrama.`,
        'Cada nota ocupa de forma exclusiva una línea (atravesada por ella) o un espacio (entre dos líneas).',
        'Una nota jamás se coloca a medias: o es nota de línea o es nota de espacio.',
      ],
      diagramNotes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter', syllable: 'Línea 1' },
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter', syllable: 'Espacio 1' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: 'Línea 2' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter', syllable: 'Espacio 2' },
      ],
      keyTakeaway: 'Alternancia perfecta: Línea → Espacio → Línea → Espacio.',
    },
    guidedExample: {
      instruction: 'Escucha cómo se asciende alternando una línea y un espacio.',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
      ],
      hint: 'Fíjate en cómo la cabeza de la nota cambia de estar atravesada a estar libre.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c1-l${i}-q1`,
        'Si una nota está en la 2ª línea, ¿dónde se encuentra la siguiente nota superior inmediata?',
        'Escala consecutiva.',
        ['En la 3ª línea', 'En el 2º espacio', 'En el 1º espacio', 'En la 1ª línea'],
        'En el 2º espacio',
        '¡Correcto! Tras la 2ª línea viene el 2º espacio.'
      ),
      createStaveClickExercise(
        `c1-l${i}-q2`,
        'Toca la nota Sol (2ª línea).',
        'Sol',
        'G4',
        '¡Bien localizado! Sol en 2ª línea.'
      ),
      createRhythmChoiceExercise(
        `c1-l${i}-q3`,
        '¿Las notas de línea tienen su óvalo atravesado por la línea?',
        'Morfología de la nota.',
        ['Sí, la línea cruza justo por el centro de la cabeza', 'No, se apoyan encima', 'Depende de la clave', 'Solo si son redondas'],
        'Sí, la línea cruza justo por el centro de la cabeza',
        '¡Exacto! La línea divide el óvalo de la nota por la mitad.'
      ),
      createStaveClickExercise(
        `c1-l${i}-q4`,
        'Toca la 1ª línea (Mi).',
        'Mi',
        'E4',
        '¡Buen trabajo!'
      ),
      createNoteIdExercise(
        `c1-l${i}-q5`,
        '¿Qué nota es la que define la clave de sol en la 2ª línea?',
        'G4',
        'Sol',
        '¡Excelente! La nota Sol.',
        ['Do', 'Re', 'Si']
      ),
    ],
  });
}

// ----------------------------------------------------
// CHAPTER 2: Notas en las líneas del pentagrama (Mi, Sol, Si, Re, Fa)
// ----------------------------------------------------
const chapter2Lessons: Lesson[] = [
  {
    id: 'c2-l1',
    chapterId: 2,
    lessonNumber: 1,
    title: '2.1 Mi y Sol (1ª y 2ª línea)',
    objective: 'Aprender y diferenciar con precisión las dos primeras líneas: Mi (1ª línea) y Sol (2ª línea).',
    theory: {
      text: [
        'Las cinco líneas del pentagrama en clave de sol son: MI, SOL, SI, RE, FA.',
        'La 1ª línea (la de más abajo) es MI (Mi4).',
        'La 2ª línea (la que abraza la clave de sol) es SOL (Sol4).',
        'Entre Mi y Sol hay una tercera de distancia.',
      ],
      diagramNotes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'half', syllable: 'Mi (1ª)' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'half', syllable: 'Sol (2ª)' },
      ],
      keyTakeaway: '1ª línea = MI | 2ª línea = SOL',
      mnemonic: 'Memoriza las líneas en orden: Mi - Sol - Si - Re - Fa.',
    },
    guidedExample: {
      instruction: 'Escucha la diferencia entre Mi (1ª línea) y Sol (2ª línea).',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
      ],
      hint: 'Mi es más grave que Sol.',
    },
    exercises: [
      createNoteIdExercise('c2-l1-q1', '¿Qué nota está situada en la 1ª línea?', 'E4', 'Mi', '¡Correcto! La 1ª línea es Mi.', ['Sol', 'Fa', 'Re']),
      createNoteIdExercise('c2-l1-q2', '¿Qué nota está situada en la 2ª línea?', 'G4', 'Sol', '¡Correcto! La 2ª línea es Sol.', ['Mi', 'Si', 'Do']),
      createStaveClickExercise('c2-l1-q3', 'Haz clic sobre la nota Mi (1ª línea).', 'Mi', 'E4', '¡Perfecto! Has hecho clic en Mi (1ª línea).'),
      createStaveClickExercise('c2-l1-q4', 'Haz clic sobre la nota Sol (2ª línea).', 'Sol', 'G4', '¡Muy bien! Sol en 2ª línea.'),
      createNoteIdExercise('c2-l1-q5', 'Identifica esta nota en la 1ª línea:', 'E4', 'Mi', '¡Excelente! Es la nota Mi.', ['Sol', 'La', 'Si']),
    ],
  },
  {
    id: 'c2-l2',
    chapterId: 2,
    lessonNumber: 2,
    title: '2.2 Si (3ª línea, la línea central)',
    objective: 'Reconocer la nota Si en la 3ª línea del pentagrama, que marca el centro de la pauta.',
    theory: {
      text: [
        'La 3ª línea del pentagrama es la línea CENTRAL y corresponde a la nota SI (Si4).',
        'Por convención estética musical, a partir de la 3ª línea las plicas (palitos) de las notas suelen dirigirse hacia abajo por la izquierda.',
        'Las tres primeras líneas son: MI (1ª), SOL (2ª) y SI (3ª).',
      ],
      diagramNotes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter', syllable: '1ª Mi' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: '2ª Sol' },
        { pitch: 'B4', name: 'Si', octave: 4, duration: 'quarter', syllable: '3ª Si' },
      ],
      keyTakeaway: '3ª línea central = SI',
      mnemonic: 'Mi - Sol - Si',
    },
    guidedExample: {
      instruction: 'Escucha la tríada de las tres primeras líneas: Mi, Sol y Si.',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'B4', name: 'Si', octave: 4, duration: 'quarter' },
      ],
      hint: '¡Estas tres notas forman el acorde de Mi menor!',
    },
    exercises: [
      createNoteIdExercise('c2-l2-q1', '¿Qué nota está situada en la 3ª línea (la línea del medio)?', 'B4', 'Si', '¡Correcto! En la 3ª línea vive el Si.', ['Sol', 'Mi', 'Re']),
      createStaveClickExercise('c2-l2-q2', 'Toca en el pentagrama la nota Si (3ª línea).', 'Si', 'B4', '¡Excelente! Si en 3ª línea.'),
      createNoteIdExercise('c2-l2-q3', 'Identifica esta nota en la 2ª línea:', 'G4', 'Sol', '¡Muy bien! Es Sol.', ['Mi', 'Si', 'Fa']),
      createNoteIdExercise('c2-l2-q4', 'Identifica esta nota en la 1ª línea:', 'E4', 'Mi', '¡Perfecto! Es Mi.', ['Si', 'Sol', 'Do']),
      createStaveClickExercise('c2-l2-q5', 'Toca de nuevo la nota central Si (3ª línea).', 'Si', 'B4', '¡Acertaste! Si en 3ª línea.'),
    ],
  },
  {
    id: 'c2-l3',
    chapterId: 2,
    lessonNumber: 3,
    title: '2.3 Re y Fa (4ª y 5ª línea)',
    objective: 'Completar el conocimiento de las cinco líneas con Re (4ª línea) y Fa (5ª línea).',
    theory: {
      text: [
        'Las dos líneas superiores del pentagrama son:',
        '4ª línea = RE (Re5).',
        '5ª línea = FA (Fa5).',
        'Ahora ya conoces las CINCO LÍNEAS completas: MI - SOL - SI - RE - FA.',
      ],
      diagramNotes: [
        { pitch: 'D5', name: 'Re', octave: 5, duration: 'quarter', syllable: '4ª Re' },
        { pitch: 'F5', name: 'Fa', octave: 5, duration: 'quarter', syllable: '5ª Fa' },
      ],
      keyTakeaway: 'Líneas: Mi (1ª), Sol (2ª), Si (3ª), Re (4ª), Fa (5ª).',
      mnemonic: 'Mi Sol Siempre Reluce Fuerte (Mi - Sol - Si - Re - Fa).',
    },
    guidedExample: {
      instruction: 'Escucha las 5 notas de las líneas sonando en orden ascendente.',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'B4', name: 'Si', octave: 4, duration: 'quarter' },
        { pitch: 'D5', name: 'Re', octave: 5, duration: 'quarter' },
        { pitch: 'F5', name: 'Fa', octave: 5, duration: 'quarter' },
      ],
      hint: 'Todas las notas de línea van saltando de tercera en tercera.',
    },
    exercises: [
      createNoteIdExercise('c2-l3-q1', '¿Qué nota está situada en la 4ª línea?', 'D5', 'Re', '¡Correcto! En la 4ª línea está Re.', ['Fa', 'Si', 'Mi']),
      createNoteIdExercise('c2-l3-q2', '¿Qué nota está situada en la 5ª línea (superior)?', 'F5', 'Fa', '¡Exacto! En la 5ª línea está Fa.', ['Re', 'Sol', 'Si']),
      createStaveClickExercise('c2-l3-q3', 'Haz clic sobre la nota Fa (5ª línea).', 'Fa', 'F5', '¡Bien! 5ª línea = Fa.'),
      createStaveClickExercise('c2-l3-q4', 'Haz clic sobre la nota Re (4ª línea).', 'Re', 'D5', '¡Genial! 4ª línea = Re.'),
      createRhythmChoiceExercise(
        'c2-l3-q5',
        '¿Cuál es el orden completo de las 5 líneas de abajo hacia arriba?',
        'Repasa la regla mnemotécnica.',
        ['Mi - Sol - Si - Re - Fa', 'Fa - La - Do - Mi - Sol', 'Do - Re - Mi - Fa - Sol', 'Mi - Fa - Sol - La - Si'],
        'Mi - Sol - Si - Re - Fa',
        '¡Magistral! Mi, Sol, Si, Re, Fa son las 5 líneas del pentagrama.'
      ),
    ],
  },
];

// Fill rest of Chapter 2 (lessons 4-10) with progressive line reading drills
for (let i = 4; i <= 10; i++) {
  const linePitches: StaveNote['pitch'][] = ['E4', 'G4', 'B4', 'D5', 'F5'];
  const lineNames: StaveNote['name'][] = ['Mi', 'Sol', 'Si', 'Re', 'Fa'];
  const targetIdx = (i - 4) % 5;

  chapter2Lessons.push({
    id: `c2-l${i}`,
    chapterId: 2,
    lessonNumber: i,
    title: `2.${i} Entrenamiento de Líneas: Lectura Fluida`,
    objective: `Agilizar la identificación instantánea sin titubeos de las notas en las 5 líneas (Mi, Sol, Si, Re, Fa).`,
    theory: {
      text: [
        'Para leer con fluidez no debemos contar las líneas una a una, sino reconocer la nota por su dibujo y posición.',
        'Practica el salto visual entre líneas contiguas y alternas.',
        `Enfoque especial en: ${lineNames[targetIdx]} (${targetIdx + 1}ª línea).`,
      ],
      diagramNotes: [
        { pitch: linePitches[targetIdx], name: lineNames[targetIdx], octave: targetIdx > 2 ? 5 : 4, duration: 'half' },
      ],
      keyTakeaway: 'Reconocimiento visual inmediato de las 5 líneas.',
    },
    guidedExample: {
      instruction: `Escucha y observa la posición de ${lineNames[targetIdx]} en la línea ${targetIdx + 1}.`,
      notes: [{ pitch: linePitches[targetIdx], name: lineNames[targetIdx], octave: 4, duration: 'half' }],
      hint: `Recuerda: Línea ${targetIdx + 1} = ${lineNames[targetIdx]}.`,
    },
    exercises: [
      createNoteIdExercise(`c2-l${i}-q1`, `Identifica esta nota de línea:`, linePitches[targetIdx], lineNames[targetIdx], `¡Correcto! Es ${lineNames[targetIdx]}.`, ['Do', 'La', lineNames[(targetIdx + 1) % 5]]),
      createNoteIdExercise(`c2-l${i}-q2`, `Identifica esta nota en la 3ª línea (central):`, 'B4', 'Si', '¡Muy bien! 3ª línea es Si.', ['Mi', 'Sol', 'Re']),
      createStaveClickExercise(`c2-l${i}-q3`, `Toca en el pentagrama la nota ${lineNames[targetIdx]}.`, lineNames[targetIdx], linePitches[targetIdx], `¡Excelente! Localizaste ${lineNames[targetIdx]}.`),
      createNoteIdExercise(`c2-l${i}-q4`, `Identifica esta nota en la 1ª línea:`, 'E4', 'Mi', '¡Correcto! 1ª línea es Mi.', ['Fa', 'Si', 'Re']),
      createStaveClickExercise(`c2-l${i}-q5`, `Toca la nota ${lineNames[(targetIdx + 2) % 5]} en el pentagrama.`, lineNames[(targetIdx + 2) % 5], linePitches[(targetIdx + 2) % 5], '¡Muy bien hecho!'),
    ],
  });
}

// ----------------------------------------------------
// CHAPTER 3: Notas en los espacios (Fa, La, Do, Mi)
// ----------------------------------------------------
const chapter3Lessons: Lesson[] = [
  {
    id: 'c3-l1',
    chapterId: 3,
    lessonNumber: 1,
    title: '3.1 Fa y La (1º y 2º espacio)',
    objective: 'Reconocer las notas en los dos primeros espacios del pentagrama: Fa (1º espacio) y La (2º espacio).',
    theory: {
      text: [
        'Entre las 5 líneas del pentagrama se forman 4 espacios.',
        'Las notas en los espacios se sitúan limpiamente entre dos líneas, sin ser cruzadas.',
        '1º espacio (entre línea 1 y 2) = FA (Fa4).',
        '2º espacio (entre línea 2 y 3) = LA (La4).',
      ],
      diagramNotes: [
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter', syllable: '1º Fa' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter', syllable: '2º La' },
      ],
      keyTakeaway: '1º espacio = Fa | 2º espacio = La',
      mnemonic: 'Los cuatro espacios forman la palabra en inglés: F-A-C-E (Fa, La, Do, Mi).',
    },
    guidedExample: {
      instruction: 'Escucha los dos primeros espacios: Fa (1º espacio) y La (2º espacio).',
      notes: [
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter' },
      ],
      hint: 'La nota La está justo encima de la línea de Sol.',
    },
    exercises: [
      createNoteIdExercise('c3-l1-q1', '¿Qué nota está situada en el 1º espacio?', 'F4', 'Fa', '¡Correcto! El 1º espacio es Fa.', ['Mi', 'Sol', 'La']),
      createNoteIdExercise('c3-l1-q2', '¿Qué nota está situada en el 2º espacio?', 'A4', 'La', '¡Exacto! El 2º espacio es La.', ['Si', 'Do', 'Fa']),
      createStaveClickExercise('c3-l1-q3', 'Haz clic sobre la nota Fa (1º espacio).', 'Fa', 'F4', '¡Perfecto! 1º espacio = Fa.'),
      createStaveClickExercise('c3-l1-q4', 'Haz clic sobre la nota La (2º espacio).', 'La', 'A4', '¡Muy bien! 2º espacio = La.'),
      createNoteIdExercise('c3-l1-q5', 'Identifica esta nota en el 1º espacio:', 'F4', 'Fa', '¡Excelente! Es la nota Fa.', ['Re', 'Sol', 'Mi']),
    ],
  },
  {
    id: 'c3-l2',
    chapterId: 3,
    lessonNumber: 2,
    title: '3.2 Do y Mi (3º y 4º espacio)',
    objective: 'Reconocer Do (3º espacio) y Mi (4º espacio) completando los 4 espacios del pentagrama.',
    theory: {
      text: [
        'Los dos espacios superiores son:',
        '3º espacio (entre línea 3 y 4) = DO (Do5 o Do agudo).',
        '4º espacio (entre línea 4 y 5) = MI (Mi5 o Mi agudo).',
        'Los cuatro espacios en orden ascendente son: FA - LA - DO - MI.',
      ],
      diagramNotes: [
        { pitch: 'C5', name: 'Do', octave: 5, duration: 'quarter', syllable: '3º Do' },
        { pitch: 'E5', name: 'Mi', octave: 5, duration: 'quarter', syllable: '4º Mi' },
      ],
      keyTakeaway: 'Espacios: Fa (1º), La (2º), Do (3º), Mi (4º).',
      mnemonic: 'FA - LA - DO - MI (¡Fa-La-Do-Mi!).',
    },
    guidedExample: {
      instruction: 'Escucha los 4 espacios en orden: Fa, La, Do, Mi.',
      notes: [
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter' },
        { pitch: 'C5', name: 'Do', octave: 5, duration: 'quarter' },
        { pitch: 'E5', name: 'Mi', octave: 5, duration: 'quarter' },
      ],
      hint: '¡Estos cuatro espacios forman el acorde de Fa mayor con séptima mayor!',
    },
    exercises: [
      createNoteIdExercise('c3-l2-q1', '¿Qué nota está en el 3º espacio?', 'C5', 'Do', '¡Correcto! En el 3º espacio está Do5.', ['La', 'Mi', 'Si']),
      createNoteIdExercise('c3-l2-q2', '¿Qué nota está en el 4º espacio (superior)?', 'E5', 'Mi', '¡Muy bien! 4º espacio es Mi5.', ['Fa', 'Do', 'Re']),
      createStaveClickExercise('c3-l2-q3', 'Toca en el pentagrama la nota Do (3º espacio).', 'Do', 'C5', '¡Bien hecho! Do en 3º espacio.'),
      createStaveClickExercise('c3-l2-q4', 'Toca en el pentagrama la nota Mi (4º espacio).', 'Mi', 'E5', '¡Genial! Mi en 4º espacio.'),
      createRhythmChoiceExercise(
        'c3-l2-q5',
        '¿Cuál es el orden completo de los 4 espacios de abajo hacia arriba?',
        'Los 4 espacios.',
        ['Fa - La - Do - Mi', 'Mi - Sol - Si - Re', 'Do - Re - Mi - Fa', 'La - Do - Mi - Sol'],
        'Fa - La - Do - Mi',
        '¡Impresionante! Fa, La, Do, Mi son los 4 espacios.'
      ),
    ],
  },
];

// Fill rest of Chapter 3 (lessons 3-10) with space drills
for (let i = 3; i <= 10; i++) {
  const spacePitches: StaveNote['pitch'][] = ['F4', 'A4', 'C5', 'E5'];
  const spaceNames: StaveNote['name'][] = ['Fa', 'La', 'Do', 'Mi'];
  const targetIdx = (i - 3) % 4;

  chapter3Lessons.push({
    id: `c3-l${i}`,
    chapterId: 3,
    lessonNumber: i,
    title: `3.${i} Agilidad en Espacios: Fa, La, Do, Mi`,
    objective: `Reforzar la lectura rápida de los 4 espacios sin confusión con las notas de líneas.`,
    theory: {
      text: [
        `Repaso activo del espacio ${targetIdx + 1}: ${spaceNames[targetIdx]}.`,
        'Observa que la nota Mi aparece dos veces en el pentagrama: en la 1ª línea (grave) y en el 4º espacio (agudo).',
        'Igualmente la nota Fa aparece en el 1º espacio (grave) y en la 5ª línea (agudo).',
      ],
      diagramNotes: [
        { pitch: spacePitches[targetIdx], name: spaceNames[targetIdx], octave: targetIdx > 1 ? 5 : 4, duration: 'half' },
      ],
      keyTakeaway: `Espacio ${targetIdx + 1} = ${spaceNames[targetIdx]}`,
    },
    guidedExample: {
      instruction: `Escucha la nota ${spaceNames[targetIdx]} del espacio ${targetIdx + 1}.`,
      notes: [{ pitch: spacePitches[targetIdx], name: spaceNames[targetIdx], octave: 4, duration: 'quarter' }],
      hint: `Espacio ${targetIdx + 1}.`,
    },
    exercises: [
      createNoteIdExercise(`c3-l${i}-q1`, `Identifica esta nota de espacio:`, spacePitches[targetIdx], spaceNames[targetIdx], `¡Correcto! Es ${spaceNames[targetIdx]}.`, ['Sol', 'Si', 'Re']),
      createStaveClickExercise(`c3-l${i}-q2`, `Toca la nota ${spaceNames[targetIdx]} en el pentagrama.`, spaceNames[targetIdx], spacePitches[targetIdx], '¡Muy bien!'),
      createNoteIdExercise(`c3-l${i}-q3`, `Identifica esta nota en el 2º espacio:`, 'A4', 'La', '¡Excelente! 2º espacio es La.', ['Mi', 'Fa', 'Sol']),
      createNoteIdExercise(`c3-l${i}-q4`, `Identifica esta nota en el 3º espacio:`, 'C5', 'Do', '¡Perfecto! 3º espacio es Do.', ['Si', 'Re', 'La']),
      createStaveClickExercise(`c3-l${i}-q5`, `Toca el 4º espacio (Mi).`, 'Mi', 'E5', '¡Buenísimo!'),
    ],
  });
}

// ----------------------------------------------------
// Helper to build remaining chapters 4 to 12
// ----------------------------------------------------
function buildChapter(
  chapterId: number,
  title: string,
  subtitle: string,
  description: string,
  color: string,
  iconName: string,
  generator: (lessonNum: number) => Lesson
): Chapter {
  const lessons: Lesson[] = [];
  for (let l = 1; l <= 10; l++) {
    lessons.push(generator(l));
  }
  return { id: chapterId, title, subtitle, description, color, iconName, lessons };
}

// Chapter 4: Lectura combinada líneas + espacios (Do4 a Do5)
const chapter4 = buildChapter(
  4,
  'Capítulo 4 – Lectura combinada líneas y espacios',
  'Escala de Do4 central a Do5',
  'Integración fluida de líneas y espacios para leer la escala diatónica completa sin vacilar.',
  '#E63946',
  'Activity',
  (l) => ({
    id: `c4-l${l}`,
    chapterId: 4,
    lessonNumber: l,
    title: `4.${l} Lectura combinada: Grados ${l <= 5 ? 'inferiores' : 'superiores'}`,
    objective: `Integrar el movimiento conjunto de línea a espacio contiguo (escala de Do central a Do agudo).`,
    theory: {
      text: [
        'En una escala diatónica, cada nota pasa de una línea a un espacio y de un espacio a una línea.',
        'Do4 (línea adicional) → Re4 (espacio bajo) → Mi4 (1ª línea) → Fa4 (1º espacio) → Sol4 (2ª línea) → La4 (2º espacio) → Si4 (3ª línea) → Do5 (3º espacio).',
        `Lección de integración y fluidez paso a paso.`,
      ],
      diagramNotes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter' },
        { pitch: 'D4', name: 'Re', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter' },
      ],
      keyTakeaway: 'La melodía asciende paso a paso alternando línea y espacio.',
    },
    guidedExample: {
      instruction: 'Escucha una melodía que sube y baja entre líneas y espacios.',
      notes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'C5', name: 'Do', octave: 5, duration: 'quarter' },
      ],
      hint: 'Do central está en una línea adicional debajo del pentagrama.',
    },
    exercises: [
      createNoteIdExercise(`c4-l${l}-q1`, '¿Qué nota es esta (1ª línea)?', 'E4', 'Mi', '¡Correcto! 1ª línea = Mi.', ['Fa', 'Sol', 'Re']),
      createNoteIdExercise(`c4-l${l}-q2`, '¿Qué nota es esta (1º espacio)?', 'F4', 'Fa', '¡Exacto! 1º espacio = Fa.', ['Mi', 'Sol', 'La']),
      createNoteIdExercise(`c4-l${l}-q3`, '¿Qué nota es esta (2ª línea)?', 'G4', 'Sol', '¡Muy bien! 2ª línea = Sol.', ['La', 'Fa', 'Si']),
      createNoteIdExercise(`c4-l${l}-q4`, '¿Qué nota es esta (2º espacio)?', 'A4', 'La', '¡Perfecto! 2º espacio = La.', ['Sol', 'Si', 'Do']),
      createStaveClickExercise(`c4-l${l}-q5`, 'Haz clic sobre la nota central Si (3ª línea).', 'Si', 'B4', '¡Excelente!'),
    ],
  })
);

// Chapter 5: Notas fuera del pentagrama (Líneas adicionales)
const chapter5 = buildChapter(
  5,
  'Capítulo 5 – Notas fuera del pentagrama',
  'Líneas adicionales inferiores y superiores',
  'Aprende a leer el Do central (Do4), Re4, Si3, La3 y notas agudas como Sol5, La5 y Do6.',
  '#1D3557',
  'Layers',
  (l) => ({
    id: `c5-l${l}`,
    chapterId: 5,
    lessonNumber: l,
    title: `5.${l} Líneas adicionales: ${l <= 5 ? 'Zona inferior (Do central, Re4, Si3)' : 'Zona superior (Sol5, La5, Si5, Do6)'}`,
    objective: `Dominar las notas que escapan a las 5 líneas mediante líneas adicionales cortas.`,
    theory: {
      text: [
        'Cuando una melodía es demasiado grave o aguda para caber en las 5 líneas, usamos LÍNEAS ADICIONALES.',
        'Do central (Do4) se escribe sobre una pequeña línea horizontal debajo del pentagrama.',
        'Re4 se apoya justo debajo de la 1ª línea (sin línea adicional atravesada).',
        'La5 se sitúa sobre la primera línea adicional superior.',
      ],
      diagramNotes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'half', syllable: 'Do Central' },
        { pitch: 'D4', name: 'Re', octave: 4, duration: 'half', syllable: 'Re bajo línea' },
        { pitch: 'A5', name: 'La', octave: 5, duration: 'half', syllable: 'La agudo' },
      ],
      keyTakeaway: 'Las líneas adicionales extienden el pentagrama hacia los graves o agudos.',
    },
    guidedExample: {
      instruction: 'Escucha el Do central (Do4), la nota de referencia para pianistas y cantantes.',
      notes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'half' },
        { pitch: 'D4', name: 'Re', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
      ],
      hint: 'Do4 está en una pequeña línea debajo del pentagrama.',
    },
    exercises: [
      createNoteIdExercise(`c5-l${l}-q1`, 'Identifica la nota en la 1ª línea adicional inferior (Do central):', 'C4', 'Do', '¡Correcto! Es Do central (Do4).', ['Re', 'Si', 'La']),
      createNoteIdExercise(`c5-l${l}-q2`, 'Identifica la nota que cuelga directamente bajo la 1ª línea (sin raya):', 'D4', 'Re', '¡Exacto! Es Re4.', ['Do', 'Mi', 'Fa']),
      createStaveClickExercise(`c5-l${l}-q3`, 'Haz clic sobre el Do central (1ª línea adicional inferior).', 'Do', 'C4', '¡Magnífico! Has tocado el Do central.'),
      createNoteIdExercise(`c5-l${l}-q4`, 'Identifica la nota situada en la 1ª línea adicional superior:', 'A5', 'La', '¡Excelente! Es La5 agudo.', ['Sol', 'Si', 'Fa']),
      createStaveClickExercise(`c5-l${l}-q5`, 'Toca la nota Re justo debajo de la primera línea.', 'Re', 'D4', '¡Muy bien hecho!'),
    ],
  })
);

// Chapter 6: Figuras rítmicas básicas (Redonda, Blanca, Negra, Corchea)
const chapter6 = buildChapter(
  6,
  'Capítulo 6 – Figuras rítmicas básicas',
  'Redonda, Blanca, Negra y Corcheas',
  'Descubre la duración del sonido: 4 tiempos, 2 tiempos, 1 tiempo y medio tiempo.',
  '#E63946',
  'Clock',
  (l) => ({
    id: `c6-l${l}`,
    chapterId: 6,
    lessonNumber: l,
    title: `6.${l} Figuras Rítmicas: ${l <= 3 ? 'Redonda y Blanca' : l <= 7 ? 'Negra y Corcheas' : 'Combinaciones Rítmicas'}`,
    objective: 'Comprender el valor relativo de las figuras y ejecutar pulsaciones precisas.',
    theory: {
      text: [
        'REDONDA (óvalo blanco sin plica) = 4 tiempos.',
        'BLANCA (óvalo blanco con plica) = 2 tiempos.',
        'NEGRA (óvalo negro con plica) = 1 tiempo (la unidad de pulso habitual).',
        'CORCHEA (óvalo negro con plica y corchete) = 1/2 tiempo (dos corcheas equivalen a 1 negra).',
      ],
      diagramNotes: [
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'whole', syllable: '4 tiempos' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'half', syllable: '2 tiempos' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: '1 tiempo' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'eighth', syllable: '1/2 tiempo' },
      ],
      keyTakeaway: '1 Redonda = 2 Blancas = 4 Negras = 8 Corcheas.',
      mnemonic: 'Redonda (Ta-a-a-a), Blanca (Ta-a), Negra (Ta), Corcheas (Ti-ti).',
    },
    guidedExample: {
      instruction: 'Escucha una secuencia rítmica: una blanca (2 tiempos) seguida de dos negras (1 tiempo cada una).',
      notes: [
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'half' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
      ],
      hint: '2 + 1 + 1 = 4 tiempos completos.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c6-l${l}-q1`,
        '¿Cuántos tiempos dura una Redonda en un compás de 4/4?',
        'Figura de mayor duración.',
        ['1 tiempo', '2 tiempos', '3 tiempos', '4 tiempos'],
        '4 tiempos',
        '¡Correcto! La redonda dura 4 pulsos enteros.'
      ),
      createRhythmChoiceExercise(
        `c6-l${l}-q2`,
        '¿Cuántas negras caben en el valor de una Blanca?',
        'Equivalencia matemática.',
        ['1 negra', '2 negras', '4 negras', '3 negras'],
        '2 negras',
        '¡Muy bien! Una blanca (2 tiempos) equivale exactamente a 2 negras (1+1).'
      ),
      createRhythmChoiceExercise(
        `c6-l${l}-q3`,
        '¿Cuánto dura una Corchea individual en relación a la Negra?',
        'Subdivisión.',
        ['El doble (2 tiempos)', 'La mitad (1/2 tiempo)', 'Un tercio', 'Igual'],
        'La mitad (1/2 tiempo)',
        '¡Exacto! Dos corcheas juntas suman 1 tiempo completo.'
      ),
      createRhythmTapExercise(
        `c6-l${l}-q4`,
        'Marca con precisión los 4 pulsos de negras con el metrónomo (1, 2, 3, 4):',
        [1, 2, 3, 4],
        ['Ta', 'Ta', 'Ta', 'Ta'],
        85,
        '¡Buen trabajo manteniendo el pulso estable!'
      ),
      createRhythmChoiceExercise(
        `c6-l${l}-q5`,
        'Si sumamos una Blanca (2) + una Negra (1) + dos Corcheas (1/2 + 1/2), ¿cuántos tiempos tenemos en total?',
        'Suma de duraciones.',
        ['3 tiempos', '4 tiempos', '5 tiempos', '2 tiempos'],
        '4 tiempos',
        '¡Excelente cálculo musical! 2 + 1 + 0.5 + 0.5 = 4 tiempos.'
      ),
    ],
  })
);

// Chapter 7: Silencios y su valor
const chapter7 = buildChapter(
  7,
  'Capítulo 7 – Los silencios y su valor',
  'La música en el espacio silencioso',
  'El silencio tiene duración exacta: silencio de redonda, blanca, negra y corchea.',
  '#1D3557',
  'VolumeX',
  (l) => ({
    id: `c7-l${l}`,
    chapterId: 7,
    lessonNumber: l,
    title: `7.${l} Silencios: ${l <= 4 ? 'Silencio de Negra y Blanca' : 'Silencio de Redonda y Corchea'}`,
    objective: 'Reconocer los símbolos de silencio e interpretar pausas rítmicas precisas.',
    theory: {
      text: [
        'El silencio en música no es ausencia de ritmo, sino ritmo sin sonido.',
        'Silencio de redonda: pequeño rectángulo que CUELGA debajo de la 4ª línea (4 tiempos).',
        'Silencio de blanca: pequeño rectángulo que REPOSA sobre la 3ª línea (2 tiempos).',
        'Silencio de negra: símbolo en forma de rayo o zigzag estilizado (1 tiempo).',
        'Silencio de corchea: parecido a un número 7 con punto (1/2 tiempo).',
      ],
      diagramNotes: [
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: 'Sonido' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: 'Silencio' },
      ],
      keyTakeaway: 'Cada figura rítmica tiene su silencio equivalente con la misma duración.',
    },
    guidedExample: {
      instruction: 'Escucha la alternancia: Nota, Silencio, Nota, Silencio.',
      notes: [
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
      ],
      hint: 'Respeta el pulso incluso cuando no haya sonido sonando.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c7-l${l}-q1`,
        '¿Cuántos tiempos de pausa representa un silencio de negra?',
        'Duración del silencio.',
        ['1 tiempo', '2 tiempos', '1/2 tiempo', '4 tiempos'],
        '1 tiempo',
        '¡Correcto! El silencio de negra dura 1 tiempo completo.'
      ),
      createRhythmChoiceExercise(
        `c7-l${l}-q2`,
        '¿Dónde se dibuja el silencio de blanca?',
        'Posición en el pentagrama.',
        ['Colgando de la 4ª línea', 'Reposando sobre la 3ª línea', 'En el 1º espacio', 'En la 1ª línea'],
        'Reposando sobre la 3ª línea',
        '¡Exacto! El silencio de blanca reposa arriba de la 3ª línea como un sombrero.'
      ),
      createRhythmChoiceExercise(
        `c7-l${l}-q3`,
        '¿Cuántos tiempos dura el silencio de redonda?',
        'Silencio mayor.',
        ['2 tiempos', '3 tiempos', '4 tiempos', '1 tiempo'],
        '4 tiempos',
        '¡Muy bien! Dura 4 tiempos completos.'
      ),
      createRhythmTapExercise(
        `c7-l${l}-q4`,
        'Toca en el tiempo 1 y 3 (el tiempo 2 y 4 son silencio):',
        [1, 3],
        ['Ta', 'Silencio', 'Ta', 'Silencio'],
        75,
        '¡Excelente dominio del silencio y la pausa!'
      ),
      createRhythmChoiceExercise(
        `c7-l${l}-q5`,
        'Si un compás tiene una blanca (2 tiempos) y un silencio de blanca, ¿cuántos tiempos suma?',
        'Suma con silencio.',
        ['2 tiempos', '3 tiempos', '4 tiempos', '1 tiempo'],
        '4 tiempos',
        '¡Perfecto! 2 de sonido + 2 de silencio = 4 tiempos.'
      ),
    ],
  })
);

// Chapter 8: Compases simples (2/4, 3/4, 4/4)
const chapter8 = buildChapter(
  8,
  'Capítulo 8 – Compases simples',
  'Métrica, compás de 2/4, 3/4 y 4/4',
  'Aprende a agrupar los pulsos en casillas regulares separadas por líneas divisorias.',
  '#E63946',
  'Columns',
  (l) => ({
    id: `c8-l${l}`,
    chapterId: 8,
    lessonNumber: l,
    title: `8.${l} Compases: ${l <= 3 ? 'Compás de 2/4 (Binario)' : l <= 7 ? 'Compás de 3/4 (Vals)' : 'Compás de 4/4 (Cuaternario)'}`,
    objective: 'Reconocer la cifra de compás, sumar los tiempos en cada casilla y marcar los acentos métricos.',
    theory: {
      text: [
        'Las líneas verticales que atraviesan el pentagrama se llaman LÍNEAS DIVISORIAS y forman COMPASES.',
        'Compás de 2/4: Entran 2 negras por compás (Fuerte - débil). Ritmo de marcha.',
        'Compás de 3/4: Entran 3 negras por compás (Fuerte - débil - débil). Ritmo de vals.',
        'Compás de 4/4 (o compasillo C): Entran 4 negras por compás.',
      ],
      diagramNotes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter', syllable: '1' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter', syllable: '2' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: '3' },
        { pitch: 'C5', name: 'Do', octave: 5, duration: 'quarter', syllable: '4' },
      ],
      keyTakeaway: 'El numerador indica cuántos tiempos caben; el denominador indica qué figura vale 1 tiempo (4 = negra).',
    },
    guidedExample: {
      instruction: 'Escucha el compás de 3/4 acentuando el primer pulso.',
      notes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
      ],
      hint: 'UN - dos - tres, UN - dos - tres.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c8-l${l}-q1`,
        'En un compás de 3/4, ¿cuántos tiempos de negra caben exactamente en cada compás?',
        'Lectura de cifra.',
        ['2 tiempos', '3 tiempos', '4 tiempos', '6 tiempos'],
        '3 tiempos',
        '¡Correcto! El número superior (3) indica 3 pulsos por compás.'
      ),
      createRhythmChoiceExercise(
        `c8-l${l}-q2`,
        '¿Cuál es la figura que llena por sí sola un compás entero de 4/4?',
        'Figura completa.',
        ['Una Blanca', 'Una Redonda', 'Dos Negras', 'Cuatro Corcheas'],
        'Una Redonda',
        '¡Muy bien! La redonda vale 4 tiempos y llena exactamente el 4/4.'
      ),
      createRhythmTapExercise(
        `c8-l${l}-q3`,
        'Marca los 3 pulsos de un compás de 3/4:',
        [1, 2, 3],
        ['UN', 'dos', 'tres'],
        90,
        '¡Fantástico ritmo de 3/4!'
      ),
      createRhythmChoiceExercise(
        `c8-l${l}-q4`,
        'En un compás de 2/4, ¿puede haber una redonda?',
        'Regla de compás.',
        ['No, porque la redonda vale 4 tiempos y el compás solo admite 2', 'Sí, siempre', 'Solo con ligadura', 'Depende de la clave'],
        'No, porque la redonda vale 4 tiempos y el compás solo admite 2',
        '¡Exacto! Una redonda superaría la capacidad de un compás de 2/4.'
      ),
      createRhythmChoiceExercise(
        `c8-l${l}-q5`,
        '¿Qué línea indica el final definitivo de una pieza musical?',
        'Notación final.',
        ['Línea simple', 'Doble barra final (una fina y una gruesa)', 'Línea de puntos', 'Sin línea'],
        'Doble barra final (una fina y una gruesa)',
        '¡Excelente! La doble barra final cierra la partitura.'
      ),
    ],
  })
);

// Chapter 9: Puntillos, ligaduras y alteraciones (sostenido, bemol, becuadro)
const chapter9 = buildChapter(
  9,
  'Capítulo 9 – Puntillos, ligaduras y alteraciones',
  'Expansión temporal y modificación tímbrica',
  'El puntillo añade la mitad del valor; las alteraciones modifican la nota medio tono.',
  '#1D3557',
  'Hash',
  (l) => ({
    id: `c9-l${l}`,
    chapterId: 9,
    lessonNumber: l,
    title: `9.${l} Expresión: ${l <= 4 ? 'El Puntillo y la Ligadura' : 'Sostenido (♯), Bemol (♭) y Becuadro (♮)'}`,
    objective: 'Interpretar notas con puntillo, ligaduras de prolongación y alteraciones cromáticas.',
    theory: {
      text: [
        'EL PUNTILLO: colocado a la derecha de la cabeza de la nota, añade la MITAD de su valor original.',
        'Blanca con puntillo = 2 + 1 = 3 tiempos.',
        'Negra con puntillo = 1 + 0.5 = 1.5 tiempos (suele seguirle una corchea).',
        'SOSTENIDO (♯): sube el sonido un semitono (medio tono más agudo).',
        'BEMOL (♭): baja el sonido un semitono (medio tono más grave).',
        'BECUADRO (♮): anula el efecto de cualquier sostenido o bemol previo.',
      ],
      diagramNotes: [
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'half', dotted: true, syllable: '3 tiempos' },
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter', accidental: 'sharp', syllable: 'Fa sostenido' },
        { pitch: 'B4', name: 'Si', octave: 4, duration: 'quarter', accidental: 'flat', syllable: 'Si bemol' },
      ],
      keyTakeaway: 'Puntillo = +50% duración | ♯ = sube medio tono | ♭ = baja medio tono | ♮ = restaura.',
    },
    guidedExample: {
      instruction: 'Escucha una blanca con puntillo sostenida durante 3 tiempos exactos.',
      notes: [{ pitch: 'G4', name: 'Sol', octave: 4, duration: 'half', dotted: true }],
      hint: 'Dura exactamente lo mismo que 3 negras unidas.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c9-l${l}-q1`,
        '¿Cuánto dura una Blanca con puntillo?',
        'Cálculo con puntillo.',
        ['2 tiempos', '3 tiempos', '4 tiempos', '2.5 tiempos'],
        '3 tiempos',
        '¡Correcto! Blanca (2) + mitad (1) = 3 tiempos.'
      ),
      createRhythmChoiceExercise(
        `c9-l${l}-q2`,
        '¿Qué efecto produce el signo de Sostenido (♯) sobre una nota?',
        'Efecto del sostenido.',
        ['Baja medio tono', 'Sube un semitono (medio tono)', 'Duplica la duración', 'Silencia la nota'],
        'Sube un semitono (medio tono)',
        '¡Muy bien! El sostenido eleva la afinación un semitono.'
      ),
      createRhythmChoiceExercise(
        `c9-l${l}-q3`,
        '¿Qué signo anula un sostenido o bemol devolviendo la nota a su estado natural?',
        'Restauración.',
        ['El calderón', 'El becuadro (♮)', 'La doble barra', 'El puntillo'],
        'El becuadro (♮)',
        '¡Exacto! El becuadro neutraliza la alteración.'
      ),
      createNoteIdExercise(
        `c9-l${l}-q4`,
        'Identifica esta nota alterada (Fa con sostenido):',
        'F4',
        'Fa',
        '¡Muy bien! Es la nota Fa (en este caso con sostenido).',
        ['Sol', 'Mi', 'La']
      ),
      createRhythmChoiceExercise(
        `c9-l${l}-q5`,
        '¿Para qué sirve una ligadura de prolongación entre dos notas de la misma altura?',
        'Ligadura.',
        ['Para cambiar de nota rápidamente', 'Para sumar las duraciones de ambas notas en un solo sonido continuo', 'Para tocar más fuerte', 'Para separar los compases'],
        'Para sumar las duraciones de ambas notas en un solo sonido continuo',
        '¡Excelente! La ligadura une sus duraciones sin volver a articular.'
      ),
    ],
  })
);

// Chapter 10: Intervalos y lectura melódica
const chapter10 = buildChapter(
  10,
  'Capítulo 10 – Intervalos y lectura melódica',
  'Distancia entre notas: segundas, terceras, cuartas, quintas y octavas',
  'Entrena el ojo para reconocer el tamaño del salto melódico sin deletrear.',
  '#E63946',
  'GitCommit',
  (l) => ({
    id: `c10-l${l}`,
    chapterId: 10,
    lessonNumber: l,
    title: `10.${l} Intervalos: ${l <= 3 ? 'Segundas (paso contiguo)' : l <= 6 ? 'Terceras (salto línea a línea)' : 'Quintas y Octavas'}`,
    objective: 'Reconocer intervalos melódicos a primera vista y anticipar su sonido.',
    theory: {
      text: [
        'Un INTERVALO es la distancia en altura entre dos notas musicales.',
        'SEGUNDA: de una línea al espacio inmediato (o viceversa). Es un paso contiguo (ej. Do → Re).',
        'TERCERA: de una línea a la siguiente línea, o de un espacio al siguiente espacio (ej. Do → Mi).',
        'QUINTA: salto amplio de consonancia perfecta (ej. Do → Sol).',
        'OCTAVA: la misma nota pero en el registro siguiente (ej. Do4 → Do5).',
      ],
      diagramNotes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter', syllable: 'Do' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter', syllable: '3ª (Mi)' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: '5ª (Sol)' },
      ],
      keyTakeaway: 'Línea a línea contigua = Tercera | Línea a espacio contiguo = Segunda.',
    },
    guidedExample: {
      instruction: 'Escucha el salto de 3ª (Do a Mi) y luego el de 5ª (Do a Sol).',
      notes: [
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'C4', name: 'Do', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
      ],
      hint: 'Nota cómo la 5ª suena abierta y hueca.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c10-l${l}-q1`,
        '¿Qué intervalo hay entre la 1ª línea (Mi) y la 2ª línea (Sol)?',
        'Línea a línea consecutiva.',
        ['Segunda', 'Tercera', 'Cuarta', 'Quinta'],
        'Tercera',
        '¡Correcto! Saltar de una línea a la inmediata siguiente es siempre un intervalo de tercera.'
      ),
      createRhythmChoiceExercise(
        `c10-l${l}-q2`,
        '¿Qué intervalo hay entre la 1ª línea (Mi) y el 1º espacio (Fa)?',
        'Paso inmediato.',
        ['Segunda', 'Tercera', 'Unísono', 'Octava'],
        'Segunda',
        '¡Muy bien! Es un paso contiguo, una segunda.'
      ),
      createRhythmChoiceExercise(
        `c10-l${l}-q3`,
        '¿Qué intervalo hay entre el Do central (Do4) y el Do del tercer espacio (Do5)?',
        'Misma nota en registro agudo.',
        ['Quinta', 'Sexta', 'Séptima', 'Octava'],
        'Octava',
        '¡Exacto! Es una octava justa.'
      ),
      createStaveClickExercise(
        `c10-l${l}-q4`,
        'Toca la nota Sol (2ª línea) para formar una quinta desde el Do central.',
        'Sol',
        'G4',
        '¡Brillante! Do a Sol es una quinta.'
      ),
      createRhythmChoiceExercise(
        `c10-l${l}-q5`,
        'Si vas del 1º espacio (Fa) al 2º espacio (La), ¿qué intervalo has recorrido?',
        'Espacio a espacio consecutivo.',
        ['Segunda', 'Tercera', 'Cuarta', 'Quinta'],
        'Tercera',
        '¡Excelente! De espacio a espacio consecutivo siempre hay una tercera.'
      ),
    ],
  })
);

// Chapter 11: Solfeo rítmico hablado (lectura con sílabas rítmicas)
const chapter11 = buildChapter(
  11,
  'Capítulo 11 – Solfeo rítmico hablado',
  'Lectura hablada con sílabas rítmicas universales',
  'Aprende a vocalizar el ritmo: Ta, Ti-Ti, Ta-a, Tiri-Tiri con pulsación constante.',
  '#1D3557',
  'Mic',
  (l) => ({
    id: `c11-l${l}`,
    chapterId: 11,
    lessonNumber: l,
    title: `11.${l} Sílabas rítmicas: ${l <= 3 ? 'Ta y Ti-Ti' : l <= 7 ? 'Síncopas y Contratiempos' : 'Lectura Fluida' }`,
    objective: 'Vocalizar con precisión rítmica usando el método de sílabas pedagógicas.',
    theory: {
      text: [
        'El solfeo rítmico hablado permite interiorizar la duración antes de preocuparse por la afinación.',
        'NEGRA = "Ta"',
        'DOS CORCHEAS = "Ti - Ti"',
        'BLANCA = "Ta - a"',
        'REDONDA = "Ta - a - a - a"',
        'CUATRO SEMICORCHEAS = "Ti - ri - ti - ri"',
      ],
      diagramNotes: [
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter', syllable: 'Ta' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'eighth', syllable: 'Ti' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'eighth', syllable: 'Ti' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'half', syllable: 'Ta - a' },
      ],
      keyTakeaway: 'Vocalizar las sílabas alinea la respiración con el pulso musical.',
    },
    guidedExample: {
      instruction: 'Escucha el patrón: Ta, Ti-Ti, Ta, Ta.',
      notes: [
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'eighth' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'eighth' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter' },
        { pitch: 'A4', name: 'La', octave: 4, duration: 'quarter' },
      ],
      hint: 'Pronuncia en voz alta mientras escuchas cada golpe.',
    },
    exercises: [
      createRhythmChoiceExercise(
        `c11-l${l}-q1`,
        '¿Qué sílaba rítmica se utiliza habitualmente para dos corcheas?',
        'Sílabas pedagógicas.',
        ['Ta - Ta', 'Ti - Ti', 'Ta - a', 'Tiri - tiri'],
        'Ti - Ti',
        '¡Correcto! Ti-Ti representa dos corcheas ágiles.'
      ),
      createRhythmChoiceExercise(
        `c11-l${l}-q2`,
        '¿Cómo se lee con sílabas una Blanca (2 tiempos)?',
        'Vocalización de blanca.',
        ['Ta', 'Ta - a', 'Ti - Ti', 'Ta - a - a - a'],
        'Ta - a',
        '¡Muy bien! Ta-a sostiene el sonido durante 2 pulsos.'
      ),
      createRhythmTapExercise(
        `c11-l${l}-q3`,
        'Entrena el patrón: Ta (1), Ti-Ti (2 y 2.5), Ta (3), Ta (4):',
        [1, 2, 2.5, 3, 4],
        ['Ta', 'Ti', 'Ti', 'Ta', 'Ta'],
        80,
        '¡Excelente precisión rítmica!'
      ),
      createRhythmChoiceExercise(
        `c11-l${l}-q4`,
        '¿Qué es un contratiempo en música?',
        'Concepto métrico.',
        ['Una nota que suena en tiempo débil precedida de silencio en tiempo fuerte', 'Un error del músico', 'Un cambio de clave', 'Una nota muy rápida'],
        'Una nota que suena en tiempo débil precedida de silencio en tiempo fuerte',
        '¡Exacto! El contratiempo articula tras el pulso fuerte.'
      ),
      createRhythmChoiceExercise(
        `c11-l${l}-q5`,
        'En un compás de 4/4 con: Negra, 2 Corcheas, Blanca. ¿Cómo se lee?',
        'Lectura completa.',
        ['Ta, Ti-Ti, Ta-a', 'Ta, Ta, Ta, Ta', 'Ti-Ti, Ta, Ta-a', 'Ta-a, Ti-Ti, Ta'],
        'Ta, Ti-Ti, Ta-a',
        '¡Magistral! Negra (Ta) + 2 Corcheas (Ti-Ti) + Blanca (Ta-a).'
      ),
    ],
  })
);

// Chapter 12: Solfeo rítmico-melódico avanzado (interpretación completa)
const chapter12 = buildChapter(
  12,
  'Capítulo 12 – Solfeo rítmico-melódico avanzado',
  'Interpretación completa: altura, ritmo y expresión musical',
  'Integración total para leer y entonar frases musicales reales con soltura profesional.',
  '#E63946',
  'Trophy',
  (l) => ({
    id: `c12-l${l}`,
    chapterId: 12,
    lessonNumber: l,
    title: `12.${l} Solfeo Integral: ${l <= 4 ? 'Melodías Clásicas (Himno a la Alegría)' : l <= 8 ? 'Cánones y Polirritmia' : 'Graduación LecMus'}`,
    objective: 'Interpretar fragmentos musicales reales integrando nombre de nota, afinación y duración rítmica.',
    theory: {
      text: [
        '¡Has llegado al nivel culminante de LecMus!',
        'El solfeo completo une la vista (lectura del pentagrama), el cerebro (reconocimiento del intervalo y valor), el oído (preescucha interna) y la voz o manos (ejecución).',
        'Al solfear una obra real, mantén el tempo sin detenerte ante un pequeño error.',
      ],
      diagramNotes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter', syllable: 'Mi' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter', syllable: 'Mi' },
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter', syllable: 'Fa' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter', syllable: 'Sol' },
      ],
      keyTakeaway: 'La lectura musical fluida es como leer un libro: lees frases enteras, no letras aisladas.',
    },
    guidedExample: {
      instruction: 'Escucha el inicio del célebre "Himno a la Alegría" de Beethoven (Mi - Mi - Fa - Sol).',
      notes: [
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'E4', name: 'Mi', octave: 4, duration: 'quarter' },
        { pitch: 'F4', name: 'Fa', octave: 4, duration: 'quarter' },
        { pitch: 'G4', name: 'Sol', octave: 4, duration: 'quarter' },
      ],
      hint: 'Todas son figuras de negra a tiempo regular.',
    },
    exercises: [
      createNoteIdExercise(`c12-l${l}-q1`, 'En el inicio del Himno a la Alegría, ¿cuál es la primera nota (1ª línea)?', 'E4', 'Mi', '¡Correcto! Empieza en Mi.', ['Sol', 'Fa', 'Re']),
      createNoteIdExercise(`c12-l${l}-q2`, 'Identifica la nota hacia la que asciende la melodía en la 2ª línea:', 'G4', 'Sol', '¡Muy bien! Sube hasta Sol.', ['Do', 'Mi', 'La']),
      createStaveClickExercise(`c12-l${l}-q3`, 'Toca la nota de resolución Do central (1ª línea adicional inferior).', 'Do', 'C4', '¡Perfecto! Has resuelto en la tónica Do.'),
      createRhythmTapExercise(
        `c12-l${l}-q4`,
        'Interpreta el compás final marcando los 4 pulsos con metrónomo a 90 BPM:',
        [1, 2, 3, 4],
        ['Mi', 'Re', 'Do', 'Do'],
        90,
        '¡Interpretación rítmica impecable!'
      ),
      createRhythmChoiceExercise(
        `c12-l${l}-q5`,
        '¿Cuál es el secreto de un solfeo fluido a primera vista?',
        'Pedagogía musical.',
        ['Mirar siempre un compás por delante de lo que estás cantando o tocando', 'Tocar lo más rápido posible', 'Memorizar sin leer', 'Nunca usar metrónomo'],
        'Mirar siempre un compás por delante de lo que estás cantando o tocando',
        '¡Extraordinario! La visión anticipada es la clave de todo músico profesional. ¡Felicidades!'
      ),
    ],
  })
);

// All 12 Chapters with exactly 10 lessons each = 120 lessons total!
export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    title: 'Capítulo 1 – Fundamentos del pentagrama y clave de sol',
    subtitle: 'Líneas, espacios y ubicación de la clave',
    description: 'Aprende los pilares de la escritura musical: las 5 líneas y 4 espacios contados de abajo hacia arriba y el nacimiento de la clave de Sol en 2ª línea.',
    color: '#E63946',
    iconName: 'BookOpen',
    lessons: chapter1Lessons,
  },
  {
    id: 2,
    title: 'Capítulo 2 – Notas en las líneas del pentagrama',
    subtitle: 'Mi, Sol, Si, Re, Fa',
    description: 'Domina las 5 notas que reposan sobre las líneas: Mi4, Sol4, Si4, Re5 y Fa5 con mnemotecnias y reconocimiento instantáneo.',
    color: '#1D3557',
    iconName: 'AlignJustify',
    lessons: chapter2Lessons,
  },
  {
    id: 3,
    title: 'Capítulo 3 – Notas en los espacios',
    subtitle: 'Fa, La, Do, Mi',
    description: 'Descubre las notas situadas en los 4 espacios: Fa4, La4, Do5 y Mi5, formando el acorde Fa-La-Do-Mi.',
    color: '#E63946',
    iconName: 'Maximize2',
    lessons: chapter3Lessons,
  },
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
  chapter11,
  chapter12,
];

// Flat list of all 120 lessons for quick lookup
export const ALL_LESSONS: Record<string, Lesson> = {};
CHAPTERS_DATA.forEach((ch) => {
  ch.lessons.forEach((les) => {
    ALL_LESSONS[les.id] = les;
  });
});
