import * as images from '../../images/index';

export type VisualCell = string | {
  text: string;
  color?: string;
};

type allEntities = Gear | Enemy | Player | Item | Environment; 

export type locationData = { x: number, y: number };
export type Coords = [ number, number ];
export type ArrayOfCoords = Coords[];
export type Residual = { entity: allEntities, coords: number[] };

export type attackStats = { dmg: number, DoT?: number, times?: number, aliment?: string, cd: number };
export type deffenseStats = { def?: number, immunity?: string, hp?: number };

export type InventoryItem = { item: Item, quantity: number, onCd: boolean };
export type InventoryGear = { id: string, item: Gear, durability: number, onCd: boolean, equiped?: boolean, selected: boolean };
export type inventory = InventoryItem[];
export type AlimentFlags = { Poisoned: boolean, Bleeding: boolean, Burning: boolean };
export type BuffFlags = { HoT: boolean };
export type AlimentInstances = { PoisonInstances: alimentIds[], BleedInstances: alimentIds[], BurnInstances: alimentIds[] }; 
export type BuffInstances = { HotInstances: alimentIds[] };

export type alimentIds = { dmgId: ReturnType<typeof setInterval>, timerId: ReturnType<typeof setTimeout> };

export type HotBarItems = { Equippeable: InventoryGear[] }

export type attackInfo = { Instant: number, DoT: number, Times: number, Aliment: string };
export type deffenseInfo = { Armor: number, Toughness: number, Immunity?: string };
export type dropInfo = { item: Item, chance: number };

export type eventLog = { message: string, color: string };

export type Aliments = 
{
    flags: AlimentFlags,
    instances: AlimentInstances
}
export type Buffs =
{
    flags: BuffFlags,
    instances: BuffInstances
}
export interface WithAliments 
{
    aliments: Aliments;
}

export interface Environment
{
    type: string,
    name: string,
    symbol: string,
    content?: any
}

export interface Item
{
    type: 'Item',
    name: string,
    symbol: string,
    hotkey: string,
    id: string,
    desc: string,
    cd: number
};

export interface Gear
{
    type: 'Gear',
    name: string,
    symbol: string,
    id: string,
    slot: string,
    desc: string,
    attackStats?: attackStats,
    defenseStats?: deffenseStats,
    buffStats?: '',
    durability: number,
    equippeable: boolean
};

export interface Player
{
    type: 'Player',
    name: string,
    hp: number,
    maxHp: number,
    defense: number,
    symbol: string,
    data: locationData,
    inventory: inventory,
    hotBar: HotBarItems,
    aliments: Aliments,
    buffs: Buffs
}

export interface Trap
{
    type: 'Trap', //agregado
    id: string,
    name: string,
    symbol: string,
    active: boolean,
    data: locationData,
    attack: attackInfo,
    toDisarm?: Item[]
}

export interface Enemy
{
    type: 'Enemy', //agregado
    id: string,
    name: string,
    hp: number,
    maxHp: number,
    symbol: string,
    data: locationData,
    aliments: Aliments,
    attack: attackInfo,
    defense: deffenseInfo,
    pattern: string,
    patrolId?: ReturnType<typeof setTimeout>,
    drops: dropInfo[]
}

export interface slideItem
{
    title: string,
    text?: string,
    img?: string
}

export const slides: slideItem[] =
[
    {
        title: 'Movimiento',
        img: images.h_mov
    },
    {
        title: 'Gear nav',
        img: images.h_gear_nav
    },
    {
        title: 'inventory',
        img: images.h_inventory
    },
    {
        title: 'Weapons',
        img: images.h_weapons
    },
    {
        title: 'Accesories',
        img: images.h_accesories
    },
    {
        title: 'Attack',
        img: images.h_attack
    },
    {
        title: 'Repositorio',
        img: images.h_repo,
        text: 'https://github.com/DarioFGonzalez/JS-Dungeon'
    }
];