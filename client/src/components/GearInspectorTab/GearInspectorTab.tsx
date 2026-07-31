import React, { useState, useEffect, useRef } from 'react';
import * as Types from '../types/global';
import styles from './GearInspectorTab.module.css';

interface GearInspectorTabProps {
  children: React.ReactNode;
  gear: Types.InventoryGear;
  onClose: () => void;
}

const GearInspectorTab: React.FC<GearInspectorTabProps> = ({ children, gear, onClose }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 20000);
    return () => clearTimeout(timer);
  }, [gear, onClose]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setShow(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const { clientX, clientY } = e;
    rafId.current = requestAnimationFrame(() => {
      setPosition({ x: clientX, y: clientY });
      rafId.current = null;
    });
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  const statusIcons: Record<string, string> = {
    poison: '💚',
    bleed: '🩸',
    burn: '🔥',
    none: '❌'
  };

  const rangeIcons: Record<string, string> = {
    melee: '⚔',
    ranged: '🏹',
    none: '❌'
  };

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

  const StatCell = ({ label, value }: { label: string; value: React.ReactNode }) => {
    return (
      <div className={styles.statWrapper}>
        <div className={styles.statBox}>
          <span className={styles.label}>{label}</span>
          <span className={styles.val}>{value}</span>
        </div>
      </div>
    );
  };

  const statusDmg = (item: Types.Gear): string => {
    if (item.attackStats?.DoT) {
      return `${item.attackStats?.DoT}x${item.attackStats?.times}`;
    }
    return '❌';
  };

  const showRange = ( item: Types.Gear): string => {
    if(item.style==='ranged') {
      return `${item.attackStats?.range} ${rangeIcons[item.style]}`
    }

    return '👊';
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      {children}
      {show && (
        <div
          className={styles.inspectorTooltip}
          style={{
            position: 'fixed',
            left: position.x + 15,
            top: position.y + 15,
            pointerEvents: 'none'
          }}
        >
          <div className={styles.inspectorContainer}>
            <div className={styles.header}>
              <img src={gear.item.symbol} className={styles.mainIcon} alt={`${gear.item.name} icon`} />
              <div className={styles.titleInfo}>
                <div className={styles.name}>{gear.item.name}</div>
                <div className={styles.desc}>{gear.item.desc}</div>
              </div>
            </div>

            {gear.item.slot === 'charm' && renderTalismanHp(gear)}

            <div className={styles.statsGrid}>
              {gear.item.slot === 'weapon' && (
                <>
                  <StatCell label="Damage" value={`🗡 ${gear.item.attackStats?.dmg ?? 0}`} />
                  <StatCell label="Status" value={statusIcons[gear.item.attackStats?.aliment || 'none']} />
                  <StatCell label="Status dmg" value={statusDmg(gear.item)} />
                  <StatCell label="Range" value={showRange(gear.item)} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GearInspectorTab;