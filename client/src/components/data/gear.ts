import * as Types from '../types/global';
import * as icons from '../../Icons/index';

export const Fists: Types.Gear =
{
    type: 'Gear',
    name: 'Fists',
    symbol: '🤜',
    id: '',
    slot: 'weapon',
    desc: '+1 DMG',
    attackStats: { dmg: 0, cd: 2500 },
    durability: 999,
    equippeable: true
}

export const Dagger1: Types.Gear =
{
    type: 'Gear',
    name: 'Razor',
    symbol: icons.dagger1Img,
    id: '',
    slot: 'weapon',
    desc: '+1 DMG',
    attackStats: { dmg: 1, DoT: 1, times: 5, cd: 1000, aliment: 'bleed' },
    durability: 10,
    equippeable: true
}

export const Sword1: Types.Gear =
{
    type: 'Gear',
    name: 'Machete',
    symbol: icons.sword1Img,
    id: '',
    slot: 'weapon',
    desc: '+8 DMG',
    attackStats: { dmg: 8, DoT: 0, times: 0, aliment: 'none', cd: 2500 },
    durability: 20,
    equippeable: true
}

export const Necklace1: Types.Gear =
{
    type: 'Gear',
    name: 'Amuleto escudo',
    symbol: icons.necklaceImg,
    id: '',
    slot: 'charm',
    desc: '+5 Shield',
    durability: 5,
    equippeable: true
}

export const Necklace2: Types.Gear =
{
    type: 'Gear',
    name: 'Armor pendant',
    symbol: icons.necklaceImg,
    id: '',
    slot: 'charm',
    desc: '+1 DEF',
    defenseStats: { def: 1 },
    durability: 50,
    equippeable: true
}

export const Equippables: Types.Gear[] = [
    Fists, Sword1, Dagger1, Necklace1, Necklace2
];

export const emptyHanded = { id: '', item: Fists, durability: 999, onCd: false, equiped: true, selected: true };


export const CopperPickaxe: Types.Gear =
{
    type: 'Tool',
    name: 'Copper Pickaxe',
    symbol: icons.copperPickaxe,
    id: '',
    slot: 'tool',
    desc: 'Useful to mine ores',
    attackStats: { dmg: 1, cd: 4000 },
    durability: 5,
    equippeable: true
}

export const allTools: Types.Gear[] =
[ CopperPickaxe ]