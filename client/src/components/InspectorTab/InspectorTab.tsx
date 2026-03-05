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
    const timer = setTimeout(() => onClose(), 1156000);
    return () => clearTimeout(timer);
  }, [entity, onClose]);

  const getChanceColor = (chance: number) => {
    const normalized = Math.pow(chance / 100, 0.6);
    const hue = normalized * 120;
    return `hsl(${hue}, 80%, 50%)`;
  };

  const statusIcons: Record<string, string> = {
    poison: '💚',
    bleed: '🩸',
    burn: '🔥',
    none: '❌'
  };

  const StatCell = ({
    unlocked,
    required,
    label,
    value
  }: {
    unlocked: boolean;
    required: number;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className={styles.statWrapper}>
      <div className={unlocked ? styles.statBox : styles.locked}>
        <span className={styles.label}>{label}</span>
        <span className={styles.val}>{value}</span>
      </div>
      {!unlocked && (
        <div className={styles.statLockOverlay}>
          <span className={styles.statLockLabel}>{label}</span>
          <span className={styles.statLockIcon}>🔒</span>
          <span className={styles.statLockRequirement}>{required} 💀</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.inspectorContainer}>
      <div className={styles.header}>
        <img src={entity.symbol} className={styles.mainIcon} alt="" />
        <div className={styles.titleInfo}>
          <div className={styles.name}>{entity.name}</div>
          <div className={styles.kills}>ELIMINADOS: {kills}💀</div>
        </div>
      </div>

      <div className={styles.heartsArea}>
        {'❤️'.repeat(Math.max(0, entity.hp))}
        <span className={styles.empty}>
          {'🖤'.repeat(Math.max(0, entity.maxHp - entity.hp))}
        </span>
      </div>

      <div className={styles.statsGrid}>
        <StatCell
          unlocked={kills >= 1}
          required={1}
          label="ARMADURA"
          value={`🛡️${entity.defense.armor ?? 0}`}
        />
        <StatCell
          unlocked={kills >= 2}
          required={2}
          label="DUREZA"
          value={`🔨${entity.defense.toughness ?? 0}`}
        />
        <StatCell
          unlocked={kills >= 2}
          required={2}
          label="DAÑO"
          value={`💥${entity.attack.Instant ?? 0}`}
        />
        <StatCell
          unlocked={kills >= 1}
          required={1}
          label="ESTADO"
          value={
            entity.attack.Aliment
              ? statusIcons[entity.attack.Aliment]
              : '❌'
          }
        />
      </div>

      <div className={kills >= 3 ? styles.lootArea : styles.lockedArea}>
        {entity.drops.map((drop, i) => (
          <div key={i} className={styles.lootRow}>
            <div className={styles.lootLeft}>
              <img src={drop.item.symbol} className={styles.itemIcon} alt="" />
              <span className={styles.itemName}>{drop.item.name}</span>
            </div>
            <span
              className={styles.itemChance}
              style={{ color: getChanceColor(drop.chance) }}
            >
              {drop.chance}%
            </span>
          </div>
        ))}
        {kills < 3 && (
          <div className={styles.lootOverlay}>
            <span className={styles.lootLockLabel}>DROPS</span>
            <span className={styles.lootLockIcon}>🔒</span>
            <span className={styles.lootLockRequirement}>3 💀</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectorTab;