import { useEffect, useRef, useState } from 'react';
import * as icons from './Icons/index';
import * as Types from './components/types/global';

import * as Entities from './components/data/entities';
import * as Gear from './components/data/gear';
import * as Items from './components/data/items';

import './App.css';

import GearTab from './components/GearTab/GearTab';

const allIcons = Object.values(icons);

// const ship_up = icons.heroBack;
// const ship_down = icons.heroFront;
// const ship_left = icons.heroLeft;
// const ship_right = icons.heroRight;
// const anyPlayer = [ship_down, ship_left, ship_right, ship_up];
// const box = icons.boxImg;
// const wall = icons.wallImg;
// const teleport = icons.tpImg;
// const totem = 'u';
// const fountain = icons.fountainImg;
// const cursedTotem = '🧿';

const mapSize = 18;

// const fire = icons.fireImg;

const emptyGrid = Array.from( {length: mapSize}, ()=> Array.from( Array(mapSize), ()=> '') );

const emptyDelayedLog = { status: false, message: '', color: 'white' };

const App = () =>
{
    const gridRef = useRef<HTMLDivElement>(null);
    const [ lan, setLan ] = useState<'es'|'en'>( 'es' );
    const [ game, setGame ] = useState<boolean>(false);
    const [ allowed, setAllowed ] = useState<boolean>(true);
    const [ stun, setStun ] = useState<boolean>(false);

    const [ mapa, setMapa ] = useState<string[][]>( emptyGrid );
    const [ visuals, setVisuals ] = useState<Types.VisualCell[][]>( emptyGrid );
    
    const [ tps, setTps ] = useState<Types.ArrayOfCoords>([]);
    const [ residual, setResidual ] = useState<Types.Residual[]>( [] );

    const [ showInventory, setShowInventory ] = useState<boolean>( false );
    const [ events, setEvents ] = useState<Types.eventLog[]>( [] );
    const [ delayedLog, setDelayedLog ] = useState<Types.eventLog[]>( [] );

    const [ player, setPlayer ] = useState<Types.Player>( Entities.emptyPlayer );
    const [ enemies, setEnemies ] = useState<Types.Enemy[]>( [] );
    const [ traps, setTraps ] = useState<Types.Trap[]>( [] );

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
            if(celda==icons.heroFront || celda==icons.heroBack || celda==icons.heroLeft || celda==icons.heroRight ) { here=[ y, z ]; symbol=celda; }
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

        if(auxiliar[tp1X][tp1Y] == icons.tpImg && auxiliar[tp2X][tp2Y] == icons.tpImg )
        {
            switch(other)
            {
                case icons.boxImg:
                {
                    auxiliar[pX][pY] = '';
                    auxiliar[newX][newY] = symbol;
                    setPlayer( prev => ({ ...prev, Data: { x: newX, y: newY, symbol } }) );
                    if( tp1X==newX+x && tp1Y==newY+y )
                    {
                        setResidual( prev => [ ...prev, { symbol: icons.tpImg, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[tp2X][tp2Y] = icons.boxImg;
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { symbol: icons.tpImg, coords: [ tp1X, tp1Y ] } ] );
                        auxiliar[tp1X][tp1Y] = icons.boxImg;
                    }
                    setMapa(auxiliar);
                    break;
                }
                case '':
                {
                    if( tp1X==newX && tp1Y==newY )
                    {
                        setResidual( prev => [ ...prev, { symbol: icons.tpImg, coords: [ tp2X, tp2Y ] } ] );
                        auxiliar[pX][pY] = '';
                        auxiliar[tp2X][tp2Y] = symbol;
                        setPlayer( prev => ({ ...prev, Data: { x: tp2X, y: tp2Y, symbol } }) );
                        setMapa(auxiliar);
                    }
                    else
                    {
                        setResidual( prev => [ ...prev, { symbol: icons.tpImg, coords: [ tp1X, tp1Y ] } ] );
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
                auxiliar[nextX][nextY] = icons.boxImg;
                setPlayer( prev => ( { ...prev, Data: { x: newX, y: newY, symbol } } ) );
                setMapa( auxiliar );
                break;
            }
            case icons.tpImg:
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

    const damageWeapon = ( enemyToughness: number, weapon: Types.InventoryGear ) =>
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
            const thisWeapon = aux.HotBar.Equippeable.find( item => item.item.slot==='weapon' && item.equiped ) || Gear.emptyHanded;

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
                    thisWeapon!=Gear.emptyHanded && damageWeapon( thisEnemy.Defense.Toughness, thisWeapon );
                    flag = false;
                }

                return mobs;
            } );

            return aux;
        } );
    }

    const enemyDeath = ( x: number, y: number, enemy: Types.Enemy, allEnemies: Types.Enemy[] ): Types.Enemy[] =>
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
            const thisEnemy = aux.find( mob => mob.ID === ID ) || Entities.enemy;
            
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

                            manageVisualAnimation( 'damage', updatedEnemy?.Data.x, updatedEnemy?.Data.y, dot.toString(), 450 );

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
            let activeCharm = prev.HotBar.Equippeable.find( item => item.equiped && item.item.slot==='charm' );
            if(activeCharm)
            {
                const { newCharm, residualDmg } = damageCharm( activeCharm, dmg );
                if(flag)
                {
                    queueLog(`${activeCharm.item.name} se activó, daño recibido: ${residualDmg}.`, 'white');
                }
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
                    if(flag)
                    {
                        queueLog(`[📿] ¡${activeCharm.item.name} se rompió! 💥`, 'white');
                        flag = false;
                    }
                    newEquippeables =  prev.HotBar.Equippeable.filter( gear => gear.id!==newCharm?.id );
                }
                if(flag)
                {
                    flag = false;
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
        const thisEnemy = enemies.find( mob => mob.Data.x===x && mob.Data.y===y ) || Entities.enemy;
        const { Attack } = thisEnemy;
        queueLog( `${thisEnemy.Name} te golpeó por ${Attack.Instant} de daño.`, 'red');
        hurtPlayer( Attack.Instant, Attack.DoT, Attack.Times, Attack.Aliment );
        inconsecuente(symbol);
    };

    const stepOnTrap = ( x: number, y: number, symbol: string ): void =>
    {
        const thisTrap = traps.find( trap => trap.Data.x===x && trap.Data.y===y ) || Entities.trap ;

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
            auxiliar[newX][newY] = icons.fireImg;
            if(player.HP<=0)
            {
                return ;
            }
            auxiliar[newX-x][newY-y] = symbol;
            setMapa(auxiliar);
            setPlayer( prev => ( { ...prev, Data: { x: newX-x, y: newY-y, symbol } } ) );
        }, 45);
    };

    const stepOnItem = ( x: number, y: number, symbol: string, tile: Types.Item, quantity: number ): void =>
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

    const stepOnGear = ( x: number, y: number, symbol: string, tile: Types.Gear ): void =>
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

    const turnToInventoryGear = ( gear: Types.Gear ): Types.InventoryGear =>
    {
        return { item: gear, id: crypto.randomUUID(), durability: gear.durability, onCd: false, equiped: false, selected: false };
    }

    const addToEquippeable = ( gear: Types.Gear ) =>
    {
        queueLog(`${gear.name} agregado a la mochila.`, 'orange');
        setPlayer( playerInfo => ( { ...playerInfo, HotBar: { ...playerInfo.HotBar,
            Equippeable: [ ...playerInfo.HotBar.Equippeable, turnToInventoryGear(gear) ] } } ) );
    }

    const addToInventory = ( item: Types.Item, quantity: number ): void =>
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

    const consumeItem = ( item: Types.Item, quantity: number ): void =>
    {
        let flag = true;
        setPlayer( playerInfo =>
        {
            const aux = { ...playerInfo };
            const thisItem = aux.Inventory.find( x => x.item.name===item.name ) as Types.InventoryItem;

            if( !thisItem || thisItem.quantity < quantity || thisItem.onCd ) return aux;
            if(flag)    queueLog(`Usas ${quantity} ${item.name}`, 'lime');

            switch(item.name)
            {
                case 'Potion':
                {
                    if(flag)
                    {
                        heal(3, 0, 0);
                        manageVisualAnimation( 'visual', aux.Data.x, aux.Data.y, icons.healing, 500 );
                    }
                    break;
                }
                case 'Bandages':
                {
                    if(aux.Aliments.Flags.Bleeding)
                    {
                        if(flag) queueLog(`[Frenas el sangrado]`, 'lime');
                        cleanse('bleed');
                    }
                    manageVisualAnimation( 'visual', aux.Data.x, aux.Data.y, icons.bandagesImg, 500 );
                    break;
                }
                case 'Aloe leaf':
                {
                    if(aux.Aliments.Flags.Burning)
                    {
                        if(flag) queueLog(`[Cortas la quemadura]`, 'lime');
                        cleanse('burn');
                    }
                    manageVisualAnimation( 'visual', aux.Data.x, aux.Data.y, icons.aloeImg, 500 );
                    break;
                }
            }

            flag = false;

            if(thisItem.quantity - quantity > 0)
            {
                setTimeout( () =>
                {
                    setPlayer( prev => ( {...prev, Inventory: prev.Inventory.map( z => z.item.name === thisItem.item.name ? { ...z, onCd: false } : z ) } ) );
                }, thisItem.item.cd)

                return {...aux, Inventory: aux.Inventory.map( z =>
                    'quantity' in z && z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - quantity, onCd: true } : z ) };
            }
            else
            {
                return {...aux, Inventory: aux.Inventory.filter( y => y.item.name!==thisItem.item.name ) };
            }
        } );
        
        // const thisItem = player.Inventory.find( x => x.item.name===item.name ) as Types.InventoryItem;

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
        //         setPlayer( prev => ( {...prev, Inventory: prev.Inventory.map( z => z.item.name === thisItem.item.name ? { ...z, onCd: false } : z ) } ) );
        //     }, thisItem.item.cd)
        //     setPlayer( prev => ( {...prev, Inventory: prev.Inventory.map( z =>
        //         'quantity' in z && z.item.name === thisItem.item.name ? { ...z, quantity: z.quantity - quantity, onCd: true } : z ) } ) );
        // }
        // else
        // {
        //     setPlayer( prev => ( {...prev, Inventory: prev.Inventory.filter( y => y.item.name!==thisItem.item.name ) } ) );
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
                case icons.boxImg:
                    {
                        pushBox( x, y, symbol );
                        break;
                    }
                case icons.tpImg:
                    {
                        handleTp( x, y, symbol, '' );
                        break;
                    }
                case Entities.enemy:
                case Entities.heavyEnemy:
                    {
                        setPlayer( playerInfo =>
                        {
                            manageVisualAnimation( 'visual', playerInfo.Data.x, playerInfo.Data.y, icons.clawHit, 400 );
                            return playerInfo;
                        } );
                        touchEnemy( symbol, newX, newY );
                        break;
                    }
                case Entities.trap:
                case Entities.poisonTrap:
                    {
                        stepOnTrap( newX, newY, symbol );
                        break;
                    }
                case icons.fireImg:
                    {
                        walkOntoFire( x, y, symbol, newX, newY );
                        break;
                    }
                case icons.fountainImg:  //Cleanse('burn')
                    {
                        touchFountain( symbol );
                        break;
                    }
                case Items.Potion:
                case Items.Bandages:
                case Items.Aloe:
                    {
                        stepOnItem( newX, newY, symbol, tile, 1 );
                        break;
                    }
                case Gear.Sword1:
                case Gear.Dagger1:
                case Gear.Necklace1:
                    {
                        stepOnGear( newX, newY, symbol, tile );
                        break;
                    }
                case 'unknown':
                case icons.wallImg:
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
        const [dx, dy] = directionFromVector(player.Data.symbol);
        let x = player.Data.x + dx;
        let y = player.Data.y + dy;

        manageVisualAnimation( 'visual', x, y, icons.redClawHit, 200 );
        
        const objective = checkCollision( x, y );
        switch(objective)
        {
            case Entities.enemy:
            case Entities.heavyEnemy:
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
                    case 'w': movePlayer(-1, 0, icons.heroBack); break;
                    case 'a': movePlayer(0, -1, icons.heroLeft); break;
                    case 's': movePlayer(1, 0, icons.heroFront); break;
                    case 'd': movePlayer(0, 1, icons.heroRight); break;
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

    const finishDoT = <T extends Types.WithAliments>( aliment: keyof Types.AlimentInstances, info: T, all?: boolean ): void =>
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

    const finishBuff = ( buff: keyof Types.BuffInstances, info: Types.Player, cleanse?: boolean ): void =>
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
            auxiliar[i][0] = icons.wallImg;
            auxiliar[0][i] = icons.wallImg;
            auxiliar[i][mapSize-1] = icons.wallImg;
            auxiliar[mapSize-1][i] = icons.wallImg;
        }
        for(let i=0; i<mapSize; i++)
        {
            if(i%6==0 || i===0)
            {
                auxiliar[i][0] = icons.torchdWallImg;
                auxiliar[0][i] = icons.torchdWallImg;
                auxiliar[i][mapSize-1] = icons.torchdWallImg;
                auxiliar[mapSize-1][i] = icons.torchdWallImg;
            }
        }
        auxiliar[mapSize-1][mapSize-1] = icons.torchdWallImg;

        auxiliar[3][3] = icons.boxImg;
        auxiliar[13][14] = icons.hGoblinImg;
        auxiliar[15][2] = icons.goblinImg;
        auxiliar[13][13] = icons.pTrapImg;
        auxiliar[15][5] = icons.trapImg;
        auxiliar[2][5] = icons.potionImg;
        auxiliar[2][6] =  icons.bandagesImg;
        auxiliar[2][7] = icons.potionImg;
        auxiliar[2][8] = icons.bandagesImg;
        auxiliar[2][10] = icons.aloeImg;
        auxiliar[3][5] = icons.sword1Img;
        auxiliar[4][6] = icons.dagger1Img;
        auxiliar[5][6] = icons.necklaceImg;
        auxiliar[6][6] = icons.necklaceImg;
        auxiliar[7][6] = icons.sword1Img;
        auxiliar[8][6] = icons.dagger1Img;
        auxiliar[9][6] = icons.necklaceImg;
        auxiliar[10][6] = icons.sword1Img;
        auxiliar[11][6] = icons.dagger1Img;
        auxiliar[10][10] = icons.fireImg;
        auxiliar[10][12] = icons.fountainImg;
        auxiliar[2][16] = icons.tpImg;
        auxiliar[16][2] = icons.tpImg;

        setTps( [ [2,16], [16,2] ] );
        auxiliar[Math.floor(mapa.length/2)][Math.floor(mapa[0].length/2)] = icons.heroFront;
        setPlayer( prev => (
        { ...prev, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: icons.heroFront } } ) );
        setEnemies( [
        { ...Entities.enemy, ID: crypto.randomUUID(), Data: { x: 15, y: 2, symbol: icons.goblinImg } },
        { ...Entities.heavyEnemy, ID: crypto.randomUUID(), Data: { x: 13, y: 14, symbol: icons.hGoblinImg } } ] );
        setTraps( [
        { ...Entities.trap, ID: crypto.randomUUID(), Data: { x: 15, y: 5, symbol: icons.trapImg } },
        { ...Entities.poisonTrap, ID: crypto.randomUUID(), Data: { x: 13, y: 13, symbol: icons.pTrapImg } } ] );
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
        setPlayer( {...Entities.emptyPlayer, Data: { x: Math.floor(mapa.length/2), y: Math.floor(mapa[0].length/2), symbol: icons.heroFront } } );
        queueLog(`Moriste a causa de tus heridas.`, 'white');
        setGame(false);
    }

    const renderHp = (): string =>
    {
        if(player.HP>=0)
        {
            const heartsLeft = '💖'.repeat( player.HP );
            const heartsLost = '🖤'.repeat( Entities.maxHp - player.HP );
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
        const poison = player.Aliments.Flags.Poisoned?'[💚]':'';
        const bleed = player.Aliments.Flags.Bleeding?'[🩸]':'';
        const burn = player.Aliments.Flags.Burning?'[🔥]':'';
        return poison + bleed + burn;
    }

return(
  <div className="game-container">

    <div className="grid-layout">
        
      <div className="map-zone">
        <div className="map-container" style={{ position: 'relative' }}>
          <div className="columna-wrapper">
            <div
              className="columna"
              onKeyDown={handleMovement}
              ref={gridRef}
              tabIndex={0}
            >
              {mapa.map((fila, x) => (
                <div key={x} className="fila">
                  {fila.map((celda, y) =>
                    allIcons.includes(celda) ? (
                      <img src={celda} key={y} className="celda" />
                    ) : (
                      <label key={y} className="celda">{celda}</label>
                    )
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

          {showInventory && (
            <div className="inventory-popup">
              <p>Inventario:</p>
              <ul className="inventory-list">
                {player.Inventory.map((x, y) => (
                  <li key={y}>
                    {x.item.name} — {`Cantidad: ${x.quantity}`} - {`(${x.item.hotkey})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="gear-column">

        {!game && <div className="start-popup">
          {!game && <button onClick={startGame}>START</button>}
          {/* {game && <button onClick={stopGame}>STOP</button>} */}
        </div>}

        <GearTab player={player} />

        <div className="log-window-floating">
          <ul>
            {events.map((log, i) => (
              <li key={i} style={{ color: log.color || 'inherit' }}>
                {log.message}
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  </div>
);

}

export default App;