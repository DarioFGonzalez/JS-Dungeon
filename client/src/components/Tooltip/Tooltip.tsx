// Tooltip.tsx
import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setShow(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShow(false);
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
          className={styles.tooltip}
          style={{
            position: 'fixed',
            left: position.x + 15,
            top: position.y + 15,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;