import * as Icons from '../../Icons/index';
import * as Material from './materials'
import { Environment, Node } from '../types/global';

export const basicWalls: Environment =
{
    type: 'Wall',
    name: 'Wall',
    symbol: Icons.wallImg
};

export const cavesF1: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor1
}

export const cavesF2: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor2
}

export const cavesF3: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor3
}

export const cavesF4: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor4
}

export const cavesF5: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor5
}

export const cavesF6: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor6
}

export const cavesF7: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor7
}

export const cavesF8: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor8
}

export const cavesF9: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor9
}

export const cavesF10: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor10
}

export const dungeonF1: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor1
}

export const dungeonF2: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor2
}

export const dungeonF3: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor3
}

export const dungeonF4: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor4
}

export const dungeonF5: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor5
}

export const dungeonF6: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor6
}

export const dungeonF7: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor7
}

export const dungeonF8: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor8
}

export const dungeonF9: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor9
}

export const dungeonF10: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor10
}

export const dungeonF11: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor11
}

export const dungeonF12: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor12
}

export const dungeonF13: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor13
}

export const dungeonF14: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor14
}

export const dungeonF15: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor15
}

export const dungeonF16: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor16
}

export const torchedWall: Environment =
{
    type: 'Wall',
    name: 'Torched Wall',
    symbol: Icons.torchdWallImg
};

export const dungeonTp: Environment =
{
    type: 'Teleporter',
    name: 'dungeonTp',
    symbol: Icons.dungeonTp,
}

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

export const rockyWalls: Environment[] = [ rockyWall1, rockyWall2, rockyWall3 ];

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
    type: 'Teleporter',
    name: 'Teleport',
    coords: { x: 0, y: 0 },
    symbol: Icons.tpImg
}

export const mapTeleport: Environment =
{
    type: 'Teleporter',
    name: 'Map teleport',
    symbol: Icons.mapTpImg,
}

export const sign: Environment = {
    type: 'Object',
    name: 'Help sign',
    content: '',
    symbol: Icons.sign
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
    toughness: 1,
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
    toughness: 1,
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
    toughness: 1,
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
    toughness: 1,
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
    toughness: 1,
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
    toughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 65, quantity: 2 } ]
}

export const allTiles:  Environment[] =
[
    basicWalls, torchedWall,
    cavesF1,
    dungeonF1, dungeonF2, dungeonF3, dungeonF4, dungeonF5,
    rockyWall1, rockyWall2, rockyWall3
];

export const dFloorTiles: Environment[] = [
    dungeonF1, dungeonF2, dungeonF3, dungeonF4, dungeonF5, dungeonF6, dungeonF7, dungeonF8,
    dungeonF9, dungeonF10, dungeonF11, dungeonF12, dungeonF13, dungeonF14, dungeonF15, dungeonF16
]

export const cFloorTiles: Environment[] = [
    cavesF1, cavesF2, cavesF3, cavesF4, cavesF5,
    cavesF6, cavesF7, cavesF8, cavesF9, cavesF10
]

export const allObjects:  Environment[] =
[
    box,
    fire,
    fountain,
    teleport,
    sign
];

export const allTeleporters: Environment[] =
[
    dungeonTp,
    mapTeleport
];

export const copperNodes: Node[] = [ copperNode1, copperNode2, copperNode3 ];

export const silverNodes: Node[] = [ silverNode1, silverNode2, silverNode3 ];

export const allNodes: Node[] =
[
    copperNode1, copperNode2, copperNode3,
    silverNode1, silverNode2, silverNode3
];