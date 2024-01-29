import { useState } from 'react';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import styles from './ShopView.module.scss';

type ModalProps = {
  isOpen: boolean;
  children: JSX.Element;
};
export default function Modal(props: ModalProps): JSX.Element {
  const { isOpen, children } = props;
  const { viewWrapper } = sharedStyles;
  const { modalWrapper } = styles;
  const [openModal, setOpenModal] = useState(isOpen)
  if (!openModal) {
    return <></>;
  }
  return (
    <div id="modal" className={modalWrapper}>
      <div className={viewWrapper}></div>
      {children}
    </div>
  );
}
