import { useRef } from 'react';

import useEscapeKey from '../../helpers/useEscapeKey';
import useOutsideClick from '../../helpers/useOutsideClick';

import styles from './Modal.module.scss';

import type { ReactNode } from 'react';

export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}): JSX.Element {
  const innerModalRef = useRef(null);
  useOutsideClick(onClose, innerModalRef);
  useEscapeKey(onClose);

  return (
    <div className={styles.modal}>
      <div ref={innerModalRef} className={styles.modal__inner}>
        {children}
      </div>
    </div>
  );
}
