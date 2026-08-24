# 🎮 JS-Dungeon

> *A scalable, real-time RPG engine built entirely from scratch using Vanilla JavaScript, TypeScript, and React. No canvas, no game engines—just pure state management, complex data structures, and optimized DOM rendering.*

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
</p>

---

## ⚔️ The Architecture Behind the Game

JS-Dungeon is disguised as a retro dungeon crawler, but under the hood, it’s a **complex state machine and architectural sandbox**. 

Why build a game in React? Because managing game loops, inventory states, entity pathfinding, and real-time combat is essentially building a highly reactive, client-side database. This project was built to test performance boundaries, design custom data pipelines (like a CSV-to-JSON map parser), and prove that you don't need heavy frameworks to build highly interactive, scalable applications if your core logic is solid.

---

## 🧠 Technical Highlights / Under the Hood

| Core System | Engineering Implementation |
|---------|--------|
| ⚙️ **State Engine** | Centralized, decoupled state management for real-time interactions without redundant re-renders. |
| 🗺️ **Map Parser Pipeline** | Custom utility that reads raw `.csv` matrix data and dynamically renders coordinate-based map entities. |
| 🩸 **Event-Driven Combat** | Independent tick handlers managing asynchronous Damage-over-Time (DoT) queues and status effects. |
| 🤖 **Modular AI Routing** | Configurable entity patrol patterns with individual tick speeds and collision detection. |
| 🎒 **Relational Inventory** | Scalable data structures linking crafted items, equipment durability, and stats to the player's core UI. |
| 📝 **Strict Typing** | 100% TypeScript. Explicit interfaces for every world entity, preventing runtime errors in complex logic chains. |

---

## 🧱 Tech Stack

`JavaScript` · `TypeScript` · `React` · `HTML5` · `CSS3` · `Git` · `GitHub` · `Vercel`

---

## 🧪 Project Status

**Active, stable, and continuously evolving.**  
Currently focused on UX polish, visual feedback, and refining the underlying architecture to support heavier mechanics without compromising React's rendering performance.

### ✨ Latest Features:
- Context-aware UI: Tooltips, dynamic stat comparisons, and contextual entity inspection.
- Bestiary data unlocked dynamically via persistent kill-tracker logs.
- Refactored camera engine: Shifted from static grid views to dynamic player-tracking viewports.
- Automatic viewport focus locking to ensure seamless keyboard event capturing.

### 🧭 Roadmap (Upcoming Milestones):
- **Data Rebalancing:** Overhauling combat math, drop probabilities, and mob stat scaling.
- **System Expansion:** Implementing gear upgrade pipelines ([ Mace ] ➡ [ Mace +1 ]).
- **Advanced Mechanics:** Designing AoE (Area of Effect) logic and modular spellcasting architectures.

---

## 🔎 Behind the Scenes

Want to see how this was built step-by-step?
- 📄 [CHANGELOG.md](./CHANGELOG.md) — Technical release notes and structured version history.
- 🧠 [devlog.md](./devlog.md) — An informal dev diary detailing architectural pivots, debugging nightmares, and engineering breakthroughs.

---

## 🚀 Live Demo

[![Vercel](https://img.shields.io/badge/Play_Now-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://js-dungeon.vercel.app)

---

## 🌐 Languages

- 🇪🇸 [Versión en Español](./README.es.md)

---

## 📜 License

MIT. Details available in the [LICENSE](./LICENSE) file.

---

*I am a Full-Stack/Backend developer who loves building robust architecture, whether it's a RESTful API or a React-based game engine. Feedback, code reviews, and networking are always welcome.*