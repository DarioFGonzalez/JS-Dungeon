import { InventoryItem } from '../types/global';
import styles from './InventoryTab.module.css';

interface InventoryTabProps {
  inventory: InventoryItem[];
  onClose: () => void;
}

export default function InventoryTab({ inventory, onClose }: InventoryTabProps) {
  return (
    <div className={styles.overlay} tabIndex={0}>
      <div className={styles.window}>

        {/* MENÚS */}
        <div className={styles.menuColumn}>
          {['Inventario', 'Crafting', 'Equipo', 'Stats', 'Opciones'].map((label, i) => (
            <div key={i} className={styles.menuCard}>
              {label}
            </div>
          ))}
        </div>

        {/* ITEMS */}
        <div className={styles.itemsRow}>
          {inventory.slice(0, 6).map((inv, i) => (
            <div
              key={inv.item.id}
              className={`${styles.itemSlot} ${inv.onCd ? styles.onCd : ''}`}
            >
              <img src={inv.item.symbol} alt={inv.item.name} />
              <div className={styles.qty}>{inv.quantity}</div>
            </div>
          ))}

          {Array.from({ length: Math.max(0, 6 - inventory.length) }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.itemSlot} />
          ))}
        </div>

        <button className={styles.closeHint} onClick={onClose}>
          TAB para cerrar
        </button>

      </div>
    </div>
  );
}