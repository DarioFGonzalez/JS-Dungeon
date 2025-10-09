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

export const Sword1: Types.Gear =
{
    type: 'Gear',
    name: 'Wooden sword',
    symbol: icons.sword1Img,
    id: '',
    slot: 'weapon',
    desc: '+2 DMG',
    attackStats: { dmg: 2, DoT: 0, times: 0, cd: 1000 },
    durability: 10,
    equippeable: true
}

export const Dagger1: Types.Gear =
{
    type: 'Gear',
    name: 'Slicing knife',
    symbol: icons.dagger1Img,
    id: '',
    slot: 'weapon',
    desc: '+8 DMG (5 🩸)',
    attackStats: { dmg: 8, DoT: 1, times: 5, aliment: 'bleed', cd: 1000 },
    durability: 20,
    equippeable: true
}

export const Pickaxe1: Types.Gear =
{
    type: 'Gear',
    name: 'Pickaxe',
    symbol: icons.tile1,
    id: '',
    slot: 'weapon',
    desc: 'Useful to mine ores',
    attackStats: { dmg: 1, cd: 1000 },
    durability: 20,
    equippeable: true
}

export const Necklace1: Types.Gear =
{
    type: 'Gear',
    name: 'Protective pendant',
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
    Fists, Sword1, Dagger1, Pickaxe1, Necklace1, Necklace2
];

export const emptyHanded = { id: '', item: Fists, durability: 999, onCd: false, equiped: true, selected: true };