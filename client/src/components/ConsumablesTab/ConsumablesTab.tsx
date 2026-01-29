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
            style={{ ['--cd-time' as any]: `${inv.item.cd}ms` }}
          >
            <div key={inv.quantity} className={styles.innerFlash}>
              {inv.onCd ? (
                <>
                  <img 
                    src={inv.item.symbol} 
                    className={`${styles.itemIcon} ${styles.grayed}`} 
                    alt="" 
                  />
                  <img 
                    src={inv.item.symbol} 
                    className={`${styles.itemIcon} ${styles.cdAnimation}`} 
                    alt="" 
                  />
                </>
              ) : (
                <img 
                  src={inv.item.symbol} 
                  className={styles.itemIcon} 
                  alt="" 
                />
              )}

              <div className={styles.qty}>{inv.quantity}</div>
            </div>

            {inv.selected && <div className={styles.hotkey}>Q</div>}
          </div>
        ))}

        {Array.from({ length: Math.max(0, 6 - player.inventory.length) }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.itemSlot} />
        ))}
      </div>

      <div className={styles.itemLabel}>
        {selectedItem 
          ? selectedItem.item.name.toUpperCase() + ' ' + 
            (selectedItem.item.cleanse ? `(${statusVector[selectedItem.item.cleanse]})` : selectedItem.item.heal ? '(💖)' : '') 
          : ""}
      </div>
    </div>
  );
};

export default ConsumablesTab;