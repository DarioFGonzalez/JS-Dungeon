import * as icons from '../../Icons/index';
import * as arrows from '../../Icons/projectileIcons';
import * as Types from '../types/global';

export const Aloe: Types.Item =
{
    type: 'Item',
    name: 'Aloe leaf',
    symbol: icons.aloeImg,
    id: '',
    desc:  'Stops [Burn] status effect.',
    cleanse: 'burn',
    cd: 4000
}

export const Potion: Types.Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: icons.potionImg,
    id: '',
    desc: 'Heals 3 HP.',
    heal: 3,
    cd: 3000
} 

export const Bandages: Types.Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: icons.bandagesImg,
    id: '',
    desc: 'Stops [Bleed] status effect.',
    cleanse: 'bleed',
    cd: 5000
}

export const Antidote: Types.Item =
{
    type: 'Item',
    name: 'Antidote',
    symbol: icons.antidoteImg,
    id: '',
    desc: 'Stops [Poison] status effect.',
    cleanse: 'poison',
    cd: 7500
}

export const Consumables: Types.Item[] = [
    Potion, Bandages, Aloe, Antidote
];

export const basicArrow: Types.Ammo = {
    type: 'Ammo',
    ammoType: 'Arrow',
    name: 'Basic arrow',
    symbol: arrows.basicArrow,
    attackStats: {
        dmg: 1,
        DoT: 0,
        times: 0,
        aliment: 'none',
        cd: 0
    },
    projectileSpeed: 50,
    toughness: 1,
    desc: 'Wooden arrow.'
};

export const poisonArrow: Types.Ammo = {
    type: 'Ammo',
    ammoType: 'Arrow',
    name: 'Poison arrow',
    symbol: arrows.poisonArrow,
    attackStats: {
        dmg: 1,
        DoT: 1,
        times: 3,
        aliment: 'poison',
        cd: 0
    },
    projectileSpeed: 75,
    toughness: 2,
    desc: 'Poison coated tip arrow.'
};

export const fireArrow: Types.Ammo = {
    type: 'Ammo',
    ammoType: 'Arrow',
    name: 'Fire Arrow',
    symbol: arrows.fireArrow,
    attackStats: {
        dmg: 1,
        DoT: 2,
        times: 2,
        aliment: 'burn',
        cd: 0
    },
    projectileSpeed: 85,
    toughness: 3,
    desc: 'Fire coated arrow.'
}

export const explosiveArrow: Types.Ammo = {
    type: 'Ammo',
    ammoType: 'Arrow',
    name: 'Explisove Arrow',
    symbol: arrows.explosiveArrow,
    attackStats: {
        dmg: 1,
        DoT: 5,
        times: 1,
        aliment: 'explosive',
        cd: 0
    },
    projectileSpeed: 100,
    toughness: 0,
    desc: 'Explosive-coated tip arrow.'
}