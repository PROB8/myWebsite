import { Dispatch, SetStateAction, useState } from 'react';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import styles from './Modal.module.scss';
import XMark from '../Icons/XMark';

type ModalProps = {
  hideClose: boolean;
  isOpen: boolean;
  children: unknown;
  setModalOpen: () => void;
};
export default function Modal(props: ModalProps): JSX.Element {
  const { isOpen, children, setModalOpen, hideClose } = props;
  const { modalWrapper, container, closeButton, closeButtonOutterWrapper } =
    styles;

  if (!isOpen) {
    return <></>;
  }
  return (
    <div id="modal" className={modalWrapper}>
      <div className={container}>
        <div className={closeButtonOutterWrapper}>
          {!hideClose && (
            <div className={closeButton} onClick={setModalOpen}>
              <XMark fill="grey" />
            </div>
          )}
        </div>
        {children as JSX.Element}
      </div>
    </div>
  );
}
