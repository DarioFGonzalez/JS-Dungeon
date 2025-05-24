import * as Types from '../types/global';
import * as icons from '../../Icons/index';

export const Aloe: Types.Item =
{
    type: 'Item',
    name: 'Aloe leaf',
    symbol: icons.aloeImg,
    hotkey: 'k',
    id: 3,
    desc:  '',
    cd: 4000
}

export const Potion: Types.Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: icons.potionImg,
    hotkey: 'o',
    id: 2,
    desc: '+3 HP',
    cd: 3000
} 

export const Bandages: Types.Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: icons.bandagesImg,
    hotkey: 'p',
    id: 1,
    desc: 'Stops bleeding.',
    cd: 5000
}