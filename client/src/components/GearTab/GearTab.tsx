import React from 'react';
import {Player} from '../types/global';
import './GearTab.css';

interface GearTabProps
{
  player: Player
}

const GearTab: React.FC<GearTabProps> = ({ player }) => {
  return (
    <div className="gear-tab">
      <div className="gear-grid">
        {player.HotBar.Equippeable.map((x, y) => (
          <div
            onClick={() => console.log(x.item)}
            key={y}
            className={`gear-card ${x.equiped ? 'equipped' : ''} ${x.selected ? 'selected' : ''}`}
          >
            <div className="gear-name">{x.item.name}</div>
            <div className="gear-stats-row">
              <div className="gear-stat">🗡 {x.item.attackStats?.dmg ?? 0}</div>
              <div className="gear-stat">🛡 +{x.item.defenseStats?.def ?? 0}</div>
              <div className="gear-stat">
                {x.item.slot === 'weapon' && `🛠 ${x.durability}/${x.item.durability}`}
                {x.item.slot === 'charm' && `💙 ${x.durability}/${x.item.durability}`}
              </div>
              <div className="gear-stat">
                {x.item.attackStats?.aliment ? x.item.attackStats?.aliment : '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GearTab;