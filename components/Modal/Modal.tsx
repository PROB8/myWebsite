import { Dispatch, SetStateAction, useState } from 'react';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import styles from './Modal.module.scss';
import XMark from '../Icons/XMark';

type ModalProps = {
  isOpen: boolean;
  children: unknown;
  setModalOpen: () => void;
};
export default function Modal(props: ModalProps): JSX.Element {
  const { isOpen, children, setModalOpen } = props;
  const { modalWrapper, container, closeButton } = styles;

  if (!isOpen) {
    return <></>;
  }
  return (
    <div id="modal" className={modalWrapper}>
      <div className={container}>
        <div className={closeButton} onClick={setModalOpen}>
          <XMark fill="grey" />
        </div>
        {children as JSX.Element}
      </div>
    </div>
  );
}
