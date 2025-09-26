import * as Icons from '../../Icons/index';
import { Environment } from '../types/global';

export const basicWalls: Environment =
{
    name: 'Wall',
    symbol: Icons.wallImg
};

export const torchedWall: Environment =
{
    name: 'Torched Wall',
    symbol: Icons.torchdWallImg
};

export const box: Environment =
{
    name: 'Box',
    symbol: Icons.boxImg
};

export const fire: Environment =
{
    name: 'Fire',
    symbol: Icons.fireImg
};

export const fountain: Environment =
{
    name: 'Fountain',
    symbol: Icons.fountainImg
};

export const teleport: Environment =
{
    name: 'Teleport',
    symbol: Icons.tpImg
};

export const allTiles:  Environment[] =
[
    basicWalls,
    torchedWall
];

export const allObjects:  Environment[] =
[
    box,
    fire,
    fountain,
    teleport
];