# DevLog - Diario de Combate

---

### 🔹 Paso 3: TPEAR CAJAS, BLOQUEAR PORTALES.

1. 👉📦🌀 ~~~~~~ 🌀 [habilitado]
2. 👉🌀❌ ~~~~~~ 📦 [bloqueado]

🗓️ *2025-04-21*

Primera pensada real que tuve que hacer en el proyecto. Hubo un par de bugs, un par de "¿Eh?... Ahhh".
Empieza a tomar forma, aunque **obviamente** está en SUPER pañales todo.

Los `Teleporters` aceptan transportar cajas ahora, pero el TP queda **bloqueado** hasta que saques la caja del otro lado, junto con toda la lógica interna y un `residual` que queda esperando a que el jugador libere el camino para volver a funcionar.

Esta adición me abrió los ojos a futuras optimizaciones, refactorizaciones y temas de escalabilidad que el proyecto va a necesitar sí o sí.
Divertido, satisfactorio. El progreso se siente placentero ♪

---

**🛠️ A nivel técnico:**
- Se creó la función `isAtSpecialTile` para detectar si el jugador está parado sobre un tile especial (TP, trampa, fuego, etc.), importante para el sistema de `residual`.
- Se refactorizó `handleTp` para permitir tpear tanto al jugador como a cualquier otro objeto (enemigos, flechas, bombas, etc. 😈).
- Se agregó el case `'teleport'` dentro de `pushBox()` para incluir esta nueva posibilidad.

---

**👾 Futuro próximo / Ideas sueltas 🎯:**
- Debería... **debería** empezar a optimizar mi código, o en unos 6–7 parches va a ser un cableado injunable y poco disfrutable de trabajar.
- TP de cajas y bloqueo: LISTO ✅  
  ¿Siguiente? Si agrego fuego, enemigos o trampas, voy a tener que meter el factor `HP`. Mhmmh... Ya sé.
- Sistema de **vidas**: 3 hits. ¿Cae a 0? GAME OVER → Se bloquea el juego, se resetea el mapa y arranca la partida de nuevo.
- Pulirlo bonito y crear un enemigo estático que al tocarlo quite una vida y empuje un casillero para atrás—algo simple por ahora.

---

### 🔹 Paso 2: TELEPORT 👉🌀 `~~~~~~` 🌀👉
🗓️ *2025-04-20*

Tras mi primera victoria en forma de cajas, sentí la necesidad de implementar algo más "divertido" como siguiente meta —o iba a terminar mandando CVs a McDonald's (¿?).

`Teletransportarse` es una de esas mecánicas que pueden agregar muchísima complejidad: interacciones, lógica oculta, mecánicas avanzadas y más cositas. Así que decidí crear la **base funcional** de la misma y dejarla quietita en este push, para poder adelante hacerla `*explotar por los aires*` con experimentos locos y delirios místicos sin miedo a quedar en la lona 💥.

(Traducción: voy a testear/romper todo hasta que quede algo copado, o tenga que volver a esta versión en plan "retirada estratégica").

**A nivel técnico**:
- Se creó la función `handleTp` con la lógica principal de teletransportación.
- Se introdujo el estado `residual` para recordar qué tile había bajo el jugador antes de moverse, y restaurarlo al abandonar la casilla.
- Se refactorizó `movePlayer` para integrar esta nueva lógica sin romper otras colisiones.

**👾 Futuro próximo / Ideas sueltas 🎯**:
- Permitir que las cajas (`B`) pasen por teletransportadores (`T`). *(Combinación de mecánicas anteriores)*
- Bloquear `T` con una `B`, abriendo camino a mecánicas estratégicas (bloquear enemigos, trampas, emboscadas).
- Usar `residual` para empezar a experimentar con tiles peligrosos (🔥fuego, 💀trampas, 🩸estados negativos).

---

### 🔹 Paso 1: CAJAS 👉📦
🗓️ *2025-04-20*

Terminé con la lógica para que el personaje se mueva, que no pueda caminar más allá de los límites del mundo *y* que se detenga antes de dársela contra una pared (ojalá yo tuviera ese script, vivo llevándome cosas por delante).

Con el patio de juegos limpio y muchas ideas alborotándose en mi cabeza, decidí arrancar por algo simple: colisionar con un objeto movible y sus posibles consecuencias (bloquear salidas, pisar cosas, apretar botones, tapar pozos — *UFF, ideas, ¡IDEAS!*).

**A nivel técnico**:
- Se creó la función `checkCollision()` para determinar con qué tile se encuentra el jugador al intentar moverse.
- Se implementó `pushBox()` con la lógica de empuje condicional (requiere espacio libre).
- Se introdujo la función `inconsecuente()` para movimientos sin efecto, evitando duplicar lógica innecesaria en múltiples ramas condicionales.
- Se refactorizó código general para modularizar mejor comportamientos repetitivos y simplificar el flujo de `movePlayer()`.

**👾 Futuro próximo / Ideas sueltas 🎯**:
- Agregar teleports (`T`) para que el jugador pase de punto A al punto B de inmediato.
- Agregar puertas (`D`) y su lógica base (Activada = pasa, Desactivada = `inconsecuente()`).
- Crear interruptores (`S`) básicos (Activar/Desactivar algo cercano).
- Crear interacción entre *cajas* y *teleports* (bloquear, activar).

---
