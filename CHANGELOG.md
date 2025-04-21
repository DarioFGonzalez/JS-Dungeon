# Changelog

Todas las modificaciones importantes a este proyecto serán documentadas en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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