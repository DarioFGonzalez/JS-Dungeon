import * as Icons from '../../Icons/index';
import { Environment } from '../types/global';

export const basicWalls: Environment =
{
    type: 'Tile',
    name: 'Wall',
    symbol: Icons.wallImg
};

export const torchedWall: Environment =
{
    type: 'Tile',
    name: 'Torched Wall',
    symbol: Icons.torchdWallImg
};

export const box: Environment =
{
    type: 'Object',
    name: 'Box',
    symbol: Icons.boxImg
};

export const fire: Environment =
{
    type: 'Object',
    name: 'Fire',
    symbol: Icons.fireImg
};

export const fountain: Environment =
{
    type: 'Object',
    name: 'Fountain',
    symbol: Icons.fountainImg
};

export const teleport: Environment =
{
    type: 'Object',
    name: 'Teleport',
    symbol: Icons.tpImg
};

export const bag: Environment =
{
    type: 'Object',
    name: 'Bag',
    symbol: Icons.bagImg,
    content: []
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