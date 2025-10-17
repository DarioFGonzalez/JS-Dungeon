import * as icons from '../../Icons/index';
import * as Types from '../types/global';
import * as Items from './items';
import * as Gear from './gear';

export const maxHp = 10;

export const emptyPlayer: Types.Player =
{
    type: 'Player',
    name: 'Hero',
    hp: maxHp,
    maxHp: maxHp,
    defense: 0,
    symbol: icons.heroFront,
    data: { x: 0, y: 0 },
    inventory: [],
    hotBar: { Equippeable: [ ] },
    aliments:
    {
        flags: { Poisoned: false, Bleeding: false, Burning: false },
        instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    buffs:
    {
        flags: { HoT: false },
        instances: { HotInstances: [] } 
    }
}

export const trap: Types.Trap =
{
    type: 'Trap',
    id: '0',
    name: 'Simple trap',
    symbol: icons.trapImg,
    active: true,
    data: { x: 0, y: 0 },
    attack: { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' }
}

export const poisonTrap: Types.Trap =
{
    type: 'Trap',
    id: '0',
    name: 'Poison trap',
    symbol: icons.pTrapImg,
    active: true,
    data: { x: 0, y: 0 },
    attack: { Instant: 1, DoT: 2, Times: 3, Aliment: 'poison' },
}

export const allTraps: Types.Trap[] = [
    trap, poisonTrap
]

export const enemy: Types.Enemy =
{
    type: 'Enemy',
    id: '0',
    name: 'Goblin',
    hp: 5,
    maxHp: 5,
    symbol: icons.goblinImg,
    data: { x: 0, y: 0 },
    aliments:
    {
        flags: { Poisoned: false, Bleeding: false, Burning: false },
        instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    attack: { Instant: 2, DoT: 0, Times: 0, Aliment: 'none' },
    defense: { Armor: 0, Toughness: 1 },
    pattern: 'horizontal',
    drops: []
}

export const heavyEnemy: Types.Enemy =
{
    type: 'Enemy',
    id: '0',
    name: 'Hobgoblin',
    hp: 20,
    maxHp: 20,
    symbol: icons.hGoblinImg,
    data: { x: 0, y: 0 },
    aliments:
    {
        flags: { Poisoned: false, Bleeding: false, Burning: false },
        instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    attack: { Instant: 3, DoT: 2, Times: 3, Aliment: 'bleed' },
    defense: { Armor: 1, Toughness: 3, Immunity: 'bleed' },
    pattern: 'vertical',
    drops: [ { item: Items.Potion, chance: 99, quantity: 2 }, { item: Gear.Dagger1, chance: 99, quantity: 1 }, { item: Items.Bandages, chance: 50, quantity: 2 } ]
}

const agileEnemy: Types.Enemy =
{
    type: 'Enemy',
    id: '0',
    name: 'Agile Goblin',
    hp: 5,
    maxHp: 5,
    symbol: icons.snsGoblinImg,
    data: { x: 0, y: 0 },
    aliments:
    {
        flags: { Poisoned: false, Bleeding: false, Burning: false },
        instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    attack: { Instant: 1, DoT: 0, Times: 0, Aliment: '' },
    defense: { Armor: 1, Toughness: 3, Immunity: 'bleed' },
    pattern: 'random',
    drops: [ { item: Items.Potion, chance: 99, quantity: 5 }, { item: Gear.Necklace1, chance: 99, quantity: 1 } ]
};

export const allEnemies: Types.Enemy[] = [
    enemy, heavyEnemy, agileEnemy
];