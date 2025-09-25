import * as icons from '../../Icons/index';
import * as Types from '../types/global';

export const Aloe: Types.Item =
{
    type: 'Item',
    name: 'Aloe leaf',
    symbol: icons.aloeImg,
    hotkey: 'P',
    id: '',
    desc:  'Corta la quemadura.',
    cd: 4000
}

export const Potion: Types.Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: icons.potionImg,
    hotkey: 'O',
    id: '',
    desc: 'Recupera 3 HP.',
    cd: 3000
} 

export const Bandages: Types.Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: icons.bandagesImg,
    hotkey: 'K',
    id: '',
    desc: 'Detiene el sangrado.',
    cd: 5000
}

export const Consumables: Types.Item[] = [
    Potion, Bandages, Aloe
];