'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useCart from 'hooks/useCart';
import PageHeader from 'components/PageHeader/PageHeader';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import styles from './CartView.module.scss';
import SmallItemPreview from 'components/SmallItemPreview/SmallItemPreview';
import CounterInput from 'components/CounterInput/CounterInput';
import CartItem from '@/types/cartItem';
import loadPaypal from '@/utils/paypal';
import PaypalCartItem from '@/types/paypalCartItem';
import LoadingDots from '../LoadingDots/LoadingDots';

export default function CartVeiw(): JSX.Element {
  const { buttonsWrapper, cartWrapper, objectEnterActive, objectEnter } =
    styles;
  const { alwaysCentered } = sharedStyles;
  const [addItem, cart, removeItem] = useCart();
  const [showLoadingDots, setShowLoadingDots] = useState(true);
  const [whichHeight, setWhichHeight] = useState(cartWrapper)

  useEffect(() => {
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
        purchaseUnits: paypalCart,
        onSuccess: () => {
          console.log('i Succeeded');
        },
      }).then(() => {
        if (cart.length >= 2) {
          setWhichHeight('')
        }
        setShowLoadingDots(false);

      });
    }
  }, [cart]);

  return (
    <div
      id="cart"
      className={whichHeight}
    >
      <PageHeader headerName="Cart" hideLinks={true} />
      <div className={showLoadingDots ? objectEnter : objectEnterActive}>
        {cart.map((item: CartItem) => {
          const { title, price, description, imageUrl, id } = item;
          const { cartItem } = styles;
          return (
            <div className={cartItem} key={id}>
              <SmallItemPreview
                key={id}
                title={title}
                price={price}
                description={description}
                imageUrl={imageUrl}
                styles={styles}
              />
              <CounterInput
                item={item}
                addItem={addItem}
                removeItem={removeItem}
              />
            </div>
          );
        })}
      </div>
      {showLoadingDots && <div className={alwaysCentered}><LoadingDots /></div>}
      <div
        id="paypal-button-container"
        className={
          showLoadingDots
            ? `${buttonsWrapper} ${objectEnter}`
            : `${buttonsWrapper} ${objectEnterActive}`
        }
      ></div>
    </div>
  );
}
