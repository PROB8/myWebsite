'use client';
import { useCallback, useEffect, useMemo } from 'react';
import useCart from 'hooks/useCart';
import PageHeader from 'components/PageHeader/PageHeader';
import sharedStyles from 'components/SharedCss/Images.module.scss';
import styles from './CartView.module.scss';
import SmallItemPreview from 'components/SmallItemPreview/SmallItemPreview';
import CounterInput from 'components/CounterInput/CounterInput';
import CartItem from '@/types/cartItem';
import loadPaypal from '@/utils/paypal';
import PaypalCartItem from '@/types/paypalCartItem';

export default function CartVeiw(): JSX.Element {
  const [addItem, cart, removeItem] = useCart();
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
      });
    }
  }, [cart]);

  const { imageContainer } = styles;
  return (
    <div id="cart">
      <PageHeader headerName="Cart" hideLinks={true} />
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
      <div id="paypal-button-container"></div>
    </div>
  );
}
