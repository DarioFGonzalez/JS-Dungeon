import React, { useEffect, useState } from 'react';
import { Player, InventoryGear, quiverItem } from '../types/global';
import DurabilityBar from './DurabilityBar/DurabilityBar';
import styles from './GearTab.module.css';
import { arrowUp } from '../../Icons/projectileIcons';

interface GearTabProps {
  player: Player;
}

const GearTab: React.FC<GearTabProps> = ({ player }) => {
  const [ammo, setAmmo] = useState<quiverItem[]>();

  useEffect(() => {
    setAmmo(player.quiver);
  }, [player]);

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
    fire: '🔥',
  };

  const slotClassMap: Record<string, string> = {
    charm: styles.charmCard,
    tool: styles.toolCard,
    ore: styles.oreCard,
  };

  const weaponClassMap: Record<string, string> = {
    melee: styles.weaponCard,
    ranged: styles.rangedCard,
  };

  const attkIcon = (item: InventoryGear): string => {
    switch (item.item.slot) {
      case 'weapon':
        const style = item.item.style;
        if (!style) return 'melee';
        return weaponClassMap[style];
      default:
        const slot = item.item.slot;
        if (!slot) return 'charm';
        return slotClassMap[slot];
    }
  };

  const attackIcon = (item: InventoryGear): string => {
    if (item.item.slot === 'tool') return '⛏';
    if (item.item.style === 'melee') return '🗡';
    if (item.item.style === 'ranged') return '🏹';
    return '🥐';
  };

  const hasDurability = (item: InventoryGear): boolean => {
    return (
      item.item.style === 'melee' ||
      item.item.style === 'ranged' ||
      item.item.style === 'tool'
    );
  };

  const ammoColour: Record<string, string> = {
    poison: "#006800",
    fire: "#af1906",
    none: "#864c00"
  }

  const showAmmo = (): any => {
    const equippedRanged = player.hotBar.Equippeable.find(
      (gear: InventoryGear) =>
        gear.equiped &&
        gear.item.slot === 'weapon' &&
        gear.item.style === 'ranged'
    );

    const equippedAmmo = ammo?.find(
      (slot: quiverItem) =>
        slot.selected && slot.ammo.ammoType === equippedRanged?.item.ammoType
    );

    const ammoSymbol = equippedAmmo?.ammo.symbol ?? arrowUp;
    const ammoColor = ammoColour[equippedAmmo?.ammo.attack.Aliment || "none"];

    return (
      <div className={styles.ammoWrapper}>
        <div className={styles.ammoBg}></div> {/* fondo negro */}
        <div 
          className={styles.ammoGradient} 
          style={{ background: `radial-gradient(circle, ${ammoColor} 0%, transparent 70%)` }}
        ></div> {/* gradiente */}
        <div 
          className={styles.ammoIcon} 
          style={{ backgroundImage: `url(${ammoSymbol})` }}
        ></div> {/* ícono */}
        <div className={styles.ammoCount}>{equippedAmmo?.quantity ?? 0}</div> {/* número */}
      </div>
    );
  };

  return (
    <div className={styles.gearTab}>
      <div className={styles.gearGrid}>
        {player.hotBar.Equippeable.map((x: InventoryGear) => (
          <div
            onClick={() => console.log(x)}
            key={x.id}
            className={`
              ${styles.gearCard}
              ${styles.lootFeedback}
              ${attkIcon(x)}
              ${x.equiped ? styles.equipped : ''}
              ${x.selected ? styles.selected : ''}
              ${x.onCd ? styles.onCooldown : ''}
            `}
            style={{
              ['--cd-time' as any]: `${x.item.attackStats?.cd || 0}ms`,
            }}
          >
            <div
              className={styles.itemIcon}
              style={{ backgroundImage: `url(${x.item.symbol})` }}
            />

            <div className={styles.gearName}>{x.item.name}</div>

            {x.selected && (
              <>
                {!(x.item.type === 'Ore' || x.item.type === 'Reagent') && (
                  <div className={styles.hotkeyEquip}>E</div>
                )}
                <div className={styles.hotkeyDel}>X</div>
              </>
            )}

            {x.item.style === 'ranged' && showAmmo()}

            <div className={styles.gearStatsRow}>
              {x.item.attackStats && (
                <div className={styles.gearStat}>
                  {attackIcon(x)} {x.item.attackStats.dmg}
                </div>
              )}
              {x.item.defenseStats && (
                <div className={styles.gearStat}>
                  🛡 +{x.item.defenseStats.def}
                </div>
              )}
              {(hasDurability(x) || x.item.slot === 'tool') && (
                <DurabilityBar
                  actual={x.durability || 1}
                  total={x.item.durability || 1}
                  slot={x.item.slot as string}
                />
              )}
              {x.item.slot === 'charm' && renderTalismanHp(x)}
              {(x.item.slot === 'Ore' || x.item.slot === 'Reagent') && (
                <div className={styles.gearStat}>[{x.quantity}]</div>
              )}
              {x.item.attackStats?.aliment &&
                x.item.attackStats.aliment !== 'none' && (
                  <div className={styles.gearStat}>
                    {statusVector[x.item.attackStats.aliment]}
                    (
                    {(x.item.attackStats.DoT || 0) *
                      (x.item.attackStats.times || 0)}
                    )
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