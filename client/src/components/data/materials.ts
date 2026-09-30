import * as icons from '../../Icons/index';
import * as Types from '../types/global';

export const wood1: Types.Gear =
{
    type: 'Ore',
    name: 'Wood',
    symbol: icons.wood1,
    slot: 'Ore',
    id: '',
    desc: 'Wood logs',
}

export const CopperOre: Types.Gear =
{
    type: 'Ore',
    name: 'Copper Ore',
    symbol: icons.copperOre,
    slot: 'Ore',
    id: '',
    desc: 'Raw copper ore',
}

export const SilverOre: Types.Gear =
{
    type: 'Ore',
    name: 'Silver Ore',
    symbol: icons.silverOre,
    slot: 'Ore',
    id: '',
    desc: 'Raw silver ore',
}

export const allOres: Types.Gear[] = [ CopperOre, SilverOre, wood1 ];

export const PoisonClaw: Types.Gear =
{
    type: 'Reagent',
    name: 'Poison Claw',
    symbol: icons.scorpionClaw,
    slot: 'Reagent',
    id: '',
    desc: 'Sharp scorpion claw, easy to craft with it.'
}

export const allReagents: Types.Gear[] = [ PoisonClaw ];