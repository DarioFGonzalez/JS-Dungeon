export type VisualCell = string | {
  text: string;
  color?: string;
};

export type locationData = { x: number, y: number, symbol: string };
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

export interface Item
{
    type: 'Item',
    name: string,
    symbol: string,
    hotkey: string,
    id: number,
    desc: string,
    cd: number
};

export interface Gear
{
    type: string,
    name: string,
    symbol: string,
    id: number,
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
    HP: number,
    MaxHP: number,
    Data: locationData,
    Inventory: Inventory,
    HotBar: HotBarItems,
    Aliments: Aliments,
    Buffs: Buffs
}

export interface Trap
{
    ID: string,
    Name: string,
    Active: boolean,
    Data: locationData,
    Attack: attackInfo,
    toDisarm?: Item[]
}

export interface Enemy
{
    ID: string,
    Name: string,
    HP: number,
    MaxHP: number,
    Data: locationData,
    Aliments: Aliments,
    Attack: attackInfo,
    Defense: deffenseInfo,
    Pattern: string,
    PatrolId?: ReturnType<typeof setTimeout>,
    Drops: dropInfo[]
}