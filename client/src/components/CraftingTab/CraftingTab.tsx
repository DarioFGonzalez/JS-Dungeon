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
            onClick={()=>console.log(recipe)}
            key={index}
            className={`
              ${styles.gearCard}
              ${styles.lootFeedback}
              ${recipe.selected ? styles.selected : ''}
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
                {recipe.ingredients?.map((mat, i) => (
                  <div key={i} className={styles.materialCell}>
                    <span className={styles.matName}>{mat.material.name}</span>
                    <span className={styles.matQty}>({mat.quantity})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CraftingTab;