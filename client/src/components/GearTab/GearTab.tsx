import React from 'react';
import { Player } from '../types/global';
import './GearTab.css';
import DurabilityBar from './DurabilityBar/DurabilityBar';

interface GearTabProps {
  player: Player;
}

const GearTab: React.FC<GearTabProps> = ({ player }) => {
  const renderTalismanHp = (thing: any) => {
    let hearts = '';
    if (thing.durability >= 0) {
      const heartsLeft = '💙'.repeat(thing.durability);
      const heartsLost = '🖤'.repeat(thing.item.durability - thing.durability);
      hearts = heartsLeft + heartsLost;
    } else {
      hearts = '🖤'.repeat(thing.item.durability);
    }
    return <span className="hearts-display">{hearts}</span>;
  };

  const statusVector: Record<string, string> = {
    'bleed': '🩸',
    'poison': '💚',
    'fire': '🔥'
  };

  const slotClassMap: Record<string, string> =
  {
    weapon: 'weapon-card',
    charm: 'charm-card',
    tool: 'tool-card',
    ore: 'ore-card'
  };


  return (
    <div className="gear-tab">
      <div className="gear-grid">
        {player.hotBar.Equippeable.map((x, y) => {
        return(
          <div 
            key={y}
            className={`
              ${x?.item.slot ? slotClassMap[x?.item.slot] : ''} 
              ${x.equiped ? 'equipped' : ''} 
              ${x.selected ? 'selected' : ''} 
              ${x.onCd ? 'on-cooldown' : ''}
            `}
            style={{ 
              animationDelay: `${y * 0.06}s`,
              ['--cd-time' as any]: `${x.item.attackStats?.cd || 0}ms`
            }}
          >
            <div className="gear-name">{x.item.name}</div>
            <div className="gear-stats-row">
              {x.item.attackStats && <div className="gear-stat"> {x.item.slot=='weapon'?'🗡':'⛏'} {x.item.attackStats?.dmg}</div>}
              {x.item.defenseStats && <div className="gear-stat">🛡 +{x.item.defenseStats?.def}</div>}
              <div className="gear-stat">
                {(x?.item.slot === 'weapon' || x?.item.slot === 'tool') && x.durability && x.item.durability &&
                <DurabilityBar actual={x.durability} total={x.item.durability} slot={x.item.slot}/>}
                {x?.item.slot === 'charm' && renderTalismanHp(x)}
                {x?.item.slot === 'ore' && <div className="gear-stat">[{x.quantity}]</div>}
              </div>
              {(x.item.attackStats?.aliment && x.item.attackStats?.aliment!=='none') && (
                <div className="gear-stat">
                  {statusVector[x.item.attackStats?.aliment]}
                  ({(x.item.attackStats?.DoT || 0) * (x.item.attackStats?.times || 0)})
                </div>
              )}
            </div>
            {x.onCd && <div className="cd-overlay"></div>}
          </div>
        )})}
      </div>
    </div>
  );
};

export default GearTab;