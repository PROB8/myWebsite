import { useEffect, useState } from 'react';
import styles from './ShoppingCartIcon.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import{ itemCountUpdated } from '@/hooks/useCart';

type ShoppingCartIconProps = { unsetPosition: boolean; fill: string };
export default function ShoppingCartIcon(
  props: ShoppingCartIconProps
): JSX.Element {
  const {
    cartLink,
    cartBox,
    fas,
    numOfItems,
    numOfItemsWrapper,
    cartLink2,
    numOfItems2,
  } = styles;
  const { unsetPosition, fill } = props;

  let cartLinkStyles = cartLink;
  let numOfItemsStyles = numOfItems;

  if (unsetPosition) {
    cartLinkStyles = cartLink2;
    numOfItemsStyles = numOfItems2;
  }

  const [itemCount, setItemCount] = useState(0);

  const countUpdatedSubscription = itemCountUpdated.subscribe({
    next: (count: number) => setItemCount(count),
  });

  useEffect(() => {
    return () => {
      countUpdatedSubscription.unsubscribe();
    };
  }, []);

  return (
    <Link href="/cart" className={cartLinkStyles}>
      <div id="cart" className={cartBox}>
        <FontAwesomeIcon
          style={{ color: fill, height: '25px', width: '25px' }}
          className={fas}
          icon={faCartShopping}
        />
        <div className={numOfItemsWrapper}>
          <p className={numOfItemsStyles}>{itemCount}</p>
        </div>
      </div>
    </Link>
  );
}
