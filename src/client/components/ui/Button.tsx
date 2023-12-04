import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

import type { ReactNode, ForwardedRef } from 'react';

interface CommonProps {
  as: 'button' | 'link';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: 'primary' | 'secondary' | 'card';
  ariaLabel?: string;
  rounded?: boolean;
  onMouseEnter?: () => unknown;
  title?: string;
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
  state?: never;
}

interface AsLinkProps {
  as: 'link';
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
  ariaControls?: never;
  ariaExpanded?: never;
  state?: Record<string, unknown>;
}

type ButtonProps = CommonProps & (AsButtonProps | AsLinkProps);

/**
 * @param props The props object that contains the following:
 * @param props.as Whether to render the element as a button ('button') or a link ('link').
 * @param props.type The type of button: 'button', 'submit', or 'reset'. (button)
 * @param props.href The URL to navigate to. (link)
 * @param [props.size='lg'] The size: 'sm', 'md', or 'lg'. Defaults to 'lg'. (button/link)
 * @param [props.colorScheme='main'] The color scheme. Optional. (button/link)
 * @param [props.ariaLabel] The aria-label attribute for accessibility. Optional. (button/link)
 * @param [props.rounded] Whether the element should have rounded edges. Optional, defaults to true. (button/link)
 * @param [props.onMouseEnter] onMouseEnter handler function. Optional. (button/link)
 * @param [props.title] Title (tooltip text). Optional. (button/link)
 * @param [props.onClick] The click handler for the button element. Optional. (button)
 * @param [props.disabled] Whether the button should be disabled. Optional. (button)
 * @param [props.ariaControls] ID of the expandable element that the button controls. Optional. (button)
 * @param [props.ariaExpanded] Whether the controlled element is expanded. Optional. (button)
 * @param [props.state] The state for the link. Optional. (link)
 * @param props.children The content to render inside the button or link.
 * @param [ref] The ref to attach to the element. Optional.
 *
 * @returns The button JSX element.
 */
const Button = forwardRef(
  (
    {
      as,
      type,
      href,
      state,
      onClick,
      disabled,
      size = 'lg',
      colorScheme = 'primary',
      rounded = true,
      onMouseEnter,
      ariaLabel,
      ariaControls,
      ariaExpanded,
      title,
      children,
    }: ButtonProps,
    ref?: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const classes = `${styles.button} ${styles[`button--${size}`]} ${
      colorScheme !== 'primary' && styles[`button--${colorScheme}`]
    } ${rounded ? styles[`button--rounded`] : ''}`;

    if (as === 'link') {
      const linkAttributes = {
        ...(ariaLabel && { 'aria-label': ariaLabel }),
        ...(state && { state }),
        ...(onMouseEnter && { onMouseEnter }),
        ...(title && { title }),
      };

      return (
        <Link
          to={href}
          {...linkAttributes}
          className={classes}
          ref={ref as ForwardedRef<HTMLAnchorElement>}
        >
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
        ...(typeof ariaExpanded === 'boolean' && { 'aria-expanded': ariaExpanded }),
        ...(onMouseEnter && { onMouseEnter }),
        ...(title && { title }),
      };

      return (
        <button
          ref={ref as ForwardedRef<HTMLButtonElement>}
          className={classes}
          {...buttonAttributes}
        >
          {children}
        </button>
      );
    }
  }
);

Button.displayName = 'Button';
export default Button;
