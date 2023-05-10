import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

import type { ReactNode, ForwardedRef } from 'react';

interface CommonProps {
  as: 'button' | 'link';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'main' | 'card';
  ariaLabel?: string;
  rounded?: boolean;
  children: ReactNode;
}

interface AsButtonProps {
  as: 'button';
  href?: never;
  type: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
}

interface AsLinkProps {
  as: 'link';
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
  ariaControls?: never;
  ariaExpanded?: never;
}

type ButtonProps = CommonProps & (AsButtonProps | AsLinkProps);

/**
 * @param props The props object that contains the following:
 * @param props.as Whether to render the element as a button ('button') or a link ('link').
 * @param [props.size='lg'] The size of the button: 'sm', 'md', or 'lg'. Defaults to 'lg'.
 * @param [props.colorScheme='main'] The color scheme of the button or link. Optional.
 * @param [props.rounded] Whether the button should have rounded edges. Defaults to true.
 * @param [props.ariaLabel] The aria-label attribute for accessibility. Optional.
 * @param props.href The URL to navigate to if the element is a link.
 * @param props.type The type of button: 'button', 'submit', or 'reset'.
 * @param [props.onClick] The click handler for the button element. Optional.
 * @param [props.disabled] Whether the button should be disabled. Optional.
 * @param [props.ariaControls] ID of the expandable element that the button controls. Optional.
 * @param [props.ariaExpanded] Whether the controlled element is expanded. Optional.
 * @param props.children The content to render inside the button or link.
 * @param [ref] The ref attached to the button element. Optional.
 * @returns The button JSX element.
 */
const Button = forwardRef(
  (
    {
      as,
      type,
      href,
      onClick,
      disabled,
      size = 'lg',
      colorScheme = 'main',
      rounded = true,
      ariaLabel,
      ariaControls,
      ariaExpanded,
      children,
    }: ButtonProps,
    ref?: ForwardedRef<HTMLButtonElement>
  ) => {
    const classes = `${styles.button} ${styles[`button--${size}`]} ${
      styles[`button--${colorScheme}`]
    } ${rounded ? styles[`button--rounded`] : ''}`;

    if (as === 'link') {
      const linkAttributes = ariaLabel ? { 'aria-label': ariaLabel } : {};

      return (
        <Link to={href} {...linkAttributes} className={classes}>
          {children}
        </Link>
      );
    } else {
      const buttonAttributes = {
        type,
        ...(disabled && { disabled, 'aria-disabled': disabled }),
        ...(onClick && { onClick }),
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        ...(ariaControls && { 'aria-controls': ariaControls }),
        ...(ariaExpanded && { 'aria-expanded': ariaExpanded }),
      };

      return (
        <button ref={ref} className={classes} {...buttonAttributes}>
          {children}
        </button>
      );
    }
  }
);

Button.displayName = 'Button';
export default Button;
