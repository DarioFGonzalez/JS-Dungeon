import { useEffect, useRef, useState } from 'react';
import * as Types from './components/types/global';

import * as icons from './Icons/index';

import * as Entities from './components/data/entities';
import * as Gear from './components/data/gear';
import * as Items from './components/data/items';
import * as Tiles from './components/data/tiles';
import { allNodes, allObjects, allTiles, copperNodes, rockyWalls, silverNodes } from './components/data/tiles';

import './App.css';

import ConsoleTab from './components/ConsoleTab/ConsoleTab';
import ConsumablesTab from './components/ConsumablesTab/ConsumablesTab';
import GearTab from './components/GearTab/GearTab';
import InventoryTab from './components/InventoryTab/InventoryTab';

const allIcons = Object.values(icons);

const mapSize = 18;

const emptyTile = { type: 'Tile', name: 'Void', symbol: '' };

const emptyGrid = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> emptyTile ) );

const emptyVisualGrid = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> '' ) );

type CellContent = Types.Player | Types.Enemy | Types.Trap | Types.Item | Types.Gear | Types.Environment | Types.Node;

// const emptyDelayedLog = { status: false, message: '', color: 'white' };

const App = () =>
{
    const isDev = process.env.NODE_ENV !== 'production';

    const gridRef = useRef<HTMLDivElement>(null);
    const lan = 'es';
    // const [ lan, setLan ] = useState<'es'|'en'>( 'es' );
    const [ game, setGame ] = useState<boolean>(false);
    const [ allowed, setAllowed ] = useState<boolean>(true);
    const stun:boolean = false;
    // const [ stun, setStun ] = useState<boolean>(false);
    // const [ patrolsId, setPatrolsId ] = useState<NodeJS.Timer>();

    const [ mapa, setMapa ] = useState<CellContent[][]>( emptyGrid );

    interface listOfMaps { name: string, visitedMap?: CellContent[][], load:() => void, actual: boolean, visited: boolean };
    const [ maps, setMaps ] = useState<listOfMaps[]>([]);

    const mapaRef = useRef( mapa );
    const [ showSlides, setShowSlides ] = useState<boolean>( false );
    const [ slideIndex, setSlideIndex ] = useState<number> ( 0 );
    // const currentSlide = Types.slides[slideIndex];
    const [ visuals, setVisuals ] = useState<Types.VisualCell[][]>( emptyVisualGrid );
    
    const [ tps, setTps ] = useState<Types.ArrayOfCoords>([]);
    
    const [ residual, setResidual ] = useState<Types.Residual[]>( [] );

    const [ showInventory, setShowInventory ] = useState<boolean>( false );
    const [ events, setEvents ] = useState<Types.eventLog[]>( [] );
    const [ delayedLog, setDelayedLog ] = useState<Types.eventLog[]>( [] );

    const [ player, setPlayer ] = useState<Types.Player>( Entities.emptyPlayer );
    // const [ enemies, setEnemies ] = useState<Types.Enemy[]>( [] );
    // const [ traps, setTraps ] = useState<Types.Trap[]>( [] );

    const moveSlide = ( where: string ): void =>
    {
        if(where==='next')
        {
            setSlideIndex( prev => ( prev + 1 ) % Types.slides.length );
            return ;
        }
        setSlideIndex( prev => ( prev - 1 + Types.slides.length ) % Types.slides.length );
        return ;
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

    useEffect( () =>
    {
        mapaRef.current = mapa;
    }, [ mapa ] );

    useEffect( () =>
    {
        if(delayedLog.length===0) return;

        const [ actual, ...rest ] = delayedLog;
        handleEventLogs( actual.message, actual.color );
        const timeId = setTimeout( () => { setDelayedLog( rest ); }, 50 );

        return () => clearTimeout( timeId );
    }, [ delayedLog ] );    //Cola de eventos en log

    const findPlayer = (): void =>
    {
        let here = [ 0, 0 ];
        let symbol = '';
        let heroIcons = [icons.heroFront, icons.heroBack, icons.heroLeft, icons.heroRight];
        mapa.forEach( (fila, y) => fila.forEach( (celda, z) =>
        {
            if( heroIcons.includes(celda.symbol) ) { here=[ y, z ]; symbol=celda.symbol; }
        } ));
        setPlayer( prev => ({ ...prev, symbol, data: { x: here[0], y: here[1] } }) );
    };

    const inconsecuente = ( symbol: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        const {x, y} = player.data;
        auxiliar[x][y] = { ...player, symbol: symbol, data: { x, y } };
        setPlayer( prev => ({ ...prev, symbol, data: { x, y } }) );
        setMapa(auxiliar);
    };

    const moveHere = ( x: number, y: number, symbol: string, complete: boolean ): CellContent[][] =>
    {
        const auxiliar = mapa.map( fila => [...fila] );
        const  { x: pX, y: pY } = player.data;
        const thisResidual = residual.find( ({coords}) => coords[0]===pX && coords[1]===pY );
        if( thisResidual )
        {
            auxiliar[pX][pY] = thisResidual.entity;
            setResidual( prev => prev.filter( ({coords}) => coords[0]!==pX || coords[1]!==pY ) );
        }
        else
        {
            auxiliar[pX][pY] = emptyTile;
        }

        
        if(complete===true)
        {
            setPlayer( prev =>
                {
                    auxiliar[x][y] = { ...prev, symbol, data: { x, y } };
                    return { ...prev, symbol, data: { x, y } } 
                });
            setMapa(auxiliar);
        }
        return auxiliar
    };

    const findThisEnemy = ( id: string, map?: CellContent[][]): { x: number, y: number, entity: Types.Enemy } | undefined =>
    {
        const activeMap = map ?? mapaRef.current;
        for( let i=0; i<activeMap.length; i++ )
        {
            for( let j=0; j<activeMap[i].length; j++ )
            {
                const cell = activeMap[i][j];
                if( 'type' in cell &&  cell.type==='Enemy' && 'id' in cell && cell.id===id )  return { x: i, y: j, entity: cell as Types.Enemy };
            }
        }

        return undefined;
    }

    const handleTp = ( x: number, y: number, symbol: string, other: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        
        const { x: pX, y: pY } = player.data;
        const newX = pX+x;
        const newY = pY+y;
        const [ tp1X, tp1Y ] = tps[0];
        const [ tp2X, tp2Y ] = tps[1];

        if(auxiliar[tp1X][tp1Y].name === 'Teleport' && auxiliar[tp2X][tp2Y].name === 'Teleport' )
        {
            switch(other)
            {
                case icons.boxImg:
                {
                    auxiliar[pX][pY] = emptyTile;
                    auxiliar[newX][newY] = player;
                    setPlayer( prev => ({ ...prev, symbol, data: { x: newX, y: newY } }) );
                    if( tp1X===newX+x && tp1Y===newY+y )
                    {
                        setResidual( prev => [ ...prev, { entity: Tiles.teleport, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[tp2X][tp2Y] = Tiles.box;
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { entity: Tiles.teleport , coords: [ tp1X, tp1Y ] } ] );
                        auxiliar[tp1X][tp1Y] = Tiles.box;
                    }
                    setMapa(auxiliar);
                    break;
                }
                case '':
                {
                    if( tp1X===newX && tp1Y===newY )
                    {
                        setResidual( prev => [ ...prev, { entity: Tiles.teleport, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[pX][pY] = emptyTile;
                        auxiliar[tp2X][tp2Y] = player;
                        setPlayer( prev => ({ ...prev, symbol, data: { x: tp2X, y: tp2Y } }) );
                        setMapa(auxiliar);
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { entity: Tiles.teleport, coords: [ tp1X, tp1Y ] } ] );
                        auxiliar[pX][pY] = emptyTile;
                        auxiliar[tp1X][tp1Y] = player;
                        setPlayer( prev => ({ ...prev, symbol, data: { x: tp1X, y: tp1Y } }) );
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
        const newX = player.data.x+x;
        const newY = player.data.y+y;
        const nextX = newX + x;
        const nextY = newY + y;

        let auxiliar = mapa.map( fila => [ ...fila ] );

        const nextTile = auxiliar[nextX][nextY];

        switch( nextTile.name )
        {
            case 'Void':
            {
                auxiliar = moveHere( newX, newY, symbol, false );
                auxiliar[nextX][nextY] = Tiles.box;
                setPlayer( prev => ( { ...prev, symbol, data: { x: newX, y: newY } } ) );
                setMapa( auxiliar );
                break;
            }
            case 'Teleport':
            {
                handleTp(x, y, symbol, icons.boxImg);
                break;
            }
            default:
                inconsecuente( symbol );
                break;
        }
    };

    const manageBuffInstance =( instance: keyof Types.BuffInstances, thisInstance: Types.alimentIds | undefined, prev: Types.Player, action: 'add' | 'remove' | 'clean' | 'restart' ) : Types.Player =>
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
                return { ...prev, buffs:
                        { ...prev.buffs, flags: { ...prev.buffs.flags, [flag]: true }, instances:
                            { ...prev.buffs.instances, [instance]: [ ...prev.buffs.instances[instance], thisInstance ] } } };
            case 'remove':
                const updatedInstance = prev.buffs.instances[instance].filter( x =>
                    x.dmgId!==thisInstance?.dmgId && x.timerId!==thisInstance?.timerId );
                const isInstanceEmpty = updatedInstance.length === 0;
                return { ...prev, buffs:
                    { ...prev.buffs, flags: { ...prev.buffs.flags, [flag]: !isInstanceEmpty },
                    instances: { ...prev.buffs.instances, [instance]: updatedInstance } } };
            case 'clean':
                finishBuff(instance, prev);
                return { ...prev, buffs:
                    { ...prev.buffs, flags: { ...prev.buffs.flags, [flag]: false },
                    instances: { ...prev.buffs.instances, [instance]: [] } } };
            case 'restart':
                return { ...prev, buffs:
                    { ...prev.buffs, flags: { HoT: false }, instances:{ HotInstances: [] } } };
            default:
                return prev;
        }
    };

    const damageWeapon = ( enemyToughness: number, weapon: Types.InventoryGear ) =>
    {
        let flag = true;

        setPlayer( playerInfo =>
        {
            if(flag && isDev)
            {
                flag = false;
                return playerInfo;
            }
            const aux = { ...playerInfo };
            const equippedWeapon = aux.hotBar.Equippeable.find( w => w.id === weapon.id );
            if(!equippedWeapon) return aux;

            if( 'durability' in equippedWeapon && equippedWeapon.durability!==undefined && equippedWeapon.durability - enemyToughness <= 0 )
            {
                const newEquippeables = aux.hotBar.Equippeable.filter( wpn => wpn.id !== equippedWeapon.id );

                queueLog( `[🗡] ¡${equippedWeapon.item.name} se rompió! 💥`, 'orange');

                return { ...aux, hotBar: { ...playerInfo.hotBar, Equippeable: newEquippeables }  };
            }

            setTimeout( ()=> { setPlayer( all =>
            {
                const stillThere = all.hotBar.Equippeable.find( w => w.id === weapon.id );
                if(stillThere)
                {
                    return { ...all, hotBar: { ...all.hotBar, Equippeable: all.hotBar.Equippeable.map(
                        item => item.id === stillThere.id ? { ...stillThere, onCd: false } : item 
                    ) } };
                }
                return all;
            } ) }, equippedWeapon.item.attackStats?.cd )

            return { ...aux, hotBar: { ...aux.hotBar, Equippeable: aux.hotBar.Equippeable.map( w =>
                {
                    if(w.durability) return(w.id === weapon.id ? { ...w, durability: w.durability - enemyToughness, onCd: true } : w)
                        return w;
                } )}}
        } );
    }

    const strikeEnemy = ( x: number, y: number ): void =>
    {
        const thisWeapon = player.hotBar.Equippeable.find( item => item.item.slot==='weapon' && item.equiped ) || Gear.emptyHanded;

        if(thisWeapon.onCd) return ;

        const thisEnemy = mapa[x][y] as Types.Enemy;

        if(!thisEnemy) return ;

        const attk = thisWeapon.item.attackStats;
        if(!attk) return ;

        const damage = attk.dmg- thisEnemy.defense.Armor;

        damageEnemy( thisEnemy.id, damage>=0?damage:0, attk?.DoT, attk?.times, attk?.aliment );
        manageVisualAnimation( 'visual', x, y, icons.redClawHit, 200 );
        thisWeapon!==Gear.emptyHanded && damageWeapon( thisEnemy.defense.Toughness, thisWeapon );
    }

    const enemyDeath = ( id: string ): CellContent[][] =>
    {
        const aux = mapaRef.current.map( x => [ ...x ] );
        const thisMonster = findThisEnemy( id, aux );
        if(!thisMonster) return mapaRef.current;

        const { x, y, entity } = thisMonster;
        clearInterval( entity.patrolId );

        lan==='es'
        ? queueLog( `${thisMonster.entity.name} murió.`, 'crimson' )
        : queueLog( `${thisMonster.entity.name} died.`, 'crimson' );

        if(thisMonster.entity.drops.length>0)
        {
            const loot = thisMonster.entity.drops.filter( drop => rollDrop( drop.chance ) )
            .map( drop => ({ item: drop.item, quantity: drop.quantity }) );
            aux[x][y] = lootBag( loot );
            return aux;
        }

        aux[x][y]= emptyTile;
        return aux;
    }

    const lootBag = ( loot: {item: (Types.Gear | Types.Item | Types.Material ) , quantity: number}[] ) : Types.Environment =>
    {
        if(loot.length>0) return { id: crypto.randomUUID(), type: 'Object', name: 'Bag', symbol: icons.bagImg, content: loot  };
        return emptyTile;
    }

    const damageEnemy = ( id: string, dmg: number, dot: number = 0, times: number = 0, aliment: string = '' ): void =>
    {
        let tag = { aliment: '', color: 'khaki'};

        const thisMonsterData = findThisEnemy( id, mapa );
        if(!thisMonsterData) return ;

        const { entity } = thisMonsterData;
        const { x, y } = thisMonsterData;

        if(entity.hp-dmg <= 0)
        {
            setMapa( prev =>
            {
                const aux = prev.map( x => [ ...x ] );

                const thisMonster = findThisEnemy( id, aux );
                if(!thisMonster) return aux ;

                const { x: mobX, y: mobY, entity: mob } = thisMonster;
                clearInterval( mob.patrolId );

                lan==='es'
                ? queueLog( `${thisMonster.entity.name} murió.`, 'crimson' )
                : queueLog( `${thisMonster.entity.name} died.`, 'crimson' );

                if(thisMonster.entity.drops.length>0)
                {
                    const loot = thisMonster.entity.drops.filter( drop => rollDrop( drop.chance ) )
                    .map( drop => ({ item: drop.item, quantity: drop.quantity }) );
                    aux[mobX][mobY] = lootBag( loot );
                    return aux;
                }

                aux[mobX][mobY]= emptyTile;     
                return aux;
            } );
            return ;
        }
        else
        {
            if(dot!==0 && entity.defense.Immunity!==aliment)
            {
                const alimentVector =
                {
                    'poison': 'PoisonInstances',
                    'bleed': 'BleedInstances',
                    'burn': 'BurnInstances'
                } as const;
                
                // const alimentTag =
                // {
                //     'poison': { aliment: '[Envenenado]', color: 'lime' },
                //     'bleed': { aliment: '[Sangrando]', color: 'red' },
                //     'burn': { aliment: '[Quemándose]', color: 'orange' }
                // };

                type AlimentKey = keyof typeof alimentVector;
                 
                let dmgId = setInterval( () =>
                {
                    let flag = true;

                    setMapa( prev =>
                    {
                        if(flag && isDev)
                        {
                            flag = false;
                            return prev;
                        }

                        const aux = prev.map( fila => [ ...fila ] );
                        const dmgIntervalMonster = findThisEnemy( id, aux );
                        
                        if(!dmgIntervalMonster) return prev;
                        const { x, y, entity } = dmgIntervalMonster;
                        
                        manageVisualAnimation( 'damage', x, y, dot.toString(), 450 );

                        if( entity.hp - dot <= 0 || !game )
                        {
                            cleanse( 'all', id );
                            return enemyDeath( id );
                        }
                        
                        aux[x][y] = { ...entity, hp: entity.hp - dot };
                        
                        return aux;
                    } )
                }, 1000);
    
                let timerId = setTimeout( () =>
                {
                    setMapa( prev =>
                    {
                        const aux = prev.map( cell => [ ...cell ] );

                        const timeoutMonster = findThisEnemy( id, aux );
                        if(!timeoutMonster) return prev;

                        const { x, y, entity } = timeoutMonster;

                        if (aliment in alimentVector)
                        {
                            aux[x][y] = manageDotInstance(
                                alimentVector[aliment as AlimentKey], { dmgId, timerId }, entity, 'remove' );
                        }

                        return aux;
                        /*switch(aliment)   // LEGACY CODE, POR SI ACASO.
                        {
                            case 'poison':
                                {
                                    aux[x][y] = manageDotInstance("PoisonInstances", {dmgId, timerId}, entity, 'remove');
                                    break;
                                }
                            case 'bleed':
                                {
                                    aux[x][y] = manageDotInstance("BleedInstances", {dmgId, timerId}, entity, 'remove');
                                    break;
                                }
                            case 'burn':
                                {
                                    aux[x][y] = manageDotInstance("PoisonInstances", {dmgId, timerId}, entity, 'remove');
                                    break;
                                }
                            default:
                                break;
                        }*/
                    } );

                    clearInterval( dmgId );
                }, times*1000);

                if (aliment in alimentVector)
                {
                    setMapa( prev =>
                    {
                        const aux = prev.map( cell => [ ...cell ] );
                        aux[x][y] = manageDotInstance(
                            alimentVector[aliment as AlimentKey], { dmgId, timerId }, entity, 'add' );
                        
                        // const tag = alimentTag[aliment as AlimentKey];
                        return aux;
                    } );
                }

            };

            setMapa( prev =>
            {
                const aux = prev.map( x => [ ...x ] );

                aux[x][y] = { ...entity, hp: entity.hp - dmg };
                return aux;
            } );

            lan==='es'
            ? queueLog(`Golpeaste a ${entity.name} por ${dmg} de daño. [${entity.hp - dmg}/${entity.maxHp}]. ${tag.aliment}`, tag.color)
            : queueLog(`You HIT ${entity.name} by ${dmg} damage. [${entity.hp- dmg}/${entity.maxHp}]`, 'khaki');

        }
    }

    const damageCharm = ( charm: Types.InventoryGear, dmg: number ) =>
    {
        const residualDmg = dmg - (charm.durability || 0);
        const newCharm = { ...charm, durability: residualDmg<0?residualDmg*(-1):0 };
        return { newCharm, residualDmg: residualDmg>0?residualDmg:0 }
    }

    const hurtPlayer = ( dmg: number, dot: number, times: number, aliment: string ): void =>
    {
        let flag = true;

        setPlayer( prev =>
        {
            if(flag && isDev)
            {
                flag = false;
                return prev;
            }

            let activeCharm = prev.hotBar.Equippeable.find( item => item.equiped && item.item.slot==='charm' );
            if(activeCharm)
            {
                const { newCharm, residualDmg } = damageCharm( activeCharm, dmg );
                queueLog(`${activeCharm.item.name} se activó, daño recibido: ${residualDmg}.`, 'white');
                if(prev.hp-residualDmg<=0)
                {
                    stopGame();
                    return { ...prev, hp: 0 };
                }
                let newEquippeables = prev.hotBar.Equippeable;
                if(newCharm.durability>0)
                {
                    newEquippeables = prev.hotBar.Equippeable.map( gear => gear.id===newCharm?.id ? newCharm : gear );
                }
                else
                {
                    queueLog(`[📿] ¡${activeCharm.item.name} se rompió! 💥`, 'white');
                    newEquippeables =  prev.hotBar.Equippeable.filter( gear => gear.id!==newCharm?.id );
                }

                return { ...prev, hotBar: { ...prev.hotBar, Equippeable: newEquippeables }, hp: prev.hp - residualDmg };
            }
            if(prev.hp-dmg<=0)
            {
                stopGame();
                return { ...prev, hp: 0 };
            }
            
            return { ...prev, hp: prev.hp - dmg };
        });

        let estado = '';
        let color = '';

        if(dot!==0)
        {
            let flag=true;
            switch(aliment)
            {
                case 'poison':
                    {
                        setPlayer( prev =>
                            {
                                if(flag && isDev)
                                {
                                    flag = false;
                                    return prev;
                                }
                                let aux = {...prev};
                                estado = "veneno";
                                color = 'lime';
                                queueLog('[ENVENENADO]', 'lime');

                                return manageDotInstance("PoisonInstances", {dmgId, timerId}, aux, 'add')
                            });
                        break;
                    }
                case 'bleed':
                    {
                        setPlayer( prev =>
                        {
                            if(flag && isDev)
                            {
                                flag=false;
                                return prev;
                            }
                            const aux = {...prev };
                            estado = 'sangrado';
                            color = 'red';
                            queueLog('[SANGRANDO]', 'red');
                            
                            return manageDotInstance("BleedInstances", {dmgId, timerId}, aux, 'add')
                        } );
                        break;
                    }
                case 'burn':
                    {
                        setPlayer( prev =>
                        {
                            if(flag && isDev)
                            {
                                flag=false;
                                return prev;
                            }
                            const aux = {...prev};
                            estado = 'quemadura';
                            color = 'orange';
                            queueLog('[EN LLAMAS]', 'orange');
                            
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
                setPlayer( prevData =>
                {
                    if(flag && isDev)
                    {
                        flag = false;
                        return prevData;
                    }

                    const aux = { ...prevData };

                    queueLog(`Daño por ${estado}: ${dot}`, color);
                    if( aux.hp - dot <= 0 )
                    {
                        stopGame();

                        return {...aux, hp: 0 };
                    }

                    return {...aux, hp: aux.hp - dot };
                } );
            }, 1000);

            let timerId = setTimeout( () =>
            {
                let flag = true;
                switch(aliment)
                {
                    case 'poison':
                        {
                            setPlayer( prev =>
                                {
                                    if(flag && isDev)
                                    {
                                        flag = false;
                                        return prev;
                                    }
                                    const aux = { ...prev };
                                    return manageDotInstance("PoisonInstances", {dmgId, timerId}, aux, 'remove')
                                } );
                            break;
                        }
                    case 'bleed':
                        {
                            setPlayer( prev =>
                                {
                                    if(flag && isDev)
                                    {
                                        flag=false;
                                        return prev;
                                    }
                                    const aux = { ...prev };
                                    return manageDotInstance("BleedInstances", {dmgId, timerId}, aux, 'remove')
                                } );
                            break;
                        }
                    case 'burn':
                        {
                            setPlayer( prev =>
                                {
                                    if(flag && isDev)
                                    {
                                        flag=false;
                                        return prev;
                                    }
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

        };

        return ;
    };
    
    const touchEnemy = ( symbol: string, thisEnemy: Types.Enemy ): void =>
    {
        const { attack } = thisEnemy;
        queueLog( `${thisEnemy.name} te golpeó por ${attack.Instant} de daño.`, 'red');
        hurtPlayer( attack.Instant, attack.DoT, attack.Times, attack.Aliment );
        inconsecuente(symbol);
    };

    const stepOnTrap = ( x: number, y: number, symbol: string ): void =>
    {
        const thisTrap = mapaRef.current[x][y];
        // const thisTrap = traps.find( trap => trap.data.x===x && trap.data.y===y ) || Entities.trap ;

        setResidual( prev => [ ...prev, { entity: thisTrap, coords: [ x, y ] } ] );
        moveHere( x, y, symbol, true );

        if( 'attack' in thisTrap)
        {
            const {attack} = thisTrap;
            queueLog(`${thisTrap.name} te causó ${attack.Instant} de daño.`, 'crimson');
    
            hurtPlayer( attack.Instant, attack.DoT, attack.Times, attack.Aliment );
        }
    };

    const walkOntoFire = ( x: number, y: number, symbol: string, newX: number, newY: number ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        auxiliar[newX-x][newY-y] = emptyTile;
        auxiliar[newX][newY] = player
        setMapa(auxiliar);
        setPlayer( playerInfo =>
            {
                manageVisualAnimation( 'visual', playerInfo.data.x, playerInfo.data.y, '🔥', 100 );
                return playerInfo;
            });
        hurtPlayer(1, 1, 8, 'burn');
        setTimeout( ()=>
        {
            const auxiliar = mapa.map(fila => [...fila]);
            auxiliar[newX][newY] = Tiles.fire;
            if(player.hp<=0)
            {
                return ; // ¿Nada? ¿No debería ir un Death();?
            }
            auxiliar[newX-x][newY-y] = player;
            setMapa(auxiliar);
            setPlayer( prev => ( { ...prev, symbol, data: { x: newX-x, y: newY-y } } ) );
        }, 45);
    };

    const stepOnItem = (  tile: Types.Item, quantity: number, x?: number, y?: number, symbol?: string, lootBag?: boolean ): void =>
    {
        if( player.inventory.length >= 20 )
        {
            if(!lootBag && x!==undefined && y!==undefined && symbol)
            {
                setResidual( prev => [ ...prev, { entity: tile, coords: [ x, y ] } ] );
                moveHere( x, y, symbol, true );
            };
            return ;
        }
        if(!lootBag && x!==undefined && y!==undefined && symbol!== undefined) moveHere( x, y, symbol, true );

        addToInventory( tile, quantity, lootBag?lootBag:false );
    }

    const stepOnGear = ( tile: Types.Gear, x?: number, y?: number, symbol?: string, lootBag?: boolean, quantity?: number ): void =>
    {
        if( player.hotBar.Equippeable.length >= 6 )
        {
            if(!lootBag && x !== undefined && y !== undefined && symbol !== undefined )
            {
                setResidual( prev => [ ...prev, { entity: tile, coords: [ x, y ] } ] );
                moveHere( x, y, symbol, true );
            }
            return ;
        }
        if(!lootBag && x!==undefined && y!==undefined && symbol!==undefined)
        {
            moveHere( x, y, symbol, true );
        }

        if( quantity )
        {
            addToEquippeable( tile, lootBag?lootBag:false, quantity );
            return ;
        }        
        addToEquippeable( tile, lootBag?lootBag:false );
    }

    const turnToInventoryGear = ( gear: Types.Gear ): Types.InventoryGear =>
    {
        return { item: gear, id: crypto.randomUUID(), durability: gear.durability, onCd: false, equiped: false, selected: false };
    }

    const turnToInventoryMaterial = ( material: Types.Gear, quantity: number ): Types.InventoryGear =>
    {
        return { item: material, id: crypto.randomUUID(), quantity, selected: false };
    }

    const addToEquippeable = ( gear: Types.Gear, lootBag: boolean, quantity?: number ): void =>
    {
        if(!lootBag) queueLog(`${gear.name} agregado a la mochila.`, 'orange');

        let item: any;

        
        if( 'durability' in gear )
        {
            if( player.hotBar.Equippeable.length>=5 ) return ;
            item = turnToInventoryGear(gear);
        }
        else
        {
            const ownedMaterial = player.hotBar.Equippeable.find( x => x.item.name === gear.name );

            if( !ownedMaterial && player.hotBar.Equippeable.length>=5 ) return ;

            if( quantity )
            {
                if( ownedMaterial && ownedMaterial.quantity )
                {
                    item = { ...ownedMaterial, quantity: ownedMaterial.quantity + quantity };
                    
                    setPlayer( playerInfo => ( { ...playerInfo, hotBar: { ...playerInfo.hotBar,
                    Equippeable: playerInfo.hotBar.Equippeable.map( x => x.id === item.id ? item : x ) } } ) );
                    
                    return ;
                }
                else
                {
                    item = turnToInventoryMaterial(gear, quantity);
                }
            }
        }

        setPlayer( playerInfo => ( { ...playerInfo, hotBar: { ...playerInfo.hotBar,
        Equippeable: [ ...playerInfo.hotBar.Equippeable, item ] } } ) );
        
        return ;
    }

    const addToInventory = ( item: Types.Item, quantity: number, lootBag?: boolean ): void =>
    {
        const thisItem = player.inventory.find( x => x.item.name === item.name )
        if(!lootBag) queueLog(`Recogiste ${quantity} ${item.name}.`, 'lime');
        if(!thisItem)
        {
            setPlayer( prev => ( { ...prev, inventory: [ ...prev.inventory, { item: item, quantity: quantity, onCd: false, selected: false } ] } ) );
        }
        else
        {
            setPlayer( prev => ( { ...prev, inventory: prev.inventory.map( object =>
            {
                return object.item.name===item.name
                ? { ...object, quantity: object.quantity + quantity } : object
            }
            ) } ) );
        }
    }

    const consumeItem = (): void =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            if(flag && isDev)
            {
                flag=false;
                return playerInfo;
            }

            const aux = { ...playerInfo };
            const thisItem = aux.inventory.find( x => x.selected ) as Types.InventoryItem;

            if( !thisItem || thisItem.onCd ) return aux;
            queueLog(`Usas ${thisItem.item.name}`, 'lime');

            switch(thisItem.item.name)
            {
                case 'Potion':
                {
                    heal(3, 0, 0);
                    manageVisualAnimation( 'visual', aux.data.x, aux.data.y, icons.healing, 500 );
                    break;
                }
                case 'Bandages':
                {
                    if(aux.aliments.flags.Bleeding)
                    {
                        queueLog(`[Frenas el sangrado]`, 'lime');
                        cleanse('bleed');
                    }
                    manageVisualAnimation( 'visual', aux.data.x, aux.data.y, icons.bandagesImg, 500 );
                    break;
                }
                case 'Aloe leaf':
                {
                    if(aux.aliments.flags.Burning)
                    {
                        queueLog(`[Cortas la quemadura]`, 'lime');
                        cleanse('burn');
                    }
                    manageVisualAnimation( 'visual', aux.data.x, aux.data.y, icons.aloeImg, 500 );
                    break;
                }
            }

            if(thisItem.quantity - 1 > 0)
            {
                setTimeout( () =>
                {
                    setPlayer( prev => ( {...prev, inventory: prev.inventory.map( z => z.item.name === thisItem.item.name ? { ...z, onCd: false } : z ) } ) );
                }, thisItem.item.cd)

                return {...aux, inventory: aux.inventory.map( z =>
                    'quantity' in z && z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - 1, onCd: true } : z ) };
            }
            else
            {
                return {...aux, inventory: aux.inventory.filter( y => y.item.name!==thisItem.item.name ) };
            }
        } );
    }

    const touchFountain = ( symbol: string ): void =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            if(flag && isDev)
            {
                flag=false;
                return playerInfo;
            }
            const aux = { ...playerInfo};

            if(aux.aliments.flags.Burning)
            {
                queueLog( 'Tocar la fuente calma tus quemaduras' ,'turquoise' );
                cleanse('burn');
            }

            inconsecuente( symbol );

            return aux;
        } );
    }

    const checkLootBag = ( lootContent: Types.lootBagItem[] ): void =>
    {
        handleEventLogs(`------------------------`, 'orange' );
        lootContent.forEach( drop =>
        {
            handleEventLogs(`- ${drop.quantity} x ${drop.item.name}`, 'khaki' );
            if(drop.item.type==='Ore') stepOnGear( drop.item as Types.Gear, undefined, undefined, undefined, true, drop.quantity )
            if(drop.item.type==='Item') stepOnItem( drop.item as Types.Item, drop.quantity, undefined, undefined, undefined, true );
            if(drop.item.type==='Gear' || drop.item.type==='Tool') stepOnGear( drop.item as Types.Gear, undefined, undefined, undefined, true );
        } );
        handleEventLogs(`La bolsa contenía:`, 'orange')
    }
        
    const movePlayer = ( x: number, y: number, symbol: string ): void =>
    {
        const aux = mapaRef.current.map( fila => [ ...fila ] );

        const newX = player.data.x+x;
        const newY = player.data.y+y;

        const tile = aux[newX][newY];

        if(!stun)
        {
            switch(tile.name)
            {
                case 'Void':
                    {
                        moveHere( newX, newY, symbol, true );
                        break;
                    }
                case 'Bag':
                    {
                        if('content' in tile) checkLootBag(tile.content);
                        moveHere( newX, newY, symbol, true );
                        break;
                    }
                case 'Box':
                    {
                        pushBox( x, y, symbol );
                        break;
                    }
                case 'Teleport':
                    {
                        handleTp( x, y, symbol, '' );
                        break;
                    }
                case 'Fire':
                    {
                        walkOntoFire( x, y, symbol, newX, newY );
                        break;
                    }
                case 'Fountain':
                    {
                        touchFountain( symbol );
                        break;
                    }
                case 'Map teleport':
                    {
                        if('content' in tile)
                        {
                            swapMap(tile.content)
                        }
                        break;
                    }
                case 'Unknown':
                case 'Wall':
                case 'Water':
                case 'oob':
                    {
                        inconsecuente( symbol );
                        break;
                    }
            }

            switch(tile.type)
            {
                case 'Wall':
                case 'Node':
                    {
                        inconsecuente( symbol );
                        break;
                    }
                case 'Item':
                    {
                        stepOnItem( tile as Types.Item, 1, newX, newY, symbol );
                        break;
                    }
                case 'Gear':
                case 'Tool':
                    {
                        stepOnGear( tile as Types.Gear, newX, newY, symbol );
                        break;
                    }
                case 'Trap':
                    {
                        stepOnTrap( newX, newY, symbol );
                        break;
                    }
                case 'Enemy':
                    {
                        setPlayer( playerInfo =>
                        {
                            manageVisualAnimation( 'visual', playerInfo.data.x, playerInfo.data.y, icons.clawHit, 400 );
                            return playerInfo;
                        } );
                        touchEnemy( symbol, tile as Types.Enemy );
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

    const queueLog = ( message: string, color: string ): void =>
    {
        setDelayedLog( list => [ ...list, { message, color } ] );
    }

    // const playerVectors: Record<string, [number, number]> = //non
    // {
    //     ship_up: [-1, 0],
    //     ship_down: [1, 0],
    //     ship_left: [0, -1],
    //     ship_right: [0, 1]
    // }

    const navigateHotBarVectors: Record<string, number> =
    {
        'arrowup': -1,
        'arrowdown': 1,
        'delete': 0
    };

    const navigateConsumablesVectors: Record<string, number> =
    {
        'arrowleft': -1,
        'arrowright': 1,
        'backspace': 0
    };

    const directionFromVector = ( symbol: string ): [number, number] =>
    {
        switch( symbol )
        {
            case icons.heroBack:
                return [-1, 0];
            case icons.heroFront:
                return [1, 0];
            case icons.heroLeft:
                return [0, -1];
            case icons.heroRight:
                return [0, 1];
            default:
                return [0, 0];
        }
    }

    const manageVisualAnimation = ( type: string, x: number, y: number, icon: string, time: number ): void =>
    {
        setPlayer( playerInfo =>
        {
            setVisuals( visualsMap =>
            {
                const aux = [ ...visualsMap ];
                switch(type)
                {
                    case 'visual':
                        aux[x][y] = icon;
                        break;
                    case 'damage':
                        aux[x][y] = { color: 'crimson', text: icon };
                        break;
                    }
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

    const hitOre = ( x: number, y: number ): void =>
    {
        const thisTool = player.hotBar.Equippeable.find( item => item.item.type==='Tool' && item.equiped );
        if(!thisTool) return ;

        if(thisTool.onCd) return ;

        let aux = mapaRef.current.map( x => [...x] );
        
        const thisOre = aux[x][y] as Types.Node;

        if(!thisOre) return ;

        const attk = thisTool.item.attackStats;
        if(!attk) return ;

        const damage = attk.dmg;

        let sparks: Record<number, string> =
        {
            0: icons.sparks1,
            1: icons.sparks2,
            2: icons.sparks3 
        };
        const randomNumber = Math.floor( Math.random() * 3 );

        manageVisualAnimation( 'visual', x, y, sparks[randomNumber], 900 );

        if(thisOre.hp - damage <= 0)
        {
            const randomValue = Math.floor( Math.random() * 3 ) + 1;

            const availableTiles: Record<number, Types.Environment> =
            {
                1: Tiles.rockyWall1,
                2: Tiles.rockyWall2,
                3: Tiles.rockyWall3
            }

            const drops = thisOre.drops.filter( drop => rollDrop( drop.chance ) )
            .map( drop => ({ item: drop.item, quantity: drop.quantity }) );

            drops.forEach( x => stepOnGear( x.item as Types.Gear, undefined, undefined, undefined, true, x.quantity ) );

            aux[x][y] = availableTiles[randomValue];
        }
        else
        {
            aux[x][y] = { ...thisOre, hp: thisOre.hp - damage }
        }
        
        setMapa( aux );
        damageWeapon( thisOre.thoughness, thisTool );
    }

    const handleInteraction = ( ): void =>
    {
        const aux = mapa.map( fila => [ ...fila ] );
        const [dx, dy] = directionFromVector(player.symbol);
        let x = player.data.x + dx;
        let y = player.data.y + dy;

        const objective = aux[x][y];
        
        switch(objective.type)
        {
            case 'Enemy':
                {
                    strikeEnemy( x, y );
                    break;
                }
            case 'Node':
                {
                    hitOre( x, y );
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
            if(flag && isDev)
            {
                flag=false;
                return playerInfo;
            }

            const player = { ...playerInfo };
            const to = navigateHotBarVectors[key];

            if(to!==0)
            {
                const oldIndex = player.hotBar.Equippeable.findIndex( item => item.selected );

                if(oldIndex===-1)
                {
                    const aux = player.hotBar.Equippeable.map( ( x, y ) => y===0 ? {...x, selected: true } : x );
                    return { ...player, hotBar: { ...player.hotBar, Equippeable: aux } };
                }

                const max = player.hotBar.Equippeable.length - 1;
                const newIndex = oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;
                
                if(oldIndex===newIndex) return playerInfo;
    
                const aux = [ ...player.hotBar.Equippeable];
                aux[oldIndex] = { ...aux[oldIndex], selected: false };
                aux[newIndex] = { ...aux[newIndex], selected: true };

                return { ...player, hotBar: { ...player.hotBar, Equippeable: aux } };
            }

            return { ...player, hotBar: { ...player.hotBar, Equippeable: player.hotBar.Equippeable.filter( x => !x.selected ) } };
        } );
    }

    const navigateConsumables = ( key: string ): void =>
    {
        let flag = true;

        setPlayer( playerInfo =>
        {
            if(flag && isDev)
            {
                flag=false;
                return playerInfo;
            }

            const player = { ...playerInfo };
            const to = navigateConsumablesVectors[key];

            if(to!==0)
            {
                const oldIndex = player.inventory.findIndex( item => item.selected );

                if(oldIndex===-1)
                {
                    const aux = player.inventory.map( ( x, y ) => y===0 ? {...x, selected: true } : x );
                    return { ...player, inventory: aux };
                }

                const max = player.inventory.length - 1;
                const newIndex = oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;
                
                if(oldIndex===newIndex) return playerInfo;
    
                const aux = [ ...player.inventory ];
                aux[oldIndex] = { ...aux[oldIndex], selected: false };
                aux[newIndex] = { ...aux[newIndex], selected: true };

                return { ...player, inventory: aux };
            }

            return { ...player, inventory: player.inventory.filter( x => !x.selected ) };
        } );
    }

    const swapGear = (): void =>
    {
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const Equippeables = aux.hotBar.Equippeable;

            const selected = Equippeables.find( x => x.selected );
            if(!selected || selected.item.slot==='ore') return playerInfo;

            const toReplace = Equippeables.find( x => x.equiped && x.item.slot === selected.item.slot )

            if(!toReplace)
            {
                return { ...aux,
                    hotBar: { ...aux.hotBar, Equippeable:
                        Equippeables.map( x => x === selected ? { ...selected, equiped: true } : x ) } };
            }
            
            if(toReplace.id===selected.id)
            {
                return { ...aux,
                    hotBar: { ...aux.hotBar, Equippeable:
                        Equippeables.map( x => x.id === selected.id ? { ...selected, equiped: !selected.equiped } : x ) } };
            }

            return { ...aux,
                hotBar: { ...aux.hotBar, Equippeable:
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
                    case 'w': movePlayer(-1, 0, icons.heroBack); break;
                    case 'a': movePlayer(0, -1, icons.heroLeft); break;
                    case 's': movePlayer(1, 0, icons.heroFront); break;
                    case 'd': movePlayer(0, 1, icons.heroRight); break;
                }
                return;
            }

            switch(key)
            {
                case 'delete':
                case 'arrowup':
                case 'arrowdown':
                    navigateHotbar(key);
                break;
                case 'arrowleft':
                case 'arrowright':
                case 'backspace':
                    navigateConsumables(key);
                break;

                case 'q':   //renew (HoT)
                consumeItem();
                break;

                case 'i':   //abrir inventario
                setShowInventory(prev => !prev);
                break;

                case 'h':   //ayuda
                setShowSlides( prev => !prev );
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

    const patrolDirections: Record<string, number[][]> =    // Vector
    {
        'vertical': [ [-1, 0], [1, 0] ],
        'horizontal': [ [0, -1], [0, 1] ],
        'random': [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
    };

    const patrolMovement = ( x: number, y: number, entity: Types.Enemy, mapaState: CellContent[][] ): CellContent[][] =>
    {
        const direcciones = patrolDirections[entity.pattern];
        const direccion = direcciones[Math.floor(Math.random()*direcciones.length)];

        const newX = x + direccion[0];
        const newY = y + direccion[1];

        if( mapaState[newX][newY]===emptyTile )
        {
            mapaState[x][y] = emptyTile;
            mapaState[newX][newY] = entity;
        };

        if( mapaState[newX][newY].type === 'Player' )
        {
            hurtPlayer( entity.attack.Instant, entity.attack.DoT, entity.attack.Times, entity.attack.Aliment );
        };

        return mapaState;
    }

    const finishDoT = <T extends Types.WithAliments>( aliment: keyof Types.AlimentInstances, info: T, all?: boolean ): void =>
    {
        if(all)
        {
            for( const key in info.aliments.instances )
            {
                const instances = info.aliments.instances[key as keyof typeof info.aliments.instances];

                instances.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
            }
        }
        else
        {
            info.aliments.instances[aliment?aliment:'BleedInstances'].forEach( ids =>
            {
                clearInterval(ids.dmgId);
                clearTimeout(ids.timerId);
            } );
        }
    }

    const finishBuff = ( buff: keyof Types.BuffInstances, info: Types.Player, cleanse?: boolean ): void =>
    {
        if(cleanse)
        {
            for( const key in info.buffs.instances )
            {
                const instances = info.buffs.instances[key as keyof typeof info.buffs.instances];

                instances.forEach( ids =>
                {
                    clearInterval(ids.dmgId);
                    clearTimeout(ids.timerId);
                } );
            }
        }
        else
        {
            info.buffs.instances[buff].forEach( ids =>
            {
                clearInterval(ids.dmgId);
                clearTimeout(ids.timerId);
            } );
        }
    }

    const manageDotInstance = <T extends Types.WithAliments>( instance: keyof Types.AlimentInstances, newInstance: Types.alimentIds | undefined, prev: T, action: 'add' | 'remove' | 'clean' | 'restart' ) : T =>
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
                return { ...prev, aliments:
                        { ...prev.aliments, flags: { ...prev.aliments.flags, [flag]: true }, instances:
                            { ...prev.aliments.instances, [instance]: [ ...prev.aliments.instances[instance], newInstance ] } } };
            case 'remove':
                const updatedInstance = prev.aliments.instances[instance].filter( x =>
                    x.dmgId!==newInstance?.dmgId && x.timerId!==newInstance?.timerId );
                const isInstanceEmpty = updatedInstance.length === 0;
                return { ...prev, aliments:
                    { ...prev.aliments, flags: { ...prev.aliments.flags, [flag]: !isInstanceEmpty }, instances:
                        { ...prev.aliments.instances, [instance]: updatedInstance } } };
            case 'clean':
                return { ...prev, aliments:
                    { ...prev.aliments, flags: { ...prev.aliments.flags, [flag]: false }, instances:
                        { ...prev.aliments.instances, [instance]: [] } } };
            case 'restart':
                return { ...prev, aliments:
                    { ...prev.aliments, flags: { Poisoned: false, Burning: false, Bleeding: false }, instances:{ BurnInstances: [], BleedInstances: [], PoisonInstances: [] } } };
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
                    // setEnemies( prevEnemies =>
                    // {
                    //     const aux = [ ...prevEnemies];
                    //     return aux.map( mob =>
                    //     {
                    //         if( mob.id!==ID ) return mob;
                    //         finishDoT( 'BleedInstances',  mob );
                    //         return manageDotInstance( 'BleedInstances', undefined, mob, 'clean' );
                    //     } );
                    // } );
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
                    // setEnemies( prevEnemies =>
                    // {
                    //     const aux = [ ...prevEnemies];
                    //     return aux.map( mob =>
                    //     {
                    //         if( mob.id!==ID ) return mob;
                    //         finishDoT( 'PoisonInstances',  mob );
                    //         return manageDotInstance( 'PoisonInstances', undefined, mob, 'clean' );
                    //     } );
                    // } );
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
                    // setEnemies( prevEnemies =>
                    // {
                    //     const aux = [ ...prevEnemies];
                    //     return aux.map( mob =>
                    //     {
                    //         if( mob.id!==ID ) return mob;
                    //         finishDoT( 'BurnInstances',  mob );
                    //         return manageDotInstance( 'BurnInstances', undefined, mob, 'clean' );
                    //     } );
                    // } );
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
                    // setEnemies( prevEnemies =>
                    // {
                    //     const aux = [ ...prevEnemies];
                    //     return aux.map( mob =>
                    //     {
                    //         if( mob.id!==ID ) return mob;
                    //         finishDoT( 'BleedInstances',  mob, true );
                    //         return manageDotInstance( 'BleedInstances', undefined, mob, 'restart' );
                    //     } );
                    // } );
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
        queueLog(`+${healing} hp`, 'green');

        setPlayer( prev =>
            {
                manageVisualAnimation( 'healing', prev.data.x, prev.data.y, healing.toString(), 500 );
                return {...prev, hp: prev.hp + healing < player.maxHp ? prev.hp + healing : player.maxHp }
            } );

        if(HoT!==0)
        {
            let dmgId = setInterval( () =>
            {
                setPlayer( prev => ( { ...prev, hp: prev.hp+HoT > player.maxHp ? player.maxHp : prev.hp + HoT } ) );
                queueLog(`+${HoT} hp [regen]`, 'seagreen');
            }, 1000);

            let timerId = setTimeout( () =>
            {
                clearInterval(dmgId);
            }, times*1000)
            setPlayer( prev => manageBuffInstance( 'HotInstances', {dmgId, timerId}, prev, 'add' ) );
        };
    }

    const nodes: Record< string, Types.Node[] > =
    {
        'Copper': copperNodes,
        'Silver': silverNodes
    }

    const randomNode = (type: string): Types.Node =>
    {
        const randomIndex = Math.floor( Math.random() * nodes[type].length );

        return nodes[type][randomIndex];
    }

    const addNodes = (mapa: CellContent[][], minerals: Types.mineralsToAdd[]) : CellContent[][] =>
    {
        type Coords = { x: number, y: number };

        const wallCoords: Coords[] = [];

        for(let y=1; y<mapa.length - 1; y++)
        {
            for(let x=1; x<mapa[0].length - 1; x++)
            {
                if(mapa[y][x].type==='Wall')
                {
                    if(
                        mapa[y-1][x]===emptyTile || mapa[y+1][x]===emptyTile ||
                        mapa[y][x-1]===emptyTile || mapa[y][x+1]===emptyTile
                    )
                    {
                        wallCoords.push( {x, y} );
                    }
                }
            }
        };
        for(let i=0; i<minerals.length; i++)
        {
            for(let j=0; j<minerals[i].quantity; j++)
            {
                let randomIndex = Math.floor( Math.random() * wallCoords.length );
                const { x, y } = wallCoords.splice( randomIndex, 1 )[0];
                mapa[y][x] = randomNode(minerals[i].node);
            }
        }
        return mapa;
    };

    const walls: Record< string, Types.Environment[] > =
    {
        'Basic': [ Tiles.basicWalls ],
        'Rocky': rockyWalls
    };

    const addWall = (type: string): Types.Environment =>
    {
        let randomIndex = Math.floor( Math.random() * walls[type].length );
        
        return walls[type][randomIndex];
    }

    const loadMinesMap = (): void =>
    {
        let auxiliar: CellContent[][] = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> emptyTile ) );  //Vacía el mapa
        
        for(let i=0; i<mapSize; i++)        //Por columna
        {
            auxiliar[i][0] = Tiles.rockyWall2;
            auxiliar[0][i] = Tiles.rockyWall1;
            auxiliar[i][mapSize-1] = Tiles.rockyWall1;
            auxiliar[mapSize-1][i] = Tiles.rockyWall1;

            if(i%6===0 || i===0)
            {
                auxiliar[i][0] = Tiles.rockyWall3;
                auxiliar[0][i] = Tiles.rockyWall3;
                auxiliar[i][mapSize-1] = Tiles.rockyWall3;
                auxiliar[mapSize-1][i] = Tiles.rockyWall3;
            }

            for(let j=1;j<mapSize-1;j++)    //Por fila
            {
                if(i===1)
                {
                    if( !([3, 7, 11, 15].includes(j)) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===2)
                {
                    if( [1, 5, 9, 13].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===3)
                {
                    if( [11, 15].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===4)
                {
                    if( [4, 8, 9, 11, 12, 13, 15].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===5)
                {
                    if( [4, 8, 9, 13, 15].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===6)
                {
                    if( [1, 2, 3, 4, 5, 8, 12, 13, 15].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===7 || i===8)
                {
                    if( [1, 8, 11, 12, 13, 15].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===9)
                {
                    if( [1, 4, 5, 7, 8, 12, 13, 15].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===10)
                {
                    if( [1, 5, 7, 12, 13 ].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===11)
                {
                    if( [1, 4, 5, 7, 12, 13, 16].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===12)
                {
                    if( [1, 4, 5, 7, 12, 13, 15, 16].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===13)
                {
                    if( [1, 4, 5, 7, 8, 9, 10, 11, 12, 13].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===14)
                {
                    if( [5, 7, 12, 13].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===15)
                {
                    if( [12].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
                if(i===16)
                {
                    if( [5, 6, 7, 12, 13].includes(j) )
                    {
                        auxiliar[i][j] = addWall('Rocky');
                    }
                }
            }
        }

        auxiliar[1][11] = createEntity( 'Enemie', 'Hobgoblin' );
        auxiliar[3][14] = createEntity( 'Enemie', 'Hobgoblin' );
        auxiliar[5][1] = createEntity( 'Node', 'Copper' );
        auxiliar[6][15] = createEntity( 'Enemie', 'Miner Goblin' );
        auxiliar[9][15] = createEntity( 'Node', 'Copper' );
        auxiliar[10][1] = createEntity( 'Enemie', 'Goblin' );
        auxiliar[11][9] = createEntity( 'Enemie', 'Miner Goblin' );
        auxiliar[12][8] = createEntity( 'Node', 'Copper' );
        auxiliar[14][11] = createEntity( 'Node', 'Copper' );
        auxiliar[15][3] = player;
        auxiliar[15][5] = createEntity( 'Tool', 'Copper Pickaxe' );
        auxiliar[15][10] = createEntity( 'Enemie', 'Goblin' );
        auxiliar[15][13] = createEntity( 'Node', 'Silver' );

        auxiliar[15][2] = createEntity( 'Object', 'Map teleport', ['Caves'] );

        auxiliar = addNodes( auxiliar, [ {node: 'Copper', quantity: 2} ] );

        setPlayer( prev => (
        { ...prev, data: { x: 15, y: 3 } } ) );

        setMapa(auxiliar);
    }

    const loadCaveMap = ( first?: boolean ): void =>
    {
        const auxiliar: CellContent[][] = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> emptyTile ) );  //Vacía el mapa
        for(let i=0; i<mapSize; i++)        //Por columna
        {
            auxiliar[i][0] = Tiles.basicWalls;
            auxiliar[0][i] = Tiles.basicWalls;
            auxiliar[i][mapSize-1] = Tiles.basicWalls;
            auxiliar[mapSize-1][i] = Tiles.basicWalls;
            if(i%6===0 || i===0)
            {
                auxiliar[i][0] = Tiles.torchedWall;
                auxiliar[0][i] = Tiles.torchedWall;
                auxiliar[i][mapSize-1] = Tiles.torchedWall;
                auxiliar[mapSize-1][i] = Tiles.torchedWall;
            }
            for(let j=1;j<mapSize-1;j++)    //Por fila
            {
                if( [1,2,3].includes(i) )
                {
                    if( [4,8,12,13].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===4 )
                {
                    if( [1, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===5 )
                {
                    if( [10, 12, 13, 14, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===6 )
                {
                    if( [1, 2, 3, 5, 6, 10, 12, 13, 14, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===7 )
                {
                    if( [6, 10 ].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===8 )
                {
                    if( [6, 10, 12, 13, 14, 15].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===9 )
                {
                    if( [6, 10].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===10 )
                {
                    if( [1, 2, 3, 4, 5, 6, 10, 12, 13, 15, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===11 )
                {
                    if( j===8 )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if(i===12)
                {
                    if( [8, 10, 11, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===13 )
                {
                    if( [8, 10, 14, 15, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===14 )
                {
                    if( [8, 13, 16].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===15 )
                {
                    if( [8, 10, 13].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
                if( i===16 )
                {
                    if( [10, 13].includes(j) )
                    {
                        auxiliar[i][j]=Tiles.basicWalls;
                    }
                }
            }
        }

        auxiliar[mapSize-1][mapSize-1] = Tiles.torchedWall;

        auxiliar[1][7] = createEntity( 'Equippable', 'Amuleto escudo' );
        auxiliar[1][10] = createEntity( 'Equippable', 'Machete');
        auxiliar[1][11] = createEntity( 'Enemie', 'Agile Goblin' );
        first ? auxiliar[2][2] = player : auxiliar[15][3] = player; 
        auxiliar[2][15] = createEntity( 'Object', 'Box' );
        auxiliar[4][15] = createEntity( 'Enemie', 'Hobgoblin' );
        auxiliar[5][11] = createEntity( 'Enemie', 'Agile Goblin' );
        auxiliar[7][2] = createEntity( 'Enemie', 'Agile Goblin' );
        auxiliar[8][3] = createEntity( 'Enemie', 'Goblin' );
        auxiliar[9][1] = createEntity( 'Object', 'Teleport' );
        auxiliar[9][11] = createEntity( 'Trap', 'Poison trap' );
        auxiliar[11][16] = createEntity( 'Object', 'Fire' );
        auxiliar[12][15] = createEntity( 'Object', 'Fire' );
        auxiliar[14][10] = createEntity( 'Enemie', 'Goblin' );
        auxiliar[14][14] = createEntity( 'Equippable', 'Razor');
        auxiliar[14][15] = createEntity( 'Object', 'Fire' );
        auxiliar[15][16] = createEntity( 'Object', 'Fire' );
        auxiliar[16][16] = createEntity( 'Object', 'Teleport' );

        auxiliar[15][2] = createEntity( 'Object', 'Map teleport', ['Mines'] );

        setTps( [ [9, 1], [16, 16] ] );
                
        setPlayer( prev => (
        { ...prev, data: first ? { x: 2, y: 2 } : { x: 15, y: 3 } } ) );

        setMapa(auxiliar);
    }

    const createEntity = ( type: 'Equippable' | 'Tool' | 'Enemie' | 'Trap' | 'Consumable' | 'Object' | 'Tile' | 'Node', entityName: string, loot?: any[] ): Types.Gear | Types.Enemy | Types.Item | Types.Environment =>
    {
        const typeContainer  =
        {
            'Equippable': Gear.Equippables,
            'Tool': Gear.allTools,
            'Enemie': Entities.allEnemies,
            'Trap': Entities.allTraps,
            'Consumable': Items.Consumables,
            'Object':  allObjects,
            'Tile': allTiles,
            'Node': allNodes
        };

        const container = typeContainer[type] as Array<Types.Gear | Types.Enemy | Types.Item | Types.Environment | Types.Node>;

        const thisEntity = container.find( (x: Types.Gear | Types.Enemy | Types.Trap | Types.Item | Types.Environment | Types.Node) => (x.name === entityName) || ('mineral' in x && x.mineral === entityName) );
        if(!thisEntity) throw new Error(`No se encontró la entidad ${entityName} en ${type}`);

        if( entityName === 'Bag' ) (thisEntity as Types.Environment).content = loot;

        if( entityName === 'Map teleport' )
        {
            if(loot!==undefined)
            return { ...thisEntity, content: loot[0] ?? '' } as Types.Environment;
        }

        if( type==='Object' || type==='Tile' ) return thisEntity as Types.Environment;

        if( type==='Node' ) return thisEntity as Types.Node;

        if( type==='Enemie' && 'pattern' in thisEntity && (thisEntity.pattern!=='none' || undefined) )
        {
            const id = crypto.randomUUID();

            const patrolId = setInterval( () =>
            {
                let flag = true;

                const thisMob = findThisEnemy( id, mapaRef.current );
                if(!thisMob || !thisMob.entity.activePatrol ) return;

                setMapa( prev =>
                {
                    if(flag && isDev)
                    {
                        flag = false;
                        return prev;
                    }

                    let aux = prev.map( x => [ ...x ] );
                    
                    const data = findThisEnemy( id, aux );
                    if(!data || !data.entity.activePatrol ) return prev;

                    const { x: mobX, y: mobY, entity: mob } = data;

                    aux = patrolMovement( mobX, mobY, mob, aux );

                    return aux;
                } );
            }, 1000 );

            return { ...thisEntity, id, patrolId, activePatrol: true };
        }
        
        return { ...thisEntity, id: crypto.randomUUID() } as Types.Gear | Types.Enemy | Types.Item;
    }

    const swapMap = ( mapName: string ): void =>
    {
        const newMap = maps.find( x => x.name === mapName );
        if(!newMap) return setMapa(mapaRef.current);

        const actualMap = maps.find( x => x.actual );
        if(!actualMap) return setMapa(mapaRef.current);

        setMaps( prev => prev.map( mapInfo =>
        {
            if(mapInfo.name===actualMap.name)
            {
                const patrolsOff = mapaRef.current.map( fila => fila.map( entidad =>
                {
                    if( entidad.type === 'Enemy' && 'activePatrol' in entidad && entidad.activePatrol )
                    {
                        return { ...entidad, activePatrol: false };
                    }
                    else
                    {
                        return entidad;
                    }
                } ) );

                setTimeout( () => {
                    setMaps( prev => prev.map( x => x.name === actualMap.name ? { ...actualMap, visited: false } : x ) ) }
                , 300000 )

                return { ...actualMap, visitedMap: patrolsOff, actual: false, visited: true }
            }
            if( mapInfo.name===newMap.name )
            {
                return { ...newMap, visited: false, actual: true };
            }
            return mapInfo
        } ) )

        if( newMap.visited && newMap.visitedMap!==undefined )
        {
            const oldPlayer = newMap.visitedMap.flat().find( x => x.type === 'Player' );
            if( oldPlayer && 'data' in oldPlayer )
            {
                setPlayer( prev => ({ ...prev, data: { x: oldPlayer.data.x, y: oldPlayer.data.y } } ) )
            }

            const patrolsOn = newMap.visitedMap.map( fila => fila.map( entidad =>
            {
                if( entidad.type === 'Enemy' && 'activePatrol' in entidad && !entidad.activePatrol )
                {
                    return { ...entidad, activePatrol: true };
                }
                else
                {
                    return entidad;
                }
            } ) );

            return setMapa( patrolsOn );
        }
        return newMap.load();
    }

    const startGame = (): void =>
    {
        setEvents( [] );
        setMaps( [
            { name: 'Caves', load: loadCaveMap, actual: true, visited: false },
            { name: 'Mines', load: loadMinesMap, actual: false, visited: false }
        ])
        loadCaveMap(true);
        setPlayer( prev => ({ ...prev, hp: player.maxHp }) );
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
        auxiliar[player.data.x][player.data.y] = emptyTile;
        setMapa(auxiliar);
        setPlayer( {...Entities.emptyPlayer, hp: 0, symbol: icons.heroFront, data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2) } } );
        queueLog(`Moriste a causa de tus heridas.`, 'white');
        setGame(false);
    }

    const renderHp = (): string =>
    {
        if(player.hp>=0)
        {
            const heartsLeft = '💖'.repeat( player.hp );
            const heartsLost = '🖤'.repeat( Entities.maxHp - player.hp );
            return heartsLeft + heartsLost;
        }
        else
        {
            const heartsLost = '🖤'.repeat( Entities.maxHp );
            return heartsLost;
        }
    }

    const renderAliments = () : string =>
    {
        const poison = player.aliments.flags.Poisoned?'[💚]':'';
        const bleed = player.aliments.flags.Bleeding?'[🩸]':'';
        const burn = player.aliments.flags.Burning?'[🔥]':'';
        return poison + bleed + burn;
    }

return(
  <div className="game-container">

    <div className="grid-layout">
        
      <div className="map-zone">

        <div className="map-container" style={{ position: 'relative' }}>

            {player.hp <= 0 && (
            <div className="death-overlay">
                <h2>MORISTE</h2>
            </div>
)}

          <div className="columna-wrapper">

            <div
              onKeyDown={handleMovement}
              ref={gridRef}
              tabIndex={0}
            >
              {mapa.map((fila, x) => (
                <div key={x} className="fila">
                  {fila.map((celda, y) =>
                    celda.symbol===''
                    ? ( <label key={y} className="celda">{celda.symbol}</label>)
                    : ( <img src={celda.symbol} alt={'main_map'} key={y} className="celda" /> )
                  )}
                </div>
              ))}
            </div>

            <div className="visuals-layer">
              {visuals.map((fila, x) => (
                <div key={x} className="fila">
                  {fila.map((celda, y) => {
                    if (typeof celda === 'string') {
                        return allIcons.includes(celda) ? (
                        <img src={celda} alt={'visual'} key={y} className="celda" />
                        ) : (
                        <label key={y} className="celda">{celda}</label>
                        );
                    } else {
                        return (
                        <label
                            key={y}
                            className="celda visual-text"
                            style={{ color: celda.color || 'white' }}
                        >
                            {celda.text}
                        </label>
                        ); }
                    })}

                </div>
              ))}
            </div>

          </div>

          <div className="hearts-floating">
            {renderHp()} {renderAliments()}
          </div>

          <div className="h-text">
           Apretá H para ver los controles [V0.0.98]
          </div>

          {showInventory && (
            <InventoryTab
                inventory={player.inventory}
                onClose={() => setShowInventory(false)}
            />
            )}
          {/* {showInventory && (
            <div className="inventory-popup">
              <p>Inventario:</p>
              <ul className="inventory-list">
                {player.inventory.map((x, y) => (
                  <li key={y}>
                    {x.item.name} — {x.item.desc} - {`Tenés ${x.quantity}`} {`(${x.item.hotkey})`}
                  </li>
                ))}
              </ul>
            </div>
          )} */}

        </div>

        {showSlides &&
        <div className='help-layer'>
            <button className='absolute top-0 left-0' onClick={()=> {setShowSlides( false );setTimeout(() => gridRef.current?.focus(), 0); } }> X </button>
            {/* <p> {slides[slideIndex].text} </p> */}
            { Types.slides[slideIndex].img && <img className= 'h-img' alt='slide' src={Types.slides[slideIndex].img}/> }
            <button onClick={()=> moveSlide('previous')}> anterior </button>
            { Types.slides[slideIndex].text &&
            <a href={Types.slides[slideIndex].text} target="_blank" rel="noopener noreferrer">
                <button> ¡Repo! </button>
            </a>}
            <button onClick={()=> moveSlide('next')}> siguiente </button>
        </div>}

      </div>

      <div className="gear-column">

        {!game && <div className="start-popup">
          {!game && <button className='button-ui' onClick={startGame}>START</button>}
          {/* {game && <button onClick={stopGame}>STOP</button>} */}
        </div>}

        <GearTab player={player} />

        {game && <ConsumablesTab  player={player} />}

        <ConsoleTab events={events} />

      </div>

    </div>

  </div>
);

}

export default App;