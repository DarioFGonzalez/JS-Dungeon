import React from 'react';
import { Player } from '../types/global';
import './GearTab.css';

interface GearTabProps
{
  player: Player
}

const GearTab: React.FC<GearTabProps> = ({ player }) => {

  return (
    <div onClick={()=>console.log( player ) } className="gear-tab">

      <div className="gear-grid">
        {player.hotBar.Equippeable.map((x, y) => (
          <div onClick={() => console.log(x.item)} key={y}
          className={`${x.item.slot=='weapon'?'weapon-card':'charm-card'} ${x.equiped ? 'equipped' : ''} ${x.selected ? 'selected' : ''}`} >
            <div className="gear-name">{x.item.name}</div>
            <div className="gear-stats-row">
              <div className="gear-stat">🗡 {x.item.attackStats?.dmg ?? '—'}</div>
              <div className="gear-stat">🛡 +{x.item.defenseStats?.def ?? ' —'}</div>
              <div className="gear-stat">
                {x.item.slot === 'weapon' && `🛠 ${x.durability}/${x.item.durability}`}
                {x.item.slot === 'charm' && `💙 ${x.durability}/${x.item.durability}`}
              </div>
              <div className="gear-stat">
                {x.item.attackStats?.aliment
                ? `${x.item.attackStats?.aliment} (${( x.item.attackStats?.DoT ? x.item.attackStats?.DoT : 0 ) * (x.item.attackStats?.times ? x.item.attackStats?.times : 0 ) })`
                : '—'}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GearTab;