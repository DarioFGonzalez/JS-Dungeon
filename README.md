# 🎮 JS-Dungeon

<p align="center">
  <a href="https://dead.army/go/badge/js-dungeon-922f50?utm_source=badge&utm_medium=readme&utm_campaign=listed">
    <img src="https://dead.army/badges/stats/js-dungeon-922f50">
  </a>
</p>

<p align="center">
  🏆 Featured on DEAD.ARMY's Curated Indie Games Catalog
</p>

> A retro-inspired indie dungeon crawler built entirely in React and TypeScript.
>
> Fight monsters, gather resources, craft equipment, unlock bestiary entries, explore interconnected maps, and discover an ever-growing world.
>
> No Canvas.
> No Phaser.
> No Game Engine.
>
> Just React, TypeScript, and a lot of questionable decisions.

---

## 🏆 Featured Indie Project

JS-Dungeon is currently featured on DEAD.ARMY's curated indie game catalog.

🔗 Game Page:
https://dead.army/games/js-dungeon-922f50

📄 Development History:
- [CHANGELOG.md](./CHANGELOG.md)
- [devlog](./devlog.en.md)

---

## ⚔️ What Is JS-Dungeon?

JS-Dungeon is a dungeon crawler built from scratch using React and TypeScript.

Explore caves, forests and dungeons.

Fight monsters.

Gather resources.

Craft equipment.

Unlock bestiary entries.

Discover new maps.

Get stronger.

Repeat.

The project began as a simple RPG prototype and evolved into a complete game architecture designed around scalability and data-driven systems.

---

## ✨ Current Features

### ⚔️ Combat

- Melee weapons
- Bows and ranged combat
- Multiple ammo types
- Projectile system
- Damage over Time effects
- Poison, Bleed and Burn
- Enemy combat interactions
- Equipment durability

### 🎒 Progression

- Equipment and tools
- Gathering systems
- Crafting recipes
- Loot tables
- Consumables
- Unlockable Bestiary
- Enemy drop tracking

### 🌎 World

- Multiple interconnected maps
- Seamless map transitions
- Cave biomes
- Dungeon biomes
- Forest biomes
- Dynamic map loading
- Interactive entities
- Resource nodes
- Multi-tile entities
- Trees and gathering spots

### 🖥️ UI / UX

- Context-sensitive tooltips
- Equipment Inspector
- Bestiary Inspector
- Dynamic recipe visibility
- Tutorial signs
- Contextual information systems

---

## 🧠 Why Build A Game In React?

Because I wanted to see how far React could be pushed.

JS-Dungeon functions as a large reactive simulation where almost everything is driven by state:

- Combat
- Status Effects
- Patrol Systems
- Crafting
- Loot Drops
- Projectiles
- Equipment
- Bestiary Progression
- Dynamic Map Loading

Instead of relying on Canvas, Phaser, Babylon or a traditional game engine, every interaction is handled through React state updates, TypeScript structures and DOM rendering.

The result is simultaneously:

- A playable dungeon crawler
- A software architecture sandbox
- A performance experiment
- A long-term learning project

---

## ⚙️ Technical Highlights

| System | Implementation |
|----------|----------|
| 🗺️ CSV Map Engine | Excel → CSV → Entity Pipeline |
| 🌎 Dynamic Map Loading | Runtime map loading, caching and seamless transitions |
| 🏹 Projectile Engine | Decoupled Weapon / Ammo architecture |
| ⚔️ Combat System | Direct Damage + DoT processing |
| 🤖 Patrol Engine | Independent entity movement loops |
| 🌲 Multi-Tile Entities | Trees, structures and future boss support |
| 📖 Bestiary System | Information unlocked through gameplay |
| 🔨 Crafting Engine | Inventory-based dynamic recipe validation |
| 🎒 Equipment System | Durability, stats and contextual inspection |
| 🧩 Typed Architecture | Strong TypeScript typing across all game entities |

---

## ☕ Design Philosophy

K.I.S.S.

Keep It Simple, Stupid.

Every system inside JS-Dungeon follows one simple rule:

If tomorrow I decide to create:

- A new weapon
- A new creature
- A new biome
- A new projectile
- A new node
- A new recipe

...I should only need to add data.

Not rewrite engine logic.

The project favors reusable structures, strict typing and scalable data-driven design over hardcoded implementations.

---

## 🧱 Tech Stack

JavaScript · TypeScript · React · HTML5 · CSS3 · Git · GitHub · Vercel

---

## 📈 Current Project Status

Active development.

Current focus:

- Tutorial experience
- New maps and biomes
- Boss encounters
- Resource gathering expansion
- Crafting improvements
- Visual feedback and polish
- Audio and sound systems

---

## 🔮 Roadmap

### Near Future

- Tutorial Experience
- Boss Monsters
- Beach Biome
- Additional Maps
- Sound & Music
- Resource Expansion
- Advanced Crafting

### Long-Term Ideas

- Large Boss Fights
- Additional Ammo Types
- More Biomes
- Environmental Hazards
- Rare Encounters
- Expanded Exploration Systems

---

## 📚 Documentation

Looking for the project's history and technical evolution?

- 📄 [CHANGELOG](./CHANGELOG.md) → Technical release notes and version history.
- [English](./devlog.en.md) → Complete development diary.
- [Español](./devlog.es.md) → Bitacora de avances en español.
- 📜 [LICENSE](./LICENSE)

The DevLogs contain architectural decisions, debugging stories, failed experiments, feature discussions and the actual thought process behind the game's evolution.

---

## 🌐 Languages

- [English](./README.md)
- [Español](./README.es.md)

---

## 📜 License

MIT License.


See [LICENSE](./LICENSE) for details.

---

## 👨‍💻 About The Developer

I'm a Full-Stack developer who enjoys building scalable systems, game logic, backend architecture and complex state-driven applications.

JS-Dungeon is both a game and a playground where I experiment with architecture, performance, data modeling and game design while continuously improving my development skills.

Feedback, ideas and code reviews are always welcome.