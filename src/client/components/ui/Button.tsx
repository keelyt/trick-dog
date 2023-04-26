import { forwardRef } from 'react';

import styles from './Button.module.scss';

import type { ReactNode, ForwardedRef } from 'react';

interface ButtonProps {
  type: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

const Button = forwardRef(
  (
    { type, onClick, disabled = false, children }: ButtonProps,
    ref?: ForwardedRef<HTMLButtonElement>
  ) => {
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
);

Button.displayName = 'Button';
export default Button;
