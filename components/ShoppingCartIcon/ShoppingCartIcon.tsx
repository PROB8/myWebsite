import styles from './ShoppingCartIcon.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function ShoppingCartIcon(): JSX.Element {
  const { cartLink, cartBox, fas } = styles;

  return (
    <Link href="/cart" className={cartLink}>
      <div id="cart" className={cartBox}>
        <FontAwesomeIcon className={fas} icon={faCartShopping} />
      </div>
    </Link>
  );
}
