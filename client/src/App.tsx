import { useEffect, useRef, useState } from "react";
import * as Types from "./components/types/global";

import * as icons from "./Icons/index";

import * as Entities from "./components/data/entities";
import * as Gear from "./components/data/gear";
import * as Items from "./components/data/items";
import * as Recipes from "./components/data/recipes";
import * as Tiles from "./components/data/tiles";
import {
    allNodes,
    allObjects,
    allTiles,
    rockyWalls,
    dungeonTorches,
    dungeonWalls,
} from "./components/data/tiles";

import "./App.css";

// import ConsoleTab from './components/ConsoleTab/ConsoleTab';
import ConsumablesTab from "./components/ConsumablesTab/ConsumablesTab";
import CraftingTab from "./components/CraftingTab/CraftingTab";
import GearTab from "./components/GearTab/GearTab";
import InspectorTab from "./components/InspectorTab/InspectorTab";
import { ArrowClass } from "./components/data/projectiles";
import { loadMap } from "./components/data/maps/maps";

const allIcons = Object.values(icons);

const mapSize = 24;
const PoV = 13;
const range = Math.floor(PoV / 2);

const emptyTile = { type: "Tile", name: "Void", symbol: "" };

const emptyGrid = Array.from({ length: mapSize }, () =>
  Array.from(Array(mapSize), () => emptyTile),
);

const emptyVisualGrid = Array.from({ length: mapSize }, () =>
  Array.from(Array(mapSize), () => ""),
);

const emptyBackgroundGrid =  Array.from({ length: mapSize }, () =>
  Array.from(Array(mapSize), () => Tiles.voidTile),
);

type CellContent =
  | Types.Player
  | Types.Enemy
  | Types.Trap
  | Types.Item
  | Types.Gear
  | Types.Projectile
  | Types.Environment
  | Types.Node;


  const App = () => {
  const isDev = process.env.NODE_ENV !== "production";

  const gridRef = useRef<HTMLDivElement>(null);
  // const lan = "es";
  const [game, setGame] = useState<boolean>(false);
  const [isTakingDamage, setIsTakingDamage] = useState(false);

  type posibleMenus = "Gear" | "Crafting";
  const [selectedMenu, setSelectedMenu] = useState<posibleMenus>("Gear");

  const [allowed, setAllowed] = useState<boolean>(true);
  const stun: boolean = false;

  const [mapa, setMapa] = useState<CellContent[][]>(emptyGrid);

  interface listOfMaps {
    name: string;
    visitedMap?: CellContent[][];
    biome: string;
    actual: boolean;
    visited?: boolean;
    timeoutId?: ReturnType<typeof setTimeout>;
  }
  
  const [maps, setMaps] = useState<listOfMaps[]>([]);

  const mapaRef = useRef(mapa);
  
  const [visuals, setVisuals] = useState<Types.VisualCell[][]>(emptyVisualGrid);
  const [backgrounds, setBackgrounds] = useState<Types.Environment[][]>(emptyBackgroundGrid);
  const [recipes, setRecipes] = useState<Types.Recipe[]>( Object.values(Recipes) );
  
  // const [tps, setTps] = useState<Types.ArrayOfCoords>([]);
  
  const [residual, setResidual] = useState<Types.Residual[]>([]);
  
  const [player, setPlayer] = useState<Types.Player>(Entities.emptyPlayer);
  const playerRef = useRef(player);
  const [bestiary, setBestiary] = useState<Types.BestiaryItem[]>([]);
  const [inspectedEntityId, setInspectedEntityId] = useState<string | null>(null);
  const lastInspectedEntityRef = useRef<Types.Enemy | null>(null);  // const [inspectedCreature, setInspectedCreature] =
  //   useState<Types.Enemy | null>();

    useEffect( () => {
    const recetas = Object.values(Recipes);
    const deepCopy = structuredClone(playerRef.current);

    let materials = deepCopy.hotBar.Equippeable.filter(
      (slot: Types.InventoryGear) => !slot.item.equippeable,
    );

    const crafteableRecipes = recetas.filter( (selectedRecipe: Types.Recipe) => {
      
    const allMaterialsHere = selectedRecipe.ingredients.every((ingredient: Types.recipeMaterial) => {
      const found = materials.find(
        (material: Types.InventoryGear) =>
          material.item.name === ingredient.material.name,
      );
        if (!found) return false;

        return found && (found.quantity ?? 0) >= ingredient.quantity;
      });

    return allMaterialsHere;

    } );

    setRecipes(crafteableRecipes);
  }, [playerRef.current.hotBar] )
  
  useEffect(() => {
    if (!game) return;

    const interval = setInterval(() => {
      if (gridRef.current && document.activeElement !== gridRef.current) {
        gridRef.current.focus();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    mapaRef.current = mapa;
  }, [mapa]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const findPlayer = (): void => {
    let here = [0, 0];
    let symbol = "";
    let heroIcons = [
      icons.heroFront,
      icons.heroBack,
      icons.heroLeft,
      icons.heroRight,
    ];
    mapa.forEach((fila, y) =>
      fila.forEach((celda, z) => {
        if (heroIcons.includes(celda.symbol)) {
          here = [y, z];
          symbol = celda.symbol;
        }
      }),
    );
    setPlayer((prev) => ({
      ...prev,
      symbol,
      data: { x: here[0], y: here[1] },
    }));
  };

  const returnPlayer = (): { x: number; y: number; icon: string } => {
    let here = [0, 0];
    let heroIcons = [
      icons.heroFront,
      icons.heroBack,
      icons.heroLeft,
      icons.heroRight,
    ];
    const actualMap = mapaRef.current;
    
    actualMap.forEach((fila, y) =>
      fila.forEach((celda, z) => {
        if (heroIcons.includes(celda.symbol)) {
          here = [y, z];
        }
      }),
    );
    return { x: here[0], y: here[1], icon: actualMap[here[0]][here[1]].symbol };
  }

  const inconsecuente = (symbol: string): void => {
    const auxiliar = mapa.map((fila) => [...fila]);
    const { x, y } = player.data;
    auxiliar[x][y] = { ...player, symbol: symbol, data: { x, y } };
    setPlayer((prev) => ({ ...prev, symbol, data: { x, y } }));
    setMapa(auxiliar);
  };

  const moveHere = (
    x: number,
    y: number,
    symbol: string,
    complete: boolean,
  ): CellContent[][] => {
    const auxiliar = mapa.map((fila) => [...fila]);
    const { x: pX, y: pY } = playerRef.current.data;
    const thisResidual = residual.find(
      ({ coords }) => coords[0] === pX && coords[1] === pY,
    );
    if (thisResidual) {
      auxiliar[pX][pY] = thisResidual.entity;
      setResidual((prev) =>
        prev.filter(({ coords }) => coords[0] !== pX || coords[1] !== pY),
      );
    } else {
      auxiliar[pX][pY] = emptyTile;
    }

    if (complete === true) {
      let flag = true;
      
      setPlayer((prev) => {
        if(isDev && flag) {
          flag = false;
          return prev;
        }
        auxiliar[x][y] = { ...prev, symbol, data: { x, y } };
        return { ...prev, symbol, data: { x, y } };
      });
      setMapa(auxiliar);
    }
    return auxiliar;
  };

  const findThisEnemy = (
    id: string,
    map?: CellContent[][],
  ): { x: number; y: number; entity: Types.Enemy } | undefined => {
    const activeMap = map ?? mapaRef.current;
    for (let i = 0; i < activeMap.length; i++) {
      for (let j = 0; j < activeMap[i].length; j++) {
        const cell = activeMap[i][j];
        if (
          "type" in cell &&
          cell.type === "Enemy" &&
          "id" in cell &&
          cell.id === id
        )
          return { x: i, y: j, entity: cell as Types.Enemy };
      }
    }

    return undefined;
  };

  // const handleTp = (
  //   x: number,
  //   y: number,
  //   symbol: string,
  //   other: string,
  // ): void => {
  //   const auxiliar = mapa.map((fila) => [...fila]);

  //   const { x: pX, y: pY } = player.data;
  //   const newX = pX + x;
  //   const newY = pY + y;
  //   const [tp1X, tp1Y] = tps[0];
  //   const [tp2X, tp2Y] = tps[1];

  //   if (
  //     auxiliar[tp1X][tp1Y].name === "Teleport" &&
  //     auxiliar[tp2X][tp2Y].name === "Teleport"
  //   ) {
  //     switch (other) {
  //       case icons.boxImg: {
  //         auxiliar[pX][pY] = emptyTile;
  //         auxiliar[newX][newY] = player;
  //         setPlayer((prev) => ({
  //           ...prev,
  //           symbol,
  //           data: { x: newX, y: newY },
  //         }));
  //         if (tp1X === newX + x && tp1Y === newY + y) {
  //           setResidual((prev) => [
  //             ...prev,
  //             { entity: Tiles.teleport, coords: [tp2X, tp2Y] },
  //           ]);
  //           auxiliar[tp2X][tp2Y] = Tiles.box;
  //         } else {
  //           setResidual((prev) => [
  //             ...prev,
  //             { entity: Tiles.teleport, coords: [tp1X, tp1Y] },
  //           ]);
  //           auxiliar[tp1X][tp1Y] = Tiles.box;
  //         }
  //         setMapa(auxiliar);
  //         break;
  //       }
  //       case "": {
  //         if (tp1X === newX && tp1Y === newY) {
  //           setResidual((prev) => [
  //             ...prev,
  //             { entity: Tiles.teleport, coords: [tp2X, tp2Y] },
  //           ]);
  //           auxiliar[pX][pY] = emptyTile;
  //           auxiliar[tp2X][tp2Y] = player;
  //           setPlayer((prev) => ({
  //             ...prev,
  //             symbol,
  //             data: { x: tp2X, y: tp2Y },
  //           }));
  //           setMapa(auxiliar);
  //         } else {
  //           setResidual((prev) => [
  //             ...prev,
  //             { entity: Tiles.teleport, coords: [tp1X, tp1Y] },
  //           ]);
  //           auxiliar[pX][pY] = emptyTile;
  //           auxiliar[tp1X][tp1Y] = player;
  //           setPlayer((prev) => ({
  //             ...prev,
  //             symbol,
  //             data: { x: tp1X, y: tp1Y },
  //           }));
  //           setMapa(auxiliar);
  //         }
  //         break;
  //       }
  //     }
  //   } else {
  //     inconsecuente(symbol);
  //   }
  // };

  const pushBox = (x: number, y: number, symbol: string): void => {
    const newX = player.data.x + x;
    const newY = player.data.y + y;
    const nextX = newX + x;
    const nextY = newY + y;

    let auxiliar = mapa.map((fila) => [...fila]);

    const nextTile = auxiliar[nextX][nextY];

    switch (nextTile.name) {
      case "Void": {
        auxiliar = moveHere(newX, newY, symbol, false);
        auxiliar[nextX][nextY] = Tiles.box;
        setPlayer((prev) => ({ ...prev, symbol, data: { x: newX, y: newY } }));
        setMapa(auxiliar);
        break;
      }
      // case "Teleport": {
      //   handleTp(x, y, symbol, icons.boxImg);
      //   break;
      // }
      default:
        inconsecuente(symbol);
        break;
    }
  };

  const manageBuffInstance = (
    instance: keyof Types.BuffInstances,
    thisInstance: Types.alimentIds | undefined,
    prev: Types.Player,
    action: "add" | "remove" | "clean" | "restart",
  ): Types.Player => {
    let flag = "";
    switch (instance) {
      case "HotInstances":
        flag = "HoT";
        break;
      default:
        break;
    }

    switch (action) {
      case "add":
        if (!thisInstance) return prev;
        return {
          ...prev,
          buffs: {
            ...prev.buffs,
            flags: { ...prev.buffs.flags, [flag]: true },
            instances: {
              ...prev.buffs.instances,
              [instance]: [...prev.buffs.instances[instance], thisInstance],
            },
          },
        };
      case "remove":
        const updatedInstance = prev.buffs.instances[instance].filter(
          (x) =>
            x.dmgId !== thisInstance?.dmgId &&
            x.timerId !== thisInstance?.timerId,
        );
        const isInstanceEmpty = updatedInstance.length === 0;
        return {
          ...prev,
          buffs: {
            ...prev.buffs,
            flags: { ...prev.buffs.flags, [flag]: !isInstanceEmpty },
            instances: { ...prev.buffs.instances, [instance]: updatedInstance },
          },
        };
      case "clean":
        finishBuff(instance, prev);
        return {
          ...prev,
          buffs: {
            ...prev.buffs,
            flags: { ...prev.buffs.flags, [flag]: false },
            instances: { ...prev.buffs.instances, [instance]: [] },
          },
        };
      case "restart":
        return {
          ...prev,
          buffs: {
            ...prev.buffs,
            flags: { HoT: false },
            instances: { HotInstances: [] },
          },
        };
      default:
        return prev;
    }
  };

  const damageWeapon = (
    enemyToughness: number,
    weapon: Types.InventoryGear,
  ) => {
    let flag = true;

    setPlayer((playerInfo) => {
      if (flag && isDev) {
        flag = false;
        return playerInfo;
      }
      const aux = { ...playerInfo };
      const equippedWeapon = aux.hotBar.Equippeable.find(
        (w) => w.id === weapon.id,
      );
      if (!equippedWeapon) return aux;

      if (
        "durability" in equippedWeapon &&
        equippedWeapon.durability !== undefined &&
        equippedWeapon.durability - enemyToughness <= 0
      ) {
        const newEquippeables = aux.hotBar.Equippeable.filter(
          (wpn) => wpn.id !== equippedWeapon.id,
        );

        queueLog(`[🗡] ¡${equippedWeapon.item.name} se rompió! 💥`, "orange");

        return {
          ...aux,
          hotBar: { ...playerInfo.hotBar, Equippeable: newEquippeables },
        };
      }

      setTimeout(() => {
        setPlayer((all) => {
          const stillThere = all.hotBar.Equippeable.find(
            (w) => w.id === weapon.id,
          );
          if (stillThere) {
            return {
              ...all,
              hotBar: {
                ...all.hotBar,
                Equippeable: all.hotBar.Equippeable.map((item) =>
                  item.id === stillThere.id
                    ? { ...stillThere, onCd: false }
                    : item,
                ),
              },
            };
          }
          return all;
        });
      }, equippedWeapon.item.attackStats?.cd);

      return {
        ...aux,
        hotBar: {
          ...aux.hotBar,
          Equippeable: aux.hotBar.Equippeable.map((w) => {
            if (w.durability)
              return w.id === weapon.id
                ? {
                    ...w,
                    durability: w.durability - enemyToughness,
                    onCd: true,
                  }
                : w;
            return w;
          }),
        },
      };
    });
  };

  const strikeEnemy = (x: number, y: number): void => {
    const thisWeapon =
      player.hotBar.Equippeable.find(
        (item) => (item.item.slot === "weapon" || item.item.slot === "ranged") && item.equiped,
      ) || Gear.emptyHanded;

    if (thisWeapon.onCd) return;

    const thisEnemy = mapa[x][y] as Types.Enemy;

    if (!thisEnemy) return;

    const attk = thisWeapon.item.attackStats;
    if (!attk) return;

    const damage = attk.dmg - thisEnemy.defense.armor;

    damageEnemy(
      thisEnemy.id,
      damage >= 0 ? damage : 0,
      attk?.DoT,
      attk?.times,
      attk?.aliment,
    );
    manageVisualAnimation("visual", x, y, icons.redClawHit, 200);
    thisWeapon !== Gear.emptyHanded &&
    damageWeapon(thisEnemy.defense.toughness, thisWeapon);

    return ;
  };

  const enemyDeath = (id: string): CellContent[][] => {
    const aux = mapaRef.current.map((x) => [...x]);
    const thisMonster = findThisEnemy(id, aux);
    if (!thisMonster) return mapaRef.current;

    const { x, y, entity } = thisMonster;

    clearInterval(entity.patrolId);

    // lan === "es"
    // ? queueLog(`${thisMonster.entity.name} murió.`, "crimson")
    // : queueLog(`${thisMonster.entity.name} died.`, "crimson");

    if (thisMonster.entity.drops.length > 0) {
      const loot = thisMonster.entity.drops
        .filter((drop) => rollDrop(drop.chance))
        .map((drop) => ({ item: drop.item, quantity: drop.quantity }));
      aux[x][y] = lootBag(loot);
      return aux;
    }

    aux[x][y] = emptyTile;
    return aux;
  };

  const lootBag = (
    loot: {
      item: Types.Gear | Types.Item | Types.Material;
      quantity: number;
    }[],
  ): Types.Environment => {
    if (loot.length > 0)
      return {
        id: crypto.randomUUID(),
        type: "Object",
        name: "Bag",
        symbol: icons.bagImg,
        content: loot,
      };
    return emptyTile;
  };

  const damageEnemy = (
    id: string,
    dmg: number,
    dot: number = 0,
    times: number = 0,
    aliment: string = "",
  ): void => {
    // let tag = { aliment: "", color: "khaki" };
    let flag = true;

    setMapa((prev) => {
      if(flag && isDev) {
        flag = false;
        return prev;
      }
      
      const aux = prev.map((x) => [...x]);
      const currentMonster = findThisEnemy(id, aux);
      if (!currentMonster) return aux;

      const { x: mobX, y: mobY, entity: mob } = currentMonster;

      if (mob.hp - dmg <= 0) {
        clearInterval(mob.patrolId);

        // lan === "es"
        //   ? queueLog(`${mob.name} murió.`, "crimson")
        //   : queueLog(`${mob.name} died.`, "crimson");

        if (mob.drops.length > 0) {
          const loot = mob.drops
            .filter((drop) => rollDrop(drop.chance))
            .map((drop) => ({ item: drop.item, quantity: drop.quantity }));
          aux[mobX][mobY] = lootBag(loot);
        } else {
          aux[mobX][mobY] = emptyTile;
        }

        setTimeout(() => {
          let bFlag = true;

          setBestiary((prevData) => {
            if(bFlag && isDev) {
              bFlag = false;
              return prevData;
            }

            
            let bAux = prevData.map((beast) => ({ ...beast }));
            let beastIndex = bAux.findIndex((beast) => beast.name === mob.name);
            if (beastIndex === -1) {
              return [...bAux, { name: mob.name, quantity: 1 }];
            }
            bAux[beastIndex].quantity++;
            return bAux;
          });
        }, 0);

        return aux;
      }

      aux[mobX][mobY] = { ...mob, hp: mob.hp - dmg };

      // lan === "es"
      //   ? queueLog(
      //       `Golpeaste a ${mob.name} por ${dmg} de daño. [${mob.hp - dmg}/${mob.maxHp}]. ${tag.aliment}`,
      //       tag.color,
      //     )
      //   : queueLog(
      //       `You HIT ${mob.name} by ${dmg} damage. [${mob.hp - dmg}/${mob.maxHp}]`,
      //       "khaki",
      //     );

      if (dot !== 0 && mob.defense.immunity !== aliment) {
        const alimentVector = {
          poison: "PoisonInstances",
          bleed: "BleedInstances",
          burn: "BurnInstances",
          explosive: 'BurnInstances',
        } as const;

        type AlimentKey = keyof typeof alimentVector;

        if (aliment in alimentVector) {
          setTimeout(() => {
            let dmgId = setInterval(() => {
              let flag = true;

              setMapa((prevMap) => {
                if (flag && isDev) {
                  flag = false;
                  return prevMap;
                }

                const dotAux = prevMap.map((fila) => [...fila]);
                const dmgIntervalMonster = findThisEnemy(id, dotAux);

                if (!dmgIntervalMonster) return prevMap;
                const { x, y, entity } = dmgIntervalMonster;

                manageVisualAnimation("damage", x, y, dot.toString(), 450);

                if (entity.hp - dot <= 0 || !game) {

                  setTimeout(() => {
                    let bFlag = true;

                    setBestiary((prevData) => {
                      if(bFlag && isDev) {
                        bFlag = false;
                        return prevData;
                      }

                      
                      let bAux = prevData.map((beast) => ({ ...beast }));
                      let beastIndex = bAux.findIndex((beast) => beast.name === mob.name);
                      if (beastIndex === -1) {
                        return [...bAux, { name: mob.name, quantity: 1 }];
                      }
                      bAux[beastIndex].quantity++;
                      return bAux;
                    });
                  }, 0);
                  
                  cleanse("all", id);
                  return enemyDeath(id);
                }

                dotAux[x][y] = { ...entity, hp: entity.hp - dot };
                return dotAux;
              });
            }, 1000);

            let timerId = setTimeout(() => {
              setMapa((prevMap) => {
                const dotAux = prevMap.map((cell) => [...cell]);
                const timeoutMonster = findThisEnemy(id, dotAux);
                if (!timeoutMonster) return prevMap;

                const { x, y, entity } = timeoutMonster;

                dotAux[x][y] = manageDotInstance(
                  alimentVector[aliment as AlimentKey],
                  { dmgId, timerId },
                  entity,
                  "remove",
                );
                return dotAux;
              });
              clearInterval(dmgId);
            }, times * 1000);

            setMapa((prevMap) => {
              const dotAux = prevMap.map((cell) => [...cell]);
              const dotInstanceMonster = findThisEnemy(id, dotAux);
              if (!dotInstanceMonster) return dotAux;

              const { x, y, entity } = dotInstanceMonster;

              dotAux[x][y] = manageDotInstance(
                alimentVector[aliment as AlimentKey],
                { dmgId, timerId },
                entity,
                "add",
              );
              return dotAux;
            });
          }, 0);
        }
      }

      return aux;
    });
  };

  const damageCharm = (charm: Types.InventoryGear, dmg: number) => {
    const residualDmg = dmg - (charm.durability || 0);
    const newCharm = {
      ...charm,
      durability: residualDmg < 0 ? residualDmg * -1 : 0,
    };
    return { newCharm, residualDmg: residualDmg > 0 ? residualDmg : 0 };
  };

  const hurtPlayer = (
    dmg: number,
    dot: number,
    times: number,
    aliment: string,
  ): void => {
    let flag = true;

    setPlayer((prev) => {
      if (flag && isDev) {
        flag = false;
        return prev;
      }

      let activeCharm = prev.hotBar.Equippeable.find(
        (item) => item.equiped && item.item.slot === "charm",
      );
      if (activeCharm) {
        const { newCharm, residualDmg } = damageCharm(activeCharm, dmg);
        queueLog(
          `${activeCharm.item.name} se activó, daño recibido: ${residualDmg}.`,
          "white",
        );
        if (prev.hp - residualDmg <= 0) {
          stopGame();
          return { ...prev, hp: 0 };
        }
        let newEquippeables = prev.hotBar.Equippeable;
        if (newCharm.durability > 0) {
          newEquippeables = prev.hotBar.Equippeable.map((gear) =>
            gear.id === newCharm?.id ? newCharm : gear,
          );
        } else {
          queueLog(`[📿] ¡${activeCharm.item.name} se rompió! 💥`, "white");
          newEquippeables = prev.hotBar.Equippeable.filter(
            (gear) => gear.id !== newCharm?.id,
          );
        }

        return {
          ...prev,
          hotBar: { ...prev.hotBar, Equippeable: newEquippeables },
          hp: prev.hp - residualDmg,
        };
      }
      if (prev.hp - dmg <= 0) {
        stopGame();
        return { ...prev, hp: 0 };
      }

      return { ...prev, hp: prev.hp - dmg };
    });

    let estado = "";
    let color = "";

    if (dot !== 0) {
      let flag = true;
      switch (aliment) {
        case "poison": {
          setPlayer((prev) => {
            if (flag && isDev) {
              flag = false;
              return prev;
            }
            let aux = { ...prev };
            estado = "veneno";
            color = "lime";
            queueLog("[ENVENENADO]", "lime");

            return manageDotInstance(
              "PoisonInstances",
              { dmgId, timerId },
              aux,
              "add",
            );
          });
          break;
        }
        case "bleed": {
          setPlayer((prev) => {
            if (flag && isDev) {
              flag = false;
              return prev;
            }
            const aux = { ...prev };
            estado = "sangrado";
            color = "red";
            queueLog("[SANGRANDO]", "red");

            return manageDotInstance(
              "BleedInstances",
              { dmgId, timerId },
              aux,
              "add",
            );
          });
          break;
        }
        case 'explosive':
        case "burn": {
          setPlayer((prev) => {
            if (flag && isDev) {
              flag = false;
              return prev;
            }
            const aux = { ...prev };
            estado = "quemadura";
            color = "orange";
            queueLog("[EN LLAMAS]", "orange");

            return manageDotInstance(
              "BurnInstances",
              { dmgId, timerId },
              aux,
              "add",
            );
          });
          break;
        }
        default:
          break;
      }

      let dmgId = setInterval(() => {
        let flag = true;
        setPlayer((prevData) => {
          if (flag && isDev) {
            flag = false;
            return prevData;
          }

          const aux = { ...prevData };

          queueLog(`Daño por ${estado}: ${dot}`, color);
          if (aux.hp - dot <= 0) {
            stopGame();

            return { ...aux, hp: 0 };
          }

          return { ...aux, hp: aux.hp - dot };
        });
      }, 1000);

      let timerId = setTimeout(() => {
        let flag = true;
        switch (aliment) {
          case "poison": {
            setPlayer((prev) => {
              if (flag && isDev) {
                flag = false;
                return prev;
              }
              const aux = { ...prev };
              return manageDotInstance(
                "PoisonInstances",
                { dmgId, timerId },
                aux,
                "remove",
              );
            });
            break;
          }
          case "bleed": {
            setPlayer((prev) => {
              if (flag && isDev) {
                flag = false;
                return prev;
              }
              const aux = { ...prev };
              return manageDotInstance(
                "BleedInstances",
                { dmgId, timerId },
                aux,
                "remove",
              );
            });
            break;
          }
          case 'explosive':
          case "burn": {
            setPlayer((prev) => {
              if (flag && isDev) {
                flag = false;
                return prev;
              }
              const aux = { ...prev };
              return manageDotInstance(
                "BurnInstances",
                { dmgId, timerId },
                aux,
                "remove",
              );
            });
            break;
          }
          default:
            break;
        }
        clearInterval(dmgId);
      }, times * 1000);
    }

    setIsTakingDamage(true);

    setTimeout(() => {
      setIsTakingDamage(false);
    }, 400);

    return;
  };

  const touchEnemy = (symbol: string, thisEnemy: Types.Enemy): void => {
    const { attack } = thisEnemy;
    queueLog(
      `${thisEnemy.name} te golpeó por ${attack.Instant} de daño.`,
      "red",
    );
    hurtPlayer(attack.Instant, attack.DoT, attack.Times, attack.Aliment);
    inconsecuente(symbol);
  };

  const stepOnTrap = (x: number, y: number, symbol: string): void => {
    const thisTrap = mapaRef.current[x][y];
    // const thisTrap = traps.find( trap => trap.data.x===x && trap.data.y===y ) || Entities.trap ;

    setResidual((prev) => [...prev, { entity: thisTrap, coords: [x, y] }]);
    moveHere(x, y, symbol, true);

    if ("attack" in thisTrap) {
      const { attack } = thisTrap;
      queueLog(
        `${thisTrap.name} te causó ${attack.Instant} de daño.`,
        "crimson",
      );

      hurtPlayer(attack.Instant, attack.DoT, attack.Times, attack.Aliment);
    }
  };

  const walkOntoFire = (
    x: number,
    y: number,
    symbol: string,
    newX: number,
    newY: number,
  ): void => {
    const auxiliar = mapa.map((fila) => [...fila]);
    auxiliar[newX - x][newY - y] = emptyTile;
    auxiliar[newX][newY] = player;
    setMapa(auxiliar);
    setPlayer((playerInfo) => {
      manageVisualAnimation(
        "visual",
        playerInfo.data.x,
        playerInfo.data.y,
        "🔥",
        100,
      );
      return playerInfo;
    });
    hurtPlayer(1, 1, 8, "burn");
    setTimeout(() => {
      const auxiliar = mapa.map((fila) => [...fila]);
      auxiliar[newX][newY] = Tiles.fire;
      if (player.hp <= 0) {
        return; // ¿Nada? ¿No debería ir un Death();?
      }
      auxiliar[newX - x][newY - y] = player;
      setMapa(auxiliar);
      setPlayer((prev) => ({
        ...prev,
        symbol,
        data: { x: newX - x, y: newY - y },
      }));
    }, 45);
  };

  const stepOnItem = (
    tile: Types.Item,
    quantity: number,
    x?: number,
    y?: number,
    symbol?: string,
    lootBag?: boolean,
  ): void => {
    if (player.inventory.length >= 20) {
      if (!lootBag && x !== undefined && y !== undefined && symbol) {
        setResidual((prev) => [...prev, { entity: tile, coords: [x, y] }]);
        moveHere(x, y, symbol, true);
      }
      return;
    }
    if (!lootBag && x !== undefined && y !== undefined && symbol !== undefined)
      moveHere(x, y, symbol, true);

    addToInventory(tile, quantity, lootBag ? lootBag : false);
  };

  const stepOnGear = (
    tile: Types.Gear,
    x?: number,
    y?: number,
    symbol?: string,
    lootBag?: boolean,
    quantity?: number,
  ): void => {
    if (player.hotBar.Equippeable.length >= 6) {
      if (
        !lootBag &&
        x !== undefined &&
        y !== undefined &&
        symbol !== undefined
      ) {
        setResidual((prev) => [...prev, { entity: tile, coords: [x, y] }]);
        moveHere(x, y, symbol, true);
      }
      return;
    }
    if (
      !lootBag &&
      x !== undefined &&
      y !== undefined &&
      symbol !== undefined
    ) {
      moveHere(x, y, symbol, true);
    }

    if (quantity) {
      addToEquippeable(tile, lootBag ? lootBag : false, quantity);
      return;
    }
    addToEquippeable(tile, lootBag ? lootBag : false);
  };

  const turnToInventoryGear = (
    gear: Types.Gear,
    equip: boolean = false,
  ): Types.InventoryGear => {
    return {
      item: gear,
      id: crypto.randomUUID(),
      durability: gear.durability,
      onCd: false,
      equiped: equip,
      selected: false,
    };
  };

  const turnToInventoryMaterial = (
    material: Types.Gear,
    quantity: number,
  ): Types.InventoryGear => {
    return {
      item: material,
      id: crypto.randomUUID(),
      quantity,
      selected: false,
    };
  };

  const addToEquippeable = (
    gear: Types.Gear,
    lootBag: boolean,
    quantity?: number,
  ): void => {
    if (!lootBag) queueLog(`${gear.name} agregado a la mochila.`, "orange");

    let item: any;

    if ("durability" in gear) {
      if (player.hotBar.Equippeable.length > 4) return;

      const hasEquippedWeapon = player.hotBar.Equippeable.some(
        (slot) => slot.item.slot === gear.slot && slot.equiped,
      );

      item = turnToInventoryGear(gear, !hasEquippedWeapon);
    } else {
      const ownedMaterial = player.hotBar.Equippeable.find(
        (x) => x.item.name === gear.name,
      );

      if (!ownedMaterial && player.hotBar.Equippeable.length > 4) return;

      if (quantity) {
        if (ownedMaterial && ownedMaterial.quantity) {
          item = {
            ...ownedMaterial,
            quantity: ownedMaterial.quantity + quantity,
          };

          setPlayer((playerInfo) => ({
            ...playerInfo,
            hotBar: {
              ...playerInfo.hotBar,
              Equippeable: playerInfo.hotBar.Equippeable.map((x) =>
                x.id === item.id ? item : x,
              ),
            },
          }));

          return;
        } else {
          item = turnToInventoryMaterial(gear, quantity);
        }
      }
    }

    let selected = false;

    if (player.hotBar.Equippeable.length === 0) {
      selected = true;
    }

    setPlayer((playerInfo) => ({
      ...playerInfo,
      hotBar: {
        ...playerInfo.hotBar,
        Equippeable: [...playerInfo.hotBar.Equippeable, { ...item, selected }],
      },
    }));

    return;
  };

  const addToInventory = (
    item: Types.Item,
    quantity: number,
    lootBag?: boolean,
  ): void => {
    const thisItem = player.inventory.find((x) => x.item.name === item.name);
    if (!lootBag) queueLog(`Recogiste ${quantity} ${item.name}.`, "lime");
    if (!thisItem) {
      setPlayer((prev) => ({
        ...prev,
        inventory: [
          ...prev.inventory,
          { item: item, quantity: quantity, onCd: false, selected: false },
        ],
      }));
    } else {
      setPlayer((prev) => ({
        ...prev,
        inventory: prev.inventory.map((object) => {
          return object.item.name === item.name
            ? { ...object, quantity: object.quantity + quantity }
            : object;
        }),
      }));
    }
  };

  const consumeItem = (): void => {
    let flag = true;
    setPlayer((playerInfo) => {
      if (flag && isDev) {
        flag = false;
        return playerInfo;
      }

      const aux = { ...playerInfo };
      const thisItem = aux.inventory.find(
        (x) => x.selected,
      ) as Types.InventoryItem;

      if (!thisItem || thisItem.onCd) return aux;
      queueLog(`Usas ${thisItem.item.name}`, "lime");

      let item = thisItem.item;

      if (item.heal) heal(item.heal, 0, 0);
      if (item.cleanse) cleanse(item.cleanse);

      manageVisualAnimation("visual", aux.data.x, aux.data.y, item.symbol, 500);

      if (thisItem.quantity - 1 > 0) {
        setTimeout(() => {
          setPlayer((prev) => ({
            ...prev,
            inventory: prev.inventory.map((z) =>
              z.item.name === thisItem.item.name ? { ...z, onCd: false } : z,
            ),
          }));
        }, thisItem.item.cd);

        return {
          ...aux,
          inventory: aux.inventory.map((z) =>
            "quantity" in z && z.item.name === thisItem.item.name
              ? { ...z, quantity: z.quantity - 1, onCd: true }
              : z,
          ),
        };
      } else {
        return {
          ...aux,
          inventory: aux.inventory.filter(
            (y) => y.item.name !== thisItem.item.name,
          ),
        };
      }
    });
  };

  const touchFountain = (symbol: string): void => {
    let flag = true;
    setPlayer((playerInfo) => {
      if (flag && isDev) {
        flag = false;
        return playerInfo;
      }
      const aux = { ...playerInfo };

      if (aux.aliments.flags.Burning) {
        queueLog("Tocar la fuente calma tus quemaduras", "turquoise");
        cleanse("burn");
      }

      inconsecuente(symbol);

      return aux;
    });
  };

  const checkLootBag = (lootContent: Types.lootBagItem[]): void => {
    // handleEventLogs(`------------------------`, 'orange' );
    lootContent.forEach((drop) => {
      // handleEventLogs(`- ${drop.quantity} x ${drop.item.name}`, 'khaki' );
      if (
        (drop.item.type === "Ore" || drop.item.type === "Reagent") &&
        player.hotBar.Equippeable.length <= 5
      )
        stepOnGear(
          drop.item as Types.Gear,
          undefined,
          undefined,
          undefined,
          true,
          drop.quantity,
        );
      if (drop.item.type === "Item" && player.inventory.length <= 6)
        stepOnItem(
          drop.item as Types.Item,
          drop.quantity,
          undefined,
          undefined,
          undefined,
          true,
        );
      if (
        (drop.item.type === "Gear" || drop.item.type === "Tool") &&
        player.hotBar.Equippeable.length <= 5
      )
        stepOnGear(
          drop.item as Types.Gear,
          undefined,
          undefined,
          undefined,
          true,
        );
    });
    // handleEventLogs(`La bolsa contenía:`, 'orange')
  };

  const movePlayer = (x: number, y: number, symbol: string): void => {
    const aux = mapaRef.current.map((fila) => [...fila]);

    const newX = Number(player.data.x) + x;
    const newY = Number(player.data.y) + y;

    const tile = aux[newX][newY];

    if (!stun) {
      switch (tile.name) {
        case "Void": {
          moveHere(newX, newY, symbol, true);
          break;
        }
        case "Bag": {
          if ("content" in tile) checkLootBag(tile.content);
          moveHere(newX, newY, symbol, true);
          break;
        }
        case "Box": {
          pushBox(x, y, symbol);
          break;
        }
        case "Teleport": {
          const thisTp = tile as Types.Environment;
          moveHere(thisTp.coords?.x || 2, thisTp.coords?.y || 2, symbol, true);
          break;
        }
        case "Fire": {
          walkOntoFire(x, y, symbol, newX, newY);
          break;
        }
        case "Fountain": {
          touchFountain(symbol);
          break;
        }
        case "Unknown":
        case "Wall":
        case "Water":
        case "oob": {
          inconsecuente(symbol);
          break;
        }
      }

      switch (tile.type) {
        case "Wall":
        case "Node": {
          inconsecuente(symbol);
          break;
        }
        case "Item": {
          stepOnItem(tile as Types.Item, 1, newX, newY, symbol);
          break;
        }
        case "Gear":
        case "Tool": {
          stepOnGear(tile as Types.Gear, newX, newY, symbol);
          break;
        }
        case "Trap": {
          stepOnTrap(newX, newY, symbol);
          break;
        }
        case "Enemy": {
          setPlayer((playerInfo) => {
            manageVisualAnimation(
              "visual",
              playerInfo.data.x,
              playerInfo.data.y,
              icons.clawHit,
              400,
            );
            return playerInfo;
          });
          touchEnemy(symbol, tile as Types.Enemy);
          break;
        }
        case "Teleporter": {
          if ("content" in tile) {
            swapMap(tile.content);
          }
          break;
        }
      }
    }
  };

  const rollDrop = (chance: number): boolean => {
    const random = Math.floor(Math.random() * 100) + 1;
    if (random <= chance) {
      return true;
    }
    return false;
  };

  const queueLog = (message: string, color: string): void => {
    // setDelayedLog( list => [ ...list, { message, color } ] );
  };

  const navigateHotBarVectors: Record<string, number> = {
    arrowup: -1,
    arrowdown: 1,
    x: 0,
    enter: 9,
  };

  const navigateConsumablesVectors: Record<string, number> = {
    arrowleft: -1,
    arrowright: 1,
    backspace: 0,
  };

  const directionFromVector = (symbol: string): [number, number] => {
    switch (symbol) {
      case icons.heroBack:
        return [-1, 0];
      case icons.heroFront:
        return [1, 0];
      case icons.heroLeft:
        return [0, -1];
      case icons.heroRight:
        return [0, 1];
      default:
        return [0, 0];
    }
  };

  const playerFacing = (symbol: string): string => {
    switch (symbol) {
      case icons.heroBack:
        return "up";
      case icons.heroFront:
        return "down";
      case icons.heroLeft:
        return "left";
      case icons.heroRight:
        return "right";
      default:
        return "up";
    }
  }

  const manageVisualAnimation = (
    type: string,
    x: number,
    y: number,
    icon: string,
    time: number,
  ): void => {
    setVisuals((visualsMap) => {
      const aux = [...visualsMap];
      switch (type) {
        case "visual":
          aux[x][y] = icon;
          break;
        case "damage":
          aux[x][y] = { color: "crimson", text: icon };
          break;
      }
      return aux;
    });

    setTimeout(() => {
      setVisuals((prev) => {
        const aux = [...prev];
        aux[x][y] = "";
        return aux;
      });
    }, time);
  };

  const hitOre = (x: number, y: number): void => {
    const thisTool = player.hotBar.Equippeable.find(
      (item) => item.item.type === "Tool" && item.equiped,
    );
    if (!thisTool) return;

    if (thisTool.onCd) return;

    let aux = mapaRef.current.map((x) => [...x]);

    const thisOre = aux[x][y] as Types.Node;

    if (!thisOre) return;

    const attk = thisTool.item.attackStats;
    if (!attk) return;

    const damage = attk.dmg;

    let sparks: Record<number, string> = {
      0: icons.sparks1,
      1: icons.sparks2,
      2: icons.sparks3,
    };
    const randomNumber = Math.floor(Math.random() * 3);

    manageVisualAnimation("visual", x, y, sparks[randomNumber], 900);

    if (thisOre.hp - damage <= 0) {
      const drops = thisOre.drops
        .filter((drop) => rollDrop(drop.chance))
        .map((drop) => ({ item: drop.item, quantity: drop.quantity }));

      drops.forEach((x) =>
        stepOnGear(
          x.item as Types.Gear,
          undefined,
          undefined,
          undefined,
          true,
          x.quantity,
        ),
      );

      aux[x][y] = addWall(thisOre.biome);
    } else {
      aux[x][y] = { ...thisOre, hp: thisOre.hp - damage };
    }

    setMapa(aux);
    damageWeapon(thisOre.toughness, thisTool);
  };

  const createProjectile= (Ammo: Types.Ammo, x: number, y: number, bowDamage: number ): Types.Projectile => {
    const facing = playerFacing(playerRef.current.symbol);
  
    return new ArrowClass(Ammo, facing, {x, y}, bowDamage);
  }

  // const createProjectile = (type: string, x: number, y: number, bowDamage: number ): Types.Projectile => {
  //   let thisProjectile: Types.Projectile;
    

    // switch(type) {
    //   case 'normal': {  
    //     thisProjectile = new basicArrowClass( playerFacing(playerRef.current.symbol), { x, y }, bowDamage );
    //     break;
    //   }
    //   case 'fire': {
    //     thisProjectile = new fireArrowClass( playerFacing(playerRef.current.symbol), { x, y }, bowDamage );
    //     break;
    //   }
    //   case 'poison': {
    //     thisProjectile = new poisonArrowClass( playerFacing(playerRef.current.symbol), { x, y }, bowDamage );
    //     break;
    //   }
    //   default: {
    //     thisProjectile = new basicArrowClass( playerFacing(playerRef.current.symbol), { x, y }, bowDamage); // manejar después
    //   }
    // }

    // return thisProjectile;
  // };

  const shootProjectile = (): void => {
    const equippedBow = playerRef.current.hotBar.Equippeable.find(
      (item) => item.equiped && item.item.style === "ranged",
    );
    if(!equippedBow || equippedBow.onCd) return;

    let traveledDistance = 0;
    const { x, y, icon } = returnPlayer();
    const [dx, dy] = directionFromVector(icon);
    
    let actualX = x + dx;
    let actualY = y + dy;

    const equippedAmmo = playerRef.current.quiver.find( (slot) => (slot.ammo.ammoType === equippedBow.item.ammoType) && slot.selected );
    if(!equippedAmmo) return;

    let thisProjectile = createProjectile(equippedAmmo.ammo, actualX, actualY, equippedBow.item.attackStats?.dmg as number);

    let firstIteration = true;

    damageWeapon(thisProjectile.toughness, equippedBow);

    const { dmg, DoT, aliment, times } = thisProjectile.attackStats;

    let flag = true;

    setPlayer( (prev: Types.Player) => {
      const aux = structuredClone(prev);

      if (flag && isDev) {
        flag = false;
        return aux;
      }

      const newQuantity = equippedAmmo.quantity - 1;

      if(newQuantity <= 0) {
        return { ...aux, quiver: aux.quiver.filter( (slot: Types.quiverItem) => 
          slot.ammo.name!==equippedAmmo.ammo.name ) }
      }

      const newQuiver: Types.quiver = aux.quiver.map( (slot: Types.quiverItem) => 
        slot.ammo.name === equippedAmmo.ammo.name
        ? { ...slot, quantity: newQuantity }
        : slot );

      return { ...aux, quiver: newQuiver }; 
    } );

    const aux = mapaRef.current.map((x) => [...x]);
    const objective = aux[actualX]?.[actualY];
    
    if(objective.type==='Enemy') {
      let thisMonster = objective as Types.Enemy;

      const realDamage = dmg - thisMonster.defense.armor;

      damageEnemy(objective.id as string , realDamage, DoT, times, aliment);

      return;
    }

    const projectileId = setInterval(() => {
      if (firstIteration) {
        thisProjectile.id = projectileId;
      }

      const aux = mapaRef.current.map((x) => [...x]);
      const objective = aux[actualX]?.[actualY];

      switch (objective.type) {
        case "Tile": {
          thisProjectile.data = { x: actualX, y: actualY };
          aux[actualX][actualY] = thisProjectile;
          break;
        }
        case "Enemy": {
          clearInterval(thisProjectile.id);
          if (!firstIteration) {
            aux[actualX - dx][actualY - dy] = emptyTile;
          }
          setMapa(aux);
          let thisMonster = objective as Types.Enemy;

          const realDamage = dmg - thisMonster.defense.armor;

          damageEnemy(objective.id as string , realDamage, DoT, times, aliment);
          return;
        }
        case "Player": {
          clearInterval(thisProjectile.id);
          if (!firstIteration) {
            aux[actualX - dx][actualY - dy] = emptyTile;
          }

          setMapa(aux);

          hurtPlayer(dmg, DoT ?? 0, times ?? 0, aliment ?? 'none');
          break;
        }
        default:
          clearInterval(thisProjectile.id);
          break;
      }

      if (!firstIteration) {
        aux[actualX - dx][actualY - dy] = emptyTile;
      }

      firstIteration = false;

      actualX += dx;
      actualY += dy;

      setMapa(aux);

      traveledDistance++;

      if (traveledDistance === equippedBow.item.attackStats?.range) {
        clearInterval(thisProjectile.id);
        setTimeout(() => {
          const aux = mapaRef.current.map((x) => [...x]);
          aux[thisProjectile.data.x][thisProjectile.data.y] = emptyTile;
          setMapa(aux);
        }, thisProjectile.projectileSpeed);
      }
    }, thisProjectile.projectileSpeed);
  };

  const handleInteraction = (): void => {
    const aux = mapa.map((fila) => [...fila]);
    const [dx, dy] = directionFromVector(player.symbol);
    
    let x = player.data.x + dx;
    let y = player.data.y + dy;

    const objective = aux[x][y];
    const equippedWeapon = playerRef.current.hotBar.Equippeable.find( (slot: Types.InventoryGear ) => slot.equiped && slot.item.slot === 'weapon' );

    switch(equippedWeapon?.item.style) {
      case 'ranged':
        if(objective.type!=='Node' && objective.type!=='Wall') {
          shootProjectile();
        }
        break;
      case 'melee':
        if(objective.type ==='Enemy') strikeEnemy( x, y );
        break;
      default:
        break;
    }

    switch (objective.type) {
      case "Node": {
        hitOre(x, y);
        break;
      }
      default:
        return;
    }
  };

  const navigateHotbar = (key: string): void => {
    let flag = true;

    setPlayer((playerInfo) => {
      if (flag && isDev) {
        flag = false;
        return playerInfo;
      }

      const player = { ...playerInfo };
      const to = navigateHotBarVectors[key];

      if (to !== 0) {
        const oldIndex = player.hotBar.Equippeable.findIndex(
          (item) => item.selected,
        );

        if (oldIndex === -1) {
          const aux = player.hotBar.Equippeable.map((x, y) =>
            y === 0 ? { ...x, selected: true } : x,
          );
          return { ...player, hotBar: { ...player.hotBar, Equippeable: aux } };
        }

        const max = player.hotBar.Equippeable.length - 1;
        const newIndex =
          oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;

        if (oldIndex === newIndex) return playerInfo;

        const aux = [...player.hotBar.Equippeable];
        aux[oldIndex] = { ...aux[oldIndex], selected: false };
        aux[newIndex] = { ...aux[newIndex], selected: true };

        return { ...player, hotBar: { ...player.hotBar, Equippeable: aux } };
      }

      let equippeables = player.hotBar.Equippeable;

      if (equippeables.length > 1) {
        let selectedAt = equippeables.findIndex((x) => x.selected);
        if (selectedAt === 0) {
          equippeables[1].selected = true;
          equippeables = equippeables.slice(1);
        } else {
          equippeables[selectedAt - 1].selected = true;
          equippeables = [
            ...equippeables.slice(0, selectedAt),
            ...equippeables.slice(selectedAt + 1),
          ];
        }
        return {
          ...player,
          hotBar: { ...player.hotBar, Equippeable: equippeables },
        };
      }
      return { ...player, hotBar: { ...player.hotBar, Equippeable: [] } };
    });
  };

  const navigateConsumables = (key: string): void => {
    let flag = true;

    setPlayer((playerInfo) => {
      if (flag && isDev) {
        flag = false;
        return playerInfo;
      }

      const player = { ...playerInfo };
      const to = navigateConsumablesVectors[key];

      if (to !== 0) {
        const oldIndex = player.inventory.findIndex((item) => item.selected);

        if (oldIndex === -1) {
          const aux = player.inventory.map((x, y) =>
            y === 0 ? { ...x, selected: true } : x,
          );
          return { ...player, inventory: aux };
        }

        const max = player.inventory.length - 1;
        const newIndex =
          oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;

        if (oldIndex === newIndex) return playerInfo;

        const aux = [...player.inventory];
        aux[oldIndex] = { ...aux[oldIndex], selected: false };
        aux[newIndex] = { ...aux[newIndex], selected: true };

        return { ...player, inventory: aux };
      }

      return {
        ...player,
        inventory: player.inventory.filter((x) => !x.selected),
      };
    });
  };

  const navigateCraftingMenu = (key: string): void => {
    let flag = true;

    setRecipes((oldRecipes) => {
      if (flag && isDev) {
        flag = false;
        return oldRecipes;
      }

      let aux = oldRecipes.map((x) => ({ ...x }));
      const to = navigateHotBarVectors[key];

      const oldIndex = aux.findIndex((recipe) => recipe.selected);

      if (oldIndex === -1) {
        return aux.map((x, y) => (y === 0 ? { ...x, selected: true } : x));
      }

      const max = oldRecipes.length - 1;
      const newIndex =
        oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;

      if (oldIndex === newIndex) return oldRecipes;

      aux[oldIndex] = { ...aux[oldIndex], selected: false };
      aux[newIndex] = { ...aux[newIndex], selected: true };

      return aux;
    });
  };

  const navigateQuiver = (): void => {
    let flag = true;

    setPlayer((playerInfo) => {
      if (flag && isDev) {
        flag = false;
        return playerInfo;
      }

      const player = structuredClone(playerInfo);

      const equippedRangedWeapon = player.hotBar.Equippeable.find( (slot: Types.InventoryGear) => slot.item.style === 'ranged' && slot.equiped );
      if(!equippedRangedWeapon) return playerInfo;

      const compatibleAmmo = player.quiver.filter( (slot: Types.quiverItem) => slot.ammo.ammoType === equippedRangedWeapon.item.ammoType );
      if(compatibleAmmo.length===0) return playerInfo;

      const selectedAmmo = compatibleAmmo.find( (slot: Types.quiverItem) => slot.selected );
      
      if(!selectedAmmo || compatibleAmmo.length === 1) {
        return {...player, quiver: player.quiver.map( (x :Types.quiverItem) =>
          x.ammo.name === compatibleAmmo[0].ammo.name
          ? { ...x, selected: true }
          : x ) };
      }

      const max = compatibleAmmo.length - 1;
      const oldIndex = compatibleAmmo.findIndex( (slot: Types.quiverItem) => slot.selected );
      const newIndex = oldIndex + 1 < 0 ? max : oldIndex + 1 > max ? 0 : oldIndex + 1;

      const aux = [...player.quiver ];
      aux[oldIndex] = { ...aux[oldIndex], selected: false };
      aux[newIndex] = { ...aux[newIndex], selected: true };

      return { ...player, quiver: aux };
    });
  };

  const addToQuiver = ( Ammo: Types.Ammo, quantity: number ) => {
    // let flag = true;

    const thisAmmo = player.quiver.find((x) => x.ammo.name === Ammo.name);
    if (!thisAmmo) {
      setPlayer((prev) => ({
        ...prev,
        quiver: [
          ...prev.quiver,
          { ammo: Ammo, quantity: quantity, selected: false },
        ],
      }));
    } else {
      setPlayer((prev) => ({
        ...prev,
        quiver: prev.quiver.map((slot) => {
          return slot.ammo.name === Ammo.name
            ? { ...slot, quantity: slot.quantity + quantity }
            : slot;
        }),
      }));
    }
  };

  const craftItem = (): void => {
    let flag = true;

    setPlayer((prevInfo) => {
      if (flag && isDev) {
        flag = false;
        return prevInfo;
      }

      let deepCopy = structuredClone(prevInfo);
      let materials = deepCopy.hotBar.Equippeable.filter(
        (slot: Types.InventoryGear) => !slot.item.equippeable,
      );

      let selectedRecipe = recipes.find((recipe) => recipe.selected);
      if (!selectedRecipe) return prevInfo;

      const canCraft = selectedRecipe.ingredients.every((ingredient) => {
        const found = materials.find(
          (material: Types.InventoryGear) =>
            material.item.name === ingredient.material.name,
        );
        if (!found) return false;

        return found && (found.quantity ?? 0) >= ingredient.quantity;
      });

      if (canCraft) {
        if (deepCopy.hotBar.Equippeable.length < 5) {
          
          switch(selectedRecipe.item.type) {
            case 'Item':
              addToInventory(selectedRecipe.item as Types.Item,selectedRecipe.quantity || 1)
              break;
            case 'Ammo':
              addToQuiver(selectedRecipe.item as Types.Ammo, selectedRecipe.quantity || 1);
              break;
            case 'Gear':
            case 'Tool':
              deepCopy.hotBar.Equippeable.push( turnToInventoryGear(selectedRecipe.item as Types.Gear) )
              break;
            default:
              break;
          };

          deepCopy.hotBar.Equippeable = deepCopy.hotBar.Equippeable.map(
            (slot: Types.InventoryGear) => {
              if (selectedRecipe !== undefined) {
                const usedMaterial = selectedRecipe.ingredients.find(
                  (x: Types.recipeMaterial) =>
                    x.material.name === slot.item.name,
                );
                if (!usedMaterial) return slot;
                return {
                  ...slot,
                  quantity: (slot.quantity ?? 0) - usedMaterial.quantity,
                };
              }
              return slot;
            },
          );

          setRecipes((oldData: Types.Recipe[]) => {
            let aux = oldData.map((x) => {
              if (x.selected) {
                setTimeout(() => {
                  setRecipes((oldData) => {
                    let aux = oldData.map((y) =>
                      y.item.name === x.item.name
                        ? { ...y, crafted: false }
                        : y,
                    );
                    return aux;
                  });
                }, 1500);
                return { ...x, crafted: true };
              }
              return x;
            });
            return aux;
          });

          deepCopy.hotBar.Equippeable = deepCopy.hotBar.Equippeable.filter(
            (slot: Types.InventoryGear) =>
              slot.item.equippeable ||
              (slot.quantity !== undefined && slot.quantity > 0),
          );

          return deepCopy;
        }

        return prevInfo;
      }

      setRecipes((oldData: Types.Recipe[]) => {
        let aux = oldData.map((x) => {
          if (x.selected) {
            setTimeout(() => {
              setRecipes((oldData) => {
                let aux = oldData.map((y) =>
                  y.item.name === x.item.name ? { ...y, failed: false } : y,
                );
                return aux;
              });
            }, 500);
            return { ...x, failed: true };
          }
          return x;
        });
        return aux;
      });

      return prevInfo;
    });
  };

  const swapGear = (): void => {
    setPlayer((playerInfo) => {
      const aux = { ...playerInfo };
      const Equippeables = aux.hotBar.Equippeable;

      const selected = Equippeables.find((x) => x.selected);
      if (!selected || selected.item.slot === "ore") return playerInfo;

      const toReplace = Equippeables.find(
        (x) => x.equiped && x.item.slot === selected.item.slot,
      );

      if (!toReplace) {
        return {
          ...aux,
          hotBar: {
            ...aux.hotBar,
            Equippeable: Equippeables.map((x) =>
              x === selected ? { ...selected, equiped: true } : x,
            ),
          },
        };
      }

      if (toReplace.id === selected.id) {
        return {
          ...aux,
          hotBar: {
            ...aux.hotBar,
            Equippeable: Equippeables.map((x) =>
              x.id === selected.id
                ? { ...selected, equiped: !selected.equiped }
                : x,
            ),
          },
        };
      }

      return {
        ...aux,
        hotBar: {
          ...aux.hotBar,
          Equippeable: Equippeables.map((x) =>
            x === toReplace
              ? { ...toReplace, equiped: false }
              : x === selected
                ? { ...selected, equiped: true }
                : x,
          ),
        },
      };
    });
  };

  const handleMovement = (event: React.KeyboardEvent): void => {
    if (game) {
      findPlayer();
      const key = event.key.toLowerCase();

      const movementKeys = ["w", "a", "s", "d"];

      if (movementKeys.includes(key)) {
        if (!allowed) return;
        setAllowed(false);
        setTimeout(() => setAllowed(true), 100);

        findPlayer();

        switch (key) {
          case "w":
            movePlayer(-1, 0, icons.heroBack);
            break;
          case "a":
            movePlayer(0, -1, icons.heroLeft);
            break;
          case "s":
            movePlayer(1, 0, icons.heroFront);
            break;
          case "d":
            movePlayer(0, 1, icons.heroRight);
            break;
        }
        return;
      }

      switch (key) {
        case "arrowup":
        case "arrowdown":
        case "x":
          switch (selectedMenu) {
            case "Gear":
              navigateHotbar(key);
              break;
            case "Crafting":
              navigateCraftingMenu(key);
              break;
            default:
              break;
          }

          break;

        case "arrowleft":
        case "arrowright":
        case "backspace":
          navigateConsumables(key);
          break;

        case "q":
          consumeItem();
          break;
        case "e":
          selectedMenu === "Gear" ? swapGear() : craftItem();
          break;

        case "r":
          navigateQuiver();
          break;
        // case 'i':   //abrir inventario
        //     setShowInventory(prev => !prev);
        //     break;

        case "tab":
          event.preventDefault();
          setSelectedMenu((prev) => {
            if (prev === "Gear") return "Crafting";
            return "Gear";
          });
          break;

        // case 'h':   //ayuda
        // setShowSlides( prev => !prev );
        // break;

        case "enter":
          handleInteraction();
          break;

        default:
          break;
      }
    }
  };

  const patrolDirections: Record<string, number[][]> =
    // Vector
    {
      vertical: [
        [-1, 0],
        [1, 0],
      ],
      horizontal: [
        [0, -1],
        [0, 1],
      ],
      random: [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ],
    };

  const patrolMovement = (
    x: number,
    y: number,
    entity: Types.Enemy,
    mapaState: CellContent[][],
  ): CellContent[][] => {
    const direcciones = patrolDirections[entity.patrol.pattern];
    let direccion = direcciones[Math.floor(Math.random() * direcciones.length)];

    const newX = x + direccion[0];
    const newY = y + direccion[1];

    if (mapaState[newX][newY] === emptyTile) {
      mapaState[x][y] = emptyTile;
      mapaState[newX][newY] = entity;

      return mapaState;
    }

    if (mapaState[newX][newY].type === "Player") {
      hurtPlayer(
        entity.attack.Instant,
        entity.attack.DoT,
        entity.attack.Times,
        entity.attack.Aliment,
      );
      return mapaState;
    }

    direccion = direcciones[Math.floor(Math.random() * direcciones.length)];

    if (mapaState[newX][newY] === emptyTile) {
      mapaState[x][y] = emptyTile;
      mapaState[newX][newY] = entity;

      return mapaState;
    }

    return mapaState;
  };

  const finishDoT = <T extends Types.WithAliments>(
    aliment: keyof Types.AlimentInstances,
    info: T,
    all?: boolean,
  ): void => {
    if (all) {
      for (const key in info.aliments.instances) {
        const instances =
          info.aliments.instances[key as keyof typeof info.aliments.instances];

        instances.forEach((ids) => {
          clearInterval(ids.dmgId);
          clearTimeout(ids.timerId);
        });
      }
    } else {
      info.aliments.instances[aliment ? aliment : "BleedInstances"].forEach(
        (ids) => {
          clearInterval(ids.dmgId);
          clearTimeout(ids.timerId);
        },
      );
    }
  };

  const finishBuff = (
    buff: keyof Types.BuffInstances,
    info: Types.Player,
    cleanse?: boolean,
  ): void => {
    if (cleanse) {
      for (const key in info.buffs.instances) {
        const instances =
          info.buffs.instances[key as keyof typeof info.buffs.instances];

        instances.forEach((ids) => {
          clearInterval(ids.dmgId);
          clearTimeout(ids.timerId);
        });
      }
    } else {
      info.buffs.instances[buff].forEach((ids) => {
        clearInterval(ids.dmgId);
        clearTimeout(ids.timerId);
      });
    }
  };

  const manageDotInstance = <T extends Types.WithAliments>(
    instance: keyof Types.AlimentInstances,
    newInstance: Types.alimentIds | undefined,
    prev: T,
    action: "add" | "remove" | "clean" | "restart",
  ): T => {
    let flag = "";
    switch (instance) {
      case "BleedInstances":
        flag = "Bleeding";
        break;
      case "BurnInstances":
        flag = "Burning";
        break;
      case "PoisonInstances":
        flag = "Poisoned";
        break;
      default:
        break;
    }

    switch (action) {
      case "add":
        return {
          ...prev,
          aliments: {
            ...prev.aliments,
            flags: { ...prev.aliments.flags, [flag]: true },
            instances: {
              ...prev.aliments.instances,
              [instance]: [...prev.aliments.instances[instance], newInstance],
            },
          },
        };
      case "remove":
        const updatedInstance = prev.aliments.instances[instance].filter(
          (x) =>
            x.dmgId !== newInstance?.dmgId &&
            x.timerId !== newInstance?.timerId,
        );
        const isInstanceEmpty = updatedInstance.length === 0;
        return {
          ...prev,
          aliments: {
            ...prev.aliments,
            flags: { ...prev.aliments.flags, [flag]: !isInstanceEmpty },
            instances: {
              ...prev.aliments.instances,
              [instance]: updatedInstance,
            },
          },
        };
      case "clean":
        return {
          ...prev,
          aliments: {
            ...prev.aliments,
            flags: { ...prev.aliments.flags, [flag]: false },
            instances: { ...prev.aliments.instances, [instance]: [] },
          },
        };
      case "restart":
        return {
          ...prev,
          aliments: {
            ...prev.aliments,
            flags: { Poisoned: false, Burning: false, Bleeding: false },
            instances: {
              BurnInstances: [],
              BleedInstances: [],
              PoisonInstances: [],
            },
          },
        };
      default:
        return prev;
    }
  };

  const cleanse = (aliment: string, ID: string = ""): void => {
    switch (aliment) {
      case "bleed": {
        if (ID) {
          // setEnemies( prevEnemies =>
          // {
          //     const aux = [ ...prevEnemies];
          //     return aux.map( mob =>
          //     {
          //         if( mob.id!==ID ) return mob;
          //         finishDoT( 'BleedInstances',  mob );
          //         return manageDotInstance( 'BleedInstances', undefined, mob, 'clean' );
          //     } );
          // } );
        } else {
          setPlayer((playerInfo) => {
            const aux = { ...playerInfo };
            finishDoT("BleedInstances", aux);
            return manageDotInstance("BleedInstances", undefined, aux, "clean");
          });
        }
        break;
      }
      case "poison": {
        if (ID) {
          // setEnemies( prevEnemies =>
          // {
          //     const aux = [ ...prevEnemies];
          //     return aux.map( mob =>
          //     {
          //         if( mob.id!==ID ) return mob;
          //         finishDoT( 'PoisonInstances',  mob );
          //         return manageDotInstance( 'PoisonInstances', undefined, mob, 'clean' );
          //     } );
          // } );
        } else {
          setPlayer((playerInfo) => {
            const aux = { ...playerInfo };
            finishDoT("PoisonInstances", aux);
            return manageDotInstance(
              "PoisonInstances",
              undefined,
              aux,
              "clean",
            );
          });
        }
        break;
      }
      case "burn": {
        if (ID) {
          // setEnemies( prevEnemies =>
          // {
          //     const aux = [ ...prevEnemies];
          //     return aux.map( mob =>
          //     {
          //         if( mob.id!==ID ) return mob;
          //         finishDoT( 'BurnInstances',  mob );
          //         return manageDotInstance( 'BurnInstances', undefined, mob, 'clean' );
          //     } );
          // } );
        } else {
          setPlayer((playerInfo) => {
            const aux = { ...playerInfo };
            finishDoT("BurnInstances", aux);
            return manageDotInstance("BurnInstances", undefined, aux, "clean");
          });
        }
        break;
      }
      case "all": {
        if (ID) {
          // setEnemies( prevEnemies =>
          // {
          //     const aux = [ ...prevEnemies];
          //     return aux.map( mob =>
          //     {
          //         if( mob.id!==ID ) return mob;
          //         finishDoT( 'BleedInstances',  mob, true );
          //         return manageDotInstance( 'BleedInstances', undefined, mob, 'restart' );
          //     } );
          // } );
        } else {
          setPlayer((playerInfo) => {
            const aux = { ...playerInfo };
            finishDoT("BleedInstances", aux, true);
            return manageDotInstance(
              "BleedInstances",
              undefined,
              aux,
              "restart",
            );
          });
        }
        break;
      }
    }
  };

  const heal = (healing: number, HoT: number, times: number): void => {
    queueLog(`+${healing} hp`, "green");

    setPlayer((prev) => {
      manageVisualAnimation(
        "healing",
        prev.data.x,
        prev.data.y,
        healing.toString(),
        500,
      );
      return {
        ...prev,
        hp: prev.hp + healing < player.maxHp ? prev.hp + healing : player.maxHp,
      };
    });

    if (HoT !== 0) {
      let dmgId = setInterval(() => {
        setPlayer((prev) => ({
          ...prev,
          hp: prev.hp + HoT > player.maxHp ? player.maxHp : prev.hp + HoT,
        }));
        queueLog(`+${HoT} hp [regen]`, "seagreen");
      }, 1000);

      let timerId = setTimeout(() => {
        clearInterval(dmgId);
      }, times * 1000);
      setPlayer((prev) =>
        manageBuffInstance("HotInstances", { dmgId, timerId }, prev, "add"),
      );
    }
  };

  type nodeDictionary = Record<string, Types.Node[]>;

  const rockyNodes: nodeDictionary = {
    Copper: Tiles.caveCopper,
    Silver: Tiles.caveSilver
  };

  const dungeonNodes: nodeDictionary = {
    Copper: Tiles.dungeonCopper
  };

  const nodePerBiome: Record<string, nodeDictionary> = {
    Rocky: rockyNodes,
    Dungeon: dungeonNodes
  };

  // const nodes: Record<string, Types.Node[]> = {
  //   Copper: copperNodes,
  //   Silver: silverNodes,
  // };

  const randomNode = (type: string, biome: string): Types.Node => {
    const biomeNodes = nodePerBiome[biome];
    const typeNodes = biomeNodes[type];
    const randomIndex = Math.floor(Math.random() * typeNodes.length);

    const randomNode = typeNodes[randomIndex];

    return randomNode;
  };

  const addNodes = (
    mapa: CellContent[][],
    minerals: Types.mineralsToAdd[],
  ): CellContent[][] => {
    type Coords = { x: number; y: number };

    const wallCoords: Coords[] = [];

    for (let y = 1; y < mapa.length - 1; y++) {
      for (let x = 1; x < mapa[0].length - 1; x++) {
        if (mapa[y][x].type === "Wall") {
          if (
            mapa[y - 1][x] === emptyTile ||
            mapa[y + 1][x] === emptyTile ||
            mapa[y][x - 1] === emptyTile ||
            mapa[y][x + 1] === emptyTile
          ) {
            wallCoords.push({ x, y });
          }
        }
      }
    }
    for (let i = 0; i < minerals.length; i++) {
      for (let j = 0; j < minerals[i].quantity; j++) {
        let randomIndex = Math.floor(Math.random() * wallCoords.length);
        const { x, y } = wallCoords.splice(randomIndex, 1)[0];
        mapa[y][x] = randomNode(minerals[i].node, minerals[i].biome);
      }
    }
    return mapa;
  };

  const walls: Record<string, Types.Environment[]> = {
    Dungeon: dungeonWalls,
    DTorch: dungeonTorches,
    Rocky: rockyWalls,
  };

  const addWall = (type: string): Types.Environment => {
    let randomIndex = Math.floor(Math.random() * walls[type].length);

    return walls[type][randomIndex];
  };

  const createEntity = (
    type:
      | "Equippable"
      | "Tool"
      | "Enemie"
      | "Trap"
      | "Consumable"
      | "Object"
      | "Teleporter"
      | "Tile"
      | "Node",
    entityName: string,
    loot?: any[],
  ): Types.Gear | Types.Enemy | Types.Item | Types.Environment => {
    const typeContainer = {
      Equippable: Gear.Equippables,
      Tool: Gear.allTools,
      Enemie: Entities.allEnemies,
      Trap: Entities.allTraps,
      Consumable: Items.Consumables,
      Object: allObjects,
      Teleporter: Tiles.allTeleporters,
      Tile: allTiles,
      Node: allNodes,
    };

    const container = typeContainer[type] as Array<
      Types.Gear | Types.Enemy | Types.Item | Types.Environment | Types.Node
    >;

    const thisEntity = container.find(
      (
        x:
          | Types.Gear
          | Types.Enemy
          | Types.Trap
          | Types.Item
          | Types.Environment
          | Types.Node,
      ) =>
        x.name === entityName || ("mineral" in x && x.mineral === entityName),
    );

    if (!thisEntity)
      throw new Error(`No se encontró la entidad ${entityName} en ${type}`);

    if (entityName === "Bag") (thisEntity as Types.Environment).content = loot;

    if (type === "Teleporter") {
      if (loot !== undefined) {
        return { ...thisEntity, content: loot[0] ?? "" } as Types.Environment;
      }
    }

    if( entityName === "Help sign" ) {
      if (loot !== undefined) {
        return { ...thisEntity, content: loot[0] } as Types.Environment;
      }
      return thisEntity;
    }

    if (entityName === "Teleport" ) {
      if( loot !== undefined && loot.length > 1 ) {
        return { ...thisEntity, coords: { x: loot[0], y: loot[1] } }
      }
      else {
        return thisEntity;
      }
    }

    if (type === "Object" || type === "Tile")
      return thisEntity as Types.Environment;

    if (type === "Node") return thisEntity as Types.Node;

    if (
      type === "Enemie" &&
      "patrol" in thisEntity &&
      (thisEntity.patrol.pattern !== "none" || undefined)
    ) {
      const id = crypto.randomUUID();

      const patrolId = setInterval(() => {
        let flag = true;

        const thisMob = findThisEnemy(id, mapaRef.current);
        if (!thisMob || !thisMob.entity.activePatrol) return;

        setMapa((prev) => {
          if (flag && isDev) {
            flag = false;
            return prev;
          }

          let aux = prev.map((x) => [...x]);

          const data = findThisEnemy(id, aux);
          if (!data || !data.entity.activePatrol) return prev;

          const { x: mobX, y: mobY, entity: mob } = data;

          aux = patrolMovement(mobX, mobY, mob, aux);

          return aux;
        });
      }, thisEntity.patrol.moveSpeed);

      return { ...thisEntity, id, patrolId, activePatrol: true };
    }

    return { ...thisEntity, id: crypto.randomUUID() } as
      | Types.Gear
      | Types.Enemy
      | Types.Item;
  };

  const rareMob = ( args: string ): CellContent => {
    const [mob, chance] = args.split('-');

    if( rollDrop(Number(chance)) ) {
      return createEntity( 'Enemie', mob );
    }

    return emptyTile;
  }

  const parseCode = (rawCode: string): { command: string; args: string[] } => {
    const match = rawCode.trim().match(/^([a-zA-Z0-9_-]+)(?:\((.*)\))?$/);

    if (!match) return { command: rawCode.trim(), args: [] };

    const command = match[1];
    const args = match[2] ? match[2].split(",").map(arg => arg.trim()) : [];

    return { command, args };
  };

  type DeferredEffect = (mapa: CellContent[][]) => CellContent[][];

  type DictionaryHandler = (args: string[]) => CellContent | { isDeferred: true; effect: DeferredEffect };

  const dictionary: Record<string, DictionaryHandler | Types.Player> = {
    "dw": () => addWall("Dungeon"),
    "tw": () => addWall("DTorch"),
    "rw": () => addWall("Rocky"),
    "cc": () => randomNode('Copper', 'Rocky'),
    "cs": () => randomNode('Silver', 'Rocky'),
    "dc": () => randomNode('Copper', 'Dungeon'),
    "w1": () => createEntity("Equippable", "Wooden bow"),
    "w2": () => createEntity("Equippable", "Wooden sword"),
    "e1": () => createEntity("Enemie", "Miner Goblin"),
    "e2": () => createEntity("Enemie", "Veteran Goblin"),
    "e3": () => createEntity("Enemie", "Scorpion"),
    "e4": () => createEntity("Enemie", "Goblin"),
    "e5": () => createEntity("Enemie", "Rookie Goblin"),
    "e6": () => createEntity("Enemie", "Hasty Goblin"),
    "t": () => createEntity("Tool", "Copper Pickaxe"),
    "p": player,
    "tp": (args) => {
      const [x, y] = args[0].split('-');
      return createEntity("Object", "Teleport", [x, y]); 
    },
    "mapTp": (args) => {
      const [style, destination] = args;
      console.log("Estilo de swapper: ", style, "\nVamos hacia: ", destination);
      return createEntity("Teleporter", style, [destination])
    },
    "sign": (args) => createEntity("Object", "Help sign", [args[0]]),
    "mob": (args) => rareMob(args[0]),
    "nodes": (args) => {
      const mineralsToAdd: Types.mineralsToAdd[] = args.map((arg) => {
        const [biome, node, qty] = arg.split('-');
        return { biome, node, quantity: Number(qty) || 1 };
      });

      return {
        isDeferred: true,
        effect: (mapa) => addNodes(mapa, mineralsToAdd),
      };
    },
    "background": (args) => {
      fillBackground(args[0]);
      return emptyTile;
    }
  };

  const floorDictionary: Record<string, Types.Environment[]> = {
    "dungeon": Tiles.dFloorTiles,
    "caves": Tiles.cFloorTiles,
  }

  const floorBrightnessDictionary: Record<string, number> = {
    "Dungeon floor": 0.2,
    "Caves floor": 0.5
  }

  const addBackground = (type: string): Types.Environment => {
    let randomIndex = Math.floor(Math.random() * floorDictionary[type].length);

    return floorDictionary[type][randomIndex];
  };

  const fillBackground = ( style: string ) => {
    setMaps( prev => {
      const aux = prev.map( x => x.actual ? { ...x, biome: style } : x );
      return aux;
    });

    setBackgrounds( Array.from({ length: mapSize }, (_, i) =>
      Array.from({ length: mapSize }, () => addBackground(style) )
    ) )
  }

  const mapReader = async (mapName: string, firstSpawn: boolean = false): Promise<void> => {
    const mapInfo = await loadMap(mapName);

    let auxiliar: CellContent[][] = Array.from({ length: mapInfo.length }, (_, i) =>
      Array.from({ length: mapInfo[i].length }, () => emptyTile)
    );

    const deferredQueue: DeferredEffect[] = [];

    for (let i = 0; i < mapInfo.length; i++) {
      for (let j = 0; j < mapInfo[i].length; j++) {
        const rawCode = mapInfo[i][j];
        if (!rawCode) continue;

        const { command, args } = parseCode(rawCode);

        if (command === 'p') {
          setPlayer((prev) => ({
            ...prev,
            data: { x: i, y: j },
          }));
        }

        const entry = dictionary[command];

        if (!entry) {
          auxiliar[i][j] = emptyTile;
        } else if (typeof entry === "function") {
          const result = entry(args);

          if (typeof result === "object" && result !== null && "isDeferred" in result) {
            deferredQueue.push(result.effect);
            auxiliar[i][j] = emptyTile;
          } else {
            auxiliar[i][j] = result as CellContent;
          }
        } else {
          if(command==='p') {
            setPlayer( (x: Types.Player) => ({...x, data: { x: i, y: j }}) )
          }
          auxiliar[i][j] = entry;
        }
      }
    }

    deferredQueue.forEach((effect) => {
      auxiliar = effect(auxiliar);
    });

    setMapa(auxiliar);
  };

  const swapMap = async (mapName: string) => {
    const existingMap = maps.find((x: listOfMaps) => x.name === mapName);
    let newMap = existingMap ?? { name: mapName, actual: true, visited: true, biome: 'none' };

    const actualMap = maps.find((x: listOfMaps) => x.actual);
    console.log("Todos los mapas cargados: ", maps, "\nMapa actual: ", actualMap);
    if (!actualMap) return setMapa(mapaRef.current);

    let flag = true;

    setMaps((prev: listOfMaps[]) => {
      if (flag && isDev) {
        flag = false;
        return prev;
      }

      const prevClone = structuredClone(prev);
      const thisMap = prevClone.find((map: listOfMaps) => map.name === newMap.name);

      if (!thisMap) {
        prevClone.push(newMap);
      }

      fillBackground(thisMap?.biome||'caves');

      return prevClone.map((mapInfo: listOfMaps) => {
        if (mapInfo.name === actualMap.name) {
          const patrolsOff = mapaRef.current.map((fila) =>
            fila.map((entidad) => {
              if (
                entidad.type === "Enemy" &&
                "activePatrol" in entidad &&
                entidad.activePatrol
              ) {
                return { ...entidad, activePatrol: false };
              } else {
                return entidad;
              }
            }),
          );

          if (mapInfo.timeoutId) {
            clearTimeout(mapInfo.timeoutId);
          }

          const timerId = setTimeout(() => {
            setMaps((prevClone: listOfMaps[]) =>
              prevClone.map((x: listOfMaps) =>
                x.name === actualMap.name
                  ? { ...x, visitedMap: undefined, visited: false, timeoutId: undefined }
                  : x,
              ),
            );
          }, 300000);

          return {
            ...actualMap,
            visitedMap: patrolsOff,
            actual: false,
            timeoutId: timerId,
          };
        }

        if (mapInfo.name === newMap.name) {
          if (mapInfo.timeoutId) {
            clearTimeout(mapInfo.timeoutId);
          }
          return { ...newMap, actual: true, timeoutId: undefined };
        }

        return mapInfo;
      });
    });

    if (existingMap?.visitedMap !== undefined) {
      const oldPlayer = existingMap.visitedMap
        .flat()
        .find((x) => x.type === "Player");
      if (oldPlayer && "data" in oldPlayer) {
        setPlayer((prev: Types.Player) => ({
          ...prev,
          data: { x: oldPlayer.data.x, y: oldPlayer.data.y },
        }));
      }

      const patrolsOn = existingMap.visitedMap.map((fila) =>
        fila.map((entidad) => {
          if (
            entidad.type === "Enemy" &&
            "activePatrol" in entidad &&
            !entidad.activePatrol
          ) {
            return { ...entidad, activePatrol: true };
          } else {
            return entidad;
          }
        }),
      );

      return setMapa(patrolsOn);
    }

    return await mapReader(mapName);
  };

  const startGame = async () => {
    const initialMapName = 'Mines4';

    setMaps( [ { name: initialMapName, actual: true, biome: 'none' } ] )

    setPlayer({
      ...Entities.emptyPlayer,
      hp: Entities.emptyPlayer.maxHp,
      symbol: icons.heroFront,
    });

    mapReader(initialMapName);

    setGame(true);
    
    setTimeout(() => gridRef.current?.focus(), 0);
  };

  const stopGame = (): void => {
    findPlayer();
    cleanse("all");
    setTimeout(() => {
      cleanse("all");
    }, 50);
    const auxiliar = mapaRef.current.map((fila) => [...fila]);
    auxiliar[player.data.x][player.data.y] = emptyTile;

    setMapa(auxiliar);
    setBackgrounds(emptyBackgroundGrid);

    setPlayer({
      ...Entities.emptyPlayer,
      hp: 0,
      symbol: icons.heroFront,
      data: {
        x: Math.floor(mapa.length / 2),
        y: Math.floor(mapa[0].length / 2),
      },
    });
    queueLog(`Moriste a causa de tus heridas.`, "white");
    setGame(false);
  };

  const renderHp = (): string => {
    if (player.hp >= 0) {
      const heartsLeft = "💖".repeat(player.hp);
      const heartsLost = "🖤".repeat(Entities.maxHp - player.hp);
      return heartsLeft + heartsLost;
    } else {
      const heartsLost = "🖤".repeat(Entities.maxHp);
      return heartsLost;
    }
  };

  const renderAliments = (): string => {
    const poison = player.aliments.flags.Poisoned ? "[💚]" : "";
    const bleed = player.aliments.flags.Bleeding ? "[🩸]" : "";
    const burn = player.aliments.flags.Burning ? "[🔥]" : "";
    return poison + bleed + burn;
  };

  const checkEntity = (entity: any): void => {
    if (
      "type" in entity &&
      (entity.type === "Enemy" || entity.type === "Trap") &&
      "id" in entity
    ) {
      setInspectedEntityId(entity.id);
    }
  };

  // const checkEntity = (entity: any): void => {
  //   console.log(entity);
  //   if (
  //     "type" in entity &&
  //     (entity.type === "Enemy" || entity.type === "Trap")
  //   ) {
  //     setInspectedCreature(entity as Types.Enemy);
  //   }
  //   return;
  // };

  function isEnvironment(celda: CellContent): celda is Types.Environment {
    return (celda as Types.Environment).content !== undefined;
  }

const readContent = (celda: CellContent): string => {
  if (isEnvironment(celda)) {
    return celda.content
      .replace(/\\r\\n|\\n/g, '\n')
      .replace(/\\t/g, '\t');
  }
  return "";
};

  return (
    <div className="game-container">
      <div className="grid-layout">
        <div className="map-zone">
          <div className="map-container" style={{ position: "relative" }}>
            <div className={`damage-vignette ${isTakingDamage ? "active" : ""}`} />

            {player.hp <= 0 && (
              <div className="death-overlay map-appear-animation">
                <h2>MORISTE</h2>
              </div>
            )}

            {game && (
              <div className="map-appear-animation" style={{ height: "100%", width: "100%" }}>
                <div className="columna-wrapper">
                
                  <div className="background-layer">
                    {Array.from({ length: PoV }, (_, dx) => {
                      const rowIndex = player.data.x - range + dx;
                      return (
                        <div key={dx} className="fila">
                          {Array.from({ length: PoV }, (_, dy) => {
                            const colIndex = player.data.y - range + dy;
                            const celda = backgrounds[rowIndex]?.[colIndex];

                            if (!celda) return <label key={dy} className="celda"></label>;

                            const iconSrc = typeof celda === "string" ? celda : celda.symbol;

                            return iconSrc ? (
                              <img src={iconSrc} alt="bg" key={dy} className="celda" style={{ filter: `brightness(${floorBrightnessDictionary[celda.name]})` }} />
                            ) : (
                              <label key={dy} className="celda"></label>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  <div onKeyDown={handleMovement} ref={gridRef} tabIndex={0}>
                    {Array.from({ length: PoV }, (_, dx) => {
                      const rowIndex = player.data.x - range + dx;
                      return (
                        <div key={dx} className="fila">
                          {Array.from({ length: PoV }, (_, dy) => {
                            const colIndex = player.data.y - range + dy;
                            const celda = mapa[rowIndex]?.[colIndex];
                            if (!celda) return <label key={dy} className="celda"></label>;
                            return celda.symbol === "" ? (
                              <label key={dy} className="celda">{celda.symbol}</label>
                            ) : celda.name === 'Help sign' ? (
                              <img
                                src={celda.symbol}
                                alt="main_map"
                                key={dy}
                                className="celda"
                                title={readContent(celda).replace(/\\r\\n|\\n/g, '\n')}
                              />
                            ) : (
                              <img
                                src={celda.symbol}
                                onClick={() => checkEntity(celda)}
                                alt="main_map"
                                key={dy}
                                className="celda"
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  <div className="visuals-layer">
                    {Array.from({ length: PoV }, (_, dx) => {
                      const rowIndex = player.data.x - range + dx;
                      return (
                        <div key={dx} className="fila">
                          {Array.from({ length: PoV }, (_, dy) => {
                            const colIndex = player.data.y - range + dy;
                            const celda = visuals[rowIndex]?.[colIndex];
                            if (!celda) return <label key={dy} className="celda"></label>;
                            if (typeof celda === "string") {
                              return allIcons.includes(celda) ? (
                                <img src={celda} alt="visual" key={dy} className="celda" />
                              ) : (
                                <label key={dy} className="celda">{celda}</label>
                              );
                            }
                            return (
                              <label
                                key={dy}
                                className="celda visual-text"
                                style={{ color: celda.color || "white" }}
                              >
                                {celda.text}
                              </label>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="hearts-floating">
                  {renderHp()} {renderAliments()}
                </div>
              </div>
            )}

            {!game && (
              <div className="start-popup">
                <button className="button-ui" onClick={startGame}>
                  START
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="gear-column">
          {selectedMenu === "Gear" && <GearTab player={player} />}
          {selectedMenu === "Crafting" && <CraftingTab recipes={recipes} player={player} />}
          <ConsumablesTab player={player} />
          {inspectedEntityId && (() => {
            const found = findThisEnemy(inspectedEntityId, mapa);

            if (found) {
              lastInspectedEntityRef.current = found.entity;
            }

            const entityToRender = found 
              ? found.entity 
              : lastInspectedEntityRef.current 
                ? { ...lastInspectedEntityRef.current, hp: 0 } 
                : null;

            if (!entityToRender) {
              return null;
            }

            return (
              <InspectorTab
                entity={entityToRender}
                bestiary={bestiary}
                onClose={() => {
                  setInspectedEntityId(null);
                  lastInspectedEntityRef.current = null;
                }}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );

};

export default App;