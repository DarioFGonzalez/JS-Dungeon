# DevLog - Diario de Combate

## 🔹 Paso 9: Refactorización, centralización, orden y coherencia. ☝🤓✨

🗓️ *2025-04-30*

Refactoricé GRAN parte de la lógica `CORE` del proyecto. Habían demasiados estados locales independientes uno del otro pero a la vez compartiendo la misma función: **Modificar valores correspondientes al jugador.** Eso decía "REFACTORIZAME POR FAVOR" por todos lados, así que accedí a sus demandas. 

Residual, ticks de daño DoT, inventario, flags, **TODO** refactorizado línea por línea, como desarmando un reloj para ver por qué gira... y rearmándolo para que gire aún mejor. Fue un lindo baile, ahora siento que puedo caminar en el código sin tropezarme con un ejercito de estados independientes quizá rompiendose por **acá**- quizá rompiendose por **allá**.

Además de tratar de romperlo a cada rato a ver si aguantaba, cosa que hace, en medio de la inspiración refactorizadora (?) me encontré teniendo varias ideas para implementar -PERO NO- Resistí la tentación de mezclar objetivos y meter cambios que no entraban en el objetivo general de este sprint: Refactorizar y ordenar. Así que ahí vá- todo refactorizado para encajar en el estado local player (.Aliments, .HP, .HpMax, .Data, etc.). 

---

### 🛠️ A nivel técnico:

- `residual()` refactorizado para poder albergar muchos símbolos a la cola de espera para reaparecer.
- Lógica detras de `DoT` y `cleanse()` re-pensados para encajar con el nuevo modelo mas escalable girando entorno a Player.
- Inventario, HP, coordenadas de usuario- todo lo que tenga que ver con la instancia "jugador" fue centralizado en un solo objeto (estado local).

---

### 👾 Futuro próximo / Ideas sueltas 🎯:

- Tengo que meter el concepto de corta-curas urgente o me va a estallar una vena creativa jajaja 😂✨
- Enemigos que se muevan, primeramente.
- Enemigos que lastimen al jugador al chocarlo.
- Enemigos que reciban daño y puedan morir.

Si me sobra tiempo:

- Que el jugador tenga alguna clase de ataque.
- DROP RATES [¿ALPHA?]

---

## 🔹 Paso 8: Bases del inventario, consumir y recoger ítems 🎁💰✨

🗓️ *2025-04-26*

El paso anterior siempre me deja una ruta clara para el siguiente feature. Como ya creé sistemas de Curación y Cleanse de estados (sangrados y efectos), el siguiente paso lógico era permitir una interacción más estratégica con estos recursos: **inventario y hotkeys**. 💰✨

Ahora `el jugador puede encontrar ítems tirados en el piso` y, al pisarlos (si tiene espacio en el inventario), `los recoge` automáticamente, apilándolos. También puede `consumirlos`, respetando el conteo de existencias y un sistema de *cooldown* que evita el uso indiscriminado (¡nada de "cura, cura, cura" como estrategia! 😄).

Refactoricé toda la lógica pertinente para asegurar que los cambios sean **escalables y estables** a futuro. El mundo ahora puede dañarnos, y tenemos formas de contrarrestarlo: manejo de recursos, farmeo de ítems, enemigos que podrán dropear loot... **¡Se abren muchas posibilidades!**

---

### 🛠️ A nivel técnico:

A nivel de implementación, los principales métodos nuevos son:

- `stepOnItem()`: Verifica si hay espacio en el inventario y, de ser así, llama a `addToInventory()` para gestionar la recolección.
- `addToInventory()`: Maneja el almacenamiento de objetos, stacking de ítems y control de cantidades.
- `consumeItem()`: Se encarga de consumir ítems, validando requisitos de consumo y gestionando el cooldown posterior.
- Sistema de **Cooldown** agregado.
- Tipado explícito de objetos y funciones para garantizar consistencia y claridad futura.
- Introducción de hotkeys para consumo rápido.

---

### 👾 Futuro próximo / Ideas sueltas 🎯:

Antes de seguir sumando nuevas funcionalidades, priorizaré una **etapa de refactorización profunda**. Aunque me encantaría seguir creando features sin freno, es importante ser mi propio Team Leader y garantizar que la base de código sea sólida, limpia y escalable.

Si me llegara a sobrar tiempo después de refactorizar, planeo avanzar en:

- Crear enemigos que patrullen áreas, con lógica de colisión con el entorno.
- Integrar sistemas de interacción entre patrullas, jugadores, obstáculos y objetos del mundo.
- Implementar **Drop Rates** para ítems, abriendo la puerta al loot farming.

---

### 🔹 Paso 7: Cleanse, curación, "totems".
_🩺 ¡Ayudas! 💉_

🗓️ *2025-04-25*

Habiendo implementado el DoT en el parche pasado, lo más equilibrado para cerrar el ciclo es implementar lo opuesto. Curas, limpieza de estados alterados, Healing Over Time (**HoT**). Y eso es justamente lo que hice.

La `curación` y el **HoT** fueron mas sencillos de crear- tuve que refactorizar la función opuesta (hurtPlayer) para DAR vida en lugar de quitarla, mismo que el HoT- refactorizar DoT pero al revez.

Ahora el `Cleanse();`, fue un desafío un poco mas rebuscado. Tuve que guardar los.. bueno, detalles técnicos aparte- tuve que repensar como guardaba, aplicaba y seguía todos los daños para poder cancelar eficientemente todo. **Hermoso**, amo los desafíos lógicos.

Ahora tengo un mundo que puede equilibrarse solo: Dañar y curar- afectar y limpiar, poder tomar riesgos calculados sabiendo tomar contramedidas. *Complejidad*, ahhh- Herramientas para mañana.

---

**🛠️ A nivel técnico:**

- Creación de `cleanse()`: Recibe que estado, sino todos, deseas quitar- cancelando todo el daño que te faltaba recibir.
- useEffects y funciones relevantes refactorizadas para adaptarse al cambio.
- 'Totems' y hotKeys para limpiarse efectos negativos y curarse implementados.

---

**👾 Futuro próximo / Ideas sueltas 🎯:**

Mhmmh... Ahora que tengo Curaciones y Cleanse, podría incursionar en como equilibrar esto.
- Corta-Curaciones: Enemigos, totems, areas, trampas, algo que haga que el `heal();` activo se **DETENGA**.
- CD para curaciones: No poder darle al botón como metralleta para curarse infinitamente. Tampoco tirarse clean cada dos segundos, etc.
- IN-VEN-TA-RIO: ¿Curarse? ¿Parar sangrado?... ¿Quitar veneno? Suena a que solo podrías hacer eso con... ***el item correspondiente en el inventario***. 😈

---

### 🔹 Paso 6: StatusEffect, el inicio de los buff/debuffs. 😷✨💪 

🗓️ *2025-04-24*

Después de estancarme un poco con el tema de los corazones, la visual, lo responsive, asincronías de useState(); y dos o tres shutdowns porque *no soy exactamente *FANÁTICO* de crear detalles visuales* (👀🔪) me encontré escapando a un poco de **lógica pura y dura**. `StatusEffect` 👌💕

Cada nuevo DoT agrega un tick a la cola de estados alterados- pueden stackear todo lo que quieran y los metí en un label para darle mas estilo (barra de buffos) clásica de RPG.
```
StatusEffect: [Burning 🔥] [Bleeding🩸] [Poisoned💚]
HP: 💖💖💖💖💖🖤
```
Un paso en la dirección que originalmente apunté en el anterior devlog.md, pero que no es **exactamente** a lo que apunté en el anterior devlog.md por razones técnicas y de eficiencia. 

``Nota al pie:`` Intenté rushear un sistema de `cleanse()` pero aunque no me da el tiempo jajaja ya tengo una idea de como implementarlo en el siguiente parche. 🐱‍💻👾

---

**🛠️ A nivel técnico:**

- Refactorizado `hurtPlayer()` para seguir los ticks de DoT y sus finalizaciones.
- Agregado label que refleje los estados alterados actuales (acumulados) activos.
- Implementado sistema de ticks (cola) y estados (boolean) para saber que estado está activo y por cuanto tiempo más.

---

**👾 Futuro próximo / Ideas sueltas 🎯:**

- `Cleanse();` Obviamente 😎🐱‍💻´
- `Healing();` Alguna manera super [BETA] de curar al personaje.
- `Buffs`: Quizá meter un escudito, bufito de algún tipo- para aprovechar el statusEffect.

---

### 🔹 Paso 5: Sistema de Daño por Tiempo (DoT)
_Tantas maneras de causar DOLOR_ 😈🔥

🗓️ *2025-04-23*

***¡Ahhhhh!...*** Al fin llegó el primer golpazo de dopamina real jajaj. Ver cómo el HP seguía bajando después del golpe fue... `perfecto 👨‍💻💕`.

Con las funciones de DoT ahora refactorizadas y pensadas para escalar me siento como un nene al que le dieron un balde, una palita y lo dejaron en la playa 🧨✨.

```¡Tanto RAW MATERIAL con el que Jugar!```

---

**🛠️ A nivel técnico:**

- Refactorizada la función de daño `hurtPlayer()` para aplicar DoT al jugador. 🩸💀
- Agregada función `stepOntoFire()`: El fuego ahora daña, empuja y bloquea el paso. 🔥🚫
- Refactorizado `touchEnemy()` y `stepOnTrap()` para diferenciar tipos de enemigos y tipos de daño. ⚔🗡

---

**👾 Futuro próximo / Ideas sueltas 🎯:**

Quiero frenar un poco para pulir detalles visuales antes de seguir avanzando.

### 📌  Indicadores visuales en los corazones según el tipo de daño pendiente (DoT):

- 💖 [ Sano ]
- 💚 [ Envenenado ]
- 💔 [ Sangrando ] 
- 🖤 [ Vida perdida ]

Ejemplo: si tenés 5 corazones y te aplican 2 de veneno:

- 💖💖💖💚💚
- 💖💖💖💚🖤
- 💖💖💖🖤🖤

Y si se combinan distintos estados:

- 💖💔💔💚💚
- 💖💔💚🖤🖤
- 💖🖤🖤🖤🖤

Esto suma **claridad visual**, **urgencia estratégica** y un plus de **inmersión** 🧠💡. Si ves [💔💚💚💚💚], sabés que curar el veneno es prioridad máxima.

### 🎨 Junto con otros update visuales que vaya encontrando. ✨
- Enemigos ( F por 🔥 );
- Trampas ( 't' por 🔳, 'p' por 🔲 );
- Ambiente ( T por 🌀, B por 🟦)

---

### 🔹 Paso 4: "Enemigos", placas trampa y lógica vidas/muerte. 💖💖🖤🖤

🗓️ *2025-04-22*

Mundo estático, quieto, vacío, ``sin peligros``. Eso es lo que estuve creando hasta ahora. Podría haber seguido para el lado temático o de interacciones con el mundo per-sé, pero preferí darle peligro- empezar a pensar antes de mandarse corriendo... darle `CONSECUENCIAS` 💀🗡.

**Enemigos**: Por más que sean un 'totem' mirandote feo- **ESTÁN AHÍ**, bloqueandote, *pegándote*, forzándote a cambiar de ruta.

**¡Placas trampa!**: Ahora mismo, se ven, porque -obvio- estilo ASCII 💽 Pero cuando el mapa evolucione podría, no se, hacerlas invisibles- o 'deducibles', tipo: en esta parte del camino no hay vegetación, normalmente aparecen trampas random en zonas así- mejor evito. ¡Lore! ¡Preparación! ¡Conocimiento! ¿Y si no? `¡Consecuencias!`.

Básicamente eso es este paso, como todo lo anterior y todo lo que va a venir es el primer pincelazo apuntando hacia-algo. Hacia→ mas mecánicas. Hacia→ nuevas interacciones. Hacia→ un mundo que reaccione, cambie y cobre vida con cada línea que agrego.

---

**🛠️ A nivel técnico:**
- Funciones `touchEnemy()`, `stepOnTrap()` y `hurtPlayer()` agregadas.
- Refactorización del sistema `residual`, haciendolo mas legible y escalable.
- Eliminé `isAtSpecialTile()`: Al buscar siempre la manera más eficiente de escribir mi código, me dí cuenta que podía quitar toda esta función y reemplazarla por un &&. Lo bello de vivir tratando de romper tu propio código. ♪ ♫

---

**👾 Futuro próximo / Ideas sueltas 🎯:**

🤔 Mhmmh... ya sé, ahora que tengo **placas trampa** y **enemigos** que hacen daño **`DIRECTO`**... 😈

- 🔥 Fuego (Daño por quemadura), 💚 Trampas venenosas (Daño por veneno), 🩸 Enemigos con armas cortantes (Daño por sangrado).

*Agregar los primeros `DOT` (Damage Over Time) y su lógica suena al próximo paso lógico- y **lógico** me emociona porque suena divertido. 🐱‍💻👾*

- Quizá incursionar en un enemigo que... ¡¿se **MUEVA**?! 😨⚡.

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

**🛠️ A nivel técnico**:
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

**🛠️ A nivel técnico**:
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