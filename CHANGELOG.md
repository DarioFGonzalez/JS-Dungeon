# Changelog

Todas las modificaciones importantes a este proyecto serán documentadas en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v0.0.98] - 2025-05-26

### Added
- **Sistema de Slides de Ayuda**: Nueva interfaz emergente que explica mecánicas clave del juego. Contiene imágenes creadas manualmente con íconos, textos e indicadores estilizados para mantener coherencia estética con el HUD.
- **Pantalla de Muerte**: Se implementó una vista clara de *Game Over* que aparece automáticamente cuando el jugador alcanza 0 de HP, brindando cierre visual al combate.
- **Carpeta unificada de assets visuales (`Images`)**: Nueva estructura de imágenes importables desde `index.ts` para facilitar la organización y reutilización de elementos gráficos.

### Changed
- **Hotbar de Gear**:
  - Navegación rediseñada: ahora se utiliza ↑ ↓ en lugar de → ←, respetando la orientación vertical del equipo visible.
- **Estética del Gear y consola de eventos**:
  - Se aplicaron cambios de color y contraste para mejorar la legibilidad de los textos y destacar ítems activos o equipados.
  - Ajustes visuales menores para integrar mejor estos componentes al entorno general del juego.
- **Formato y consistencia visual de Slides**:
  - Imágenes de ayuda exportadas desde Photoshop, Figma y Paint, con íconos recortados manualmente y ajustados a una paleta y dimensiones coherentes.

### Notes
- Este parche tuvo como objetivo reforzar la experiencia del jugador mediante feedback visual claro, asistencia contextual (Slides), y mayor cohesión estética entre los elementos interactivos.
- También sienta las bases para un tutorial inicial o sistema de progresión visual escalable en futuras versiones.

## [v0.0.97] - 2025-05-24

### Added
- **Indicadores visuales de daño continuo (DoT)**: Ahora los enemigos muestran sobre sí mismos los valores numéricos del daño que están recibiendo con formato claro y legible.
- **Iconografía de entorno**: Se añadieron nuevas imágenes como antorchas (`torchWallLeft`, `torchWallRight`) que enriquecen la ambientación del mapa.

### Changed
- **Overhaul visual del HUD**: 
  - Rediseño completo del layout de los componentes principales (`mapa`, `GearTab`, `inventory`, `log`, y controles).
  - Reorganización en un sistema de grilla para mejorar la coherencia visual y la legibilidad.
- **Estilización de la consola de eventos**:
  - Reformateo del texto de cada entrada para ajustarse automáticamente al ancho, mejorar la separación visual y eliminar desbordes no deseados.
  - Se agregaron logs visibles para acciones como el uso de ítems (`onUse`), mejorando la retroalimentación al jugador.
- **Refactor de elementos de estado del jugador**:
  - La vida, los efectos de estado (DoT, Buffs), el inventario y el botón de control ahora son **consolas flotantes** visualmente integradas al entorno.
- **Estética del equipo equipado y seleccionable**:
  - El equipo seleccionado se resalta visualmente.
  - Se mejoró la separación entre ítems equipados (`charm`, `weapon`) con fondos diferenciados según tipo.

### Fixed
- **Scroll visual innecesario** en el área de consola de eventos: se eliminó un overflow vertical que causaba desbordes visuales no deseados.

### Notes
- Esta versión se centró en unificar criterios visuales, ordenar el layout general del juego y preparar el terreno para parches más técnicos. Se buscó evitar superposición de preocupaciones entre parches visuales y lógicos.
- El `manageVisuals` fue refactorizado para permitir mayor flexibilidad visual sin sobrecargar la lógica del juego.

## [v0.0.96] - 2025-05-20

### Added
- **Sistema de accesorios (Amuletos)**: Se incorporó el primer accesorio funcional (amuletos protectores). Implementación de `damageCharm()` para interceptar daño antes de que afecte la salud del jugador.
- **Sprites de amuletos**: Se agregó el ícono `necklaceImg` y su integración con la UI general del jugador.
  
### Changed
- **Refactor en `hurtPlayer()`**: Ahora contempla la lógica de accesorios protectores (si están equipados, reciben el daño antes que el jugador).

### Removed
- **Capas visuales experimentales**: Se eliminaron las funciones `setDamages` y `setHealings` que intentaban separar animaciones de daño y curación en capas independientes. Las pruebas revelaron limitaciones de performance severas en React ante múltiples renderizados concurrentes.

### Notes
- Se identificó un tope técnico crítico: React no escala bien al intentar simular un motor de rendering con múltiples capas activas en tiempo real. Se decidió priorizar estabilidad y jugabilidad sobre extensibilidad visual.
- El enfoque a futuro será consolidar una demo funcional con los sistemas actuales, y explorar minijuegos modulares en lugar de un único juego extenso y complejo.

## [v0.0.95] - 2025-05-15

### Added
- **Visual Overhaul**: Reemplazo completo del sistema de render ASCII por íconos PNG representativos. Ahora los elementos del mapa (jugador, enemigos, trampas, fuego, paredes) tienen sprites visuales claros.
- **Sistema de Overlay visual**: Se agregó una segunda capa (`visualOverlay`) que permite superponer efectos visuales temporales (daño, buffs, etc.) sin alterar el mapa base.
- **Funciones de gestión visual secundaria**: Nuevas funciones `setVisualOverlay` y `clearVisualOverlay` para manejar de forma modular los efectos en el overlay del mapa.

### Changed
- **Refactor del renderer principal**: Se modificó la lógica de renderizado para desacoplar el contenido lógico (`map`) de la presentación (`visualOverlay` + íconos). Esto facilita la extensión futura con animaciones o efectos más complejos.
- **Soporte completo de íconos como entidades visuales**: Las entidades ya no se renderizan por carácter (`<`, `>`, `f`, `p`...), sino que se vinculan directamente a sus respectivos sprites a través de un mapa de visualización.

### Notes
- Primer sistema visual jugable para terceros no-devs: si bien sigue siendo una versión temprana, permite interpretar el entorno sin necesidad de conocer el sistema interno.
- Este sistema visual es funcional pero no definitivo; se espera una segunda iteración con animaciones avanzadas, transiciones y visual feedback más completo.

## [v0.0.94] - 2025-05-14

### Added
- **Sistema de Gear Equipable**: Separación del inventario en dos categorías: `Inventory` (ítems consumibles) y `Equippeable` (ítems con durabilidad). Se implementó la lógica de auto-equipado de puños (`Fists`) al romperse el arma principal.
- **Durabilidad de armas y lógica de rotura**: Las armas ahora pierden durabilidad al atacar enemigos. Esta se reduce según la `Toughness` (dureza) del enemigo. Si la durabilidad cae a 0 o menos, el arma se destruye.
- **HotBar navegable**: Se agregó un sistema para cambiar el ítem equipado con las teclas de flecha (`ArrowLeft` / `ArrowRight`), facilitando la rotación entre armas disponibles.
- **Logs visuales asincrónicos**: Implementado un sistema de consola en pantalla con logs estilizados, colores por tipo de evento, y gestión asincrónica para evitar repeticiones y errores de render.
- **Inicio del sistema de estados alterados (DoT) en enemigos**: Se integró la lógica de daño por tiempo (`DoT`) en enemigos, reutilizando el sistema del jugador (veneno, quemadura, sangrado). Los logs reflejan estos eventos con tag e información contextual.

### Changed
- **Refactor de `damageEnemy`**: Se dividió la lógica de daño y muerte en `damageEnemy` y `enemyDeath`, mejorando legibilidad y atomicidad del sistema de combate.
- **Unificación de lógica `strikeEnemy`**: Ahora encapsula correctamente la secuencia ataque ➝ daño ➝ pérdida de durabilidad ➝ muerte ➝ drop ➝ log.

### Fixed
- **Problemas de asincronía en logs y daño doble**: Se solucionaron problemas causados por doble render en `StrictMode`, como la duplicación de eventos o la pérdida de estados intermedios.
- **Aplicación de daño post-mortem**: Los efectos DoT ya no siguen afectando a enemigos muertos gracias al refactor del control de instancias dentro de `manageDotInstance` y `finishDoT`.

## [v0.0.93] - 2025-05-07

### Added
- **finishBuff**: Implementada la función `finishBuff` que recibe una instancia de un "buff", busca sus intervalos y los elimina. Esta función también maneja la lógica de "combate", causando que el enemigo pierda vida hasta morir. En caso de que el enemigo tenga una `dropTable`, se tira un item según las probabilidades de su tabla de drops, en lugar de simplemente vaciar su espacio al morir.
  
- **Inventario y Efectos de Items**: Se implementó la mecánica de **agarrar un item**, **guardarlo en el inventario**, **transportarlo** por el mapa, **consumirlo** y **restarlo del inventario**. El efecto del item se aplica al consumirlo, utilizando la escalabilidad y flexibilidad del sistema de inventario y efectos ya establecido.

### Changed
- **Refactorización de lógica de combate y drops**: La refactorización de la lógica de combate ahora incluye la implementación de un sistema de drops en el que se generan ítems según las probabilidades definidas en la `dropTable` del enemigo al morir. Los ítems caídos se gestionan e interactúan directamente con el sistema de inventario.

### Fixed
- **Errores menores**: Se corrigieron algunos errores menores relacionados con la manipulación de objetos dentro del sistema de inventario y su integración con la mecánica de drops de enemigos.

## [v0.0.92] - 2025-04-28

### Changed
- Refactor completo del estado `player`: ahora incluye `HP`, `MaxHP`, `Coords`, `Inventory` y `Aliments`, permitiendo una gestión centralizada, consistente y escalable de la información del jugador.
- Rediseñado el sistema de daño en el tiempo (DoT): encapsulado en la función `manageDotInstance()`, con soporte para agregar, remover y limpiar efectos individuales como `bleed`, `poison` y `burn`.
- Separación clara entre flags (`Poisoned`, `Bleeding`, `Burning`) y sus instancias (`PoisonInstances`, etc.), manteniendo sincronía automática según el estado de cada efecto.
- Eliminación de estructuras crudas (`number[]`) para representar posiciones residuales: reemplazadas por objetos estructurados con propiedades explícitas (`x`, `y`, `symbol`).
- Refactor de las funciones `hurtPlayer()` y `cleanse()` para integrarse al nuevo sistema de `Aliments`, utilizando lógica unificada y helpers reutilizables.

### Fixed
- Eliminados `guard clauses` innecesarios que prevenían la ejecución esperada de funciones cuando se pasaban parámetros válidos en tiempo de uso lógico correcto.
- Eliminado problema de residuales limitados al refactorizar `residual`.

### Notes
- Este parche representa un punto clave en la estandarización del código base: unificación de estados, encapsulamiento de lógica compartida y mayor claridad semántica.
- Aunque funcional, el sistema de estados alterados y DoT sigue en fase de iteración. Se planea aplicar el mismo enfoque modular a nuevas mecánicas como curaciones progresivas (HoT), buffs temporales y otras alteraciones.

## [v0.0.91] - 2025-04-26

### Added
- Implementado `stepOnItem()`: sistema de interacción al caminar sobre un ítem, recogiendo objetos si hay espacio en el inventario.
- Implementado `addToInventory()`: gestión de almacenamiento de objetos recogidos, con control de cantidad y nuevos slots automáticos.
- Implementado `consumeItem()`: sistema de consumo de ítems, chequeando disponibilidad en inventario, cantidad suficiente y cooldown individual.
- Sistema de cooldown para ítems: los consumibles no pueden ser utilizados repetidamente hasta que su temporizador interno expire.
- Tipado explícito de objetos `Item`, `InventoryItem` y `Inventory` para asegurar consistencia y escalabilidad futura.
- Introducción de hotkeys `O` y `K` para consumo rápido de ítems (`Potion` para curación y `Bandages` para detener sangrado), con validaciones de inventario y cooldown.

### Changed
- Modificada la gestión de `handleMovement` para integrar eventos de consumo de ítems mediante teclado de manera fluida.
- Ajustes menores en el renderizado: agregado sistema de visualización precario del inventario (`showInventory`) para debug y control rápido.

### Notes
- Este parche sienta las bases para el sistema de administración de recursos del jugador (inventario, cooldowns, consumo estratégico).
- Se prevé que en futuras versiones se incorporen mejoras visuales en el inventario, ordenación de ítems y diferenciación de tipos de objetos (consumibles, equipables, utilizables en mundo).
- El sistema actual es funcional y estable para testeo inicial, pero no representa aún la versión final de interacción jugador-ítems.

## [v0.0.9] - 2025-04-25

### Added
- Función `cleanse()` creada: permite purgar efectos negativos activos (`bleeding`, `burning`, `poisoned`) de forma selectiva o total. Al remover un estado, detiene inmediatamente el daño asociado.
- Implementado sistema de *totems*: objetos del mundo con efectos sobre el jugador. El primer prototipo ejecuta `cleanse()` al ser tocado.
- Nuevas *hotkeys* para interacción rápida: tecla `K` activa `cleanse('bleed')`, tecla `O` activa `heal(3)`.
- Primer prototipo de `heal()` implementado: restaura vida sin superar el máximo (`maxHp`). Diseñada para escalar en futuras versiones (curación en el tiempo, condiciones, etc.).

### Changed
- Refactorizadas las funciones `hurtPlayer()` y `handleMovement()` para integrar lógica de purga (`cleanse`) y curación (`heal`) sin interferir con el sistema de DoT existente.
- Ajustes menores en el sistema de `useEffect` para reflejar correctamente el estado del jugador tras interacciones con totems o teclas.

### Notes
- Este parche sienta las bases del sistema de curación y purificación, piezas clave para el futuro balance de combate.
- `heal()` y `cleanse()` están en estado **funcional pero no definitivo**, listos para ser iterados según el diseño del sistema de Lux y las condiciones mágicas del entorno.
- Se recomienda testear intensivamente la interacción entre DoT stackeados y curación rápida para evitar exploits o loops desequilibrados.

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
- Sistema de *Daño en el Tiempo (DoT)* implementado: efectos persistentes de fuego, veneno y sangrado que impactan la vida del jugador de manera progresiva.
Nuevos enemigos y trampas con efectos DoT:

  - 'f': fuego que inflige daño inicial más DoT de quemadura al ser pisado. Incluye retroceso (knockback) de una celda.
  - 't': trampa venenosa que aplica DoT de veneno.
  - 'E': enemigo tipo "heavy" que causa sangrado al contacto.
Efectos visuales y retroalimentación en pantalla para representar el tipo de daño recibido y su duración.


### Changed
- Refactorizada la función hurtPlayer() para contemplar tanto daño directo como acumulativo por DoT.
- Separadas y mejoradas las funciones touchEnemy() y stepOnTrap() para diferenciar entre tipos de enemigos y trampas, aplicando efectos según corresponda.
- Incorporada nueva función walkOntoFire(): gestiona la lógica de contacto con fuego, aplica daño inicial, retroceso y estado de DoT.

---

## [v0.0.6] - 2025-04-22

### Added
- Sistema de *enemigos básicos*: aparecen en el mapa y pueden bloquear el movimiento del jugador.
- Implementadas *placas trampa* ('t'): activan efectos al ser pisadas, como pérdida de vida.
- Mecánica de *vida y muerte del jugador*: si la vida llega a cero, se reinicia el juego (placeholder actual).

### Changed
- Refactorizada la función isAtSpecialTile(): fue eliminada y reemplazada por una validación directa más eficiente.
Limpieza de funciones innecesarias y llamadas sin propósito detectadas durante revisión de código.

- Reemplazo de valores hardcodeados para el tamaño del mapa (18) por una variable global mapSize para mejorar la escalabilidad.

---

## [v0.0.5] - 2025-04-21

### Added
- Soporte para *teleportación de cajas*: ahora las cajas ('B') también pueden usar teleportadores si el destino está libre.
- Implementado el concepto de *teleportador bloqueado*: si el punto de salida está ocupado (por una caja, jugador, muro, etc.), el TP se considera no disponible.
- Ampliado el uso de residual para conservar el contenido anterior en celdas con teleportadores y cajas.
Lógica para que el jugador no pueda tpear si la salida está bloqueada (mensajes de feedback incluidos).


### Changed
- Reorganizada la función handleTp() para contemplar objetos distintos al jugador y validar condiciones de uso.
Separadas responsabilidades entre detección de colisiones, control de movimiento y efectos colaterales (como TP, empuje, etc.).


---

## [v0.0.4] - 2025-04-20

### Added
- Sistema de *teleportadores* ('T') implementado: permite transportar al jugador entre dos puntos del mapa.
- Hook useState para almacenar coordenadas de teleports y gestionar su comportamiento dinámico.
- Función handleTp() para manejar lógica de activación y transporte.
- Introducción del estado residual: conserva el contenido original de la celda anterior al movimiento del jugador (ej: T, trampas, placas, etc.).

### Changed
- Ajustada la lógica de movimiento sobre celdas vacías ('empty') para contemplar el uso de residual sin afectar el flujo base.

---

## [v0.0.3] - 2025-04-20

### Added
- Mecánica de empuje de cajas ('B') implementada.
Validación de colisión entre jugador, caja y espacio disponible.

- Fallback inconsecuente() para manejar intentos de movimiento inválidos.
- Modularización de lógica con funciones checkCollision() y pushBox().

### Fixed
- Error de referencia en eje de coordenadas (nextY → newY).

---

## [v0.0.2] - 2025-04-19

### Added
Sistema de detección de colisiones basado en tipo de tile.

- Control de movimiento con teclado (WASD).
Renderizado dinámico del jugador y el mapa.


---

## [v0.0.1] - 2025-04-18

### Added
Primer commit funcional del engine.
Mapa estático con renderizado inicial.
Movimiento básico del jugador.