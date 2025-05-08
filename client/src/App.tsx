import { useEffect, useRef, useState } from 'react';
import './App.css';

const ship_up = '^';
const ship_down = 'v';
const ship_left = '<';
const ship_right = '>';
const anyPlayer = [ship_down, ship_left, ship_right, ship_up];
const box = 'B';
const wall = 'x';
const teleport = 'T';
const totem = 'u';
const fountain = 'F';
const cursedTotem = '🧿';

const mapSize = 18;
const maxHp = 15;

const fire = 'f';

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

const Potion: Item =
{
    type: 'Item',
    name: 'Potion',
    symbol: '+',
    id: 2,
    desc: '+3 HP',
    cd: 3000
} 

const Bandages: Item =
{
    type: 'Item',
    name: 'Bandages',
    symbol: 'b',
    id: 1,
    desc: 'Stops bleeding.',
    cd: 5000
}

interface Gear
{
    type: 'Gear',
    name: string,
    symbol: string,
    id: number,
    slot: string,
    desc: string,
    attackStats?: attackStats,
    defenseStats?: deffenseStats,
    durability: number,
    Equippeable: boolean
};

type attackStats = { dmg: number, DoT?: number, times?: number, cd: number };
type deffenseStats = { def: number, immunity?: string };

const Fists: Gear =
{
    type: 'Gear',
    name: 'Fists',
    symbol: '🤜',
    id: 0,
    slot: 'two_handed',
    desc: '+1 DMG',
    attackStats: { dmg: 1, cd: 2500 },
    durability: 999,
    Equippeable: true
}

const Sword1: Gear =
{
    type: 'Gear',
    name: 'Sword_1',
    symbol: '🗡',
    id: 3,
    slot: 'main_hand',
    desc: '+2 DMG',
    attackStats: { dmg: 2, DoT: 0, times: 0, cd: 1000 },
    durability: 10,
    Equippeable: true
}

const Shield1: Gear =
{
    type: 'Gear',
    name: 'Shield_1',
    symbol: '🛡',
    id: 4,
    slot: 'off_hand',
    desc: '+1 DEF',
    defenseStats: { def: 1 },
    durability: 5,
    Equippeable: false
}

type InventoryItem = { item: Item, quantity: number, onCd: boolean };
type InventoryGear = { item: Gear, durability: number, onCd: boolean, equiped?: boolean };
type Inventory = InventoryItem[];
type AlimentFlags = { Poisoned: boolean, Bleeding: boolean, Burning: boolean };
type BuffFlags = { HoT: boolean };
type AlimentInstances = { PoisonInstances: alimentIds[], BleedInstances: alimentIds[], BurnInstances: alimentIds[] }; 
type BuffInstances = { HotInstances: alimentIds[] };

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

type HotBarItems = { Equipped: Gear, Equippeable: InventoryGear[] }

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
    Data: { x: 0, y: 0, symbol: '^' },
    Inventory: [],
    HotBar: { Equipped: Fists, Equippeable: [ { item: Fists, durability: 999, onCd: false, equiped: true } ] },
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

const basicWeapon = { item: Fists, durability: 999, onCd: false, equiped: true };

type attackInfo = { Instant: number, DoT: number, Times: number, Aliment: string };
type deffenseInfo = { Armor: number, Toughness: number, Immunity?: string };
type dropInfo = { item: Item, chance: number };

interface Trap
{
    Active: boolean,
    Data: locationData,
    Attack: attackInfo,
    toDisarm?: Item[]
}

const trap: Trap =
{
    Active: true,
    Data: { x: 0, y: 0, symbol: 't' },
    Attack: { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' }
}

const poisonTrap: Trap =
{
    Active: true,
    Data: { x: 0, y: 0, symbol: 'p' },
    Attack: { Instant: 1, DoT: 2, Times: 3, Aliment: 'poison' },
}

interface Enemy
{
    HP: number,
    MaxHP: number,
    Data: locationData,
    Attack: attackInfo,
    Defense: deffenseInfo,
    Pattern: string,
    PatrolId?: ReturnType<typeof setTimeout>,
    Drops: dropInfo[]
}

const enemy: Enemy =
{
    HP: 5,
    MaxHP: 5,
    Data: { x: 0, y: 0, symbol: 'e' },
    Attack: { Instant: 2, DoT: 0, Times: 0, Aliment: 'none' },
    Defense: { Armor: 0, Toughness: 1 },
    Pattern: 'none',
    Drops: []
}

const heavyEnemy: Enemy =
{
    HP: 20,
    MaxHP: 10,
    Data: { x: 0, y: 0, symbol: 'E' },
    Attack: { Instant: 3, DoT: 2, Times: 3, Aliment: 'bleed' },
    Defense: { Armor: 1, Toughness: 3, Immunity: 'bleed' },
    Pattern: 'none',
    Drops: [ { item: Potion, chance: 75 } ]
}

const App = () =>
{
    const gridRef = useRef<HTMLDivElement>(null);
    const [ game, setGame ] = useState<boolean>(false);
    const [ stun, setStun ] = useState<boolean>(false);
    const [ mapa, setMapa ] = useState<string[][]>( Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> '') ) );
    const [ tps, setTps ] = useState<ArrayOfCoords>([]);
    const [ residual, setResidual ] = useState<Residual[]>( [] );

    const [ player, setPlayer ] = useState<Player>( emptyPlayer );
    const [ showInventory, setShowInventory ] = useState<boolean>( false );
    const [ showGear, setShowGear ] = useState<boolean>( false );
    const [ enemies, setEnemies ] = useState<Enemy[]>( [] );
    const [ traps, setTraps ] = useState<Trap[]>( [] );

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
            case 'F': return fountain;
            case 'e': return enemy;
            case 'E': return heavyEnemy;
            case 'f': return fire;
            case 'D': return 'door';
            case 'B': return box;
            case 'T': return teleport;
            case 't': return trap;
            case 'p': return poisonTrap;
            case '+': return Potion;
            case 'b': return Bandages;
            case '🗡': return Sword1;
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

        if(auxiliar[tp1X][tp1Y] == teleport && auxiliar[tp2X][tp2Y] == teleport)
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
                        setResidual( prev => [ ...prev, { symbol: teleport, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[tp2X][tp2Y] = box;
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { symbol: teleport, coords: [ tp1X, tp1Y ] } ] );
                        auxiliar[tp1X][tp1Y] = box;
                    }
                    setMapa(auxiliar);
                    break;
                }
                case '':
                {
                    if( tp1X==newX && tp1Y==newY )
                    {
                        setResidual( prev => [ ...prev, { symbol: teleport, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[pX][pY] = '';
                        auxiliar[tp2X][tp2Y] = symbol;
                        setPlayer( prev => ({ ...prev, Data: { x: tp2X, y: tp2Y, symbol } }) );
                        setMapa(auxiliar);
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { symbol: teleport, coords: [ tp1X, tp1Y ] } ] );
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

    const manageDotInstance =( instance: keyof AlimentInstances, newInstance: alimentIds | undefined, prev: Player, action: 'add' | 'remove' | 'clean' | 'restart' ) : Player =>
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
                finishBuff(instance);
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

    const hurtPlayer = ( dmg: number, dot: number, times: number, aliment: string ): void =>
    {
        setPlayer( prev =>
        {
            if(prev.HP-dmg<=0)
            {
                stopGame();
            }
            return { ...prev, HP: prev.HP - dmg };
        });

        if(dot!=0)
        {
            switch(aliment)
            {
                case 'poison':
                    {
                        setPlayer( prev => manageDotInstance("PoisonInstances", {dmgId, timerId}, prev, 'add') );
                        break;
                    }
                case 'bleed':
                    {
                        setPlayer( prev => manageDotInstance("BleedInstances", {dmgId, timerId}, prev, 'add') );
                        break;
                    }
                case 'burn':
                    {
                        setPlayer( prev => manageDotInstance("BurnInstances", {dmgId, timerId}, prev, 'add') );
                        break;
                    }
                default:
                    break;
            }

            let dmgId = setInterval( () =>
            {
                setPlayer( prev =>
                {
                    if( prev.HP - dot <= 0 )
                    {
                        clearInterval(dmgId);
                        clearTimeout(timerId);
                        stopGame();
                        return {...prev, HP: 0 };
                    }
                    return {...prev, HP: prev.HP - dot };
                } );
            }, 1000);

            let timerId = setTimeout( () =>
            {
                switch(aliment)
                {
                    case 'poison':
                        {
                            setPlayer( prev => manageDotInstance("PoisonInstances", {dmgId, timerId}, prev, 'remove') );
                            break;
                        }
                    case 'bleed':
                        {
                            setPlayer( prev => manageDotInstance("BleedInstances", {dmgId, timerId}, prev, 'remove') );
                            break;
                        }
                    case 'burn':
                        {
                            setPlayer( prev => manageDotInstance("BurnInstances", {dmgId, timerId}, prev, 'remove') );
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
        hurtPlayer( Attack.Instant, Attack.DoT, Attack.Times, Attack.Aliment );
        inconsecuente(symbol);
    };

    const stepOnTrap = ( x: number, y: number, symbol: string ): void =>
    {
        const thisTrap = traps.find( trap => trap.Data.x===x && trap.Data.y===y ) || trap ;

        setResidual( prev => [ ...prev, { symbol: thisTrap.Data.symbol, coords: [ x, y ] } ] );
        moveHere( x, y, symbol, true );

        const {Attack} = thisTrap;
        hurtPlayer( Attack.Instant, Attack.DoT, Attack.Times, Attack.Aliment );
    };

    const walkOntoFire = ( x: number, y: number, symbol: string, newX: number, newY: number ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[newX-x][newY-y] = '';
        auxiliar[newX][newY] = symbol
        setMapa(auxiliar);
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
        return { item: gear, durability: gear.durability, onCd: false, equiped: false };
    }

    const addToEquippeable = ( gear: Gear ) =>
    {
        setPlayer( playerInfo => ( { ...playerInfo, HotBar: { ...playerInfo.HotBar,
            Equippeable: [ ...playerInfo.HotBar.Equippeable, turnToInventoryGear(gear) ] } } ) );
    }

    const addToInventory = ( item: Item, quantity: number ): void =>
    {
        const thisItem = player.Inventory.find( x => x.item.name === item.name )
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
                break;
            }
            case 'Bandages':
            {
                cleanse('bleed');
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
                        inconsecuente( symbol );
                        cleanse('burn');
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
                    {
                        stepOnItem( newX, newY, symbol, tile, 1 );
                        break;
                    }
                case Sword1:
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

    const strikeEnemy = ( x: number, y: number ): void =>
    {
        const equippedWeapon = player.HotBar.Equippeable.find( item => item.equiped ) || basicWeapon;
        const thisEnemy = enemies.find( mob => mob.Data.x===x && mob.Data.y===y ) || enemy;

        const damage = (equippedWeapon?.item.attackStats?.dmg || 0) - thisEnemy.Defense.Armor;

        damageEnemy( x, y, damage );
        setPlayer( playerInfo =>
        {
            const thisWeapon = playerInfo.HotBar.Equippeable.find( item => item.equiped ) || Sword1 ;

            if(thisWeapon.durability - thisEnemy.Defense.Toughness <= 0)
            {
                let Equipeables = [ ...playerInfo.HotBar.Equippeable ];
                Equipeables = Equipeables.filter( x => x.equiped === false  );
                Equipeables = Equipeables.map( x => x.item.name === 'Fists' ? { ...x, equiped: true } : x );
                return { ...playerInfo, HotBar: { ...playerInfo.HotBar, Equippeable: Equipeables } }
            }
            return { ...playerInfo, HotBar: { ...playerInfo.HotBar,
                Equippeable: playerInfo.HotBar.Equippeable.map( x => x.equiped ? { ...x, durability: x.durability - thisEnemy.Defense.Toughness } : x ) } }
        } );
    }

    const damageEnemy = ( x: number, y: number, dmg: number ): void =>
    {
        const thisEnemy = enemies.find( mob => mob.Data.x===x && mob.Data.y===y ) || enemy ;

        if(thisEnemy.HP-dmg<=0)
        {
            setMapa( prev =>
            {
                let aux = prev.map( x => [...x] );
                if(thisEnemy.Drops.length>0)
                {
                    if( rollDrop(thisEnemy.Drops[0].chance) )
                    {
                        aux[x][y]=thisEnemy.Drops[0].item.symbol;
                        return aux
                    }
                }
                aux[x][y]='';
                return aux;
            } );
            console.log("Se murió");
            setEnemies( mobs => mobs.filter( mob => mob.Data.x!==x && mob.Data.y!==y ) );
        }
        else
        {
            console.log(`Le quedan ${ thisEnemy.HP-dmg } puntos de vida.`);
            setEnemies( mobs => mobs.map( mob => mob.Data.x===x && mob.Data.y===y ? { ...mob, HP: mob.HP - dmg } : mob ) );
        }
    }

    const playerVectors: Record<string, [number, number]> =
    {
        '^': [-1, 0],
        'v': [1, 0],
        '<': [0, -1],
        '>': [0, 1]
    }

    const directionFromVector = ( symbol: string ): [number, number] =>
    {
        return playerVectors[symbol] || [0, 0];
    }

    const handleInteraction = ( ): void =>
    {
        const [dx, dy] = directionFromVector(player.Data.symbol);
        let x = player.Data.x + dx;
        let y = player.Data.y + dy;

        const objective = checkCollision( x, y );
        switch(objective)
        {
            case enemy:
            case heavyEnemy:
                {
                    const thisWeapon = player.HotBar.Equippeable.find( item => item.equiped );
                    console.log("Daño infligido: ", thisWeapon?.item.attackStats?.dmg);
                    strikeEnemy( x, y );
                    break;
                }
            default:
                return;
        }
    }

    const swapGear = ( key: string ): void =>
    {
        const to = key==='arrowleft' ? -1 : +1 ;
        const oldIndex = player.HotBar.Equippeable.findIndex( item => item.equiped );
        const max = player.HotBar.Equippeable.length - 1;
        const newIndex = oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;

        if(oldIndex===newIndex) return;
        
        setPlayer( playerInfo =>
        {
            const aux = [ ...playerInfo.HotBar.Equippeable];
            aux[oldIndex] = { ...aux[oldIndex], equiped: false };
            aux[newIndex] = { ...aux[newIndex], equiped: true };
            return { ...playerInfo, HotBar: { ...playerInfo.HotBar, Equippeable: aux } };
        } );
    }

    const handleMovement = (event: React.KeyboardEvent): void =>
    {
        if(game)
        {
            findPlayer();
            const key = event.key.toLowerCase();

            switch(key)
            {
                case 'w':
                movePlayer(-1,0,ship_up);
                break;
                case 'a':
                movePlayer(0,-1,ship_left);
                break;
                case 's':
                movePlayer(+1,0,ship_down);
                break;
                case 'd':
                movePlayer(0,+1,ship_right);
                break;

                case 'arrowleft':
                case 'arrowright':
                swapGear(key);
                break;

                case 'k':   //bandages
                consumeItem(Bandages, 2);
                break;
                case 'o':   //poción
                consumeItem(Potion, 1);
                break;
                case 'p':   //renew (HoT)
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

    const finishDoT = ( aliment: keyof AlimentInstances ): void =>
    {
        player.Aliments.Instances[aliment?aliment:'BleedInstances'].forEach( ids =>
        {
            clearInterval(ids.dmgId);
            clearTimeout(ids.timerId);
        } );
    }

    const finishBuff = ( buff: keyof BuffInstances ): void =>
    {
        player.Buffs.Instances[buff].forEach( ids =>
        {
            clearInterval(ids.dmgId);
            clearTimeout(ids.timerId);
        } );
    }

    const cleanse = ( aliment: string ): void =>
    {
        switch( aliment )
        {
            case 'bleed':
            {
                finishDoT('BleedInstances');
                setPlayer( prev => manageDotInstance('BleedInstances', undefined, prev, 'clean') )
                break;
            }
            case 'poison':
            {
                finishDoT('PoisonInstances');
                setPlayer( prev => manageDotInstance('PoisonInstances', undefined, prev, 'clean') )
                break;
            }
            case 'burn':
            {
                finishDoT('BurnInstances');
                setPlayer( prev => manageDotInstance('BurnInstances', undefined, prev, 'clean') )
                break;
            }
            case 'all':
            {
                finishDoT('BleedInstances');
                finishDoT('BurnInstances');
                finishDoT('PoisonInstances');
                setPlayer( prev => manageDotInstance('BleedInstances', undefined, prev, 'restart') )
                break;
            }
        }
    }

    const heal = ( healing: number, HoT: number, times: number ): void =>
    {
        setPlayer( prev => ( { ...prev, HP: prev.HP + healing < player.MaxHP ? prev.HP + healing : player.MaxHP } ) );

        if(HoT!==0)
        {
            let dmgId = setInterval( () =>
            {
                setPlayer( prev => ( { ...prev, HP: prev.HP+HoT > player.MaxHP ? player.MaxHP : prev.HP + HoT } ) );
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
            auxiliar[i][0] = 'z';
            auxiliar[0][i] = 'y';
            auxiliar[i][17] = 'x';
            auxiliar[17][i] = 'x';
        }

        auxiliar[3][3] = 'B';
        auxiliar[13][14] = 'E';
        auxiliar[13][12] = totem;
        auxiliar[15][2] = 'e';
        auxiliar[13][13] = 'p';
        auxiliar[15][5] = 't';
        auxiliar[2][5] = '+';
        auxiliar[2][6] = 'b';
        auxiliar[2][7] = '+';
        auxiliar[2][8] = 'b';
        auxiliar[3][5] = '🗡';
        auxiliar[2][10] = cursedTotem;
        auxiliar[10][10] = fire;
        auxiliar[10][12] = fountain;
        auxiliar[2][16] = 'T';
        auxiliar[16][2] = 'T';

        setTps( [ [2,16], [16,2] ] );
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = ship_up;    //Agrega el jugador al centro
        setPlayer( prev => (
        { ...prev, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: ship_up } } ) );
        setEnemies( [
        { ...enemy, Data: { x: 15, y: 2, symbol: 'e' } },
        { ...heavyEnemy, Data: { x: 13, y: 14, symbol: 'E' } } ] );
        setTraps( [
        { ...trap, Data: { x: 15, y: 5, symbol: 't' } },
        { ...poisonTrap, Data: { x: 13, y: 13, symbol: 'p' } } ] );
        setMapa(auxiliar);
    }

    const startGame = (): void =>
    {
        loadGame();
        setPlayer( prev => ({ ...prev, HP: player.MaxHP }) );
        setGame(true);
        setTimeout(() => gridRef.current?.focus(), 0);
    }

    const stopGame = (): void =>
    {
        findPlayer();
        cleanse('all');
        setShowInventory(false);
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[player.Data.x][player.Data.y] = '';
        setMapa(auxiliar);
        setPlayer( {...emptyPlayer, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: ship_up } } );
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
          <span>StatusEffect: {renderAliments()}</span>
          <br />
          <span>HP: {renderHp()}</span>
      
          <div className="layout-flex"> {/* NUEVO contenedor horizontal */}
            <div className='general'> {/* Esto mantiene el fondo y centrado */}
              <div className='columna' onKeyDown={handleMovement} ref={gridRef} tabIndex={0}>
                {mapa.map((fila, x) => (
                  <div key={x} className='fila'>
                    {fila.map((celda, y) =>
                      <label key={y} className='celda'>
                        {celda}
                      </label>
                    )}
                  </div>
                ))}
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
                      {x.item.name} — { `Durabilidad: ${x.durability}` } - { x.equiped && '✔'}
                    </li>)}
                </ul>
              </div>
            )}
          </div>
      
          {!game && <button onClick={startGame}>START</button>}
          {game && <button onClick={stopGame}>STOP</button>}
        </div>
      );
}

export default App;