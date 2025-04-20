# Changelog

Todas las modificaciones importantes a este proyecto serán documentadas en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v0.0.3] - 2025-04-20

### Added
- Mecánica de empuje de cajas (`'B'`) implementada.
- Validaciones de colisión con caja, y espacio libre siguiente.
- Fallback `inconsecuente()` para movimientos inválidos.
- Modularización de lógica con `checkCollision`, `pushBox`.

### Fixed
- Bug por eje mal referenciado (`nextY` en vez de `newY`).

---

## [v0.0.2] - 2025-04-19

### Added
- Sistema de detección de colisiones basado en tipos de tile.
- Control de movimiento con teclas (`WASD`).
- Renderizado dinámico del jugador y el mapa.

---

## [v0.0.1] - 2025-04-18

### Added
- Primer commit funcional del engine.
- Mapa estático + render.
- Movimiento básico.