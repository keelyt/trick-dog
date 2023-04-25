import { useRef } from 'react';

import useEscapeKey from '../../helpers/useEscapeKey';
import useOutsideClick from '../../helpers/useOutsideClick';
import useTabFocus from '../../helpers/useTabFocus';

import styles from './Modal.module.scss';

import type { ReactNode } from 'react';

export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}): JSX.Element {
  const innerModalRef = useRef<HTMLDivElement>(null);
  useOutsideClick(onClose, innerModalRef);
  useEscapeKey(onClose);
  useTabFocus(innerModalRef);

  return (
    <div className={styles.modal} tabIndex={-1} aria-modal='true' role='dialog'>
      <div ref={innerModalRef} className={styles.modal__inner}>
        {children}
      </div>
    </div>
  );
}
