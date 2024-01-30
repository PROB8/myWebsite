'use client';
import useCart from 'hooks/useCart';
import PageHeader from 'components/PageHeader/PageHeader';
import sharedStyles from 'components/SharedCss/Images.module.scss';
import styles from './CartView.module.scss';
import SmallItemPreview from 'components/SmallItemPreview/SmallItemPreview';
import CounterInput from 'components/CounterInput/CounterInput';
import CartItem from '@/types/cartItem';

export default function CartVeiw(): JSX.Element {
  const [addItem, cart, removeItem] = useCart();
  const { imageContainer } = styles;
  return (
    <div id="cart">
      <PageHeader headerName="Cart" hideLinks={true} />
      {cart.map((item: CartItem) => {
        const { title, price, description, imageUrl, id } = item;
        const { cartItem } = styles;
        return (
          <div className={cartItem}>
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
  );
}
