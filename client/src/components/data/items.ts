import * as icons from '../../Icons/index';
import * as Types from '../types/global';

export const Aloe: Types.Item =
{
    type: 'Item',
    name: 'Aloe leaf',
    symbol: icons.aloeImg,
    hotkey: 'P',
    id: 3,
    desc:  'Corta la quemadura.',
    cd: 4000
}

export const Potion: Types.Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: icons.potionImg,
    hotkey: 'O',
    id: 2,
    desc: 'Recupera 3 HP.',
    cd: 3000
} 

export const Bandages: Types.Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: icons.bandagesImg,
    hotkey: 'K',
    id: 1,
    desc: 'Detiene el sangrado.',
    cd: 5000
}