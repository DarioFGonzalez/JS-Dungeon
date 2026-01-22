import React from 'react';
import { Player } from '../types/global';
import DurabilityBar from './DurabilityBar/DurabilityBar';
import styles from './GearTab.module.css';

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
    return <span className={styles.heartsDisplay}>{hearts}</span>;
  };

  const statusVector: Record<string, string> = {
    bleed: '🩸',
    poison: '💚',
    fire: '🔥'
  };

  const slotClassMap: Record<string, string> = {
    weapon: styles.weaponCard,
    charm: styles.charmCard,
    tool: styles.toolCard,
    ore: styles.oreCard
  };

  return (
    <div className={styles.gearTab}>
      <div className={styles.gearGrid}>
        {player.hotBar.Equippeable.map((x: any, y: number) => (
          <div
            key={y}
            className={`
              ${styles.gearCard}
              ${x.item.slot ? slotClassMap[x.item.slot] : ''}
              ${x.equiped ? styles.equipped : ''}
              ${x.selected ? styles.selected : ''}
              ${x.onCd ? styles.onCooldown : ''}
            `}
            style={{
              ['--cd-time' as any]: `${x.item.attackStats?.cd || 0}ms`
            }}
          >
            <div
              className={styles.itemIcon}
              style={{ backgroundImage: `url(${x.item.symbol})` }}
            />
            <div className={styles.gearName}>{x.item.name}</div>
            <div className={styles.gearStatsRow}>
              {x.item.attackStats && (
                <div className={styles.gearStat}>
                  {x.item.slot === 'weapon' ? '🗡' : '⛏'} {x.item.attackStats.dmg}
                </div>
              )}
              {x.item.defenseStats && (
                <div className={styles.gearStat}>
                  🛡 +{x.item.defenseStats.def}
                </div>
              )}
              {(x.item.slot === 'weapon' || x.item.slot === 'tool') &&
                x.durability !== undefined &&
                x.item.durability !== undefined && (
                  <DurabilityBar
                    actual={x.durability}
                    total={x.item.durability}
                    slot={x.item.slot}
                  />
                )}
              {x.item.slot === 'charm' && renderTalismanHp(x)}
              {x.item.slot === 'ore' && (
                <div className={styles.gearStat}>[{x.quantity}]</div>
              )}
              {x.item.attackStats?.aliment &&
                x.item.attackStats.aliment !== 'none' && (
                  <div className={styles.gearStat}>
                    {statusVector[x.item.attackStats.aliment]}
                    ({(x.item.attackStats.DoT || 0) * (x.item.attackStats.times || 0)})
                  </div>
                )}
            </div>
            {x.onCd && <div className={styles.cdOverlay} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GearTab;