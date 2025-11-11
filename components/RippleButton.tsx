import React, { useState, useRef } from 'react';
import styles from './RippleButton.module.css';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  rippleColor?: string;
}

export default function RippleButton({ 
  children, 
  className = '', 
  onClick, 
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  ...props 
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleCounter = useRef(0);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: rippleCounter.current++,
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    // Call original onClick
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...props}
      className={`${styles.rippleButton} ${className}`}
      onClick={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: rippleColor
          }}
        />
      ))}
    </button>
  );
}