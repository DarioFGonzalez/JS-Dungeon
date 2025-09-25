import * as icons from '../../Icons/index';
import * as Types from '../types/global';
import * as Items from './items';

export const maxHp = 10;

export const emptyPlayer: Types.Player =
{
    Type: 'Player',
    HP: maxHp,
    MaxHP: maxHp,
    symbol: icons.heroFront,
    Data: { x: 0, y: 0 },
    Inventory: [],
    HotBar: { Equippeable: [ ] },
    Aliments:
    {
        Flags: { Poisoned: false, Bleeding: false, Burning: false },
        Instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    Buffs:
    {
        Flags: { HoT: false },
        Instances: { HotInstances: [] } 
    }
}

export const trap: Types.Trap =
{
    Type: 'Trap',
    id: '0',
    name: 'Trampa simple',
    symbol: icons.trapImg,
    Active: true,
    Data: { x: 0, y: 0 },
    Attack: { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' }
}

export const poisonTrap: Types.Trap =
{
    Type: 'Trap',
    id: '0',
    name: 'Trampa venenosa',
    symbol: icons.pTrapImg,
    Active: true,
    Data: { x: 0, y: 0 },
    Attack: { Instant: 1, DoT: 2, Times: 3, Aliment: 'poison' },
}

export const Traps: Types.Trap[] = [
    trap, poisonTrap
]

export const enemy: Types.Enemy =
{
    Type: 'Enemy',
    id: '0',
    name: 'Goblin',
    HP: 5,
    MaxHP: 5,
    symbol: icons.goblinImg,
    Data: { x: 0, y: 0 },
    Aliments:
    {
        Flags: { Poisoned: false, Bleeding: false, Burning: false },
        Instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    Attack: { Instant: 2, DoT: 0, Times: 0, Aliment: 'none' },
    Defense: { Armor: 0, Toughness: 1 },
    Pattern: 'none',
    Drops: []
}

export const heavyEnemy: Types.Enemy =
{
    Type: 'Enemy',
    id: '0',
    name: 'Hobgoblin',
    HP: 20,
    MaxHP: 20,
    symbol: icons.hGoblinImg,
    Data: { x: 0, y: 0 },
    Aliments:
    {
        Flags: { Poisoned: false, Bleeding: false, Burning: false },
        Instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    Attack: { Instant: 3, DoT: 2, Times: 3, Aliment: 'bleed' },
    Defense: { Armor: 1, Toughness: 3, Immunity: 'bleed' },
    Pattern: 'none',
    Drops: [ { item: Items.Potion, chance: 75 } ]
}

export const allEnemies: Types.Enemy[] = [
    enemy, heavyEnemy
];