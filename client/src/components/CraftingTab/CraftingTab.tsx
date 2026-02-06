import React from 'react';
import { Player } from '../types/global';
import styles from './CraftingTab.module.css';


interface GearTabProps {
  player: Player;
}

const GearTab: React.FC<GearTabProps> = ({ player }) =>
{

  return (
    <div className={styles.gearTab}>
      <div className={styles.gearGrid}>

      </div>
    </div>
  );
};

export default GearTab;