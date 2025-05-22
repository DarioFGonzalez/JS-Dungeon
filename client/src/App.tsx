import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

import healing from './Icons/heal.png';
import clawHit from './Icons/claws.PNG';
import redClawHit from './Icons/clawsRed.png';

import goblinImg from './Icons/s_Goblin.PNG';
import hGoblinImg from './Icons/dns-Goblin.PNG';

import potionImg from './Icons/potion.png';
import bandagesImg from './Icons/yPotion.PNG';
import aloeImg from './Icons/aloe.png';

import tpImg from './Icons/portal.png';
import fireImg from './Icons/fuego.PNG';
import fountainImg from './Icons/fountain.png';
import trapImg from './Icons/trap.PNG';
import pTrapImg from './Icons/pTrap.png';
import wallImg from './Icons/wall.png';
import boxImg from './Icons/box.png';

import sword1Img from './Icons/sword.png';
import dagger1Img from './Icons/dagger.png';
import necklaceImg from './Icons/necklace.PNG';

import heroFront from './Icons/heroFront.png';
import heroBack from './Icons/heroBack.png';
import heroRight from './Icons/heroRight.png';
import heroLeft from './Icons/heroLeft.png';

const icons =
[
    healing, clawHit, redClawHit,
    goblinImg, hGoblinImg,
    potionImg, bandagesImg, aloeImg,
    tpImg, fireImg, fountainImg,
    trapImg, pTrapImg,
    wallImg, boxImg,
    dagger1Img, sword1Img, necklaceImg,
    heroBack, heroFront, heroLeft, heroRight
];

const ship_up = heroBack;
const ship_down = heroFront;
const ship_left = heroLeft;
const ship_right = heroRight;
const anyPlayer = [ship_down, ship_left, ship_right, ship_up];
const box = boxImg;
const wall = wallImg;
const teleport = tpImg;
const totem = 'u';
const fountain = fountainImg;
const cursedTotem = '🧿';

const mapSize = 18;
const maxHp = 15;

const fire = fireImg;

type locationData = { x: number, y: number, symbol: string };
type Coords = [ number, number ];
type ArrayOfCoords = Coords[];
type Residual = { symbol: string, coords: number[] };

interface Item
{
    type: 'Item',
    name: string,
    symbol: string,
    id: number,
    desc: string,
    cd: number
};

const Aloe: Item =
{
    type: 'Item',
    name: 'Aloe leaf',
    symbol: aloeImg,
    id: 3,
    desc:  '',
    cd: 4000
}

const Potion: Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: potionImg,
    id: 2,
    desc: '+3 HP',
    cd: 3000
} 

const Bandages: Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: bandagesImg,
    id: 1,
    desc: 'Stops bleeding.',
    cd: 5000
}

interface Gear
{
    type: string,
    name: string,
    symbol: string,
    id: number,
    slot: string,
    desc: string,
    attackStats?: attackStats,
    defenseStats?: deffenseStats,
    buffStats?: '',
    durability: number,
    Equippeable: boolean
};

type attackStats = { dmg: number, DoT?: number, times?: number, aliment?: string, cd: number };
type deffenseStats = { def?: number, immunity?: string, hp?: number };

const Fists: Gear =
{
    type: 'Gear',
    name: 'Fists',
    symbol: '🤜',
    id: 0,
    slot: 'weapon',
    desc: '+1 DMG',
    attackStats: { dmg: 0, cd: 2500 },
    durability: 999,
    Equippeable: true
}

const emptyHanded = { id: '0', item: Fists, durability: 999, onCd: false, equiped: true, selected: true };

const Sword1: Gear =
{
    type: 'Gear',
    name: 'Wooden Sword',
    symbol: sword1Img,
    id: 1,
    slot: 'weapon',
    desc: '+2 DMG',
    attackStats: { dmg: 2, DoT: 0, times: 0, cd: 1000 },
    durability: 10,
    Equippeable: true
}

const Dagger1: Gear =
{
    type: 'Gear',
    name: 'Slicing Knife',
    symbol: dagger1Img,
    id: 2,
    slot: 'weapon',
    desc: '+1 DMG (5 🩸)',
    attackStats: { dmg: 1, DoT: 1, times: 5, aliment: 'bleed', cd: 1000 },
    durability: 20,
    Equippeable: true
}

const Necklace1: Gear =
{
    type: 'Accessory',
    name: 'Protective pendant',
    symbol: necklaceImg,
    id: 3,
    slot: 'charm',
    desc: '+5 Shield',
    durability: 5,
    Equippeable: true
}

const Necklace2: Gear =
{
    type: 'Accessory',
    name: 'Armor pendant',
    symbol: necklaceImg,
    id: 4,
    slot: 'charm',
    desc: '+1 DEF',
    defenseStats: { def: 1 },
    durability: 50,
    Equippeable: true
}

type InventoryItem = { item: Item, quantity: number, onCd: boolean };
type InventoryGear = { id: string, item: Gear, durability: number, onCd: boolean, equiped?: boolean, selected: boolean };
type Inventory = InventoryItem[];
type AlimentFlags = { Poisoned: boolean, Bleeding: boolean, Burning: boolean };
type BuffFlags = { HoT: boolean };
type AlimentInstances = { PoisonInstances: alimentIds[], BleedInstances: alimentIds[], BurnInstances: alimentIds[] }; 
type BuffInstances = { HotInstances: alimentIds[] };

interface WithAliments 
{
    Aliments: Aliments;
}

type Aliments = 
{
    Flags: AlimentFlags,
    Instances: AlimentInstances
};
type Buffs =
{
    Flags: BuffFlags,
    Instances: BuffInstances
}
type alimentIds = { dmgId: ReturnType<typeof setInterval>, timerId: ReturnType<typeof setTimeout> };

type HotBarItems = { Equippeable: InventoryGear[] }

interface Player
{
    HP: number,
    MaxHP: number,
    Data: locationData,
    Inventory: Inventory,
    HotBar: HotBarItems,
    Aliments: Aliments,
    Buffs: Buffs
}

const emptyPlayer: Player =
{
    HP: maxHp,
    MaxHP: maxHp,
    Data: { x: 0, y: 0, symbol: ship_down },
    Inventory: [],
    HotBar: { Equippeable: [ ] },
    Aliments:
    {
        Flags: { Poisoned: false, Bleeding: false, Burning: false },
        Instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    Buffs:
    {
        Flags: { HoT: false },
        Instances: { HotInstances: [] } 
    }
}

type attackInfo = { Instant: number, DoT: number, Times: number, Aliment: string };
type deffenseInfo = { Armor: number, Toughness: number, Immunity?: string };
type dropInfo = { item: Item, chance: number };

interface Trap
{
    ID: string,
    Name: string,
    Active: boolean,
    Data: locationData,
    Attack: attackInfo,
    toDisarm?: Item[]
}

const trap: Trap =
{
    ID: '0',
    Name: 'Trampa simple',
    Active: true,
    Data: { x: 0, y: 0, symbol: trapImg },
    Attack: { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' }
}

const poisonTrap: Trap =
{
    ID: '0',
    Name: 'Trampa venenosa',
    Active: true,
    Data: { x: 0, y: 0, symbol: pTrapImg },
    Attack: { Instant: 1, DoT: 2, Times: 3, Aliment: 'poison' },
}

interface Enemy
{
    ID: string,
    Name: string,
    HP: number,
    MaxHP: number,
    Data: locationData,
    Aliments: Aliments,
    Attack: attackInfo,
    Defense: deffenseInfo,
    Pattern: string,
    PatrolId?: ReturnType<typeof setTimeout>,
    Drops: dropInfo[]
}

const enemy: Enemy =
{
    ID: '0',
    Name: 'Goblin',
    HP: 5,
    MaxHP: 5,
    Data: { x: 0, y: 0, symbol: goblinImg },
    Aliments:
    {
        Flags: { Poisoned: false, Bleeding: false, Burning: false },
        Instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    Attack: { Instant: 2, DoT: 0, Times: 0, Aliment: 'none' },
    Defense: { Armor: 0, Toughness: 1 },
    Pattern: 'none',
    Drops: []
}

const heavyEnemy: Enemy =
{
    ID: '0',
    Name: 'Heavy Goblin',
    HP: 20,
    MaxHP: 20,
    Data: { x: 0, y: 0, symbol: hGoblinImg },
    Aliments:
    {
        Flags: { Poisoned: false, Bleeding: false, Burning: false },
        Instances: { PoisonInstances: [], BleedInstances: [], BurnInstances: [] }
    },
    Attack: { Instant: 3, DoT: 2, Times: 3, Aliment: 'bleed' },
    Defense: { Armor: 1, Toughness: 3, Immunity: 'bleed' },
    Pattern: 'none',
    Drops: [ { item: Potion, chance: 75 } ]
}

const emptyGrid = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> '') );

type eventLog = { message: string, color: string };
const emptyDelayedLog = { status: false, message: '', color: 'white' };

const App = () =>
{
    const gridRef = useRef<HTMLDivElement>(null);
    const [ lan, setLan ] = useState<'es'|'en'>( 'es' );
    const [ game, setGame ] = useState<boolean>(false);
    const [ allowed, setAllowed ] = useState<boolean>(true);
    const [ stun, setStun ] = useState<boolean>(false);

    const [ mapa, setMapa ] = useState<string[][]>( emptyGrid );
    const [ visuals, setVisuals ] = useState<string[][]>( emptyGrid );
    
    const [ tps, setTps ] = useState<ArrayOfCoords>([]);
    const [ residual, setResidual ] = useState<Residual[]>( [] );

    const [ showInventory, setShowInventory ] = useState<boolean>( false );
    const [ showGear, setShowGear ] = useState<boolean>( false );
    const [ events, setEvents ] = useState<eventLog[]>( [] );
    const [ delayedLog, setDelayedLog ] = useState<eventLog[]>( [] );

    const [ player, setPlayer ] = useState<Player>( emptyPlayer );
    const [ enemies, setEnemies ] = useState<Enemy[]>( [] );
    const [ traps, setTraps ] = useState<Trap[]>( [] );

    useEffect( () =>
    {
        if(delayedLog.length===0) return;

        const [ actual, ...rest ] = delayedLog;
        handleEventLogs( actual.message, actual.color );
        const timeId = setTimeout( () => { setDelayedLog( rest ); }, 50 );

        return () => clearTimeout( timeId );
    }, [ delayedLog ] );

    const findPlayer = (): void =>
    {
        let here = [ 0, 0 ];
        let symbol = '';
        mapa.forEach( (fila, y) => fila.map( (celda, z) =>
        {
            if(celda==ship_down || celda==ship_up || celda==ship_left || celda==ship_right ) { here=[ y, z ]; symbol=celda; }
        } ));
        setPlayer( prev => ({ ...prev, Data: { x: here[0], y: here[1], symbol } }) );
    };

    const checkCollision = ( x: number, y: number ) =>
    {
        if( x<0 || x >= mapa.length || y<0 || y >= mapa[0].length ) return 'oob';
        
        const tile = mapa[x][y];
        switch(tile)
        {
            case '': return 'empty';
            case 'x': return wall;
            case 'u': return totem;
            case '🧿': return cursedTotem;
            case '~': return 'water';
            case fountainImg: return fountain;
            case goblinImg: return enemy;
            case hGoblinImg: return heavyEnemy;
            case fireImg: return fire;
            case 'D': return 'door';
            case boxImg: return box;
            case tpImg: return teleport;
            case trapImg: return trap;
            case pTrapImg: return poisonTrap;
            case potionImg: return Potion;
            case bandagesImg: return Bandages;
            case aloeImg: return Aloe;
            case sword1Img: return Sword1;
            case dagger1Img: return Dagger1;
            case necklaceImg: return Necklace1;
            case necklaceImg: return 
            default: return 'unknown';
        };
    };

    const inconsecuente = ( symbol: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        const {x, y} = player.Data;
        auxiliar[x][y] = symbol;
        setPlayer( prev => ({ ...prev, Data: { x, y, symbol } }) );
        setMapa(auxiliar);
    };

    const mobInconsecuente = ( x: number, y: number, symbol: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[x][y] = symbol;
        setEnemies( list => list.map( mob => mob.Data.x===x && mob.Data.y===y
            ? {...mob, Data: { ...mob.Data, symbol: symbol } }
            : mob ) );
        setMapa(auxiliar);
    };

    const moveHere = ( x: number, y: number, symbol: string, complete: boolean ): string[][] =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        const  { x: pX, y: pY } = player.Data;
        const thisResidual = residual.find( ({coords}) => coords[0]===pX && coords[1]===pY );
        if( thisResidual )
        {
            auxiliar[pX][pY] = thisResidual.symbol;
            setResidual( prev => prev.filter( ({coords}) => coords[0]!==pX || coords[1]!==pY ) );
        }
        else
        {
            auxiliar[pX][pY] = '';
        }
        auxiliar[x][y] = symbol;
        if(complete==true)
        {
            setPlayer( prev => ({ ...prev, Data: { x, y, symbol } }) );
            setMapa(auxiliar);
        }
        return auxiliar
    };

    const handleTp = ( x: number, y: number, symbol: string, other: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        
        const { x: pX, y: pY } = player.Data;
        const newX = pX+x;
        const newY = pY+y;
        const [ tp1X, tp1Y ] = tps[0];
        const [ tp2X, tp2Y ] = tps[1];

        if(auxiliar[tp1X][tp1Y] == tpImg && auxiliar[tp2X][tp2Y] == tpImg )
        {
            switch(other)
            {
                case box:
                {
                    auxiliar[pX][pY] = '';
                    auxiliar[newX][newY] = symbol;
                    setPlayer( prev => ({ ...prev, Data: { x: newX, y: newY, symbol } }) );
                    if( tp1X==newX+x && tp1Y==newY+y )
                    {
                        setResidual( prev => [ ...prev, { symbol: tpImg, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[tp2X][tp2Y] = box;
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { symbol: tpImg, coords: [ tp1X, tp1Y ] } ] );
                        auxiliar[tp1X][tp1Y] = box;
                    }
                    setMapa(auxiliar);
                    break;
                }
                case '':
                {
                    if( tp1X==newX && tp1Y==newY )
                    {
                        setResidual( prev => [ ...prev, { symbol: tpImg, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[pX][pY] = '';
                        auxiliar[tp2X][tp2Y] = symbol;
                        setPlayer( prev => ({ ...prev, Data: { x: tp2X, y: tp2Y, symbol } }) );
                        setMapa(auxiliar);
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { symbol: tpImg, coords: [ tp1X, tp1Y ] } ] );
                        auxiliar[pX][pY] = '';
                        auxiliar[tp1X][tp1Y] = symbol;
                        setPlayer( prev => ({ ...prev, Data: { x: tp1X, y: tp1Y, symbol } }) );
                        setMapa(auxiliar);
                    }
                    break;
                }
            }
        }
        else
        {
            inconsecuente(symbol);
        }
    };

    const pushBox = ( x: number, y: number, symbol: string ): void =>
    {
        const newX = player.Data.x+x;
        const newY = player.Data.y+y;
        const nextX = newX + x;
        const nextY = newY + y;

        const tileAfterBox = checkCollision( nextX, nextY );

        switch(tileAfterBox)
        {
            case 'empty':
            {
                const auxiliar = moveHere( newX, newY, symbol, false );
                auxiliar[nextX][nextY] = box;
                setPlayer( prev => ( { ...prev, Data: { x: newX, y: newY, symbol } } ) );
                setMapa( auxiliar );
                break;
            }
            case teleport:
            {
                handleTp(x, y, symbol, box);
                break;
            }
            default:
                inconsecuente( symbol );
                break;
        }
    };

    const manageBuffInstance =( instance: keyof BuffInstances, thisInstance: alimentIds | undefined, prev: Player, action: 'add' | 'remove' | 'clean' | 'restart' ) : Player =>
    {
        let flag = '';
        switch(instance)
        {
            case 'HotInstances':
                flag = 'HoT';
                break;
            default:
                break;
        }

        switch(action)
        {
            case 'add':
                if(!thisInstance) return prev;
                return { ...prev, Buffs:
                        { ...prev.Buffs, Flags: { ...prev.Buffs.Flags, [flag]: true }, Instances:
                            { ...prev.Buffs.Instances, [instance]: [ ...prev.Buffs.Instances[instance], thisInstance ] } } };
            case 'remove':
                const updatedInstance = prev.Buffs.Instances[instance].filter( x =>
                    x.dmgId!==thisInstance?.dmgId && x.timerId!==thisInstance?.timerId );
                const isInstanceEmpty = updatedInstance.length == 0;
                return { ...prev, Buffs:
                    { ...prev.Buffs, Flags: { ...prev.Buffs.Flags, [flag]: !isInstanceEmpty },
                    Instances: { ...prev.Buffs.Instances, [instance]: updatedInstance } } };
            case 'clean':
                finishBuff(instance, prev);
                return { ...prev, Buffs:
                    { ...prev.Buffs, Flags: { ...prev.Buffs.Flags, [flag]: false },
                    Instances: { ...prev.Buffs.Instances, [instance]: [] } } };
            case 'restart':
                return { ...prev, Buffs:
                    { ...prev.Buffs, Flags: { HoT: false }, Instances:{ HotInstances: [] } } };
            default:
                return prev;
        }
    };

    const damageWeapon = ( enemyToughness: number, weapon: InventoryGear ) =>
    {
        let flag = true;

        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const equippedWeapon = aux.HotBar.Equippeable.find( w => w.id === weapon.id );
            if(!equippedWeapon) return aux;

            if( equippedWeapon.durability - enemyToughness <= 0 )
            {
                const newEquippeables = aux.HotBar.Equippeable.filter( wpn => wpn.id !== equippedWeapon.id );

                if(flag)
                {
                    queueLog( `[🗡] ¡${equippedWeapon.item.name} se rompió! 💥`, 'orange');
                    flag = false;
                }

                return { ...aux, HotBar: { ...playerInfo.HotBar, Equippeable: newEquippeables }  };
            }

            let cdTimer = setTimeout( ()=> { setPlayer( all =>
            {
                const stillThere = all.HotBar.Equippeable.find( w => w.id == weapon.id );
                if(stillThere)
                {
                    return { ...all, HotBar: { ...all.HotBar, Equippeable: all.HotBar.Equippeable.map(
                        item => item.id == stillThere.id ? { ...stillThere, onCd: false } : item 
                    ) } };
                }
                return all;
            } ) }, equippedWeapon.item.attackStats?.cd )

            return { ...aux, HotBar: { ...aux.HotBar, Equippeable: aux.HotBar.Equippeable.map( w => w.equiped ? { ...w, durability: w.durability - enemyToughness, onCd: true } : w )}}    
        } );
    }

    const strikeEnemy = ( x: number, y: number ): void =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const thisWeapon = aux.HotBar.Equippeable.find( item => item.item.slot==='weapon' && item.equiped ) || emptyHanded;

            !thisWeapon.onCd && setEnemies( mobs =>
            {
                const thisEnemy = mobs.find( mob => mob.Data.x===x && mob.Data.y===y );
                if(!thisEnemy) return mobs;

                const attk = thisWeapon.item.attackStats;
                if(!attk) return mobs;

                const damage = attk.dmg- thisEnemy.Defense.Armor;

                if(flag && !thisWeapon.onCd)
                {
                    damageEnemy( thisEnemy.ID, damage>=0?damage:0, attk?.DoT, attk?.times, attk?.aliment );
                    thisWeapon!=emptyHanded && damageWeapon( thisEnemy.Defense.Toughness, thisWeapon );
                    flag = false;
                }

                return mobs;
            } );

            return aux;
        } );
    }

    const enemyDeath = ( x: number, y: number, enemy: Enemy, allEnemies: Enemy[] ): Enemy[] =>
    {
        setMapa( prev =>
        {
            let mapAux = prev.map( x => [...x] );
            if(enemy.Drops.length>0)
            {
                if( rollDrop(enemy.Drops[0].chance) )
                {
                    mapAux[x][y] = enemy.Drops[0].item.symbol;
                    return mapAux;
                }
            }
            mapAux[x][y]='';
            return mapAux;
        } );
        
        lan==='es'
        ? queueLog( `${enemy.Name} murió.`, 'crimson' )
        : queueLog( `${enemy.Name} died.`, 'crimson' );

        return allEnemies.filter( mob => mob.Data.x!==x && mob.Data.y!==y );
    }

    const damageEnemy = ( ID: string, dmg: number, dot: number = 0, times: number = 0, aliment: string = '' ): void =>
    {
        setEnemies( allEnemies =>
        {
            const aux = [ ...allEnemies ];
            let tag = { aliment: '', color: 'khaki'};
            const thisEnemy = aux.find( mob => mob.ID === ID ) || enemy;
            
            if(thisEnemy.HP-dmg<=0)
            {
                return enemyDeath( thisEnemy.Data.x, thisEnemy.Data.y, thisEnemy, aux );
            }
            else
            {
                if(dot!=0)
                {
                    switch(aliment)
                    {
                        case 'poison':
                        {
                            tag.aliment = '[Envenenado]';
                            tag.color = 'lime';
                            setEnemies( allEnemies =>
                            {
                                const aux = [ ...allEnemies ];
                                return aux.map( mob => mob.ID===thisEnemy.ID
                                    ? manageDotInstance("PoisonInstances", {dmgId, timerId}, thisEnemy, 'add')
                                    : mob );
                            });
                            break;
                        }
                        case 'bleed':
                        {
                            tag.aliment = '[Sangrando]';
                            tag.color = 'red';
                            setEnemies( allEnemies =>
                            {
                                const aux = [ ...allEnemies ];
                                return aux.map( mob => mob.ID===thisEnemy.ID
                                    ? manageDotInstance("BleedInstances", {dmgId, timerId}, thisEnemy, 'add')
                                    : mob );
                            });
                            break;
                        }
                        case 'burn':
                            {
                                tag.aliment = '[Quemándose]';
                                tag.color = 'orange';
                                setEnemies( allEnemies =>
                                {
                                    const aux = [ ...allEnemies ];
                                    return aux.map( mob => mob.ID===thisEnemy.ID
                                        ? manageDotInstance("BurnInstances", {dmgId, timerId}, thisEnemy, 'add')
                                        : mob );
                                });
                                break;
                            }
                        default:
                            break;
                    }
        
                    let dmgId = setInterval( () =>
                    {
                        let flag = true;
                        setEnemies( prev =>
                        {
                            const aux = [ ...prev ];
                            const updatedEnemy = aux.find( x => x.ID === thisEnemy.ID );

                            if(!updatedEnemy) return prev;
                            
                            if( updatedEnemy.HP - dot <= 0 || !game)
                            {
                                cleanse('all', updatedEnemy.ID);
                                if(flag)
                                {
                                    console.log("El bicho murió por DOT: ", aliment);
                                    flag = false;
                                }
                                if(game)
                                {
                                    return enemyDeath(updatedEnemy.Data.x, updatedEnemy.Data.y, updatedEnemy, aux);
                                }
                                return aux;
                            }
                            if(flag)
                            {
                                console.log(`El bicho recibió ${dot} de daño por ${aliment}.`);
                                flag = false;
                            }
                            return aux.map( mob => mob.ID === updatedEnemy.ID ? {...mob, HP: mob.HP - dot } : mob );
                        } );
                    }, 1000);
        
                    let timerId = setTimeout( () =>
                    {
                        switch(aliment)
                        {
                            case 'poison':
                                {
                                    setEnemies( prev =>
                                    {
                                        const aux = [ ...prev ];
                                        return aux.map( x => x.ID === thisEnemy.ID
                                            ? manageDotInstance("PoisonInstances", {dmgId, timerId}, x, 'remove')
                                            : x );
                                    } );
                                    break;
                                }
                            case 'bleed':
                                {
                                    setEnemies( prev =>
                                    {
                                        const aux = [ ...prev ];
                                        return aux.map( x => x.ID === thisEnemy.ID
                                            ? manageDotInstance("BleedInstances", {dmgId, timerId}, x, 'remove')
                                            : x );
                                    } );
                                    break;
                                }
                            case 'burn':
                                {
                                    setEnemies( prev =>
                                    {
                                        const aux = [ ...prev ];
                                        return aux.map( x => x.ID === thisEnemy.ID
                                            ? manageDotInstance("BurnInstances", {dmgId, timerId}, x, 'remove')
                                            : x );
                                    } );
                                    break;
                                }
                            default:
                                break;
                        }
                        clearInterval( dmgId );
                    }, times*1000)
                }

                lan=='es'
                ? queueLog(`Golpeaste a ${thisEnemy.Name} por ${dmg} de daño. [${thisEnemy.HP - dmg}/${thisEnemy.MaxHP}]. ${tag.aliment}`, tag.color)
                : queueLog(`You HIT ${thisEnemy.Name} by ${dmg} damage. [${thisEnemy.HP - dmg}/${thisEnemy.MaxHP}]`, 'khaki');

                return aux.map( mob => mob.ID===thisEnemy.ID ? { ...mob, HP: mob.HP - dmg } : mob );
            }
        } );
    }

    const damageCharm = ( charm: InventoryGear, dmg: number ) =>
    {
        const residualDmg = dmg - charm.durability;
        const newCharm = { ...charm, durability: residualDmg<0?residualDmg*(-1):0 };
        return { newCharm, residualDmg: residualDmg>0?residualDmg:0 }
    }

    const hurtPlayer = ( dmg: number, dot: number, times: number, aliment: string ): void =>
    {
        let c = 0;
        setPlayer( prev =>
        {
            c++;
            let activeCharm = prev.HotBar.Equippeable.find( item => item.equiped && item.item.slot==='charm' );
            if(activeCharm)
            {
                const { newCharm, residualDmg } = damageCharm( activeCharm, dmg );
                if(prev.HP-residualDmg<=0)
                {
                    stopGame();
                    return { ...prev, HP: 0 };
                }
                let newEquippeables = prev.HotBar.Equippeable;
                if(newCharm.durability>0)
                {
                    newEquippeables = prev.HotBar.Equippeable.map( gear => gear.id===newCharm?.id ? newCharm : gear );
                }
                else
                {
                    newEquippeables =  prev.HotBar.Equippeable.filter( gear => gear.id!==newCharm?.id );
                }
                return { ...prev, HotBar: { ...prev.HotBar, Equippeable: newEquippeables }, HP: prev.HP - residualDmg };
            }
            if(prev.HP-dmg<=0)
            {
                stopGame();
                return { ...prev, HP: 0 };
            }
            return { ...prev, HP: prev.HP - dmg };
        });

        let estado = '';
        let color = '';

        if(dot!=0)
        {
            let flag=true;
            switch(aliment)
            {
                case 'poison':
                    {
                        setPlayer( prev =>
                            {
                                let aux = {...prev};
                                estado = "veneno";
                                color = 'lime';
                                if(flag)
                                {
                                    queueLog('[ENVENENADO]', 'lime');
                                    flag=false;
                                }
                                return manageDotInstance("PoisonInstances", {dmgId, timerId}, aux, 'add')
                            });
                        break;
                    }
                case 'bleed':
                    {
                        setPlayer( prev =>
                        {
                            const aux = {...prev };
                            estado = 'sangrado';
                            color = 'red';
                            if(flag)
                            {
                                queueLog('[SANGRANDO]', 'red');
                                flag=false;
                            }
                            return manageDotInstance("BleedInstances", {dmgId, timerId}, aux, 'add')
                        } );
                        break;
                    }
                case 'burn':
                    {
                        setPlayer( prev =>
                        {
                            const aux = {...prev};
                            estado = 'quemadura';
                            color = 'orange';
                            if(flag)
                            {
                                queueLog('[EN LLAMAS]', 'orange');
                                flag=false;
                            }
                            return manageDotInstance("BurnInstances", {dmgId, timerId}, aux, 'add')
                        } );
                        break;
                    }
                default:
                    break;
            }

            let dmgId = setInterval( () =>
            {
                let flag = true;
                setPlayer( prev =>
                {
                    const aux = { ...prev};
                    if(flag)
                    {
                        queueLog(`Daño por ${estado}: ${dot}`, color);
                    }
                    
                    if( aux.HP - dot <= 0 || !game)
                    {
                        if(flag)
                        {
                            stopGame();
                        }
                        flag=false;
                        return {...aux, HP: 0 };
                    }
                    flag=false;
                    return {...aux, HP: aux.HP - dot };
                } );
            }, 1000);

            let timerId = setTimeout( () =>
            {
                switch(aliment)
                {
                    case 'poison':
                        {
                            setPlayer( prev =>
                                {
                                    const aux = { ...prev };
                                    return manageDotInstance("PoisonInstances", {dmgId, timerId}, aux, 'remove')
                                } );
                            break;
                        }
                    case 'bleed':
                        {
                            setPlayer( prev =>
                                {
                                    const aux = { ...prev };
                                    return manageDotInstance("BleedInstances", {dmgId, timerId}, aux, 'remove')
                                } );
                            break;
                        }
                    case 'burn':
                        {
                            setPlayer( prev =>
                                {
                                    const aux = { ...prev };
                                    return manageDotInstance("BurnInstances", {dmgId, timerId}, aux, 'remove')
                                } );
                            break;
                        }
                    default:
                        break;
                }
                clearInterval( dmgId );
            }, times*1000)

        }
    };
    
    const touchEnemy = ( symbol: string, x: number, y: number ): void =>
    {
        const thisEnemy = enemies.find( mob => mob.Data.x===x && mob.Data.y===y ) || enemy;
        const { Attack } = thisEnemy;
        queueLog( `${thisEnemy.Name} te golpeó por ${Attack.Instant} de daño.`, 'red');
        hurtPlayer( Attack.Instant, Attack.DoT, Attack.Times, Attack.Aliment );
        inconsecuente(symbol);
    };

    const stepOnTrap = ( x: number, y: number, symbol: string ): void =>
    {
        const thisTrap = traps.find( trap => trap.Data.x===x && trap.Data.y===y ) || trap ;

        setResidual( prev => [ ...prev, { symbol: thisTrap.Data.symbol, coords: [ x, y ] } ] );
        moveHere( x, y, symbol, true );

        const {Attack} = thisTrap;
        queueLog(`${thisTrap.Name} te causó ${Attack.Instant} de daño.`, 'crimson');

        hurtPlayer( Attack.Instant, Attack.DoT, Attack.Times, Attack.Aliment );
    };

    const walkOntoFire = ( x: number, y: number, symbol: string, newX: number, newY: number ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[newX-x][newY-y] = '';
        auxiliar[newX][newY] = symbol
        setMapa(auxiliar);
        setPlayer( playerInfo =>
            {
                manageVisualAnimation( 'visual', playerInfo.Data.x, playerInfo.Data.y, '🔥', 100 );
                return playerInfo;
            });
        hurtPlayer(1, 1, 8, 'burn');
        setTimeout( ()=>
        {
            const auxiliar = mapa.map(fila => [...fila]);
            auxiliar[newX][newY] = fire;
            if(player.HP<=0)
            {
                return ;
            }
            auxiliar[newX-x][newY-y] = symbol;
            setMapa(auxiliar);
            setPlayer( prev => ( { ...prev, Data: { x: newX-x, y: newY-y, symbol } } ) );
        }, 45);
    };

    const stepOnItem = ( x: number, y: number, symbol: string, tile: Item, quantity: number ): void =>
    {
        if( player.Inventory.length >= 20 )
        {
            setResidual( prev => [ ...prev, { symbol: tile.symbol, coords: [ x, y ] } ] );
            moveHere( x, y, symbol, true );
            return ;
        }
        moveHere( x, y, symbol, true );

        addToInventory( tile, quantity );
    }

    const stepOnGear = ( x: number, y: number, symbol: string, tile: Gear ): void =>
    {
        if( player.HotBar.Equippeable.length >= 6 )
        {
            setResidual( prev => [ ...prev, { symbol: tile.symbol, coords: [ x, y ] } ] );
            moveHere( x, y, symbol, true );
            return ;
        }
        moveHere( x, y, symbol, true );

        addToEquippeable( tile );
    }

    const turnToInventoryGear = ( gear: Gear ): InventoryGear =>
    {
        return { item: gear, id: crypto.randomUUID(), durability: gear.durability, onCd: false, equiped: false, selected: false };
    }

    const addToEquippeable = ( gear: Gear ) =>
    {
        queueLog(`${gear.name} agregado a la mochila.`, 'orange');
        setPlayer( playerInfo => ( { ...playerInfo, HotBar: { ...playerInfo.HotBar,
            Equippeable: [ ...playerInfo.HotBar.Equippeable, turnToInventoryGear(gear) ] } } ) );
    }

    const addToInventory = ( item: Item, quantity: number ): void =>
    {
        const thisItem = player.Inventory.find( x => x.item.name === item.name )
        queueLog(`Recogiste ${quantity} ${item.name}.`, 'lime');
        if(!thisItem)
        {
            setPlayer( prev => ( { ...prev, Inventory: [ ...prev.Inventory, { item: item, quantity: quantity, onCd: false } ] } ) );
        }
        else
        {
            setPlayer( prev => ( { ...prev, Inventory: prev.Inventory.map( object =>
                object.item.name===item.name
                ? { ...object, quantity: object.quantity + quantity } : object ) } ) );
        }
    }

    const consumeItem = ( item: Item, quantity: number ): void =>
    {
        const thisItem = player.Inventory.find( x => x.item.name===item.name ) as InventoryItem;

        if( !thisItem || thisItem.quantity < quantity || thisItem.onCd ) return ;

        switch(item.name)
        {
            case 'Potion':
            {
                heal(3, 0, 0);
                setPlayer( playerInfo =>
                    {
                        manageVisualAnimation( 'visual', playerInfo.Data.x, playerInfo.Data.y, healing, 500 );
                        return playerInfo;
                    } )
                break;
            }
            case 'Bandages':
            {
                cleanse('bleed');
                break;
            }
            case 'Aloe leaf':
            {
                cleanse('burn');
                break;
            }
        }

        
        if(thisItem.quantity - quantity > 0)
        {
            setTimeout( () =>
            {
                setPlayer( prev => ( {...prev, Inventory: prev.Inventory.map( z => z.item.name === thisItem.item.name ? { ...z, onCd: false } : z ) } ) );
            }, thisItem.item.cd)
            setPlayer( prev => ( {...prev, Inventory: prev.Inventory.map( z =>
                'quantity' in z && z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - quantity, onCd: true } : z ) } ) );
        }
        else
        {
            setPlayer( prev => ( {...prev, Inventory: prev.Inventory.filter( y => y.item.name!==thisItem.item.name ) } ) );
        }
    }

    const touchFountain = ( symbol: string ) =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo};
            if(flag)
            {
                
                if(aux.Aliments.Flags.Burning)
                {
                    queueLog( 'Tocar la fuente calma tus quemaduras' ,'turquoise' );
                    cleanse('burn');
                }
    
                inconsecuente( symbol );
                flag = false;
            }
            return aux;
        } );
    }
        
    const movePlayer = ( x: number, y: number, symbol: string ): void =>
    {
        const newX = player.Data.x+x;
        const newY = player.Data.y+y;
        const tile = checkCollision(newX, newY);

        if(!stun)
        {
            switch(tile)
            {
                case 'empty':
                    {
                        moveHere( newX, newY, symbol, true );
                        break;
                    }
                case box:
                    {
                        pushBox( x, y, symbol );
                        break;
                    }
                case teleport:
                    {
                        handleTp( x, y, symbol, '' );
                        break;
                    }
                case enemy:
                case heavyEnemy:
                    {
                        setPlayer( playerInfo =>
                        {
                            manageVisualAnimation( 'visual', playerInfo.Data.x, playerInfo.Data.y, clawHit, 400 );
                            return playerInfo;
                        } );
                        touchEnemy( symbol, newX, newY );
                        break;
                    }
                case trap:
                case poisonTrap:
                    {
                        stepOnTrap( newX, newY, symbol );
                        break;
                    }
                case fire:
                    {
                        walkOntoFire( x, y, symbol, newX, newY );
                        break;
                    }
                case totem: //Cleanse('all')
                    {
                        inconsecuente( symbol );
                        cleanse('all');
                        break;
                    }
                case fountain:  //Cleanse('burn')
                    {
                        touchFountain( symbol );
                        break;
                    }
                case cursedTotem:
                    {
                        inconsecuente( symbol );
                        setPlayer( prev => manageBuffInstance( 'HotInstances', undefined, prev, 'clean' ) );
                        break;
                    }
                case Potion:
                case Bandages:
                case Aloe:
                    {
                        stepOnItem( newX, newY, symbol, tile, 1 );
                        break;
                    }
                case Sword1:
                case Dagger1:
                case Necklace1:
                    {
                        stepOnGear( newX, newY, symbol, tile );
                        break;
                    }
                case 'unknown':
                case wall:
                case 'water':
                case 'oob':
                    {
                        inconsecuente( symbol );
                        break;
                    }
            }
        }
    }

    const rollDrop = ( chance: number ) : boolean =>
    {
        const random = Math.floor( Math.random() * 100 ) + 1;
        if( random <= chance )
        {
            return true;
        }
        return false;
    }

    const handleEventLogs = ( event: string, color: string ): void =>
    {
        setEvents( eventos =>
        {
            const aux = [ ...eventos ];
            if(aux.length>=6)
            {
                aux.pop();
            }
            aux.unshift( {message: event, color: color} );
            return aux;
        } );
    }

    const queueLog = ( message: string, color: string ): void =>
    {
        setDelayedLog( list => [ ...list, { message, color } ] );
    }

    const playerVectors: Record<string, [number, number]> = //non
    {
        ship_up: [-1, 0],
        ship_down: [1, 0],
        ship_left: [0, -1],
        ship_right: [0, 1]
    }

    const directionFromVector = ( symbol: string ): [number, number] =>
    {
        switch( symbol )
        {
            case ship_up:
                return [-1, 0];
            case ship_down:
                return [1, 0];
            case ship_left:
                return [0, -1];
            case ship_right:
                return [0, 1];
            default:
                return [0, 0];
        }
        // return playerVectors[symbol] || [0, 0];
    }

    const manageVisualAnimation = ( type: string, x: number, y: number, icon: string, time: number ): void =>
    {
        setPlayer( playerInfo =>
        {
            setVisuals( visualsMap =>
            {
                const aux = [ ...visualsMap ];
                aux[x][y] = icon;
                return aux;
            } );

            setTimeout( () =>
            {
                setVisuals( prev=>
                {
                    const aux = [ ...prev ];
                    aux[x][y] = '';
                    return aux;
                } );
            }, time);

            return playerInfo;
        } );
    }

    const handleInteraction = ( ): void =>
    {
        const [dx, dy] = directionFromVector(player.Data.symbol);
        let x = player.Data.x + dx;
        let y = player.Data.y + dy;

        manageVisualAnimation( 'visual', x, y, redClawHit, 200 );
        
        const objective = checkCollision( x, y );
        switch(objective)
        {
            case enemy:
            case heavyEnemy:
                {
                    strikeEnemy( x, y );
                    break;
                }
            default:
                return;
        }
    }

    const navigateHotbar = ( key: string ): void =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            const player = { ...playerInfo };
            const to = key==='arrowleft' ? -1 : +1 ;
            const oldIndex = player.HotBar.Equippeable.findIndex( item => item.selected );
            const max = player.HotBar.Equippeable.length - 1;
            const newIndex = oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;
            
            if(oldIndex===newIndex) return playerInfo;

            const aux = [ ...player.HotBar.Equippeable];
            aux[oldIndex] = { ...aux[oldIndex], selected: false };
            aux[newIndex] = { ...aux[newIndex], selected: true };
            flag = false;
            return { ...player, HotBar: { ...player.HotBar, Equippeable: aux } };
        } );
    }

    const swapGear = (): void =>
    {
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const Equippeables = aux.HotBar.Equippeable;

            const selected = Equippeables.find( x => x.selected );
            if(!selected) return playerInfo;

            const toReplace = Equippeables.find( x => x.equiped && x.item.type === selected.item.type )

            if(!toReplace)
            {
                return { ...aux,
                    HotBar: { ...aux.HotBar, Equippeable:
                        Equippeables.map( x => x === selected ? { ...selected, equiped: true } : x ) } };
            }
            
            if(toReplace.id===selected.id)
            {
                return { ...aux,
                    HotBar: { ...aux.HotBar, Equippeable:
                        Equippeables.map( x => x.id === selected.id ? { ...selected, equiped: !selected.equiped } : x ) } };
            }

            return { ...aux,
                HotBar: { ...aux.HotBar, Equippeable:
                    Equippeables.map( x => x === toReplace ? { ...toReplace, equiped: false } : x === selected ? { ...selected, equiped: true } : x )
                }
            }
        } );
    }

    const handleMovement = (event: React.KeyboardEvent): void =>
    {
        if(game)
        {
            findPlayer();
            const key = event.key.toLowerCase();

            const movementKeys = ['w', 'a', 's', 'd'];

            if (movementKeys.includes(key))
            {
                if (!allowed) return;
                setAllowed(false);
                setTimeout(() => setAllowed(true), 100);

                findPlayer();

                switch (key)
                {
                    case 'w': movePlayer(-1, 0, ship_up); break;
                    case 'a': movePlayer(0, -1, ship_left); break;
                    case 's': movePlayer(1, 0, ship_down); break;
                    case 'd': movePlayer(0, 1, ship_right); break;
                }
                return;
            }

            switch(key)
            {    
                case 'arrowleft':
                case 'arrowright':
                navigateHotbar(key);
                break;

                case 'k':   //bandages
                consumeItem(Bandages, 2);
                break;
                case 'o':   //poción
                consumeItem(Potion, 1);
                break;
                case 'p':   //Aloe
                consumeItem(Aloe, 1);
                break;

                case 'q':   //renew (HoT)
                heal(0,1,5);
                break;

                case 'i':   //abrir inventario
                setShowInventory(prev => !prev);
                break;
                case 'g':   //mostrar Gear equipable
                setShowGear(prev=> !prev);
                break;

                case 'enter':
                handleInteraction();
                break;
                case 'e':
                swapGear();
                break;
                default:
                    break;
            }
        }
    }

    const beginPatrol = ( x: number, y: number, symbol: string, patrol: string ) => //non
    {
        const thisEnemy = enemies.find( mob => mob.Data.x === x && mob.Data.y === y );

        if( thisEnemy?.Pattern !== 'none' )
        {
            switch(patrol)
            {
                case 'straight':
                {
                    straightPatrol( x, y, symbol );
                    break;
                }
                default: return;
            }
        }
    }

    const straightPatrol = ( x: number, y: number, symbol: string ): void => //non
    {
        let direction = -1;
        let currentX = x;

        const thisEnemy = enemies?.find( mob => mob.Data.x===x && mob.Data.y===y );
        !thisEnemy && console.log('No se encontró un mob en las coordenadas iniciales.');

        if(thisEnemy?.PatrolId)
        {
            clearInterval(thisEnemy.PatrolId);
        }

        let id = setInterval( () =>
        {
            let change = [];
            let nextX = currentX + direction;

            setMapa( prev =>
            {
                const aux = prev.map( x => [...x] );

                if(checkCollision(nextX,y)!=='empty')
                {
                    change.push(true);
                    return aux;
                }

                aux[nextX][y] = thisEnemy?.Data.symbol || '❌';
                aux[currentX][y] = '';
                return aux;
            });
            
            setEnemies( prev => prev.map( mob => mob.Data.x===x && mob.Data.y===y ?
            { ...mob, Data: { ...mob.Data, x: nextX } } : mob ) );
            
            if(change.length>0)
            {
                direction*=-1;
            }
            else
            {
                currentX = nextX;
            }
            console.log("---------------------------------------- fin de una vuelta");
        },1000);

        setEnemies( prev => prev.map( mob => mob.Data.x===x && mob.Data.y===y ?
            { ...mob, Data: { ...mob.Data, PatrolId: id  } } : mob ) );
    }

    const finishDoT = <T extends WithAliments>( aliment: keyof AlimentInstances, info: T, all?: boolean ): void =>
    {
        if(all)
        {
            for( const key in info.Aliments.Instances )
            {
                const instances = info.Aliments.Instances[key as keyof typeof info.Aliments.Instances];

                instances.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
            }
        }
        else
        {
            info.Aliments.Instances[aliment?aliment:'BleedInstances'].forEach( ids =>
            {
                clearInterval(ids.dmgId);
                clearTimeout(ids.timerId);
            } );
        }
    }

    const finishBuff = ( buff: keyof BuffInstances, info: Player, cleanse?: boolean ): void =>
    {
        if(cleanse)
        {
            for( const key in info.Buffs.Instances )
            {
                const instances = info.Buffs.Instances[key as keyof typeof info.Buffs.Instances];

                instances.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
            }
        }
        else
        {
            info.Buffs.Instances[buff].forEach( ids =>
            {
                clearInterval(ids.dmgId);
                clearTimeout(ids.timerId);
            } );
        }
    }

    const manageDotInstance = <T extends WithAliments>( instance: keyof AlimentInstances, newInstance: alimentIds | undefined, prev: T, action: 'add' | 'remove' | 'clean' | 'restart' ) : T =>
    {
        let flag = '';
        switch(instance)
        {
            case 'BleedInstances':
                flag = 'Bleeding';
                break;
            case 'BurnInstances':
                flag = 'Burning';
                break;
            case 'PoisonInstances':
                flag = 'Poisoned';
                break;
            default:
                break;
        }

        switch(action)
        {
            case 'add':
                return { ...prev, Aliments:
                        { ...prev.Aliments, Flags: { ...prev.Aliments.Flags, [flag]: true }, Instances:
                            { ...prev.Aliments.Instances, [instance]: [ ...prev.Aliments.Instances[instance], newInstance ] } } };
            case 'remove':
                const updatedInstance = prev.Aliments.Instances[instance].filter( x =>
                    x.dmgId!==newInstance?.dmgId && x.timerId!==newInstance?.timerId );
                const isInstanceEmpty = updatedInstance.length == 0;
                return { ...prev, Aliments:
                    { ...prev.Aliments, Flags: { ...prev.Aliments.Flags, [flag]: !isInstanceEmpty }, Instances:
                        { ...prev.Aliments.Instances, [instance]: updatedInstance } } };
            case 'clean':
                return { ...prev, Aliments:
                    { ...prev.Aliments, Flags: { ...prev.Aliments.Flags, [flag]: false }, Instances:
                        { ...prev.Aliments.Instances, [instance]: [] } } };
            case 'restart':
                return { ...prev, Aliments:
                    { ...prev.Aliments, Flags: { Poisoned: false, Burning: false, Bleeding: false }, Instances:{ BurnInstances: [], BleedInstances: [], PoisonInstances: [] } } };
            default:
                return prev;
        }
    };

    const cleanse = ( aliment: string, ID: string = '' ): void =>
    {
        switch( aliment )
        {
            case 'bleed':
            {
                if(ID)
                {
                    setEnemies( prevEnemies =>
                    {
                        const aux = [ ...prevEnemies];
                        return aux.map( mob =>
                        {
                            if( mob.ID!==ID ) return mob;
                            finishDoT( 'BleedInstances',  mob );
                            return manageDotInstance( 'BleedInstances', undefined, mob, 'clean' );
                        } );
                    } );
                }
                else
                {
                    setPlayer( playerInfo =>
                    {
                        const aux = { ...playerInfo };
                        finishDoT( 'BleedInstances', aux );
                        return manageDotInstance('BleedInstances', undefined, aux, 'clean')
                    } );
                }
                break;
            }
            case 'poison':
            {
                if(ID)
                {
                    setEnemies( prevEnemies =>
                    {
                        const aux = [ ...prevEnemies];
                        return aux.map( mob =>
                        {
                            if( mob.ID!==ID ) return mob;
                            finishDoT( 'PoisonInstances',  mob );
                            return manageDotInstance( 'PoisonInstances', undefined, mob, 'clean' );
                        } );
                    } );
                }
                else
                {
                    setPlayer( playerInfo =>
                    {
                        const aux = { ...playerInfo };
                        finishDoT( 'PoisonInstances', aux );
                        return manageDotInstance('PoisonInstances', undefined, aux, 'clean')
                    } );
                }
                break;
            }
            case 'burn':
            {
                if(ID)
                {
                    setEnemies( prevEnemies =>
                    {
                        const aux = [ ...prevEnemies];
                        return aux.map( mob =>
                        {
                            if( mob.ID!==ID ) return mob;
                            finishDoT( 'BurnInstances',  mob );
                            return manageDotInstance( 'BurnInstances', undefined, mob, 'clean' );
                        } );
                    } );
                }
                else
                {
                    setPlayer( playerInfo =>
                    {
                        const aux = { ...playerInfo };
                        finishDoT( 'BurnInstances', aux );
                        return manageDotInstance('BurnInstances', undefined, aux, 'clean')
                    } );
                }
                break;
            }
            case 'all':
            {
                if(ID)
                {
                    setEnemies( prevEnemies =>
                    {
                        const aux = [ ...prevEnemies];
                        return aux.map( mob =>
                        {
                            if( mob.ID!==ID ) return mob;
                            finishDoT( 'BleedInstances',  mob, true );
                            return manageDotInstance( 'BleedInstances', undefined, mob, 'restart' );
                        } );
                    } );
                }
                else
                {
                    setPlayer( playerInfo =>
                    {
                        const aux = { ...playerInfo };
                        finishDoT( 'BleedInstances', aux, true );
                        return manageDotInstance('BleedInstances', undefined, aux, 'restart')
                    } );
                }
                break;
            }
        }
    }

    const heal = ( healing: number, HoT: number, times: number ): void =>
    {
        queueLog(`+${healing} HP`, 'green');

        setPlayer( prev =>
            {
                manageVisualAnimation( 'healing', prev.Data.x, prev.Data.y, healing.toString(), 500 );
                return {...prev, HP: prev.HP + healing < player.MaxHP ? prev.HP + healing : player.MaxHP }
            } );

        if(HoT!==0)
        {
            let dmgId = setInterval( () =>
            {
                setPlayer( prev => ( { ...prev, HP: prev.HP+HoT > player.MaxHP ? player.MaxHP : prev.HP + HoT } ) );
                queueLog(`+${HoT} HP [regen]`, 'seagreen');
            }, 1000);

            let timerId = setTimeout( () =>
            {
                clearInterval(dmgId);
            }, times*1000)
            setPlayer( prev => manageBuffInstance( 'HotInstances', {dmgId, timerId}, prev, 'add' ) );
        }
    }

    const loadGame = (): void =>
    {
        const auxiliar = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> '') );  //Vacía el mapa
        for(let i=0; i<mapSize; i++)
        {
            auxiliar[i][0] = wallImg;
            auxiliar[0][i] = wallImg;
            auxiliar[i][17] = wallImg;
            auxiliar[17][i] = wallImg;
        }

        auxiliar[3][3] = boxImg;
        auxiliar[13][14] = hGoblinImg;
        auxiliar[15][2] = goblinImg;
        auxiliar[13][13] = pTrapImg;
        auxiliar[15][5] = trapImg;
        auxiliar[2][5] = potionImg;
        auxiliar[2][6] =  bandagesImg;
        auxiliar[2][7] = potionImg;
        auxiliar[2][8] = bandagesImg;
        auxiliar[2][10] = aloeImg;
        auxiliar[3][5] = sword1Img;
        auxiliar[4][6] = dagger1Img;
        auxiliar[5][6] = necklaceImg;
        auxiliar[6][6] = necklaceImg;
        auxiliar[10][10] = fire;
        auxiliar[10][12] = fountain;
        auxiliar[2][16] = tpImg;
        auxiliar[16][2] = tpImg;

        setTps( [ [2,16], [16,2] ] );
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = ship_up;
        setPlayer( prev => (
        { ...prev, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: ship_up } } ) );
        setEnemies( [
        { ...enemy, ID: crypto.randomUUID(), Data: { x: 15, y: 2, symbol: 'e' } },
        { ...heavyEnemy, ID: crypto.randomUUID(), Data: { x: 13, y: 14, symbol: 'E' } } ] );
        setTraps( [
        { ...trap, ID: crypto.randomUUID(), Data: { x: 15, y: 5, symbol: trapImg } },
        { ...poisonTrap, ID: crypto.randomUUID(), Data: { ...poisonTrap.Data, x: 13, y: 13 } } ] );
        setMapa(auxiliar);
    }

    const startGame = (): void =>
    {
        setEvents( [] );
        loadGame();
        setPlayer( prev => ({ ...prev, HP: player.MaxHP }) );
        setGame(true);
        setTimeout(() => gridRef.current?.focus(), 0);
    }

    const stopGame = (): void =>
    {
        findPlayer();
        cleanse('all');
        setTimeout( () => { cleanse('all') }, 50 );
        setShowInventory(false);
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[player.Data.x][player.Data.y] = '';
        setMapa(auxiliar);
        setPlayer( {...emptyPlayer, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: ship_up } } );
        queueLog(`Moriste a causa de tus heridas.`, 'white');
        setGame(false);
    }

    const renderHp = (): string =>
    {
        if(player.HP>=0)
        {
            const heartsLeft = '💖'.repeat( player.HP );
            const heartsLost = '🖤'.repeat( maxHp - player.HP );
            return heartsLeft + heartsLost;
        }
        else
        {
            const heartsLost = '🖤'.repeat( maxHp );
            return heartsLost;
        }
    }

    const renderAliments = () : string =>
    {
        const poison = player.Aliments.Flags.Poisoned?'[Poisoned💚]':'';
        const bleed = player.Aliments.Flags.Bleeding?'[Bleeding🩸]':'';
        const burn = player.Aliments.Flags.Burning?'[Burning🔥]':'';
        return poison + bleed + burn;
    }
    
    return (
        <div className='game-container'>
          <button onClick={() => console.log(player)}> Player </button>
          <button onClick={() => setLan('en')}> Inglés </button>
          <button onClick={() => setLan('es')}> Español </button>
          <span>StatusEffect: {renderAliments()}</span>
          <br />
          <span>HP: {renderHp()}</span>
      
          <div className="layout-flex">
            <div className='general'>
  <div className='columna-wrapper'>
    <div className='columna' onKeyDown={handleMovement} ref={gridRef} tabIndex={0}>
      {mapa.map((fila, x) => (
        <div key={x} className='fila'>
          {fila.map((celda, y) => {
            if (icons.includes(celda)) {
              return <img src={celda} key={y} className='celda' />;
            } else {
              return <label key={y} className='celda'>{celda}</label>;
            }
          })}
        </div>
      ))}
    </div>

    <div className='visuals-layer'>
      {visuals.map((fila, x) => (
        <div key={x} className='fila'>
          {fila.map((celda, y) => {
            if (icons.includes(celda)) {
              return <img src={celda} key={y} className='celda' />;
            } else {
              return <label key={y} className='celda'>{celda}</label>;
            }
          })}
        </div>
      ))}
    </div>

  </div>
</div>

      
            {showInventory && (
              <div className="inventory-window">
                <p>Inventario:</p>
                <ul className="inventory-list">
                  {player.Inventory.map((x, y) =>
                    <li key={y}>
                      {x.item.name} — { `Cantidad: ${x.quantity}` }
                    </li>)}
                </ul>
              </div>
            )}

            {showGear && (
              <div className="inventory-window">
                <p>GEAR:</p>
                <ul className="inventory-list">
                  {player.HotBar.Equippeable.map((x, y) =>
                    <li key={y}>
                      { x.selected && '👉' } {x.item.name} —
                      { x.item.attackStats?.dmg && `DMG: ${x.item.attackStats?.dmg} -` }
                      { x.item.defenseStats?.def && `DEF: +${x.item.defenseStats.def} -` }
                      { x.item.defenseStats?.hp && `HP (${x.item.defenseStats?.hp}) -`}
                      Durability: {x.durability} / {x.item.durability} -
                      { x.equiped && '✔' }
                    </li>)}
                </ul>
              </div>
            )}

          </div>

         <div style={{ background: "#111", color: "#0f0", fontFamily: "monospace", padding: "0.01rem", height: "118px", overflowY: "auto" }}>
            <ul style={{ margin: 0, padding: 0 }}>
                {events.map((log, i) => <li key={i} style={{ color: log.color || 'inherit' }}>{log.message}</li>)}
            </ul>
        </div>
      
          {!game && <button onClick={startGame}>START</button>}
          {game && <button onClick={stopGame}>STOP</button>}
        </div>
      );
}

export default App;