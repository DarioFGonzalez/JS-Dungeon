import * as icons from '../../Icons/index';
import * as Types from '../types/global';
import * as Items from './items';

export const maxHp = 10;

export const emptyPlayer: Types.Player =
{
    HP: maxHp,
    MaxHP: maxHp,
    Data: { x: 0, y: 0, symbol: icons.heroFront },
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
    ID: '0',
    Name: 'Trampa simple',
    Active: true,
    Data: { x: 0, y: 0, symbol: icons.trapImg },
    Attack: { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' }
}

export const poisonTrap: Types.Trap =
{
    ID: '0',
    Name: 'Trampa venenosa',
    Active: true,
    Data: { x: 0, y: 0, symbol: icons.pTrapImg },
    Attack: { Instant: 1, DoT: 2, Times: 3, Aliment: 'poison' },
}

export const enemy: Types.Enemy =
{
    ID: '0',
    Name: 'Goblin',
    HP: 5,
    MaxHP: 5,
    Data: { x: 0, y: 0, symbol: icons.goblinImg },
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
    ID: '0',
    Name: 'Heavy Goblin',
    HP: 20,
    MaxHP: 20,
    Data: { x: 0, y: 0, symbol: icons.hGoblinImg },
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