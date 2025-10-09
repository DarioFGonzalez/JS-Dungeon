import { useEffect, useRef, useState } from 'react';
import * as Types from './components/types/global';

import * as icons from './Icons/index';

import * as Entities from './components/data/entities';
import * as Gear from './components/data/gear';
import * as Items from './components/data/items';
import * as Tiles from './components/data/tiles';
import { allObjects, allTiles } from './components/data/tiles';

import './App.css';

import ConsoleTab from './components/ConsoleTab/ConsoleTab';
import GearTab from './components/GearTab/GearTab';

const allIcons = Object.values(icons);

const mapSize = 18;

const emptyTile = { type: 'Tile', name: 'Void', symbol: '' };

const emptyGrid = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> emptyTile ) );

const emptyVisualGrid = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> '' ) );

type CellContent = Types.Player | Types.Enemy | Types.Trap | Types.Item | Types.Gear | Types.Environment;

const emptyDelayedLog = { status: false, message: '', color: 'white' };    

const App = () =>
{
    const gridRef = useRef<HTMLDivElement>(null);
    const [ lan, setLan ] = useState<'es'|'en'>( 'es' );
    const [ game, setGame ] = useState<boolean>(false);
    const [ allowed, setAllowed ] = useState<boolean>(true);
    const [ stun, setStun ] = useState<boolean>(false);

    const [ mapa, setMapa ] = useState<CellContent[][]>( emptyGrid );
    const [ showSlides, setShowSlides ] = useState<boolean>( false );
    const [ slideIndex, setSlideIndex ] = useState<number> ( 0 );
    const currentSlide = Types.slides[slideIndex];
    const [ visuals, setVisuals ] = useState<Types.VisualCell[][]>( emptyVisualGrid );
    
    const [ tps, setTps ] = useState<Types.ArrayOfCoords>([]);
    const [ residual, setResidual ] = useState<Types.Residual[]>( [] );

    const [ showInventory, setShowInventory ] = useState<boolean>( false );
    const [ events, setEvents ] = useState<Types.eventLog[]>( [] );
    const [ delayedLog, setDelayedLog ] = useState<Types.eventLog[]>( [] );

    const [ player, setPlayer ] = useState<Types.Player>( Entities.emptyPlayer );
    const [ enemies, setEnemies ] = useState<Types.Enemy[]>( [] );
    const [ traps, setTraps ] = useState<Types.Trap[]>( [] );

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
        let heroIcons = [icons.heroFront, icons.heroBack, icons.heroLeft, icons.heroRight];
        mapa.forEach( (fila, y) => fila.map( (celda, z) =>
        {
            if( heroIcons.includes(celda.symbol) ) { here=[ y, z ]; symbol=celda.symbol; }
        } ));
        setPlayer( prev => ({ ...prev, symbol, data: { x: here[0], y: here[1] } }) );
    };

    /*const checkCollision = ( x: number, y: number ) =>
    {
        if( x<0 || x >= mapa.length || y<0 || y >= mapa[0].length ) return 'oob';
        
        const tile = mapa[x][y];

        switch(tile)
        {
            case '': return 'empty';
            case icons.wallImg: return icons.wallImg;
            case icons.fountainImg: return icons.fountainImg;
            case icons.goblinImg: return Entities.enemy;
            case icons.hGoblinImg: return Entities.heavyEnemy;
            case icons.fireImg: return icons.fireImg;
            case icons.boxImg: return icons.boxImg;
            case icons.tpImg: return icons.tpImg;
            case icons.trapImg: return Entities.trap;
            case icons.pTrapImg: return Entities.poisonTrap;
            case icons.potionImg: return Items.Potion;
            case icons.bandagesImg: return Items.Bandages;
            case icons.aloeImg: return Items.Aloe;
            case icons.sword1Img: return Gear.Sword1;
            case icons.dagger1Img: return Gear.Dagger1;
            case icons.necklaceImg: return Gear.Necklace1;
            default: return 'unknown';
        };
    };*/

    const inconsecuente = ( symbol: string ): void =>
    {
        const auxiliar = mapa.map(fila => [...fila]);
        const {x, y} = player.data;
        auxiliar[x][y] = player;
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

        
        if(complete==true)
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

    const findThisEnemy = ( id: string, map: CellContent[][] ): { x: number, y: number, entity: Types.Enemy } | undefined =>
    {
        for( let i=0; i<map.length; i++ )
        {
            for( let j=0; j<map[i].length; j++ )
            {
                const cell = map[i][j];
                if( 'type' in cell &&  cell.type==='Enemy' && 'id' in cell && cell.id===id )  return { x: i, y: j, entity: cell };
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

        if(auxiliar[tp1X][tp1Y].name == 'Teleport' && auxiliar[tp2X][tp2Y].name == 'Teleport' )
        {
            switch(other)
            {
                case icons.boxImg:
                {
                    auxiliar[pX][pY] = emptyTile;
                    auxiliar[newX][newY] = player;
                    setPlayer( prev => ({ ...prev, symbol, data: { x: newX, y: newY } }) );
                    if( tp1X==newX+x && tp1Y==newY+y )
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
                    if( tp1X==newX && tp1Y==newY )
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
                const isInstanceEmpty = updatedInstance.length == 0;
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
            const aux = { ...playerInfo };
            const equippedWeapon = aux.hotBar.Equippeable.find( w => w.id === weapon.id );
            if(!equippedWeapon) return aux;

            if( equippedWeapon.durability - enemyToughness <= 0 )
            {
                const newEquippeables = aux.hotBar.Equippeable.filter( wpn => wpn.id !== equippedWeapon.id );

                if(flag)
                {
                    queueLog( `[🗡] ¡${equippedWeapon.item.name} se rompió! 💥`, 'orange');
                    flag = false;
                }

                return { ...aux, hotBar: { ...playerInfo.hotBar, Equippeable: newEquippeables }  };
            }

            let cdTimer = setTimeout( ()=> { setPlayer( all =>
            {
                const stillThere = all.hotBar.Equippeable.find( w => w.id == weapon.id );
                if(stillThere)
                {
                    return { ...all, hotBar: { ...all.hotBar, Equippeable: all.hotBar.Equippeable.map(
                        item => item.id == stillThere.id ? { ...stillThere, onCd: false } : item 
                    ) } };
                }
                return all;
            } ) }, equippedWeapon.item.attackStats?.cd )

            return { ...aux, hotBar: { ...aux.hotBar, Equippeable: aux.hotBar.Equippeable.map( w => w.equiped ? { ...w, durability: w.durability - enemyToughness, onCd: true } : w )}}    
        } );
    }

    const strikeEnemy = ( x: number, y: number ): void =>
    {
        let flag = true;

        const thisWeapon = player.hotBar.Equippeable.find( item => item.item.slot==='weapon' && item.equiped ) || Gear.emptyHanded;

        if(thisWeapon.onCd) return ;

        const thisEnemy = mapa[x][y] as Types.Enemy;

        if(!thisEnemy) return ;

        const attk = thisWeapon.item.attackStats;
        if(!attk) return ;

        const damage = attk.dmg- thisEnemy.defense.Armor;

        if(flag)
        {
            damageEnemy( thisEnemy.id, damage>=0?damage:0, attk?.DoT, attk?.times, attk?.aliment );
            thisWeapon!=Gear.emptyHanded && damageWeapon( thisEnemy.defense.Toughness, thisWeapon );
            flag=false;
        }
        /*setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const thisWeapon = aux.hotBar.Equippeable.find( item => item.item.slot==='weapon' && item.equiped ) || Gear.emptyHanded;

            !thisWeapon.onCd && setEnemies( mobs =>
            {
                const thisEnemy = auxiliar[x][y] as Types.Enemy;
                if(!thisEnemy) return mobs;

                const attk = thisWeapon.item.attackStats;
                if(!attk) return mobs;

                const damage = attk.dmg- thisEnemy.defense.Armor;

                if(flag && !thisWeapon.onCd)
                {
                    if(thisEnemy.name==='Ore')
                    {
                        if(thisWeapon.item.name==='Pickaxe')
                        {
                            damageEnemy( thisEnemy.id, damage>=0?damage:0, attk?.DoT, attk?.times, attk?.aliment );
                            thisWeapon!=Gear.emptyHanded && damageWeapon( thisEnemy.defense.Toughness, thisWeapon );
                        }
                        return mobs;
                    }
                    else
                    {
                        damageEnemy( thisEnemy.id, damage>=0?damage:0, attk?.DoT, attk?.times, attk?.aliment );
                        thisWeapon!=Gear.emptyHanded && damageWeapon( thisEnemy.defense.Toughness, thisWeapon );
                    }
                    flag = false;
                }

                return mobs;
            } );

            return aux;
        } );*/
    }

    const enemyDeath = ( id: string, aux: CellContent[][] ): CellContent[][] =>
    {
        const thisMonster = findThisEnemy( id, mapa );
        if(!thisMonster) return aux ;

        const { x, y } = thisMonster;

        lan==='es'
        ? queueLog( `${thisMonster.entity.name} murió.`, 'crimson' )
        : queueLog( `${thisMonster.entity.name} died.`, 'crimson' );

        if(thisMonster.entity.drops.length>0)
        {
            const loot = thisMonster.entity.drops.filter( drop => rollDrop( drop.chance ) )
            .map( drop => drop.item );
            aux[x][y] = lootBag( loot );
            return aux;
        }

        aux[x][y]= emptyTile;     
        return aux;
    }

    const lootBag = ( loot: (Types.Gear | Types.Item)[] ) : Types.Environment =>
    {
        if(loot.length>0) return { type: 'Object', name: 'Bag', symbol: icons.bagImg, content: loot  };
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
            setMapa( prev => enemyDeath( entity.id, prev ) );
            return ;
        }
        else
        {
            if(dot!=0)
            {
                const alimentVector =
                {
                    'poison': 'PoisonInstances',
                    'bleed': 'BleedInstances',
                    'burn': 'BurnInstances'
                } as const;
                
                const alimentTag =
                {
                    'poison': { aliment: '[Envenenado]', color: 'lime' },
                    'bleed': { aliment: '[Sangrando]', color: 'red' },
                    'burn': { aliment: '[Quemándose]', color: 'orange' }
                };

                type AlimentKey = keyof typeof alimentVector;
                 
                let dmgId = setInterval( () =>
                {
                    let flag = true;

                    setMapa( prev =>
                    {
                        const aux = prev.map( fila => [ ...fila ] );
                        const dmgIntervalMonster = findThisEnemy( id, aux );
                        
                        if(!dmgIntervalMonster) return prev;
                        const { x, y, entity } = dmgIntervalMonster;
                        
                        manageVisualAnimation( 'damage', x, y, dot.toString(), 450 );

                        if( entity.hp - dot <= 0 || !game )
                        {
                            cleanse( 'all', id );
                            if(flag)
                            {
                                console.log("El bicho murió por DOT: ", aliment); // ?. handleEventLog para esto porfavor.
                                flag = false;
                            }
                            if(game)
                            {
                                return enemyDeath( id, aux );
                            }
                            return aux;
                        }
                        if(flag)
                        {
                            console.log(`El bicho recibió ${dot} de daño por ${aliment}.`);
                            flag = false;
                        }
                        
                        aux[x][y] = { ...entity, hp: entity.hp - dot };
                        
                        return aux;
                    } )

                    /*setEnemies( prev =>   // LEGACY CODE, POR SI ACASO.
                    {
                        const aux = [ ...prev ];
                        const updatedEnemy = aux.find( x => x.id === thisEnemy.id );
                        if(!updatedEnemy) return prev;

                        manageVisualAnimation( 'damage', updatedEnemy?.data.x, updatedEnemy?.data.y, dot.toString(), 450 );

                        if(!updatedEnemy) return prev;
                        
                        if( updatedEnemy.hp - dot <= 0 || !game)
                        {
                            cleanse('all', updatedEnemy.id);
                            if(flag)
                            {
                                console.log("El bicho murió por DOT: ", aliment);
                                flag = false;
                            }
                            if(game)
                            {
                                return enemyDeath(updatedEnemy.data.x, updatedEnemy.data.y, updatedEnemy, aux);
                            }
                            return aux;
                        }
                        if(flag)
                        {
                            console.log(`El bicho recibió ${dot} de daño por ${aliment}.`);
                            flag = false;
                        }
                        return aux.map( mob => mob.id === updatedEnemy.id ? {...mob, hp: mob.hp - dot } : mob );
                    } );*/
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
                        
                        const tag = alimentTag[aliment as AlimentKey];
                        return aux;
                    } );
                }

                /*switch(aliment)       // LEGACY CODE, POR SI ACASO.
                {
                    case 'poison':
                    {
                        tag.aliment = '[Envenenado]';
                        tag.color = 'lime';
                        setMapa( prev =>
                        {
                            const aux = prev.map( x => [ ...x ] );
                            aux[x][y] = manageDotInstance("PoisonInstances", {dmgId, timerId}, entity, 'add');
                            return aux;
                        } );
                        break;
                    }
                    case 'bleed':
                    {
                        tag.aliment = '[Sangrando]';
                        tag.color = 'red';
                        mapa[x][y] = manageDotInstance("BleedInstances", {dmgId, timerId}, entity, 'add');
                        break;
                    }
                    case 'burn':
                    {
                        tag.aliment = '[Quemándose]';
                        tag.color = 'orange';
                        mapa[x][y] = manageDotInstance("BurnInstances", {dmgId, timerId}, entity, 'add');
                        break;
                    }
                    default:
                        break;
                }*/
            };

            setMapa( prev =>
            {
                const aux = prev.map( x => [ ...x ] );

                aux[x][y] = { ...entity, hp: entity.hp - dmg };
                return aux;
            } );

            lan=='es'
            ? queueLog(`Golpeaste a ${entity.name} por ${dmg} de daño. [${entity.hp - dmg}/${entity.maxHp}]. ${tag.aliment}`, tag.color)
            : queueLog(`You HIT ${entity.name} by ${dmg} damage. [${entity.hp- dmg}/${entity.maxHp}]`, 'khaki');

        /*setEnemies( allEnemies =>
        {
            const aux = [ ...allEnemies ];
            let tag = { aliment: '', color: 'khaki'};
            const thisEnemy = aux.find( mob => mob.id === ID ) || Entities.enemy;
            
            if(thisEnemy.hp-dmg <= 0)
            {
                return enemyDeath( thisEnemy.data.x, thisEnemy.data.y, thisEnemy, aux );
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
                                return aux.map( mob => mob.id===thisEnemy.id
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
                                return aux.map( mob => mob.id===thisEnemy.id
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
                                    return aux.map( mob => mob.id===thisEnemy.id
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
                            const updatedEnemy = aux.find( x => x.id === thisEnemy.id );
                            if(!updatedEnemy) return prev;

                            manageVisualAnimation( 'damage', updatedEnemy?.data.x, updatedEnemy?.data.y, dot.toString(), 450 );

                            if(!updatedEnemy) return prev;
                            
                            if( updatedEnemy.hp - dot <= 0 || !game)
                            {
                                cleanse('all', updatedEnemy.id);
                                if(flag)
                                {
                                    console.log("El bicho murió por DOT: ", aliment);
                                    flag = false;
                                }
                                if(game)
                                {
                                    return enemyDeath(updatedEnemy.data.x, updatedEnemy.data.y, updatedEnemy, aux);
                                }
                                return aux;
                            }
                            if(flag)
                            {
                                console.log(`El bicho recibió ${dot} de daño por ${aliment}.`);
                                flag = false;
                            }
                            return aux.map( mob => mob.id === updatedEnemy.id ? {...mob, hp: mob.hp - dot } : mob );
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
                                        return aux.map( x => x.id === thisEnemy.id
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
                                        return aux.map( x => x.id === thisEnemy.id
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
                                        return aux.map( x => x.id === thisEnemy.id
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
                ? queueLog(`Golpeaste a ${thisEnemy.name} por ${dmg} de daño. [${thisEnemy.hp - dmg}/${thisEnemy.maxHp}]. ${tag.aliment}`, tag.color)
                : queueLog(`You HIT ${thisEnemy.name} by ${dmg} damage. [${thisEnemy.hp- dmg}/${thisEnemy.maxHp}]`, 'khaki');

                return aux.map( mob => mob.id===thisEnemy.id ? { ...mob, hp: mob.hp - dmg } : mob );
            }
        } );*/
        }
    }

    const damageCharm = ( charm: Types.InventoryGear, dmg: number ) =>
    {
        const residualDmg = dmg - charm.durability;
        const newCharm = { ...charm, durability: residualDmg<0?residualDmg*(-1):0 };
        return { newCharm, residualDmg: residualDmg>0?residualDmg:0 }
    }

    const hurtPlayer = ( dmg: number, dot: number, times: number, aliment: string ): void =>
    {
        let flag = true;
        setPlayer( prev =>
        {
            let activeCharm = prev.hotBar.Equippeable.find( item => item.equiped && item.item.slot==='charm' );
            if(activeCharm)
            {
                const { newCharm, residualDmg } = damageCharm( activeCharm, dmg );
                if(flag)
                {
                    queueLog(`${activeCharm.item.name} se activó, daño recibido: ${residualDmg}.`, 'white');
                }
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
                    if(flag)
                    {
                        queueLog(`[📿] ¡${activeCharm.item.name} se rompió! 💥`, 'white');
                        flag = false;
                    }
                    newEquippeables =  prev.hotBar.Equippeable.filter( gear => gear.id!==newCharm?.id );
                }
                if(flag)
                {
                    flag = false;
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
                    
                    if( aux.hp - dot <= 0 || !game)
                    {
                        if(flag)
                        {
                            stopGame();
                        }
                        flag=false;
                        return {...aux, hp: 0 };
                    }
                    flag=false;
                    return {...aux, hp: aux.hp - dot };
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
        const thisEnemy = enemies.find( mob => mob.data.x===x && mob.data.y===y ) || Entities.enemy;
        const { attack } = thisEnemy;
        queueLog( `${thisEnemy.name} te golpeó por ${attack.Instant} de daño.`, 'red');
        hurtPlayer( attack.Instant, attack.DoT, attack.Times, attack.Aliment );
        inconsecuente(symbol);
    };

    const stepOnTrap = ( x: number, y: number, symbol: string ): void =>
    {
        const thisTrap = traps.find( trap => trap.data.x===x && trap.data.y===y ) || Entities.trap ;

        setResidual( prev => [ ...prev, { entity: thisTrap, coords: [ x, y ] } ] );
        moveHere( x, y, symbol, true );

        const {attack} = thisTrap;
        queueLog(`${thisTrap.name} te causó ${attack.Instant} de daño.`, 'crimson');

        hurtPlayer( attack.Instant, attack.DoT, attack.Times, attack.Aliment );
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

    const stepOnItem = ( x: number, y: number, symbol: string, tile: Types.Item, quantity: number ): void =>
    {
        if( player.inventory.length >= 20 )
        {
            setResidual( prev => [ ...prev, { entity: tile, coords: [ x, y ] } ] );
            moveHere( x, y, symbol, true );
            return ;
        }
        moveHere( x, y, symbol, true );

        addToInventory( tile, quantity );
    }

    const stepOnGear = ( x: number, y: number, symbol: string, tile: Types.Gear ): void =>
    {
        if( player.hotBar.Equippeable.length >= 6 )
        {
            setResidual( prev => [ ...prev, { entity: tile, coords: [ x, y ] } ] );
            moveHere( x, y, symbol, true );
            return ;
        }
        moveHere( x, y, symbol, true );

        addToEquippeable( tile );
    }

    const turnToInventoryGear = ( gear: Types.Gear ): Types.InventoryGear =>
    {
        return { item: gear, id: crypto.randomUUID(), durability: gear.durability, onCd: false, equiped: false, selected: false };
    }

    const addToEquippeable = ( gear: Types.Gear ) =>
    {
        queueLog(`${gear.name} agregado a la mochila.`, 'orange');
        setPlayer( playerInfo => ( { ...playerInfo, hotBar: { ...playerInfo.hotBar,
            Equippeable: [ ...playerInfo.hotBar.Equippeable, turnToInventoryGear(gear) ] } } ) );
    }

    const addToInventory = ( item: Types.Item, quantity: number ): void =>
    {
        const thisItem = player.inventory.find( x => x.item.name === item.name )
        queueLog(`Recogiste ${quantity} ${item.name}.`, 'lime');
        if(!thisItem)
        {
            setPlayer( prev => ( { ...prev, inventory: [ ...prev.inventory, { item: item, quantity: quantity, onCd: false } ] } ) );
        }
        else
        {
            setPlayer( prev => ( { ...prev, inventory: prev.inventory.map( object =>
                object.item.name===item.name
                ? { ...object, quantity: object.quantity + quantity } : object ) } ) );
        }
    }

    const consumeItem = ( item: Types.Item, quantity: number ): void =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const thisItem = aux.inventory.find( x => x.item.name===item.name ) as Types.InventoryItem;

            if( !thisItem || thisItem.quantity < quantity || thisItem.onCd ) return aux;
            if(flag)    queueLog(`Usas ${quantity} ${item.name}`, 'lime');

            switch(item.name)
            {
                case 'Potion':
                {
                    if(flag)
                    {
                        heal(3, 0, 0);
                        manageVisualAnimation( 'visual', aux.data.x, aux.data.y, icons.healing, 500 );
                    }
                    break;
                }
                case 'Bandages':
                {
                    if(aux.aliments.flags.Bleeding)
                    {
                        if(flag) queueLog(`[Frenas el sangrado]`, 'lime');
                        cleanse('bleed');
                    }
                    manageVisualAnimation( 'visual', aux.data.x, aux.data.y, icons.bandagesImg, 500 );
                    break;
                }
                case 'Aloe leaf':
                {
                    if(aux.aliments.flags.Burning)
                    {
                        if(flag) queueLog(`[Cortas la quemadura]`, 'lime');
                        cleanse('burn');
                    }
                    manageVisualAnimation( 'visual', aux.data.x, aux.data.y, icons.aloeImg, 500 );
                    break;
                }
            }

            flag = false;

            if(thisItem.quantity - quantity > 0)
            {
                setTimeout( () =>
                {
                    setPlayer( prev => ( {...prev, inventory: prev.inventory.map( z => z.item.name === thisItem.item.name ? { ...z, onCd: false } : z ) } ) );
                }, thisItem.item.cd)

                return {...aux, inventory: aux.inventory.map( z =>
                    'quantity' in z && z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - quantity, onCd: true } : z ) };
            }
            else
            {
                return {...aux, inventory: aux.inventory.filter( y => y.item.name!==thisItem.item.name ) };
            }
        } );
        
        // const thisItem = player.inventory.find( x => x.item.name===item.name ) as Types.InventoryItem;

        // if( !thisItem || thisItem.quantity < quantity || thisItem.onCd ) return ;

        // switch(item.name)
        // {
        //     case 'Potion':
        //     {
        //         heal(3, 0, 0);
        //         setPlayer( playerInfo =>
        //             {
        //                 manageVisualAnimation( 'visual', playerInfo.Data.x, playerInfo.Data.y, icons.healing, 500 );
        //                 return playerInfo;
        //             } )
        //         break;
        //     }
        //     case 'Bandages':
        //     {
        //         cleanse('bleed');
        //         break;
        //     }
        //     case 'Aloe leaf':
        //     {
        //         cleanse('burn');
        //         break;
        //     }
        // }

        
        // if(thisItem.quantity - quantity > 0)
        // {
        //     setTimeout( () =>
        //     {
        //         setPlayer( prev => ( {...prev, inventory: prev.inventory.map( z => z.item.name === thisItem.item.name ? { ...z, onCd: false } : z ) } ) );
        //     }, thisItem.item.cd)
        //     setPlayer( prev => ( {...prev, inventory: prev.inventory.map( z =>
        //         'quantity' in z && z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - quantity, onCd: true } : z ) } ) );
        // }
        // else
        // {
        //     setPlayer( prev => ( {...prev, inventory: prev.inventory.filter( y => y.item.name!==thisItem.item.name ) } ) );
        // }
    }

    const touchFountain = ( symbol: string ) =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo};
            if(flag)
            {
                
                if(aux.aliments.flags.Burning)
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
        const aux = mapa.map( fila => [ ...fila ] );

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
                case 'Item':
                    {
                        stepOnItem( newX, newY, symbol, tile as Types.Item, 1 );
                        break;
                    }
                case 'Gear':
                    {
                        stepOnGear( newX, newY, symbol, tile as Types.Gear );
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
                        touchEnemy( symbol, newX, newY );
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

    const handleInteraction = ( ): void =>
    {
        const aux = mapa.map( fila => [ ...fila ] );
        const [dx, dy] = directionFromVector(player.symbol);
        let x = player.data.x + dx;
        let y = player.data.y + dy;

        manageVisualAnimation( 'visual', x, y, icons.redClawHit, 200 );
        
        const objective = aux[x][y];

        switch(objective.type)
        {
            case 'Enemy':
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
            const to = key==='arrowup' ? -1 : +1 ;
            const oldIndex = player.hotBar.Equippeable.findIndex( item => item.selected );
            const max = player.hotBar.Equippeable.length - 1;
            const newIndex = oldIndex + to < 0 ? max : oldIndex + to > max ? 0 : oldIndex + to;
            
            if(oldIndex===newIndex) return playerInfo;

            const aux = [ ...player.hotBar.Equippeable];
            aux[oldIndex] = { ...aux[oldIndex], selected: false };
            aux[newIndex] = { ...aux[newIndex], selected: true };
            flag = false;
            return { ...player, hotBar: { ...player.hotBar, Equippeable: aux } };
        } );
    }

    const swapGear = (): void =>
    {
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const Equippeables = aux.hotBar.Equippeable;

            const selected = Equippeables.find( x => x.selected );
            if(!selected) return playerInfo;

            const toReplace = Equippeables.find( x => x.equiped && x.item.type === selected.item.type )

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
                case 'arrowup':
                case 'arrowdown':
                navigateHotbar(key);
                break;

                case 'k':   //bandages
                consumeItem(Items.Bandages, 2);
                break;
                case 'o':   //poción
                consumeItem(Items.Potion, 1);
                break;
                case 'p':   //Aloe
                consumeItem(Items.Aloe, 1);
                break;

                case 'q':   //renew (HoT)
                heal(0,1,5);
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

    /*const beginPatrol = ( x: number, y: number, symbol: string, patrol: string ) => //non
    {
        const thisEnemy = enemies.find( mob => mob.data.x === x && mob.data.y === y );

        if( thisEnemy?.pattern !== 'none' )
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
    }*/

    /*const straightPatrol = ( x: number, y: number, symbol: string ): void => //non
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

                aux[nextX][y] = thisEnemy?.symbol || '❌';
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
    }*/

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
                const isInstanceEmpty = updatedInstance.length == 0;
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
                    setEnemies( prevEnemies =>
                    {
                        const aux = [ ...prevEnemies];
                        return aux.map( mob =>
                        {
                            if( mob.id!==ID ) return mob;
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
                            if( mob.id!==ID ) return mob;
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
                            if( mob.id!==ID ) return mob;
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
                            if( mob.id!==ID ) return mob;
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
        }
    }

    const loadGame = (): void =>
    {
        const auxiliar: CellContent[][] = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> emptyTile ) );  //Vacía el mapa
        for(let i=0; i<mapSize; i++)
        {
            auxiliar[i][0] = Tiles.basicWalls;
            auxiliar[0][i] = Tiles.basicWalls;
            auxiliar[i][mapSize-1] = Tiles.basicWalls;
            auxiliar[mapSize-1][i] = Tiles.basicWalls;
        }
        for(let i=0; i<mapSize; i++)
        {
            if(i%6==0 || i===0)
            {
                auxiliar[i][0] = Tiles.torchedWall;
                auxiliar[0][i] = Tiles.torchedWall;
                auxiliar[i][mapSize-1] = Tiles.torchedWall;
                auxiliar[mapSize-1][i] = Tiles.torchedWall;
            }
        }
        auxiliar[mapSize-1][mapSize-1] = Tiles.torchedWall;

        // auxiliar[3][3] = icons.boxImg;               LEGACY SPAWNS
        // auxiliar[13][14] = icons.hGoblinImg;
        // auxiliar[15][2] = icons.goblinImg;
        // auxiliar[13][13] = icons.pTrapImg;
        // auxiliar[15][5] = icons.trapImg;
        // auxiliar[2][5] = icons.potionImg;
        // auxiliar[2][6] =  icons.bandagesImg;
        // auxiliar[2][7] = icons.potionImg;
        // auxiliar[2][8] = icons.bandagesImg;
        // auxiliar[2][10] = icons.aloeImg;
        // auxiliar[3][5] = icons.sword1Img;
        // auxiliar[4][6] = icons.dagger1Img;
        // auxiliar[5][6] = icons.necklaceImg;
        // auxiliar[6][6] = icons.necklaceImg;
        // auxiliar[7][6] = icons.sword1Img;
        // auxiliar[8][6] = icons.dagger1Img;
        // auxiliar[9][6] = icons.necklaceImg;
        // auxiliar[10][6] = icons.sword1Img;
        // auxiliar[11][6] = icons.dagger1Img;
        // auxiliar[10][10] = icons.fireImg;
        // auxiliar[10][12] = icons.fountainImg;
        // auxiliar[2][16] = icons.tpImg;
        // auxiliar[16][2] = icons.tpImg;

        auxiliar[3][3] = createEntity( 'Object', 'Box' );
        auxiliar[13][14] = createEntity( 'Enemie', 'Hobgoblin' );
        auxiliar[15][2] = createEntity( 'Enemie', 'Goblin' );
        auxiliar[13][13] = createEntity( 'Trap', 'Poison trap' );
        auxiliar[15][5] = createEntity( 'Trap', 'Simple trap' );
        auxiliar[2][5] = createEntity( 'Consumable', 'Potion' );
        auxiliar[2][6] =  createEntity( 'Consumable', 'Bandages' );
        auxiliar[2][7] = createEntity( 'Consumable', 'Potion' );
        auxiliar[2][8] = createEntity( 'Consumable', 'Bandages' );
        auxiliar[2][10] = createEntity( 'Consumable', 'Aloe leaf' );
        auxiliar[3][5] = createEntity( 'Equippable', 'Wooden sword');
        auxiliar[4][6] = createEntity( 'Equippable', 'Slicing knife');
        auxiliar[5][6] = createEntity( 'Equippable', 'Protective pendant' );
        auxiliar[6][6] = createEntity( 'Equippable', 'Protective pendant' );
        auxiliar[7][6] = createEntity( 'Equippable', 'Wooden sword' );
        auxiliar[8][6] = createEntity( 'Equippable', 'Slicing knife' );
        auxiliar[9][6] = createEntity( 'Equippable', 'Protective pendant' );
        auxiliar[10][6] = createEntity( 'Equippable', 'Wooden sword' );
        auxiliar[11][6] = createEntity( 'Equippable', 'Slicing knife' );
        auxiliar[10][10] = createEntity( 'Object', 'Fire' );
        auxiliar[10][12] = createEntity( 'Object', 'Fountain' );
        auxiliar[2][16] = createEntity( 'Object', 'Teleport' );
        auxiliar[16][2] = createEntity( 'Object', 'Teleport' );

        setTps( [ [2,16], [16,2] ] );
        
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = player;
        
        setPlayer( prev => (
        { ...prev, data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2) } } ) );
        setEnemies( [
        { ...Entities.enemy, id: crypto.randomUUID(), symbol: icons.goblinImg, data: { x: 15, y: 2 } },
        { ...Entities.heavyEnemy, id: crypto.randomUUID(), symbol: icons.hGoblinImg, data: { x: 13, y: 14 } } ] );
        setTraps( [
        { ...Entities.trap, id: crypto.randomUUID(), symbol: icons.trapImg, data: { x: 15, y: 5 } },
        { ...Entities.poisonTrap, id: crypto.randomUUID(), symbol: icons.pTrapImg, data: { x: 13, y: 13 } } ] );
        
        setMapa(auxiliar);
    }

    const createEntity = ( type: 'Equippable' | 'Enemie' | 'Trap' | 'Consumable' | 'Object' | 'Tile', entityName: string, loot?: any[] ): Types.Gear | Types.Enemy | Types.Item | Types.Environment =>
    {
        const typeContainer  =
        {
            'Equippable': Gear.Equippables,
            'Enemie': Entities.allEnemies,
            'Trap': Entities.allTraps,
            'Consumable': Items.Consumables,
            'Object':  allObjects,
            'Tile': allTiles
        };

        const container = typeContainer[type] as Array<Types.Gear | Types.Enemy | Types.Item | Types.Environment>;

        const thisEntity = container.find( (x: Types.Gear | Types.Enemy | Types.Trap | Types.Item | Types.Environment) => x.name === entityName );
        if(!thisEntity) throw new Error(`No se encontró la entidad ${entityName} en ${type}`);

        if( entityName === 'Bag' ) (thisEntity as Types.Environment).content = loot;

        if(type==='Object' || type==='Tile') return thisEntity as Types.Environment;
        
        return { ...thisEntity, id: crypto.randomUUID() } as Types.Gear | Types.Enemy | Types.Item;
    }

    const startGame = (): void =>
    {
        setEvents( [] );
        loadGame();
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
                    : ( <img src={celda.symbol} key={y} className="celda" /> )
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
                        <img src={celda} key={y} className="celda" />
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
          )}

        </div>

        {showSlides &&
        <div className='help-layer'>
            <button className='absolute top-0 left-0' onClick={()=> {setShowSlides( false );setTimeout(() => gridRef.current?.focus(), 0); } }> X </button>
            {/* <p> {slides[slideIndex].text} </p> */}
            { Types.slides[slideIndex].img && <img className= 'h-img' src={Types.slides[slideIndex].img}/> }
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

        <ConsoleTab events={events} />

      </div>

    </div>

  </div>
);

}

export default App;