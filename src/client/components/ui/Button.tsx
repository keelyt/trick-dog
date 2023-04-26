import styles from './Button.module.scss';

import type { ReactNode, RefObject } from 'react';

interface ButtonProps {
  type: 'button' | 'submit';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ref?: RefObject<HTMLButtonElement>;
}

export default function Button({ type, children, onClick, disabled = false, ref }: ButtonProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={styles.button}
    >
      {children}
    </button>
  );
}
