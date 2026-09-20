import * as icons from '../../Icons/index';
import * as Types from '../types/global';

export const Fists: Types.Gear =
{
    type: 'Gear',
    name: 'Fists',
    symbol: '🤜',
    id: '',
    slot: 'weapon',
    style: 'melee',
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
    style: 'melee',
    desc: "Old rusty blade, it's serrated edge causes bleeding.",
    attackStats: { dmg: 1, DoT: 2, times: 2, cd: 1000, aliment: 'bleed' },
    durability: 10,
    equippeable: true
}

export const Sword1: Types.Gear =
{
    type: 'Gear',
    name: 'Wooden sword',
    symbol: icons.sword1Img,
    id: '',
    slot: 'weapon',
    style: 'melee',
    desc: 'Sword used for fencing practice, pretty harmless.',
    attackStats: { dmg: 1, DoT: 0, times: 0, aliment: 'none', cd: 1500 },
    durability: 5,
    equippeable: true
}

export const Bow1: Types.Gear =
{
    type: 'Gear',
    name: 'Wooden bow',
    symbol: icons.basicBow,
    id: '',
    slot: 'weapon',
    style: 'ranged',
    ammoType: 'Arrow',
    desc: 'An old bow, made out of wood and poor handicraft',
    attackStats: { dmg: 1, range: 3, cd: 1500 },
    durability: 8,
    equippeable: true
}

export const Bow2: Types.Gear =
{
    type: 'Gear',
    name: 'Long bow',
    symbol: icons.longBow,
    id: '',
    slot: 'weapon',
    style: 'ranged',
    ammoType: 'Arrow',
    desc: 'Accurate and reliable on long distances- yet fragile.',
    attackStats: { dmg: 1, range: 6, cd: 1500 },
    durability: 5,
    equippeable: true
}

export const Bow3: Types.Gear =
{
    type: 'Gear',
    name: 'Heavy bow',
    symbol: icons.heavyBow,
    id: '',
    slot: 'weapon',
    style: 'ranged',
    ammoType: 'Arrow',
    desc: 'Heavy draw - high impact bow. Short distances only.',
    attackStats: { dmg: 2, range: 2, cd: 2000 },
    durability: 7,
    equippeable: true
}

export const Necklace1: Types.Gear =
{
    type: 'Gear',
    name: 'Amulet of protection',
    symbol: icons.necklaceImg,
    id: '',
    slot: 'charm',
    desc: 'Protects for (💙) damage, then breaks.',
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
    Fists, Sword1, Dagger1, Bow1, Bow2, Bow3, Necklace1, Necklace2
];

export const emptyHanded = { id: '', item: Fists, durability: 999, onCd: false, equiped: true, selected: true };


export const CopperPickaxe: Types.Gear =
{
    type: 'Tool',
    name: 'Copper Pickaxe',
    symbol: icons.copperPickaxe,
    id: '',
    slot: 'tool',
    desc: 'Basic tool for mining ore.',
    attackStats: { dmg: 1, cd: 1500 },
    durability: 10,
    equippeable: true
}

export const allTools: Types.Gear[] =
[ CopperPickaxe ]