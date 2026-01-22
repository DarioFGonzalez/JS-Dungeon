import React from 'react';
import { Player } from '../types/global';
import styles from './ConsumablesTab.module.css';

interface ConsumableTabProps {
  player: Player;
}

const ConsumablesTab: React.FC<ConsumableTabProps> = ({ player }) => {
  const selectedItem = player.inventory.find(inv => inv.selected);

  const statusVector: Record<string, string> = {
    bleed: '🩸',
    poison: '💚',
    burn: '🔥',
    heal: '💖'
  };

  return (
    <div className={styles.consumablesWrapper}>
      <div className={styles.itemsRow}>
        {player.inventory.slice(0, 6).map((inv, index) => (
          <div
            key={index}
            className={`${styles.itemSlot} ${inv.selected ? styles.selected : ''}`}
          >
            <img src={inv.item.symbol} alt="" />
            <div className={styles.qty}>{inv.quantity}</div>
            {inv.selected && <div className={styles.hotkey}>Q</div>}
          </div>
        ))}
        {Array.from({ length: Math.max(0, 6 - player.inventory.length) }).map((_, i) => (
          <div key={i} className={styles.itemSlot} />
        ))}
      </div>
      <div className={styles.itemLabel}>
        {selectedItem ? selectedItem.item.name.toUpperCase() + ' ' + ( selectedItem.item.cleanse!==undefined ? `(${statusVector[selectedItem.item.cleanse]})` : selectedItem.item.heal ? '(💖)' : '' )  : ""}
      </div>
    </div>
  );
};

export default ConsumablesTab;