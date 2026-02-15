import React, { useEffect, useState } from 'react';
import { Recipe, Player, InventoryGear } from '../types/global';
import styles from './CraftingTab.module.css';

interface CraftingTabProps {
  recipes: Recipe[];
  player: Player;
}

const CraftingTab: React.FC<CraftingTabProps> = ({ recipes, player }) => {
  const [ materials, setMaterials ] = useState<InventoryGear[]>();

  useEffect( ()=>{
    setMaterials( player.hotBar.Equippeable.filter( x => x.item.type === 'Ore' || x.item.type === 'Reagent' ) )
  }, [player.hotBar]);

  return (
    <div className={styles.gearTab}>
      <div className={styles.gearGrid}>
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className={`
              ${styles.gearCard}
              ${recipe.selected ? styles.selected : ''}
              ${recipe.crafted ? styles.crafted : ''}
              ${recipe.failed ? styles.craftNegated : ''}
            `}
          >
            <div className={styles.iconSection}>
              <div
                className={styles.itemIcon}
                style={{ backgroundImage: `url(${recipe.item.symbol})` }}
              />
            </div>

            <div className={styles.infoSection}>
              <div className={styles.nameRow}>
                {recipe.item.name}
              </div>

              <div className={styles.materialsRow}>
                {recipe.ingredients?.map((mat, i) => {
                  const playerMat = materials?.find(m => m.item.name === mat.material.name);
                  const hasEnough = playerMat && (playerMat.quantity ?? 0) >= mat.quantity;

                  return (
                    <div key={i} className={styles.materialCell}>
                      <span className={styles.matName}>{mat.material.name}</span>
                      <span className={`${styles.matQty} ${!hasEnough ? styles.insufficient : ''}`}>
                        ({mat.quantity})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CraftingTab;