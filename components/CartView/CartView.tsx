'use client';
import { useEffect, useState, useCallback } from 'react';
import PageHeader from 'components/PageHeader/PageHeader';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import SmallItemPreview from 'components/SmallItemPreview/SmallItemPreview';
import CartItem from '@/types/cartItem';
import PaypalCartItem from '@/types/paypalCartItem';
import LoadingDots from '../LoadingDots/LoadingDots';
import Modal from '../Modal/Modal';
import PaymentResponseMessage from '../PaymentResponseMessage/PaymentResponseMessage';

import useCart from 'hooks/useCart';
import useModal from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import { OrderResponseBody } from '@paypal/paypal-js';
import loadPaypal, {
  callInternalFulfillmentApi,
  createCartForPaypal,
} from '@/utils/paypal';

import styles from './CartView.module.scss';

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

  const onSuccess = useCallback(
    (orderData: OrderResponseBody): void => {
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
    [cartHeight]
  );

  const onError = useCallback(
    (error: Record<string, unknown>) => {
      setModalOpen();
      setWhichHeight(cartHeight);
      console.error(error);
    },
    [cartHeight]
  );

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
        onError,
        onSuccess,
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
      <PageHeader headerName="cart" hideLinks={cart.length !== 0} />
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
