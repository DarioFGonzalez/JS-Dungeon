# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.6] - 2026-09-03

### Added
- **Tutorial Map Foundations (Step 26)**: Introduced a dedicated tutorial map with hover‑based help signs, a rookie‑friendly mob, and contextual onboarding mechanics to ease new players into combat, crafting, and resource systems.
- **Arrow Velocity Mechanic (Step 26)**: Implemented projectile speed scaling based on ammo type, adding tactical depth to ranged combat beyond raw damage values.
- **Biome Tile System (Step 27)**: Expanded visual assets with 11 floor tiles and 16 wall tiles per biome, alongside node dictionaries for scalable map generation and environmental diversity.

### Changed
- **Visual Coherence (Step 27)**: Updated tile rendering pipeline to improve pixel‑art consistency across maps, reducing early‑beta visual artifacts and preparing for future biome‑specific expansions.
- **Map Creation Workflow (Step 27)**: Prioritized farming routes, battle maps, and scalable layouts over experimental boss mechanics, aligning development with K.I.S.S principles for maintainability.

### Notes
- These updates establish the groundwork for onboarding new players through a structured tutorial experience while simultaneously enhancing long‑term scalability via biome‑driven map creation.
- Future iterations will focus on boss encounters, conditional mob spawns, and environmental hazards once the tutorial and farming maps reach stability.

## [0.1.5] - 2026-08-18

### Added
- **CSV Dynamic Map Loading Engine (Step 25)**: Integrated the `mapReader` parser utility to import map layouts and world entities directly from raw CSV spreadsheet exports.
- **Map Instance Caching**: Implemented an in-memory caching mechanism with TTL and unique identifiers to manage visited map instances and optimize runtime rendering performance.
- **Teleporter Logic Refactor**: Implemented dynamic map transition mechanics using entity IDs and runtime coordinate mapping tied to loaded CSV maps.

### Changed
- **Dynamic Camera Viewport (Step 24)**: Replaced the rigid 12x12 static viewport with a dynamic camera system centered on player coordinates.
- **Visual Bestiary Inspector (Steps 21 & 23)**: Deprecated text-console logging in favor of dedicated `<InspectorTab>` and `<GearInspectorTab>` components, displaying drop tables and advanced combat stats scaling with enemy kill counters[cite: 1].
- **Ranged Combat Decoupling (v0.1.4 / Step 22)**: Decoupled projectile ammo management using a modular `<Quiver>` component, bound to the `R` key for quick-swapping projectiles[cite: 1].
- **Integrated Crafting Interface (v0.1.2 / Step 20)**: Built an in-game crafting system accessible via `TAB`, featuring real-time resource validation and visual feedback for craft outcomes[cite: 1].

### Fixed
- **Automated Focus Recovery**: Scheduled background thread task forcing DOM event focus back onto the primary game engine canvas during accidental blur/clicks outside the viewport[cite: 1].
- **Environment Compatibility**: Normalized asset path references and environment variables to fix build pipeline failures during production deployments on Vercel[cite: 1].

## [v0.1.4] - 2025-07-16

### Added
- Projectiles and ranged weapon architecture: Initial implementation of arrows as consumable ammo, supporting collision detection, status effect application, and entity destruction.
- Ammunition system: Introduced the `ammoType` interface property across weapons and projectiles to strictly enforce compatibility (arrows, bullets, etc.).
- `<Quiver>` component: Storage system for multiple projectile types with keybinding navigation (`R`).
- Ammunition crafting recipes: Integrated arrow and projectile production into the core crafting engine using harvested world materials.

### Changed
- Ranged firing logic: Depleting ammunition now decrements quiver charges while wearing down weapon durability proportional to projectile tiers.
- Projectile range scaling: Travel distance is now dynamically derived from the equipped ranged weapon's baseline stats.

### Notes
- Lays the core architecture for future ranged weapon expansions (crossbows, firearms, magic catalysts).
- Fully functional execution, with UI/UX polish planned for inventory ammo displays.

## [v0.1.3] - 2025-03-14

### Added
- `<InspectorTab>` component displaying detailed entity metadata upon click interactions. Tracks Armor, Toughness, Base Damage, Statuses, drop chances, and progressive kill unlocks.
- Contextual Tooltip System: Built a reusable `<Tooltip>` component providing hover descriptions across UI panels and the entity inspector.
- Bestiary Tracking: Local `bestiary` state tracking kill counts per species to dynamically reveal advanced inspector data.
- Progression UI Locks: Blur, overlay, and lock badges applied to unrevealed monster stats and drop tables.
- Dynamic Drop Rate Gradients: Rendered item drop percentages using HSL color interpolation (red for low probabilities to green for high).
- Individual Entity Tick Rates: Configurable `moveSpeed` attributes on patrol units to allow distinct AI behaviors (e.g., Swift Goblin vs. Tanky Goblin Veteran).

### Changed
- Patrol Engine Refactor: Decoupled move intervals per entity with isolated cleanup execution upon entity death or map switching.
- UX Focus Shift: Replaced text event logs (`<ConsoleTab>`) with real-time visual feedback in `<InspectorTab>` and contextual tooltips.
- Unified Entity Inspection: Enabled click-to-inspect on all map tiles, standardizing feedback across monsters, traps, and interactables.

### Fixed
- Window Focus Loss: Implemented periodic refocus listeners preventing DOM event drops when clicking outside the render area.
- Drop Overlay Positioning: Corrected layout shifting on locked drop overlays when kill milestones were unmet.

## [v0.1.2] - 2025-03-10

### Added
- `<CraftingTab>` panel listing available recipes and resolving material costs from the player's inventory.
- Typed Recipe Engine: Implemented recipe data structures handling input arrays, quantities, and outcome yields.
- Dual-Tab Navigation: Added `TAB` key toggling between `<GearTab>` and `<CraftingTab>`, sharing vertical hotbar navigation controls (↑↓).
- `craftItem()` Handler: Complete item creation handler verifying ingredient costs, inventory deductions, and UI state sync.
- Crafting Visual Feedback: Triggers transient error states on input shortcut (`E`) when ingredient constraints fail.

### Changed
- Unified Input Listeners: Streamlined hotkey navigation hooks (`navigateHotbar`, `navigateCraftingMenu`) based on active UI tab state.
- State Standardization: Standardized inventory state updates using unified `setPlayer` dispatchers post-crafting.

### Fixed
- Recipe List Overflow: Fixed container layout behavior to allow vertical scrolling when recipes exceed container bounds.
- Multi-selection State Bug: Resolved a state bug allowing concurrent selection of multiple recipes during tab transitions.

## [v0.1.1] - 2025-01-20

### Changed
- **Codebase Standardization**:
  - Resolved all ESLint warnings to guarantee clean CI/CD build pipelines.
  - Standardized strict equality checks (`===`, `!==`) and array callback routines.
- **Environment Handling (Local vs. Prod)**:
  - Refactored internal environment flags to properly detect `localhost` versus production deployments (Vercel).
  - Eliminated state discrepancies between local dev servers and remote builds.
- **HUD Layout Constraints**:
  - Enforced `min-height` and `max-height` constraints across event logs, `<GearTab>`, and consumable slots to prevent visual layout shifts.

### Fixed
- **Playable Demo Restoration**:
  - Resolved main loop errors breaking production builds.
  - Verified core systems: Mining, Combat, Gear durability, Damage over Time (DoT), and Drop tables.
- **Item Disposal Logic**:
  - Fixed consumable drop/delete handlers (`Backspace`), preventing invalid inventory states.
- **Build Stability**:
  - Resolved all TypeScript and Vercel build compilation failures.

### Notes
- Stabilizing patch following initial public release.
- Focused entirely on system architecture, technical debt, and cross-environment stability.

## [v0.1.0] - 2025-01-11

### Added
- **GearTab Visual Overhaul**:
  - Persistent equipment slot icons.
  - Color-coded item rarity and type classification.
  - Cooldown timers visualized via animated overlay graphics.
  - Integrated visual durability bars.
- **New Mob Type (Goblin Miner)**:
  - Enemy designed specifically to drop mining tools, aligning narrative with gameplay loot.
- **Resource Icons**: Added mineral ore visual assets matching HUD styling.
- **`DurabilityBar` Component**: Reusable component rendering equipment wear and tear.

### Changed
- **CSS Modules Migration**: Converted `GearTab.css` to `GearTab.module.css` to prevent global scope style leakage.
- **Equipment Layout Spacing**: Improved padding, proportions, and typographic hierarchy across HUD panels.
- **UX Design Focus**: Prioritized intuitive gameplay feedback without relying on intrusive tutorials or external guides.

### Notes
- Official transition to a **Playable Demo (v0.1.0)**: Players can combat, loot, equip items, and trigger game-over loops.

## [v0.0.99+] - 2025-12-26

### Added
- **Grid-Based External Map Workflow (Excel-driven)**: Adopted a 18x18 grid system for layout designs, enabling rapid prototyping and visual layout control.
- **Map Visual Reference**: Added base map visual assets to repository documentation as ground truth for logical matrix mapping.
- **Entity-Oriented Map Matrix**: Refactored grid cells to store complete entity objects instead of primitive types.

### Changed
- **Core Engine Architecture**:
  - Replaced primitive char matrices with fully typed entity objects.
  - Prioritized internal structural integrity and scalability over quick hacks.
- **Patrol AI Lifecycle**:
  - Isolated patrol AI execution per entity instance.
  - Enabled explicit interval cleanup routines (`clearInterval(id)`), eliminating memory leaks and orphan timers.
- **Development Tooling**:
  - Replaced built-in map editor tooling in favor of lightweight external spreadsheet parsers.

### Fixed
- Resolved critical DoT execution bug that triggered state inconsistencies upon entity termination.

### Notes
- Structural stabilization milestone shifting focus from engine refactor to content creation.

## [v0.0.99] - 2025-06-02

### Added
- HUD Accessibility Banner: Added *"Press H for tutorial"* prompt to top navigation.
- Help Slides Extension: Added Repository reference slide featuring direct GitHub link integration.
- `README.md` updates with direct Vercel live demo links.

## [v0.0.98] - 2025-05-26

### Added
- **Help Slides Overlay**: Interactive tutorial overlay rendering custom graphical slide assets.
- **Game Over Screen**: Implemented formal death state rendering automatically at 0 HP.
- **Asset Indexing**: Centralized visual asset exports inside a unified `Images/index.ts` directory.

### Changed
- **Hotbar Navigation**: Re-mapped gear navigation to vertical orientation (`Up` / `Down` arrow keys).
- **HUD Contrast**: Adjusted color palettes and typography across event logs and equipment slots.

## [v0.0.97] - 2025-05-24

### Added
- **Visual DoT Indicators**: Dynamic floating damage numbers rendering continuous status damage above entities.
- **Map Visual Props**: Wall torches and environmental visual variants (`torchWallLeft`, `torchWallRight`).

### Changed
- **HUD Layout Overhaul**: Re-architected grid container mechanics for layout alignment.
- **Event Console Styling**: Added auto-wrapping, overflow handling, and visual event tags (`onUse`).
- **Player State Floating Consoles**: Refactored HP, active status effects, and inventory panels into floating HUD modules.

### Fixed
- Fixed unconstrained vertical overflow within event log containers.

## [v0.0.96] - 2025-05-20

### Added
- **Accessory Engine (Amulets)**: Added protective amulets intercepting damage prior to player health deduction (`damageCharm()`).
- Added `necklaceImg` sprite assets and UI integrations.

### Changed
- Refactored `hurtPlayer()` to evaluate protective gear logic before reducing base health.

### Removed
- **Experimental Multi-Layer Renderer**: Removed multi-layered rendering state experiments due to React re-render performance bottlenecks under continuous load.

## [v0.0.95] - 2025-05-15

### Added
- **Sprite Rendering Engine**: Replaced ASCII rendering with PNG sprite assets (player, enemies, traps, walls).
- **Visual Overlay Layer**: Introduced `visualOverlay` layer handling transient particle effects (damage, status indicators) independent of underlying map tiles.
- Added modular layer utilities: `setVisualOverlay()` and `clearVisualOverlay()`.

### Changed
- Decoupled state logic (`map`) from render tree execution (`visualOverlay` + sprites).

## [v0.0.94] - 2025-05-14

### Added
- **Equipment System**: Split player storage into `Inventory` (consumables) and `Equippeable` (durability items). Added auto-equipping fists on weapon destruction.
- **Weapon Durability**: Weapon attacks decrement durability based on enemy `Toughness`. Weapons break at 0 durability.
- **Equipment HotBar**: Enabled quick weapon swapping using `ArrowLeft` and `ArrowRight`.
- **Async Event Console**: On-screen logging system handling asynchronous event dispatches without state collisions.
- **Enemy Status Engine**: Ported player DoT handlers (Poison, Burn, Bleed) onto enemy entity instances.

### Changed
- Refactored combat logic, decoupling `damageEnemy` from `enemyDeath` handling.
- Encapsulated combat execution pipeline within `strikeEnemy()`.

### Fixed
- Resolved React `StrictMode` double-invocation side effects in logging and damage pipelines.
- Stopped DoT timers from continuing execution post-entity death.

## [v0.0.93] - 2025-05-07

### Added
- **Buff & DoT Cleanup Lifecycle**: Implemented `finishBuff()` handling interval disposal and death triggers. Integrated drop table evaluation (`dropTable`) spawning world loot on entity death.
- **World Loot Engine**: Implemented world item pickup, inventory storage, usage, and cooldown execution.

### Changed
- Refactored combat logic to evaluate entity drop tables and spawn physical map items on death.

## [v0.0.92] - 2025-04-28

### Changed
- Refactored `player` state model into a centralized interface (`hp`, `MaxHP`, `Coords`, `Inventory`, `Aliments`).
- Encapsulated Status Effect handling within `manageDotInstance()` for modular application of `bleed`, `poison`, and `burn`.
- Replaced primitive array coordinates with typed structural objects (`x`, `y`, `symbol`).
- Refactored `hurtPlayer()` and `cleanse()` handlers to use `Aliments` helpers.

### Fixed
- Cleaned up redundant guard clauses and residual tile mapping artifacts.

## [v0.0.91] - 2025-04-26

### Added
- Implemented `stepOnItem()` tile collision handler for automatic item collection.
- Added `addToInventory()` supporting item stacks and slot allocation.
- Added `consumeItem()` handling usage constraints, item counts, and cooldown timers.
- Added explicit type definitions (`Item`, `InventoryItem`, `Inventory`).
- Bound hotkeys `O` (Potion) and `K` (Bandages) for quick consumable usage.

## [v0.0.9] - 2025-04-25

### Added
- Implemented `cleanse()` helper purging active negative status effects and stopping damage intervals.
- World interactables (Totems) executing `cleanse()` on collision.
- Bound hotkeys `K` (`cleanse('bleed')`) and `O` (`heal(3)`).
- Added baseline `heal()` interface handling health recovery bounded by `maxHp`.

## [v0.0.8] - 2025-04-24

### Added
- Active Status Effect HUD bar displaying poison, bleed, and burn stacks.
- Tracked tick duration counters (`bleedTicks`, `poisonTicks`, `burnTicks`).

### Changed
- Refactored `hurtPlayer()` to evaluate concurrent DoT stacks.

## [v0.0.7] - 2025-04-23

### Added
- Implemented Damage over Time (DoT) system: Fire, Poison, and Bleed status effects.
- Added DoT hazards and enemies:
  - Fire (`f`): Initial impact damage, burn DoT, and 1-tile knockback.
  - Poison Trap (`t`): Applies poison DoT.
  - Heavy Enemy (`E`): Inflicts bleed status on contact.

## [v0.0.6] - 2025-04-22

### Added
- Base Enemy Entities blocking tile movement.
- Trap Plates (`t`) triggering health damage on step.
- Player death state triggers and reset handling.

### Changed
- Replaced `isAtSpecialTile()` with direct array lookup evaluations.
- Replaced hardcoded map dimensions with global `mapSize` configuration constants.

## [v0.0.5] - 2025-04-21

### Added
- Box Teleportation: Pushable boxes (`B`) can now enter teleporters if exit points are clear.
- Blocked Teleporters: TPs evaluate target tiles, preventing transport if occupied.

## [v0.0.4] - 2025-04-20

### Added
- Teleporter Entities (`T`) handling spatial transportation between linked coordinate pairs.
- Spatial state retention restoring original underlying tile symbols upon entity exit.

## [v0.0.3] - 2025-04-20

### Added
- Box Pushing Mechanics (`B`) evaluating player push vectors and tile collisions.
- Modularized collision pipeline (`checkCollision()`, `pushBox()`).

## [v0.0.2] - 2025-04-19

### Added
- Tile-based collision detection system.
- Keyboard movement handling (`WASD`).
- Dynamic map rendering pipeline.

## [v0.0.1] - 2025-04-18

### Added
- Initial functional engine release.
- Static map matrix rendering and basic player grid movement.