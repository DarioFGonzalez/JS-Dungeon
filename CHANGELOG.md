# Changelog

Todas las modificaciones importantes a este proyecto serán documentadas en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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