import * as icons from '../../Icons/index';
import * as arrows from '../../Icons/projectileIcons';
import * as Types from '../types/global';

export const Aloe: Types.Item =
{
    type: 'Item',
    name: 'Aloe leaf',
    symbol: icons.aloeImg,
    id: '',
    desc:  'Corta la quemadura.',
    cleanse: 'burn',
    cd: 4000
}

export const Potion: Types.Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: icons.potionImg,
    id: '',
    desc: 'Recupera 3 HP.',
    heal: 3,
    cd: 3000
} 

export const Bandages: Types.Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: icons.bandagesImg,
    id: '',
    desc: 'Detiene el sangrado.',
    cleanse: 'bleed',
    cd: 5000
}

export const Antidote: Types.Item =
{
    type: 'Item',
    name: 'Antidote',
    symbol: icons.antidoteImg,
    id: '',
    desc: 'Cura el envenenamiento.',
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
    toughness: 1,
    desc: 'Flecha de madera ordinaria.'
};

export const poisonArrow: Types.Ammo = {
    type: 'Ammo',
    ammoType: 'Arrow',
    name: 'Poison arrow',
    symbol: arrows.poisonArrow,
    attackStats: {
        dmg: 1,
        DoT: 1,
        times: 4,
        aliment: 'poison',
        cd: 0
    },
    toughness: 2,
    desc: 'Flecha con punta envenenada.'
};

export const fireArrow: Types.Ammo = {
    type: 'Ammo',
    ammoType: 'Arrow',
    name: 'Fire Arrow',
    symbol: arrows.fireArrow,
    attackStats: {
        dmg: 0,
        DoT: 2,
        times: 2,
        aliment: 'burn',
        cd: 0
    },
    toughness: 2,
    desc: 'Flecha envuelta en llamas.'
}