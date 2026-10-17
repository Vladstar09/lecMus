# Animación de Celebración y Gamificación en LessonView

Implementación de retroalimentación visual reforzada al acertar ejercicios individuales en la vista de lecciones (`LessonView`), consistente en una **mini ráfaga sutil de confetti** orientada al botón/tarjeta activa y una **transición suave de pulso luminoso esmeralda/oro** con la paleta de identidad LecMus (`#E63946`, `#1D3557`, `#F59E0B`, `#FFFFFF`).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones confirmadas por el usuario:**
> 1. **Efecto de Acierto Individual**: Combinación de una **mini ráfaga sutil de confetti** (~35 partículas compactas sin tapar la lectura) + **pulso de borde/fondo esmeralda** sobre la tarjeta del ejercicio.
> 2. **Paleta del Confetti**: Gama cromática oficial de LecMus: Rojo primario (`#E63946`), Azul marino (`#1D3557`), Oro de estrellas (`#F59E0B`) y Blanco marfil (`#FFFFFF`).
> 3. **Distinción entre Acierto Parcial y Final de Lección**: La mini ráfaga de cada pregunta es sutil y de corta duración (600ms), mientras que al completar la lección entera (los 5 ejercicios) se mantiene la gran lluvia de celebración completa con fanfarria.

---

### 1. Overview & Core Concept

- **Objetivo**: Elevar la dopamina y el refuerzo positivo inmediato en la resolución de cada pregunta (identificación de notas, clics en el pentagrama, opciones de ritmo y tapping).
- **Sensación de usuario**: Cada acierto produce una micro-celebración que confirma visualmente el éxito sin interrumpir el ritmo cognitivo del estudiante.

---

### 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────┐
│ [✓] ¡Excelente acierto!                                │
│ Explicación pedagógica...                              │
│                                                        │
│           ✨ 🎊 Mini ráfaga de confetti ✨              │
│       (Rojo #E63946, Azul #1D3557, Oro #F59E0B)        │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │   [ Halo esmeralda pulsante temporal 300ms ]   │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

- **Comportamiento en acierto (`isAnswerCorrect === true`)**:
  - Disparo de `confetti({ particleCount: 35, spread: 55, startVelocity: 25, origin: { y: 0.7 }, colors: ['#E63946', '#1D3557', '#F59E0B', '#FFFFFF'], scalar: 0.85 })`.
  - Aplicación de clase de animación CSS `animate-pulse-glow` en la tarjeta de feedback con resplandor en verde esmeralda (`box-shadow: 0 0 15px rgba(16, 185, 129, 0.35)`).
  - Reproducción sincronizada del acorde de confirmación mediante `soundEngine.playSuccessSound()`.
- **Comportamiento en error**:
  - Suave sacudida sutil (`shake-error`) con borde coral rojizo (`#E63946`) y tono menor suave para invitar a la reflexión sin frustración.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Mini ráfaga localizada vs Confetti global expansivo**
  - *Enfoque*: Reducir el conteo a 30-35 partículas con escala `0.85` y velocidad inicial moderada (`startVelocity: 25`).
  - *Por qué*: Evita tapar el pentagrama VexFlow o el botón de siguiente pregunta y mantiene la fluidez en dispositivos móviles.
- **Decisión 2: Transición de color con Tailwind CSS**
  - *Enfoque*: Utilizar clases de transición `transition-all duration-300 ring-2 ring-emerald-500 bg-emerald-50/90` con halo para asegurar 60fps sin repintados pesados.

---

### 4. Technical Architecture & Integration Steps

1. **Ajuste en `src/components/views/LessonView.tsx`**:
   - En la función `markAnswer(isCorrect, answer)`:
     - Si `isCorrect === true`, llamar a la función auxiliar `triggerSuccessConfetti()`.
     - Activar estado temporal `justAnsweredCorrect` (duración ~700ms) para disparar la animación de brillo en la tarjeta.
2. **Definición de estilos de transición en Tailwind / CSS**:
   - Agregar micro-animación de escala y resplandor en `src/index.css` si es necesario, o usar utilidades existentes de Tailwind (`ring-2 ring-emerald-500 shadow-md shadow-emerald-500/20`).
3. **Validación y Pruebas**:
   - Ejecutar `lint_applet` y `compile_applet`.
   - Probar aciertos por clic en pentagrama y por botones de opción múltiple.
