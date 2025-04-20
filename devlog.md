# DevLog - Diario de Combate

---

## 🗓️ 2025-04-20

### Primer paso: CAJAS 👉📦
Terminé con la lógica para que el personaje se mueva, que no pueda caminar mas allá de los límites del mundo *y* que se detenga antes de dársela contra una pared (ojalá yo tuviera ese script, vivo llevándome cosas por delante).

Con el patio de juegos limpio y muchas ideas alborotándose en mi cabeza decidí arrancar por algo simple, colisionar con un objeto 'movible' y sus posibles consecuencias. (Bloquear salidas, quizá pisar cosas- apretar botones- tapar pozos- UFF, ideas *¡IDEAS!*)

En cuanto a código: Limpié y refactoricé un par de funciones, creé `inconsecuente()` // para movimientos nulos, sin efecto // para no andar reutilizando las mismas 6, 7 lineas de código por todos lados (lo vi un comportamiento que se repetía y lo hice función), bueno- obvio el `pushBox()` para la lógica de empujar cajas y `checkCollision()` para ver con que se está chocando el jugador.

---

## 👾 Futuro próximo / Ideas sueltas 🎯

- Agregar teleports (`T`) para que el jugador pase de punto A al punto B de inmediato.
- Agregar `puertas` y su lógica base (Activada= pasas, Desactivada= `inconsecuente()`)
- Crear `interruptores` básicos (Activar/Desactivar algo cercano).
- Crear interacción entre *cajas* y *teleports* (bloquear, activar).