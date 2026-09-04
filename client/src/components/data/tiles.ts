import * as Icons from '../../Icons/index';
import * as Material from './materials'
import { Environment, Node } from '../types/global';

export const voidTile: Environment = {
    type: 'Backgound',
    name: 'Void',
    symbol: Icons.voidTile
};

export const basicWalls: Environment =
{
    type: 'Wall',
    name: 'Wall',
    symbol: Icons.wallImg
};

const cavesF1: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor1
};
const cavesF2: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor2
};
const cavesF3: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor3
};
const cavesF4: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor4
};
const cavesF5: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor5
};
const cavesF6: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor6
};
const cavesF7: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor7
};
const cavesF8: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor8
};
const cavesF9: Environment = {
    type: 'Background',
    name: 'Caves floor',
    symbol: Icons.cFloor9
};

export const cFloorTiles: Environment[] = [
    cavesF1, cavesF2, cavesF3, cavesF4, cavesF5,
    cavesF6, cavesF7, cavesF8, cavesF9
]

const dungeonF1: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor1
};
const dungeonF2: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor2
};
const dungeonF3: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor3
};
const dungeonF4: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor4
};
const dungeonF5: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor5
};
const dungeonF6: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor6
};
const dungeonF7: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor7
};
const dungeonF8: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor8
};
const dungeonF9: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor9
};
const dungeonF10: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor10
};
const dungeonF11: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor11
};
const dungeonF12: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor12
}
const dungeonF13: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor13
};
const dungeonF14: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor14
};
const dungeonF15: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor15
};
const dungeonF16: Environment = {
    type: 'Background',
    name: 'Dungeon floor',
    symbol: Icons.dFloor16
};

export const dFloorTiles: Environment[] = [
    dungeonF1, dungeonF2, dungeonF3, dungeonF4, dungeonF5, dungeonF6, dungeonF7, dungeonF8,
    dungeonF9, dungeonF10, dungeonF11, dungeonF12, dungeonF13, dungeonF14, dungeonF15, dungeonF16
]

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
};

const rockyWall1: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 1',
    symbol: Icons.rockyWall1
};
const rockyWall2: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 2',
    symbol: Icons.rockyWall2
};
const rockyWall3: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 3',
    symbol: Icons.rockyWall3
};
const rockyWall4: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 4',
    symbol: Icons.rockyWall4
};
const rockyWall5: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 5',
    symbol: Icons.rockyWall5
};
const rockyWall6: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 6',
    symbol: Icons.rockyWall6
};
const rockyWall7: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 7',
    symbol: Icons.rockyWall7
};
const rockyWall8: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 8',
    symbol: Icons.rockyWall8
};
const rockyWall9: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 9',
    symbol: Icons.rockyWall9
};
const rockyWall10: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 10',
    symbol: Icons.rockyWall10
};
const rockyWall11: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 11',
    symbol: Icons.rockyWall11
};
const rockyWall12: Environment =
{
    type: 'Wall',
    style: 'Caves',
    name: 'Rocky Wall 12',
    symbol: Icons.rockyWall12
};

export const rockyWalls: Environment[] = [
    rockyWall1, rockyWall2, rockyWall3, rockyWall4, rockyWall5, rockyWall6,
    rockyWall7, rockyWall8, rockyWall9, rockyWall10, rockyWall11, rockyWall12
];

const dungeonWall1: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 1',
    symbol: Icons.dungeonWall1
};
const dungeonWall2: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 2',
    symbol: Icons.dungeonWall2
};
const dungeonWall3: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 3',
    symbol: Icons.dungeonWall3
};
const dungeonWall4: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 4',
    symbol: Icons.dungeonWall4
};
const dungeonWall5: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 5',
    symbol: Icons.dungeonWall5
};
const dungeonWall6: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 6',
    symbol: Icons.dungeonWall6
};
const dungeonWall7: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 7',
    symbol: Icons.dungeonWall7
};
const dungeonWall8: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 8',
    symbol: Icons.dungeonWall8
};
const dungeonWall9: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 9',
    symbol: Icons.dungeonWall9
};
const dungeonWall10: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 10',
    symbol: Icons.dungeonWall10
};
const dungeonWall11: Environment = {
    type: 'Wall',
    style: 'Dungeon',
    name: 'Dungeon Wall 11',
    symbol: Icons.dungeonWall11
};
const dungeonWall12: Environment = {
    type: 'Wall',
    name: 'Dungeon Wall 2',
    symbol: Icons.dungeonWall12
};

export const dungeonWalls = [
    dungeonWall1, dungeonWall2, dungeonWall3, dungeonWall4, dungeonWall5, dungeonWall6,
    dungeonWall7, dungeonWall8, dungeonWall9, dungeonWall10, dungeonWall11, dungeonWall12
]

const dungeonTorch1: Environment = {
    type: 'Wall',
    name: 'Dungeon Torch 1',
    symbol: Icons.dungeonTorch1
};
const dungeonTorch2: Environment = {
    type: 'Wall',
    name: 'Dungeon Torch 2',
    symbol: Icons.dungeonTorch2
};
const dungeonTorch3: Environment = {
    type: 'Wall',
    name: 'Dungeon Torch 3',
    symbol: Icons.dungeonTorch3
};
const dungeonTorch4: Environment = {
    type: 'Wall',
    name: 'Dungeon Torch 4',
    symbol: Icons.dungeonTorch4
};

export const dungeonTorches = [
    dungeonTorch1, dungeonTorch2, dungeonTorch3, dungeonTorch4
]

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
};

// export const mapTeleport: Environment =
// {
//     type: 'Teleporter',
//     name: 'Map teleport',
//     symbol: Icons.mapTpImg,
// };

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

const caveCopper1: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Rocky',
    name: 'Copper Node 1',
    symbol: Icons.caveCopper1,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 90, quantity: 1 } ]
};
const caveCopper2: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Rocky',
    name: 'Copper Node 2',
    symbol: Icons.caveCopper2,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 90, quantity: 1 } ]
};
const caveCopper3: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Rocky',
    name: 'Copper Node 3',
    symbol: Icons.caveCopper3,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 65, quantity: 2 } ]
};
const caveCopper4: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Rocky',
    name: 'Copper Node 4',
    symbol: Icons.caveCopper4,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 90, quantity: 1 } ]
};
const caveCopper5: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Rocky',
    name: 'Copper Node 5',
    symbol: Icons.caveCopper5,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 50, quantity: 3 } ]
};

export const caveCopper: Node[] = [ caveCopper1, caveCopper2, caveCopper3, caveCopper4, caveCopper5 ];

const dungeonCopper1: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Dungeon',
    name: 'Dungeon Copper Node 1',
    symbol: Icons.dungeonCopper1,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 90, quantity: 1 } ]
};
const dungeonCopper2: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Copper',
    biome: 'Dungeon',
    name: 'Dungeon Copper Node 2',
    symbol: Icons.dungeonCopper2,
    toughness: 1,
    maxHp: 2,
    hp: 2,
    drops: [ { item: Material.CopperOre, chance: 90, quantity: 1 } ]
};

export const dungeonCopper: Node[] = [ dungeonCopper1, dungeonCopper2 ];

const caveSilver1: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    biome: 'Rocky',
    name: 'Silver Node 1',
    symbol: Icons.caveSilver1,
    toughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 90, quantity: 1 } ]
};
const caveSilver2: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    biome: 'Rocky',
    name: 'Silver Node 2',
    symbol: Icons.caveSilver2,
    toughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 85, quantity: 1 } ]
};
const caveSilver3: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    biome: 'Rocky',
    name: 'Silver Node 3',
    symbol: Icons.caveSilver3,
    toughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 65, quantity: 2 } ]
};
const caveSilver4: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    biome: 'Rocky',
    name: 'Silver Node 4',
    symbol: Icons.caveSilver4,
    toughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 90, quantity: 1 } ]
};
const caveSilver5: Node =
{
    id: '',
    type: 'Node',
    mineral: 'Silver',
    biome: 'Rocky',
    name: 'Silver Node 5',
    symbol: Icons.caveSilver5,
    toughness: 1,
    maxHp: 3,
    hp: 3,
    drops: [ { item: Material.SilverOre, chance: 85, quantity: 1 } ]
};

export const caveSilver: Node[] = [ caveSilver1, caveSilver2, caveSilver3, caveSilver4, caveSilver5 ];

export const allTiles:  Environment[] =
[
    voidTile,
    basicWalls, torchedWall,
    cavesF1,
    dungeonF1, dungeonF2, dungeonF3, dungeonF4, dungeonF5,
    rockyWall1, rockyWall2, rockyWall3
];

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
    dungeonTp
];

export const allNodes: Node[] =
[
    caveSilver1, caveSilver2, caveSilver3, caveSilver4, caveSilver5,
    caveCopper1, caveCopper2, caveCopper3, caveCopper4, caveCopper5,
];