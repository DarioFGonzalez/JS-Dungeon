import * as Types from '../types/global';
import * as icons from '../../Icons/index';

export const Fists: Types.Gear =
{
    type: 'Gear',
    name: 'Fists',
    symbol: '🤜',
    id: 0,
    slot: 'weapon',
    desc: '+1 DMG',
    attackStats: { dmg: 0, cd: 2500 },
    durability: 999,
    Equippeable: true
}

export const emptyHanded = { id: '0', item: Fists, durability: 999, onCd: false, equiped: true, selected: true };

export const Sword1: Types.Gear =
{
    type: 'Gear',
    name: 'Wooden Sword',
    symbol: icons.sword1Img,
    id: 1,
    slot: 'weapon',
    desc: '+2 DMG',
    attackStats: { dmg: 2, DoT: 0, times: 0, cd: 1000 },
    durability: 10,
    Equippeable: true
}

export const Dagger1: Types.Gear =
{
    type: 'Gear',
    name: 'Slicing Knife',
    symbol: icons.dagger1Img,
    id: 2,
    slot: 'weapon',
    desc: '+1 DMG (5 🩸)',
    attackStats: { dmg: 1, DoT: 1, times: 5, aliment: 'bleed', cd: 1000 },
    durability: 20,
    Equippeable: true
}

export const Necklace1: Types.Gear =
{
    type: 'Accessory',
    name: 'Protective pendant',
    symbol: icons.necklaceImg,
    id: 3,
    slot: 'charm',
    desc: '+5 Shield',
    durability: 5,
    Equippeable: true
}

export const Necklace2: Types.Gear =
{
    type: 'Accessory',
    name: 'Armor pendant',
    symbol: icons.necklaceImg,
    id: 4,
    slot: 'charm',
    desc: '+1 DEF',
    defenseStats: { def: 1 },
    durability: 50,
    Equippeable: true
}