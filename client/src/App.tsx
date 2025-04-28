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

const mapSize = 18;
const maxHp = 15;

const enemy = 'e';
const heavyEnemy = 'E';
const trap = 't';
const poisonTrap = 'p';
const fire = 'f';

const bandages = { name: 'Bandages', id: 1, desc: 'Deals with bleeding.', cd: 5000 };
const potion = { name: 'Potion', id: 2, desc: 'Basic healing item (+3HP).', cd: 3000 };

const residuals = [fire, trap, poisonTrap, teleport];
const immovable = [enemy, heavyEnemy, box, wall];
const movable = [box];

type playerData = { x: number, y: number, symbol: string };
type Coords = [ number, number ];
type ArrayOfCoords = Coords[];
type Residual = { symbol: string, coords: number[] };
type Item = { name: string, id: number, desc: string, cd: number };
type InventoryItem = { item: Item, quantity: number, onCd: boolean };
type Inventory = InventoryItem[];
type Aliments = { PoisonInstnaces: alimentIds[], BleedInstances: alimentIds[], BurnInstances: alimentIds[] };
type alimentIds = { dmgId: ReturnType<typeof setInterval>, timerId: ReturnType<typeof setTimeout> };

interface Player
{
    HP: number,
    MaxHP: number,
    Data: playerData,
    Inventory: Inventory,
    Aliments: Aliments
}

const emptyPlayer: Player =
{
    HP: maxHp,
    MaxHP: maxHp,
    Data: { x: 0, y: 0, symbol: '^' },
    Inventory: [],
    Aliments: { PoisonInstnaces: [], BleedInstances: [], BurnInstances: [] }
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

    const [ poisoned, setPoisoned ] = useState<boolean>( false );
    const [ poisonTicks, setPoisonTicks ] = useState<alimentIds[]>( [] );
    const [ bleeding, setBleeding ] = useState<boolean>( false );
    const [ bleedTicks, setBleedTicks ] = useState<alimentIds[]>( [] );
    const [ burning, setBurning ] = useState<boolean>( false );
    const [ burnTicks, setBurnTicks ] = useState<alimentIds[]>( [] );

    useEffect( (): void =>
    {
        if(poisonTicks.length==0 && poisoned)
        {
            setPoisoned(false);
            cleanse('poison');
        }
        if(bleedTicks.length==0 && bleeding)
        {
            setBleeding(false);
            cleanse('bleed');
        }
        if(burnTicks.length==0 && burning)
        {
            setBurning(false);
            cleanse('burn');
        }
    }, [poisonTicks, bleedTicks, burnTicks]);

    const findPlayer = (): void =>
    {
        let here = [ 0, 0 ];
        let symbol = '';
        mapa.forEach( (fila, y) => fila.map( (celda, z) =>
        {
            if(celda==ship_down || celda==ship_up || celda==ship_left || celda==ship_right ) { here=[ y, z ]; symbol=celda; }
        } ));
        setPlayer( prev => ({ ...prev, Data: { x: here[0], y: here[1], symbol } }) );
    }

    const checkCollision = ( x: number, y: number ): string =>
    {
        if( x<0 || x >= mapa.length || y<0 || y >= mapa[0].length ) return 'oob';
        
        const tile = mapa[x][y];
        switch(tile)
        {
            case '': return 'empty';
            case 'x': return wall;
            case 'u': return totem;
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
            case '+': return '+'
            case 'b': return 'b';
            default: return 'unknown';
        };
    }

    const inconsecuente = ( symbol: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        const {x, y} = player.Data;
        auxiliar[x][y] = symbol;
        setPlayer( prev => ({ ...prev, Data: { x, y, symbol } }) );
        setMapa(auxiliar);
    }

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
    }

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
    }

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
    }

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
                        setPoisoned(true);
                        setPoisonTicks( prev => [ ...prev, {dmgId, timerId} ] );
                        break;
                    }
                case 'bleed':
                    {
                        setBleeding(true);
                        setBleedTicks( prev => [ ...prev, {dmgId, timerId} ] );
                        break;
                    }
                case 'burn':
                    {
                        setBurning(true);
                        setBurnTicks( prev => [ ...prev, {dmgId, timerId} ] );
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
                            setPoisonTicks( prev => prev.filter( x => x.timerId!==timerId ) );
                            break;
                        }
                    case 'bleed':
                        {
                            setBleedTicks( prev => prev.filter( x => x.timerId!==timerId ) );
                            break;
                        }
                    case 'burn':
                        {
                            setBurnTicks( prev => prev.filter( x => x.timerId!==timerId ) );
                            break;
                        }
                    default:
                        break;
                }
                clearInterval( dmgId );
            }, times*1000)

        }
    }
    
    const touchEnemy = ( symbol: string, type: string ): void =>
    {
        switch(type)
        {
            case enemy:
                {
                    inconsecuente(symbol);
                    hurtPlayer(1, 0, 0, 'none');
                    break;
                }
            case heavyEnemy:
                {
                    inconsecuente(symbol);
                    hurtPlayer(1, 2, 10, 'bleed');
                    break;
                }
        }
    }

    const stepOnTrap = ( x: number, y: number, symbol: string, type: string ): void =>
    {
        setResidual( prev => [ ...prev, { symbol: type, coords: [ x, y ] } ] );
        moveHere( x, y, symbol, true );

        switch(type)
        {
            case trap:
                {
                    hurtPlayer(1, 0, 0, 'none');
                    break;
                }
            case poisonTrap:
                {
                    hurtPlayer(1, 1, 2, 'poison');
                    break;
                }
        }
    }

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

    const stepOnItem = ( x: number, y: number, symbol: string, tile: string ): void =>
    {
        if( player.Inventory.length >= 20 )
        {
            setResidual( prev => [ ...prev, { symbol: tile, coords: [ x, y ] } ] );
            moveHere( x, y, symbol, true );
            return ;
        }
        moveHere( x, y, symbol, true );

        switch(tile)
        {
            case '+':
            {
                addToInventory( potion, 1 );
                break;
            }
            case 'b':
            {
                addToInventory( bandages, 1 );
                break;
            }
        }
    }

    const addToInventory = ( item: Item, quantity: number ): void =>
    {
        const thisItem = player.Inventory.find( x => x.item.name === item.name )
        if(!thisItem)
        {
            setPlayer( prev => ( { ...prev, Inventory: [ ...prev.Inventory, { item, quantity: quantity, onCd: false } ] } ) );
            return
        }
        setPlayer( prev => ( { ...prev, Inventory: prev.Inventory.map( x => x.item.name===item.name ? { ...x, quantity: x.quantity + quantity } : x ) } ) );
    }

    const consumeItem = ( item: Item, quantity: number ): void =>
    {
        const thisItem = player.Inventory.find( x => x.item.name===item.name );

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
            setPlayer( prev => ( {...prev, Inventory: prev.Inventory.map( z => z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - quantity, onCd: true } : z ) } ) );
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
                        touchEnemy( symbol, tile );
                        break;
                    }
                case trap:
                case poisonTrap:
                    {
                        stepOnTrap( newX, newY, symbol, tile );
                        break;
                    }
                case fire:
                    {
                        walkOntoFire( x, y, symbol, newX, newY );
                        break;
                    }
                case totem:
                    {
                        inconsecuente( symbol );
                        cleanse('all');
                        break;
                    }
                case fountain:
                    {
                        inconsecuente( symbol );
                        cleanse('burn');
                        break;
                    }
                case '+':
                case 'b':
                    {
                        stepOnItem( newX, newY, symbol, tile )
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
                case 'k':
                consumeItem(bandages, 2);
                break;
                case 'o':
                consumeItem(potion, 1);
                break;
                case 'i':
                console.log(player.Inventory);
                setShowInventory(prev => !prev);
                break;
                default:
                    break;
            }
        }
    }

    const cleanse = ( aliment: string ): void =>
    {
        switch( aliment )
        {
            case 'bleed':
            {
                bleedTicks.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
                setBleedTicks( [] );
                break;
            }
            case 'poison':
            {
                poisonTicks.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
                setPoisonTicks( [] );
                break;
            }
            case 'burn':
            {
                burnTicks.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
                setBurnTicks( [] );
                break;
            }
            case 'all':
            {
                burnTicks.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
                setBurnTicks( [] );
                poisonTicks.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
                setPoisonTicks( [] );
                bleedTicks.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
                setBleedTicks( [] );
                break;
            }
        }
    }

    const heal = ( healing: number, HoT: number, times: number ): void =>
    {
        setPlayer( prev => ( { ...prev, HP: prev.HP + healing < player.MaxHP ? prev.HP + healing : player.MaxHP } ) );
        if(HoT!==0)
        {
            let healId = setInterval( () =>
            {
                setPlayer( prev => ( { ...prev, HP: prev.HP+HoT > player.MaxHP ? player.MaxHP : prev.HP + HoT } ) );
            }, 1000);

            let timerId = setTimeout( () =>
            {
                clearInterval(healId);
            }, times*1000)
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
        auxiliar[13][14] = heavyEnemy;
        auxiliar[13][13] = poisonTrap;
        auxiliar[13][12] = totem;
        auxiliar[15][2] = enemy;
        auxiliar[15][5] = trap;
        auxiliar[2][5] = '+';
        auxiliar[2][6] = 'b';
        auxiliar[2][7] = '+';
        auxiliar[2][8] = 'b';
        auxiliar[10][10] = fire;
        auxiliar[10][12] = fountain;
        auxiliar[2][16] = 'T';
        auxiliar[16][2] = 'T';

        setTps( [ [2,16], [16,2] ] );
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = ship_up;    //Agrega el jugador al centro
        setPlayer( prev => ( { ...prev, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: ship_up } } ) );
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

  return(
    <div>
        <span> StatusEffect: { poisoned?'[Poisoned💚]':'' } { bleeding?'[Bleeding🩸]':'' } { burning?'[Burning🔥]':'' } </span>
        <br />
        <span> HP: { renderHp() } </span>
        <div className='general'>
            <div className='columna' onKeyDown={handleMovement} ref={gridRef} tabIndex={0}>
                {mapa.map((fila, x) => (
                <div key={x} className='fila'>
                    {fila.map((celda, y) =>
                    <label key={y} className='celda'>
                        { celda }
                    </label>
                    )}
                </div> ))}
            </div>
           { showInventory &&
           <div> Inventario:
                <div>
                    {player.Inventory.map( (x, y) => <label key={y}> {x.item.name} Cantidad: {x.quantity} </label>)}
                </div>
            </div>}
        </div>
        {!game && <button onClick={startGame}> START </button>}
        {game && <button onClick={stopGame}> STOP </button>}
    </div>
  );
}

export default App;