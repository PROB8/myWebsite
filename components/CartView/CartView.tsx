'use client';
import { useEffect, useState } from 'react';
import useCart from 'hooks/useCart';
import PageHeader from 'components/PageHeader/PageHeader';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import styles from './CartView.module.scss';
import SmallItemPreview from 'components/SmallItemPreview/SmallItemPreview';
import CartItem from '@/types/cartItem';
import loadPaypal, {
  callBackend,
  callInternalFulfillmentApi,
} from '@/utils/paypal';
import PaypalCartItem from '@/types/paypalCartItem';
import LoadingDots from '../LoadingDots/LoadingDots';
import Modal from '../Modal/Modal';
import useModal from '@/hooks/useModal';
import PaymentResponseMessage from '../PaymentResponseMessage/PaymentResponseMessage';
import { OrderResponseBody } from '@paypal/paypal-js';

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
  const [showLoadingDots, setShowLoadingDots] = useState(true);
  const [whichHeight, setWhichHeight] = useState<string>(cartHeight);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [loadingModalIsOpen, setLodingModalIsOpen] = useState(false);
  const [showButtonContainer, setShowButtonContainer] = useState(true);

  const callBackendSubscription = callBackend.subscribe({
    next: (orderData: OrderResponseBody) => {
      const payPalButtonContainer = document.getElementById(
        'paypal-button-container'
      );

      callInternalFulfillmentApi({
        orderData,
        setLodingModalIsOpen,
        setPaymentSuccessful,
        setShowButtonContainer,
        payPalButtonContainer,
        setWhichHeight,
        cartHeight,
      });
    },
  });

  useEffect(() => {
    return () => {
      callBackendSubscription.unsubscribe();
    };
  }, [callBackendSubscription]);

  const [isOpen, setModalOpen] = useModal();

  useEffect(() => {
    if (cart.length === 0) {
      setShowLoadingDots(false);
      return;
    }
    let paypalCart: PaypalCartItem[] = [];
    if (cart.length) {
      for (const item of cart) {
        for (let i = 0; i < item.quantity; i++) {
          paypalCart = [
            ...paypalCart,
            {
              reference_id: `${item.id}-${i}`,
              amount: { currency_code: 'USD', value: item.price },
            },
          ];
        }
      }

      loadPaypal({
        setLodingModalIsOpen,
        setModalOpen,
        setShowLoadingDots,
        purchaseUnits: paypalCart,
        onError: () => {
          setWhichHeight(cartHeight);
        },
        onSuccess: () => {
          setLodingModalIsOpen(false);
          setPaymentSuccessful(true);
          setShowButtonContainer(false);
        },
        clearCart,
      }).then(() => {
        // * adjust cart height to show footer
        if (cart.length >= 2) {
          setWhichHeight('');
        }
        // setShowLoadingDots(false);
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
        {loadingModalIsOpen && <LoadingDots />}
        {!loadingModalIsOpen && (
          <PaymentResponseMessage paymentSuccessful={paymentSuccessful} />
        )}
      </Modal>
    </div>
  );
}
