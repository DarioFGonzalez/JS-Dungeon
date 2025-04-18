import { useState } from 'react';
import './App.css';

const ship_up = '^';
const ship_down = 'v';
const ship_left = '<';
const ship_right = '>';
const asteroid = 'e';

const App = () =>
{
  const [ mapa, setMapa ] = useState( Array.from( {length: 18}, ()=> Array.from( Array(18), ()=>'' ) ) );
  const [ dead, setDead ] = useState( false );
  const [ player, setPlayer ] = useState( [ 0, 0, '^' ] );

  const handleMovement = (event: React.KeyboardEvent) =>
  {
      if(!dead)
      {
          let here = [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2) ];
          let symbol = ship_up;
          mapa.forEach( (fila, y) => fila.map( (celda, z) =>
          {
              if(celda==ship_down || celda==ship_up || celda==ship_left || celda==ship_right ) { here=[ y, z ]; symbol=celda; }
          } ));
          setPlayer( [ here[0], here[1], symbol ] );
          let auxiliar = [ ...mapa ];
  
          switch(event.key)
          {
              case 'W':
              case 'w':
                  if(event.shiftKey)
                  {
                      let aux = [ ...mapa ];
                      aux[here[0]][here[1]]=ship_up;
                      setPlayer( [ here[0], here[1], ship_up ] );
                      setMapa(aux);
                  }
                  else
                  {
                      if(here[0]-1>=0 && mapa[here[0]-1][here[1]]=='')
                      {
                          let aux = mapa;
                          aux[here[0]][here[1]]='';
                          aux[here[0]-1][here[1]]=ship_up;
                          setPlayer( [ here[0]-1, here[1], ship_up ] );
                          setMapa(aux);
                      }
                      else
                      {
                          if(here[0]-1>=0 && mapa[here[0]-1][here[1]]==asteroid)
                          {
                              auxiliar[here[0]][here[1]] = '';
                              auxiliar[here[0]-1][here[1]] = '💥';
                              // death();
                              // setScore( Number(score) - 20 );
                              auxiliar[ Math.floor(mapa.length/2) ][ Math.floor(mapa[0].length/2) ] = 'v';
                              setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), 'v' ] );
                              setMapa(auxiliar);
                              boomAnimation(here[0]-1, 1, 0, here[1], 1);
                          }
                          else
                          {
                              let aux = mapa;
                              aux[here[0]][here[1]]=ship_up;
                              setPlayer( [ here[0], here[1], ship_up ] );
                              setMapa(aux);
                          }
                      }
                  }
                  break;
              case 'A':
              case 'a':
                  if(event.shiftKey)
                  {
                      let aux = mapa;
                      aux[here[0]][here[1]]=ship_left;
                      setPlayer( [ here[0], here[1], ship_left ] );
                      setMapa(aux);
                  }
                  else
                  {
                      if(here[1]-1>=0 && mapa[here[0]][here[1]-1]=='')
                      {
                          let aux = mapa;
                          aux[here[0]][here[1]]='';
                          aux[here[0]][here[1]-1]=ship_left;
                          setPlayer( [ here[0], here[1]-1, ship_left ] );
                          setMapa(aux);
                      }
                      else
                      {
                          if(here[1]-1>=0 && mapa[here[0]][here[1]-1]==asteroid)
                          {
                              auxiliar[here[0]][here[1]] = '';
                              auxiliar[here[0]][here[1]-1] = '💥';
                              // death();
                              // setScore( Number(score) - 20 );
                              auxiliar[ Math.floor(mapa.length/2) ][ Math.floor(mapa[0].length/2) ] = ship_down;
                              setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), ship_down ] );
                              setMapa(auxiliar);
                              boomAnimation(here[0], 1, 0, here[1]-1, 1);
                          }
                          else
                          {
                              let aux = mapa;
                              aux[here[0]][here[1]]=ship_left;
                              setPlayer( [ here[0], here[1], ship_left ] );
                              setMapa(aux);
                          }
                      }
                  }
                  break;
              case 'S':
              case 's':
                  if(event.shiftKey)
                  {
                      let aux = mapa;
                      aux[here[0]][here[1]]=ship_down;
                      setPlayer( [ here[0], here[1], ship_down ] );
                      setMapa(aux);
                  }
                  else
                  {
                      if(here[0]+1<mapa.length && mapa[here[0]+1][here[1]]=='')
                      {
                          let aux = mapa;
                          aux[here[0]][here[1]]='';
                          aux[here[0]+1][here[1]]=ship_down;
                          setPlayer( [ here[0]+1, here[1], ship_down ] );
                          setMapa(aux);
                      }
                      else
                      {
                          if(here[0]+1<mapa.length && mapa[here[0]+1][here[1]]==asteroid)
                          {
                              auxiliar[here[0]][here[1]] = '';
                              auxiliar[here[0]+1][here[1]] = '💥';
                              // death();
                              // setScore( Number(score) - 20 );
                              auxiliar[ Math.floor(mapa.length/2) ][ Math.floor(mapa[0].length/2) ] = ship_down;
                              setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), ship_down ] );
                              setMapa(auxiliar);
                              boomAnimation(here[0]+1, 1, 0, here[1], 1);
                          }
                          else
                          {
                              auxiliar[here[0]][here[1]]=ship_down;
                              setPlayer( [ here[0], here[1], ship_down ] );
                              setMapa(auxiliar);
                          }
                      }
                  }
                  break;
              case 'D':
              case 'd':
                  if(event.shiftKey)
                  {
                      let aux = mapa;
                      aux[here[0]][here[1]]=ship_right;
                      setPlayer( [ here[0], here[1], ship_right ] );
                      setMapa(aux);
                  }
                  else
                  {
                      if(here[1]+1<mapa[0].length && mapa[here[0]][here[1]+1]=='')
                      {
                          let aux = mapa;
                          aux[here[0]][here[1]]='';
                          aux[here[0]][here[1]+1]=ship_right;
                          setPlayer( [ here[0], here[1]+1, ship_right ] );
                          setMapa(aux);
                      }
                      else
                      {
                          if(here[1]+1<mapa[0].length && mapa[here[0]][here[1]+1]==asteroid)
                          {
                              auxiliar[here[0]][here[1]] = '';
                              auxiliar[here[0]][here[1]+1] = '💥';
                              // death();
                              // setScore( Number(score) - 20 );
                              auxiliar[ Math.floor(mapa.length/2) ][ Math.floor(mapa[0].length/2) ] = ship_down;
                              setPlayer( [ Math.floor(mapa.length/2), Math.floor(mapa[0].length/2), ship_down ] );
                              setMapa(auxiliar);
                              boomAnimation(here[0], 1, 0, here[1]+1, 1);
                          }
                          else
                          {
                              auxiliar[here[0]][here[1]]=ship_right;
                              setPlayer( [ here[0], here[1], ship_right ] );
                              setMapa(auxiliar);
                          }
                      }
                  }
                  break;
              default:
                  break;
          }
      }
  }

  const boomAnimation = ( bulletAt0: number, c: number, movimiento: any, bulletAt1: number , interaction: number) =>
    {
        let aux = [ ...mapa ];
        setTimeout( () =>
        {
            if(interaction == 1)
            {
                let objective = aux[Number(bulletAt0) + ( c * Number(movimiento) ) ][Number(bulletAt1)];
                if( !(objective=='<' || objective=='>' || objective=='^' || objective=='v') )
                {
                    aux[Number(bulletAt0) + ( c * Number(movimiento) ) ][Number(bulletAt1)] = '';
                }
            }
            if(interaction == 2)
            {
                let objective = aux[Number(bulletAt0)][Number(bulletAt1) + ( c * Number(movimiento) ) ];
                if( !(objective=='<' || objective=='>' || objective=='^' || objective=='v') )
                {
                    aux[Number(bulletAt0)][Number(bulletAt1) + ( c * Number(movimiento) ) ] = '';
                }
            }
            setMapa(aux);
        }, 100);
    }

  return(
    <div>
        <div className='general'>
            <div className='columna' onKeyDown={handleMovement} tabIndex={0}>

                {mapa.map( ( fila, x ) =>
                <div key={x} className='fila'>
                    {fila.map( ( celda, y ) =>
                    {
                        let x = false;
                        let estilo = 'celda';
                        if(celda=='v' || celda=='>' || celda=='<' || celda=='^' || celda=='e')
                        {
                            x = true;
                        }

                        if(dead && x && celda!='e')
                        {
                            estilo = 'titilar';
                        }

                        return(
                            <>
                                { x && <img src={celda} key={y} className={estilo} /> }
                                { !x && <label key={y} className='celda' >
                                            {celda}
                                        </label>}
                            </>
                        )
                    } )}
                </div> )}

            </div>
        </div>
        {/* {startId==0 && <button onClick={startGame}> START </button>}
        {startId!=0 && <button onClick={stopGame}> STOP </button>} */}
    </div>
  );
}

export default App;
