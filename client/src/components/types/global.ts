import * as images from '../../images/index';

export type VisualCell = string | {
  text: string;
  color?: string;
};

export type locationData = { x: number, y: number };
export type Coords = [ number, number ];
export type ArrayOfCoords = Coords[];
export type Residual = { symbol: string, coords: number[] };

export type attackStats = { dmg: number, DoT?: number, times?: number, aliment?: string, cd: number };
export type deffenseStats = { def?: number, immunity?: string, hp?: number };

export type InventoryItem = { item: Item, quantity: number, onCd: boolean };
export type InventoryGear = { id: string, item: Gear, durability: number, onCd: boolean, equiped?: boolean, selected: boolean };
export type Inventory = InventoryItem[];
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
    Flags: AlimentFlags,
    Instances: AlimentInstances
}
export type Buffs =
{
    Flags: BuffFlags,
    Instances: BuffInstances
}
export interface WithAliments 
{
    Aliments: Aliments;
}

export interface Environment
{
    name: string,
    symbol: string
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
    Equippeable: boolean
};

export interface Player
{
    Type: 'Player', //agregado
    HP: number,
    MaxHP: number,
    symbol: string,
    Data: locationData,
    Inventory: Inventory,
    HotBar: HotBarItems,
    Aliments: Aliments,
    Buffs: Buffs
}

export interface Trap
{
    Type: 'Trap', //agregado
    id: string,
    name: string,
    symbol: string,
    Active: boolean,
    Data: locationData,
    Attack: attackInfo,
    toDisarm?: Item[]
}

export interface Enemy
{
    Type: 'Enemy', //agregado
    id: string,
    name: string,
    HP: number,
    MaxHP: number,
    symbol: string,
    Data: locationData,
    Aliments: Aliments,
    Attack: attackInfo,
    Defense: deffenseInfo,
    Pattern: string,
    PatrolId?: ReturnType<typeof setTimeout>,
    Drops: dropInfo[]
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
        title: 'Inventory',
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