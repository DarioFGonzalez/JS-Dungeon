import { useRef, useState } from 'react';
import './App.css';

const ship_up = '^';
const ship_down = 'v';
const ship_left = '<';
const ship_right = '>';
const anyPlayer = ship_down || ship_left || ship_right || ship_up;
const asteroid = 'e';
const box = 'B';

type playerData = [ number, number, string ];
type Coords = [ number, number ];
type ArrayOfCoords = Coords[];
type Residual = { active: boolean, symbol: string };

const App = () =>
{
    const [ game, setGame ] = useState<boolean>(false);
    const [ mapa, setMapa ] = useState( Array.from( {length: 18}, ()=> Array.from( Array(18), ()=> '') ) );
    const gridRef = useRef<HTMLDivElement>(null);
    const [ tps, setTps ] = useState<ArrayOfCoords>([]) // ESTO a Mapas();
    const [ residual, setResidual ] = useState<Residual>( { active: false, symbol: '' } );


    // const [ dead, setDead ] = useState( false );
    const [ player, setPlayer ] = useState<playerData>( [ 0, 0, '^' ] );

    const findPlayer = () =>
    {
        let here = [ 0, 0 ];
        let symbol = '';
        mapa.forEach( (fila, y) => fila.map( (celda, z) =>
        {
            if(celda==ship_down || celda==ship_up || celda==ship_left || celda==ship_right ) { here=[ y, z ]; symbol=celda; }
        } ));
        setPlayer( [ here[0], here[1], symbol ] );
    }

    const checkCollision = ( x: number, y: number ) =>
    {
        if( x<0 || x >= mapa.length || y<0 || y >= mapa[0].length ) return 'oob';
        
        const tile = mapa[x][y];
        switch(tile)
        {
            case '': return 'empty';
            case 'x': return 'wall';
            case '~': return 'water';
            case 'e': return 'enemy';
            case '*': return 'fire';
            case 'D': return 'door';
            case 'B': return 'box';
            case 'T': return 'teleport';
            default: return 'unknown';
        };
    }

    const inconsecuente = ( symbol: string ) =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        const [ pX, pY ] = player;
        auxiliar[pX][pY] = symbol;
        setPlayer( [ pX, pY, symbol ] );
        setMapa(auxiliar);
    }

    const isAtSpecialTile = ( x: number, y: number ) =>
    {
        let flag = [];
        tps.forEach( coord => (coord[0]==x && coord[1]==y) && flag.push(true) );
        if(flag.length!=0)
        {
            console.log('true');
            return true;
        }
        console.log('false');
        return false;
    }

    const handleTp = ( x: number, y: number, symbol: string, other: string ) =>
    {
        const auxiliar = mapa.map(fila => [...fila]);

        const newX = player[0]+x;
        const newY = player[1]+y;
        const [ pX, pY ] = player;
        const [ tp1X, tp1Y ] = tps[0];
        const [ tp2X, tp2Y ] = tps[1];

        if(auxiliar[tp1X][tp1Y] == 'T' && auxiliar[tp2X][tp2Y] == 'T')
        {
            setResidual( { active: true, symbol: 'T' } );
    
            switch(other)
            {
                case box:
                {
                    auxiliar[pX][pY] = '';
                    auxiliar[newX][newY] = symbol;
                    setPlayer( [ newX, newY, symbol ] );
                    if( tp1X==newX+x && tp1Y==newY+y )
                    {
                        auxiliar[tp2X][tp2Y] = box;
                    }
                    else
                    {
                        auxiliar[tp1X][tp1Y] = box;
                    }
                    setMapa(auxiliar);
                    break;
                }
                case '':
                {
                    if( tp1X==newX && tp1Y==newY )
                    {
                        auxiliar[pX][pY] = '';
                        auxiliar[tp2X][tp2Y] = symbol;
                        setPlayer( [ tp2X, tp2Y, symbol ] );
                        setMapa(auxiliar);
                    }
                    else
                    {
                        auxiliar[pX][pY] = '';
                        auxiliar[tp1X][tp1Y] = symbol;
                        setPlayer( [ tp1X, tp1Y, symbol ] );
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

    const pushBox = ( x: number, y: number, symbol: string ) =>
    {
        const newX = player[0]+x;
        const newY = player[1]+y;
        const nextX = newX + x;
        const nextY = newY + y;

        const tileAfterBox = checkCollision( nextX, nextY );

        switch(tileAfterBox)
        {
            case 'empty':
            {
                const [pX, pY] = player;
                const auxiliar = mapa.map(fila => [...fila]);
                auxiliar[pX][pY] = '';
                auxiliar[newX][newY] = symbol;
                auxiliar[nextX][nextY] = box;
                setPlayer( [ newX, newY, symbol ] );
                setMapa( auxiliar );
                break;
            }
            case 'teleport':
            {
                handleTp(x, y, symbol, box);
                break;
            }
            default:
                inconsecuente( symbol );
                break;
        }
    }

    const movePlayer = ( x: number, y: number, symbol: string ) =>
    {
        const newX = player[0]+x;
        const newY = player[1]+y;
        const [ pX, pY ] = player;
        const tile = checkCollision(newX, newY);
        isAtSpecialTile(pX, pY);

        switch(tile)
        {
            case 'empty':
                {
                    const auxiliar = mapa.map(fila => [...fila]);
                    const [ pX, pY ] = player;
                    if(residual.active && isAtSpecialTile(pX, pY) )
                    {
                        auxiliar[pX][pY] = residual.symbol;
                        setResidual( { active: false, symbol: '' } );
                    }
                    else
                    {
                        auxiliar[pX][pY] = '';
                    }
                    auxiliar[newX][newY] = symbol;
                    setPlayer( [ newX, newY, symbol ] );
                    setMapa(auxiliar);
                    break;
                }
            case 'box':
                {
                    pushBox(x, y, symbol);
                    break;
                }
            case 'teleport':
                {
                    handleTp(x, y, symbol, '');
                    break;
                }
            case 'wall':
            case 'water':
            case 'oob':
                {
                    inconsecuente( symbol );
                    break;
                }
        }
    }

    const handleMovement = (event: React.KeyboardEvent) =>
    {
        if(game)
        {
            findPlayer();

            switch(event.key)
            {
                case 'W':
                case 'w':
                movePlayer(-1,0,ship_up);
                break;
                case 'A':
                case 'a':
                movePlayer(0,-1,ship_left);
                break;
                case 'S':
                case 's':
                movePlayer(+1,0,ship_down);
                break;
                case 'D':
                case 'd':
                movePlayer(0,+1,ship_right);
                break;
                default:
                    break;
            }
        }
    }

    const loadGame = () =>
    {
        const auxiliar = Array.from( {length: 18}, ()=> Array.from( Array(18), ()=> '') );  //Vacía el mapa
        for(let i=0; i<18; i++)
        {
            auxiliar[i][0] = 'x';
            auxiliar[0][i] = 'x';
        }
        auxiliar[3][3] = 'B';
        auxiliar[2][16] = 'T';
        auxiliar[16][2] = 'T';
        setTps( [ [2,16], [16,2] ] );
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = ship_up;    //Agrega el jugador al centro
        setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), ship_up ] );
        setMapa(auxiliar);
    }

    const startGame = () =>
    {
        loadGame();
        setGame(true);
        setTimeout(() => gridRef.current?.focus(), 0);
    }

    const stopGame = () =>
    {
        findPlayer();
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[player[0]][player[1]] = '';
        setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), ship_up ] );
        setMapa(auxiliar);
        setGame(false);
    }

  return(
    <div>
        <div className='general'>
            <div className='columna' onKeyDown={handleMovement} ref={gridRef} tabIndex={0}>

                {mapa.map( ( fila, x ) =>
                <div key={x} className='fila'>
                    { fila.map( ( celda, y ) => { return( <label key={y} className='celda'> {celda} </label> ) } ) }
                </div> )}

            </div>
        </div>
        {!game && <button onClick={startGame}> START </button>}
        {game && <button onClick={stopGame}> STOP </button>}
    </div>
  );
}

export default App;