# Changelog

Todas las modificaciones importantes a este proyecto serán documentadas en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v0.0.8] - 2025-04-24

### Added
- **Visualización de estados alterados (DoT)**: ahora se muestra una barra que refleja los efectos activos sobre el jugador (veneno, sangrado, quemadura). Estos estados se acumulan (stackean) correctamente y desaparecen una vez que el último efecto correspondiente se disipa.
- Contadores específicos para cada tipo de estado alterado (`bleedTicks`, `poisonTicks`, `burnTicks`), permitiendo seguimiento independiente de duración y stackeo.
- Estados locales (`bleeding`, `poisoned`, `burning`) que representan la activación de efectos persistentes en el jugador, usados tanto en la lógica de daño como en el render.

### Changed
- Refactorizada la función `hurtPlayer()` para soportar múltiples efectos DoT simultáneos, con control de duración y aplicación individual.
- Centralizada la lógica de estado alterado: se actualizan las cargas visuales y los efectos en tiempo real conforme cada DoT es aplicado o finalizado.

### Notes
- Los timers de cada DoT son independientes; no hay aún una gestión centralizada de todos los efectos activos.
- No se implementó aún una función de purga (`cleansePlayer()`), pero se considera a futuro para control manual de estados.

---

## [v0.0.7] - 2025-04-23

### Added
- Sistema de **Daño en el Tiempo (DoT)** implementado: efectos persistentes de fuego, veneno y sangrado que impactan la vida del jugador de manera progresiva.
- Nuevos enemigos y trampas con efectos DoT:
  - `'f'`: fuego que inflige daño inicial más DoT de quemadura al ser pisado. Incluye retroceso (knockback) de una celda.
  - `'t'`: trampa venenosa que aplica DoT de veneno.
  - `'E'`: enemigo tipo "heavy" que causa sangrado al contacto.
- Efectos visuales y retroalimentación en pantalla para representar el tipo de daño recibido y su duración.

### Changed
- Refactorizada la función `hurtPlayer()` para contemplar tanto daño directo como acumulativo por DoT.
- Separadas y mejoradas las funciones `touchEnemy()` y `stepOnTrap()` para diferenciar entre tipos de enemigos y trampas, aplicando efectos según corresponda.
- Incorporada nueva función `walkOntoFire()`: gestiona la lógica de contacto con fuego, aplica daño inicial, retroceso y estado de DoT.

---

## [v0.0.6] - 2025-04-22

### Added
- Sistema de **enemigos básicos**: aparecen en el mapa y pueden bloquear el movimiento del jugador.
- Implementadas **placas trampa** (`'t'`): activan efectos al ser pisadas, como pérdida de vida.
- Mecánica de **vida y muerte del jugador**: si la vida llega a cero, se reinicia el juego (placeholder actual).

### Changed
- Refactorizada la función `isAtSpecialTile()`: fue eliminada y reemplazada por una validación directa más eficiente.
- Limpieza de funciones innecesarias y llamadas sin propósito detectadas durante revisión de código.
- Reemplazo de valores hardcodeados para el tamaño del mapa (`18`) por una variable global `mapSize` para mejorar la escalabilidad.

---

## [v0.0.5] - 2025-04-21

### Added
- Soporte para **teleportación de cajas**: ahora las cajas (`'B'`) también pueden usar teleportadores si el destino está libre.
- Implementado el concepto de **teleportador bloqueado**: si el punto de salida está ocupado (por una caja, jugador, muro, etc.), el TP se considera no disponible.
- Ampliado el uso de `residual` para conservar el contenido anterior en celdas con teleportadores y cajas.
- Lógica para que el jugador no pueda tpear si la salida está bloqueada (mensajes de feedback incluidos).

### Changed
- Reorganizada la función `handleTp()` para contemplar objetos distintos al jugador y validar condiciones de uso.
- Separadas responsabilidades entre detección de colisiones, control de movimiento y efectos colaterales (como TP, empuje, etc.).

---

## [v0.0.4] - 2025-04-20

### Added
- Sistema de **teleportadores** (`'T'`) implementado: permite transportar al jugador entre dos puntos del mapa.
- Hook `useState` para almacenar coordenadas de teleports y gestionar su comportamiento dinámico.
- Función `handleTp()` para manejar lógica de activación y transporte.
- Introducción del estado `residual`: conserva el contenido original de la celda anterior al movimiento del jugador (ej: `T`, trampas, placas, etc.).

### Changed
- Ajustada la lógica de movimiento sobre celdas vacías (`'empty'`) para contemplar el uso de `residual` sin afectar el flujo base.

---

## [v0.0.3] - 2025-04-20

### Added
- Mecánica de empuje de cajas (`'B'`) implementada.
- Validación de colisión entre jugador, caja y espacio disponible.
- Fallback `inconsecuente()` para manejar intentos de movimiento inválidos.
- Modularización de lógica con funciones `checkCollision()` y `pushBox()`.

### Fixed
- Error de referencia en eje de coordenadas (`nextY` → `newY`).

---

## [v0.0.2] - 2025-04-19

### Added
- Sistema de detección de colisiones basado en tipo de tile.
- Control de movimiento con teclado (`WASD`).
- Renderizado dinámico del jugador y el mapa.

---

## [v0.0.1] - 2025-04-18

### Added
- Primer commit funcional del engine.
- Mapa estático con renderizado inicial.
- Movimiento básico del jugador.