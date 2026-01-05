import * as Icons from '../../Icons/index';
import * as Material from './materials'
import { Environment, Node } from '../types/global';

export const basicWalls: Environment =
{
    type: 'Wall',
    name: 'Wall',
    symbol: Icons.wallImg
};

export const torchedWall: Environment =
{
    type: 'Wall',
    name: 'Torched Wall',
    symbol: Icons.torchdWallImg
};

export const rockyWall1: Environment =
{
    type: 'Wall',
    name: 'Rocky Wall 1',
    symbol: Icons.rockyWall1
};

export const rockyWall2: Environment =
{
    type: 'Wall',
    name: 'Rocky Wall 2',
    symbol: Icons.rockyWall2
};

export const rockyWall3: Environment =
{
    type: 'Wall',
    name: 'Rocky Wall 3',
    symbol: Icons.rockyWall3
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
    id: '',
    type: 'Object',
    name: 'Bag',
    symbol: Icons.bagImg,
    content: []
};

export const copperNode1: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    name: 'Copper Node 1',
    symbol: Icons.copperVein1,
    thoughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 90, quantity: 1 } ]
}

export const copperNode2: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    name: 'Copper Node 2',
    symbol: Icons.copperVein2,
    thoughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 85, quantity: 1 } ]
}

export const copperNode3: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    name: 'Copper Node 3',
    symbol: Icons.copperVein3,
    thoughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 65, quantity: 2 } ]
}

export const silverNode1: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    name: 'Silver Node 1',
    symbol: Icons.silverVein1,
    thoughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 90, quantity: 1 } ]
}

export const silverNode2: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    name: 'Silver Node 2',
    symbol: Icons.silverVein2,
    thoughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 85, quantity: 1 } ]
}

export const silverNode3: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    name: 'Silver Node 3',
    symbol: Icons.silverVein3,
    thoughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 65, quantity: 2 } ]
}

export const allTiles:  Environment[] =
[
    basicWalls, torchedWall,
    rockyWall1, rockyWall2, rockyWall3
];

export const allObjects:  Environment[] =
[
    box,
    fire,
    fountain,
    teleport
];

export const copperNodes: Node[] = [ copperNode1, copperNode2, copperNode3 ];

export const silverNodes: Node[] = [ silverNode1, silverNode2, silverNode3 ];

export const allNodes: Node[] = [ copperNode1, copperNode2, copperNode3 ];