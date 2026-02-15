import React, { useState, useEffect } from 'react';
import * as Types from '../types/global';
import styles from './InspectorTab.module.css';

interface InspectorTabProps {
  entity: Types.Enemy;
  bestiary: { name: string; quantity: number }[];
  onClose: () => void;
}

const InspectorTab: React.FC<InspectorTabProps> = ({ entity, bestiary, onClose }) => {
  const beastEntry = bestiary.find(b => b.name === entity.name);
  const kills = beastEntry ? beastEntry.quantity : 0;

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
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
          <div className={styles.kills}>KILLS: {kills}</div>
        </div>
      </div>

      <div className={styles.hearts}>
        {'❤️'.repeat(Math.max(0, entity.hp))}
        <span style={{ opacity: 0.2 }}>{'🖤'.repeat(Math.max(0, entity.maxHp - entity.hp))}</span>
      </div>

      <div className={styles.statsRow}>
        <div className={kills >= 1 ? styles.statCol : styles.lockedCol}>
          <span className={styles.statLabel}>ARM</span>
          <span className={styles.statVal}>🛡️{entity.defense.armor ?? 0}</span>
        </div>
        <div className={kills >= 2 ? styles.statCol : styles.lockedCol}>
          <span className={styles.statLabel}>TGH</span>
          <span className={styles.statVal}>{(entity.defense.toughness ?? 0) > 0 ? `🔨${entity.defense.toughness}` : '🍃'}</span>
        </div>
        <div className={kills >= 2 ? styles.statCol : styles.lockedCol}>
          <span className={styles.statLabel}>RAW</span>
          <span className={styles.statVal}>💥{entity.attack.Instant ?? 0}</span>
        </div>
        <div className={kills >= 1 ? styles.statCol : styles.lockedCol}>
          <span className={styles.statLabel}>ELM</span>
          <span className={styles.statVal}>
            {entity.attack.Aliment ? statusIcons[entity.attack.Aliment] : '👊'}
          </span>
        </div>
      </div>

      <div className={kills >= 3 ? styles.lootArea : styles.lockedArea}>
        <div className={styles.lootList}>
          {entity.drops.map((drop, i) => (
            <div key={i} className={styles.lootItem}>
              <img src={drop.item.symbol} className={styles.itemIcon} alt="" />
              <span className={styles.itemName}>{drop.item.name}</span>
              <span className={styles.itemChance} style={{ color: getChanceColor(drop.chance) }}>
                {drop.chance}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectorTab;