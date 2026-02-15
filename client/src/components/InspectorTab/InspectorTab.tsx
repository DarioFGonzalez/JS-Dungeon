import React, { useEffect } from 'react';
import * as Types from '../types/global';
import styles from './InspectorTab.module.css';

interface InspectorTabProps {
  entity: Types.Enemy;
  bestiary: Types.BestiaryItem[];
  onClose: () => void;
}

const InspectorTab: React.FC<InspectorTabProps> = ({ entity, bestiary, onClose }) => {
  const beastEntry = bestiary.find(b => b.name === entity.name);
  const kills = beastEntry ? beastEntry.quantity : 0;

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 6000);
    return () => clearTimeout(timer);
  }, [entity, onClose]);

  const getChanceColor = (chance: number) => {
    if (chance <= 25) return '#ff4d4d';
    if (chance <= 50) return '#ff944d';
    if (chance <= 75) return '#ffd11a';
    return '#4dff88';
  };

  const statusIcons: Record<string, string> = {
    Poisoned: '💚', Bleeding: '🩸', Burning: '🔥'
  };

  return (
    <div className={styles.inspectorContainer}>
      <div className={styles.header}>
        <img src={entity.symbol} className={styles.mainIcon} alt="" />
        <div className={styles.titleInfo}>
          <div className={styles.name}>{entity.name}</div>
          <div className={styles.kills}>ELIMINADOS: {kills}</div>
        </div>
      </div>

      <div className={styles.heartsArea}>
        {'❤️'.repeat(Math.max(0, entity.hp))}
        <span className={styles.empty}>{'🖤'.repeat(Math.max(0, entity.maxHp - entity.hp))}</span>
      </div>

      <div className={styles.statsGrid}>
        <div className={kills >= 1 ? styles.statBox : styles.locked}>
          <span className={styles.label}>ARM</span>
          <span className={styles.val}>🛡️{entity.defense.armor ?? 0}</span>
        </div>
        <div className={kills >= 2 ? styles.statBox : styles.locked}>
          <span className={styles.label}>TGH</span>
          <span className={styles.val}>🔨{entity.defense.toughness ?? 0}</span>
        </div>
        <div className={kills >= 2 ? styles.statBox : styles.locked}>
          <span className={styles.label}>RAW</span>
          <span className={styles.val}>💥{entity.attack.Instant ?? 0}</span>
        </div>
        <div className={kills >= 1 ? styles.statBox : styles.locked}>
          <span className={styles.label}>ELM</span>
          <span className={styles.val}>
            {entity.attack.Aliment ? (statusIcons[entity.attack.Aliment] || '✨') : '👊'}
          </span>
        </div>
      </div>

      <div className={kills >= 3 ? styles.lootArea : styles.lockedArea}>
        {entity.drops.map((drop, i) => (
          <div key={i} className={styles.lootRow}>
            <div className={styles.lootLeft}>
              <img src={drop.item.symbol} className={styles.itemIcon} alt="" />
              <span className={styles.itemName}>{drop.item.name}</span>
            </div>
            <span className={styles.itemChance} style={{ color: getChanceColor(drop.chance) }}>
              {drop.chance}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspectorTab;