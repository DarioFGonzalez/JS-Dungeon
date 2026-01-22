import React from 'react';
import { Player } from '../types/global';
import styles from './ConsumablesTab.module.css';

interface ConsumableTabProps {
  player: Player;
}

const ConsumablesTab: React.FC<ConsumableTabProps> = ({ player }) => {
  return (
    <div className={styles.itemsRow}>
      {player.inventory.slice(0, 6).map((inv) => (
        <div
          key={inv.item.id}
          className={`
            ${styles.itemSlot} 
            ${inv.selected ? styles.selected : ''} 
            ${inv.onCd ? styles.onCd : ''}
          `}
        >
          <img src={inv.item.symbol} alt={inv.item.name} />
          <div className={styles.qty}>{inv.quantity}</div>
        </div>
      ))}

      {Array.from({ length: Math.max(0, 6 - player.inventory.length) }).map((_, i) => (
        <div key={`empty-${i}`} className={styles.itemSlot} />
      ))}
    </div>
  );
};

export default ConsumablesTab;