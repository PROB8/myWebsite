'use client';
import { useEffect, useState } from 'react';
import useCart from 'hooks/useCart';
import PageHeader from 'components/PageHeader/PageHeader';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import styles from './CartView.module.scss';
import SmallItemPreview from 'components/SmallItemPreview/SmallItemPreview';
import CartItem from '@/types/cartItem';
import loadPaypal, {
  callInternalFulfillmentApi,
  createCartForPaypal,
} from '@/utils/paypal';
import PaypalCartItem from '@/types/paypalCartItem';
import LoadingDots from '../LoadingDots/LoadingDots';
import Modal from '../Modal/Modal';
import useModal from '@/hooks/useModal';
import PaymentResponseMessage from '../PaymentResponseMessage/PaymentResponseMessage';

import { useRouter } from 'next/navigation';

export default function CartVeiw(): JSX.Element {
  const {
    buttonsWrapper,
    cartWrapper,
    cartHeight,
    objectEnterActive,
    objectEnter,
    cartItem,
    width300Center,
    raiseBtns,
  } = styles;
  const { alwaysCentered } = sharedStyles;
  const [addItem, cart, removeItem, clearCart] = useCart();
  const [isOpen, setModalOpen] = useModal();
  const router = useRouter();
  const [showLoadingDots, setShowLoadingDots] = useState(true);
  const [whichHeight, setWhichHeight] = useState<string>(cartHeight);

  const [loadingModalIsOpen, setLodingModalIsOpen] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      setShowLoadingDots(false);
      return;
    }

    let paypalCart: PaypalCartItem[] = [];
    if (cart.length) {
      paypalCart = createCartForPaypal(cart);

      loadPaypal({
        setLodingModalIsOpen,
        setShowLoadingDots,
        purchaseUnits: paypalCart,
        onError: (error: Record<string, unknown>) => {
          setModalOpen();
          setWhichHeight(cartHeight);
          console.error(error);
        },
        onSuccess: (orderData) => {
          setLodingModalIsOpen(true);
          callInternalFulfillmentApi({
            orderData,
            cartHeight,
            setLodingModalIsOpen,
            setWhichHeight,
            router,
            clearCart,
          });
        },
        clearCart,
      }).then(() => {
        // * adjust cart height to show footer
        if (cart.length >= 2) {
          setWhichHeight('');
        }
      });
    }
  }, [cart, cartHeight, clearCart, setModalOpen]);

  return (
    <div id="cart" className={`${whichHeight} ${cartWrapper}`}>
      <PageHeader headerName="cart" hideLinks />
      <div className={showLoadingDots ? objectEnter : objectEnterActive}>
        {cart.length === 0 && (
          <h2 className={`${alwaysCentered} ${width300Center}`}>
            Add items to purchase
          </h2>
        )}
        {cart.map((item: CartItem) => {
          const { id } = item;
          return (
            <div className={cartItem} key={id}>
              <SmallItemPreview
                showCounter
                key={id}
                styles={styles}
                item={item}
                addItem={addItem}
                removeItem={removeItem}
              />
            </div>
          );
        })}
      </div>
      {showLoadingDots && (
        <div className={alwaysCentered}>
          <LoadingDots />
        </div>
      )}
      <div
        id="paypal-button-container"
        className={
          showLoadingDots
            ? `${buttonsWrapper} ${objectEnter} ${raiseBtns}`
            : `${buttonsWrapper} ${objectEnterActive} ${raiseBtns}`
        }
      ></div>
      <Modal
        isOpen={isOpen}
        setModalOpen={setModalOpen}
        hideClose={loadingModalIsOpen}
      >
        {/**
         * USE REACTIVE JS TO UPDATE THE MESSAGE HERE
         * 
         * * 
         */}
        {loadingModalIsOpen && <LoadingDots />}
        {!loadingModalIsOpen && <PaymentResponseMessage />}
      </Modal>
    </div>
  );
}
