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
  const [addItem, cart, removeItem] = useCart();
  const [showLoadingDots, setShowLoadingDots] = useState(true)
useEffect(() => {
    if (cart.length) {
      let paypalCart: PaypalCartItem[] = [];
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
        setShowLoadingDots(false)
      });
    }
  }, [cart]);

  const { buttonsWrapper, cartWrapper,objectEnterActive , objectEnter } = styles;
  const { alwaysCentered } = sharedStyles;
  return (
    <div id="cart" className={cart.length === 1 || cart.length === 0 ? cartWrapper : ''}>
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
      <div className={alwaysCentered}>
        {showLoadingDots && <LoadingDots />}
      </div>
      <div id="paypal-button-container"className={showLoadingDots ? `${buttonsWrapper} ${objectEnter}` : `${buttonsWrapper} ${objectEnterActive}`}></div>
    </div>
  );
}
