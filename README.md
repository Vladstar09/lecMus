# LecMus - Lectura Musical y Solfeo Progresivo en Clave de Sol

**LecMus** es una micro aplicación web educativa y moderna diseñada para guiar al estudiante desde el nivel cero (sin conocimientos previos) hasta la lectura musical fluida y el solfeo rítmico-melódico en clave de sol.

---

## 🎨 Identidad Visual y Paleta de Colores

- **Rojo Primario / Acento:** `#E63946` / `#D62828`
  - Utilizado en llamadas a la acción primarias (CTAs), botones interactivos, playhead del metrónomo, notas activas y acentos clave.
- **Azul Secundario / Fondo & Texto:** `#1D3557` / `#0A192F`
  - Utilizado en cabeceras, tarjetas estructuradas, bordes sutiles y textos de alta legibilidad.
- **Lienzo Neutro:** `#F8FAFC`
- **Tipografía:** Plus Jakarta Sans (geométrica, moderna y de máxima legibilidad).

---

## 📚 Estructura Curricular: 12 Capítulos × 10 Lecciones = 120 Lecciones

1. **Capítulo 1 – Fundamentos del pentagrama y la clave de sol:**
   - 5 líneas y 4 espacios contados de abajo hacia arriba.
   - El nacimiento de la clave de Sol en la 2ª línea.
   - Discriminación visual entre notas de línea y notas de espacio.
2. **Capítulo 2 – Notas en las líneas del pentagrama:**
   - Mi4 (1ª línea), Sol4 (2ª línea), Si4 (3ª línea), Re5 (4ª línea) y Fa5 (5ª línea).
   - Mnemotecnia: *Mi Sol Siempre Reluce Fuerte*.
3. **Capítulo 3 – Notas en los espacios:**
   - Fa4 (1º espacio), La4 (2º espacio), Do5 (3º espacio) y Mi5 (4º espacio).
   - Mnemotecnia internacional: *F-A-C-E / Fa-La-Do-Mi*.
4. **Capítulo 4 – Lectura combinada líneas + espacios:**
   - Escala diatónica completa de Do4 central a Do5 agudo.
   - Movimiento conjunto y saltos interválicos.
5. **Capítulo 5 – Notas fuera del pentagrama:**
   - Líneas adicionales inferiores: Do central (Do4), Re4, Si3, La3.
   - Líneas adicionales superiores: Sol5, La5, Si5, Do6.
6. **Capítulo 6 – Figuras rítmicas básicas:**
   - Redonda (4 tiempos), Blanca (2 tiempos), Negra (1 tiempo) y Corcheas (1/2 tiempo).
7. **Capítulo 7 – Los silencios y su valor:**
   - Silencio de redonda, blanca, negra y corchea con pausas métricas exactas.
8. **Capítulo 8 – Compases simples:**
   - Compás de 2/4 (binario), 3/4 (ternario/vals) y 4/4 (cuaternario). Líneas divisorias y doble barra.
9. **Capítulo 9 – Puntillos, ligaduras y alteraciones:**
   - El puntillo (+50%), ligadura de prolongación, sostenido (♯), bemol (♭) y becuadro (♮).
10. **Capítulo 10 – Intervalos y lectura melódica:**
    - Segundas, terceras, cuartas, quintas y octavas.
11. **Capítulo 11 – Solfeo rítmico hablado:**
    - Lectura con sílabas pedagógicas (*Ta*, *Ti-Ti*, *Ta-a*, *Tiri-Tiri*).
12. **Capítulo 12 – Solfeo rítmico-melódico avanzado:**
    - Interpretación musical de obras clásicas (Himno a la Alegría, Frère Jacques) y examen de graduación.

---

## 🎹 Funcionalidades Interactivas Clave

1. **Pentagrama Profesional con VexFlow 5 (Renderizado SVG):**
   - Grabado musical de nivel de conservatorio en tiempo real usando **VexFlow 5**.
   - Clave de sol con espiral de alta precisión en 2ª línea, plicas orientadas acústicamente, cabezas elípticas de grabado editorial, corcheas con banderas/barras de unión y silencios auténticos.
   - Modo interactivo para responder haciendo clic directamente sobre las líneas y espacios del pentagrama grabado de VexFlow con halo y previsualización.
2. **Motor de Audio con Web Audio API:**
   - Síntesis polifónica sin latencia para notas desde C3 hasta C6 con armónicos y caída natural.
   - Timbres seleccionables: Piano, Sintetizador y Campana.
3. **Entrenador de Pulso y Tapping Rítmico:**
   - Medición de precisión temporal en milisegundos con cursor en tiempo real y detección de toques tempranos/tardíos/perfectos.
4. **Metrónomo Profesional Integrado:**
   - Rango de 40 a 220 BPM, tap tempo interactivo, compases 2/4, 3/4, 4/4, 6/8 e indicador visual de pulso.
5. **Desafío "Lectura a Primera Vista":**
   - Modo contrarreloj de 30s, 45s o 60s con racha de combos, multiplicador y registro de récords.
6. **Reconocimiento de Voz Opcional (Web Speech API):**
   - El estudiante puede cantar o nombrar las notas al micrófono ("Sol", "Do", "Mi").
7. **Gamificación y Persistencia:**
   - Sistema de XP, estrellas (1 a 3), racha diaria calculada por fecha, 9 medallas desbloqueables y almacenamiento automático en `localStorage`.

---

## 🚀 Instalación y Puesta en Marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo en puerto 3000
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 📁 Estructura del Proyecto

```text
├── index.html                   # Entry point HTML con tipografía Plus Jakarta Sans
├── lecciones.json               # Esquema curricular completo (12 caps × 10 lecciones)
├── metadata.json                # Metadatos del applet LecMus
├── package.json                 # Dependencias
├── src/
│   ├── App.tsx                  # Componente raíz con navegación y estado global
│   ├── index.css                # Estilos globales con Tailwind v4
│   ├── main.tsx                 # Bootstrap de React 19
│   ├── types/
│   │   └── music.ts             # Tipos de TypeScript (StaveNote, Lesson, Chapter, Stats)
│   ├── services/
│   │   ├── audioEngine.ts       # Motor de síntesis de notas y metrónomo con Web Audio
│   │   └── storageService.ts    # Persistencia en localStorage, medallas y estadísticas
│   ├── data/
│   │   └── lessonsData.ts       # Base de datos curricular completa (120 lecciones)
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx       # Barra de navegación superior (Contrato de 3 zonas)
│       │   └── Footer.tsx       # Pie de página institucional
│       ├── music/
│       │   ├── MusicStave.tsx   # Pentagrama SVG interactivo con clave de sol
│       │   ├── MetronomeTool.tsx # Metrónomo con tap tempo y pulsos visuales
│       │   ├── RhythmTapTrainer.tsx # Tapping rítmico con precisión temporal
│       │   └── SightReadingTrainer.tsx # Entrenamiento de velocidad a primera vista
│       ├── views/
│       │   ├── ChapterMapView.tsx # Mapa general de los 12 capítulos con progreso
│       │   ├── ChapterDetailView.tsx # Lista de las 10 lecciones del capítulo
│       │   ├── LessonView.tsx   # Experiencia de lección (Teoría, Ejemplo, 5 Ejercicios)
│       │   └── StatsAndBadgesView.tsx # Perfil, estadísticas y medallas
│       └── modals/
│           └── SettingsModal.tsx # Configuración de audio, timbre y notación
```
