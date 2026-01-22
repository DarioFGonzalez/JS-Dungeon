import * as icons from '../../Icons/index';
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