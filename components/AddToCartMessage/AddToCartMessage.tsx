import Link from 'next/link';
import styles from './AddToCartMessage.module.scss';
import { Book } from '@/types/book';
import SmallItemPreview from '../SmallItemPreview/SmallItemPreview';

type AddToCartMessageProps = {
  setModalOpen: () => void;
  lastItemClicked: Book | null;
};
export default function AddToCartMessage(props: AddToCartMessageProps) {
  const { setModalOpen, lastItemClicked } = props;

  if (!lastItemClicked) {
    return null;
  }

  const { title, price, description, imageUrl } = lastItemClicked;
  const { continueCheckLinksWrapper, header, psuedoLink } = styles;
  return (
    <div>
      <h2 className={header}>You&#39;ve added an item to your cart!</h2>
      {lastItemClicked && (
        <SmallItemPreview
          styles={styles}
          title={title}
          price={price}
          description={description}
          imageUrl={imageUrl}
        />
      )}
      <div className={continueCheckLinksWrapper}>
        <p className={psuedoLink} onClick={setModalOpen}>
          Continue Shopping
        </p>
        <Link onClick={setModalOpen} href="/cart">
          Go to cart
        </Link>
      </div>
    </div>
  );
}
