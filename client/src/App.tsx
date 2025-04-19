import { useState } from 'react';
import './App.css';

const ship_up = '^';
const ship_down = 'v';
const ship_left = '<';
const ship_right = '>';
const asteroid = 'e';

type playerData = [ number, number, string ];

const App = () =>
{
    const [ game, setGame ] = useState<boolean>(false);
    const [ mapa, setMapa ] = useState( Array.from( {length: 18}, ()=> Array.from( Array(18), ()=> '') ) );

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

    const movePlayer = ( x: number, y: number, symbol: string ) =>
    {
        const newX = player[0]+x;
        const newY = player[1]+y;
        if( newX>=0 && newX < mapa.length && newY>=0 && newY < mapa[0].length ) //Dentro del mapa
        {
            const auxiliar = mapa.map(fila => [...fila]);
            const [ pX, pY ] = player;
            if(mapa[newX][newY] == '')  //Hacia 'VACÍO'.
            {
                auxiliar[pX][pY] = '';
                auxiliar[newX][newY] = symbol;
                setPlayer( [ newX, newY, symbol ] );
                setMapa(auxiliar);
            }
            else    //Ninguna de las anteriores. "No caminable".
            {
                auxiliar[pX][pY] = symbol;
                setPlayer( [ pX, pY, symbol ] );
                setMapa(auxiliar);
            }
        }
        else
        {
            const auxiliar = mapa.map(fila => [...fila]);
            const [ pX, pY ] = player;
            auxiliar[pX][pY] = symbol;
            setPlayer( [ pX, pY, symbol ] );
            setMapa(auxiliar);
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
        // for(let i=0; i<18; i++)
        // {
        //     auxiliar[i][0]='x';
        // }
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = ship_up;    //Agrega el jugador al centro
        setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), ship_up ] );
        setMapa(auxiliar);
    }

    const startGame = () =>
    {
        loadGame();
        setGame(true);
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
            <div className='columna' onKeyDown={handleMovement} tabIndex={0}>

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