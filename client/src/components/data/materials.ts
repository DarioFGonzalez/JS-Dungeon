import * as icons from '../../Icons/index';
import * as Types from '../types/global';

export const CopperOre: Types.Gear =
{
    type: 'Ore',
    name: 'Copper Ore',
    symbol: icons.copperOre,
    slot: 'ore',
    id: '',
    desc: 'Raw copper ore',
}

export const SilverOre: Types.Gear =
{
    type: 'Ore',
    name: 'Silver Ore',
    symbol: icons.silverOre,
    slot: 'ore',
    id: '',
    desc: 'Raw silver ore',
}

export const allOres: Types.Gear[] = [ CopperOre, SilverOre ];