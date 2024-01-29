import Link from 'next/link';
import styles from './AddToCartMessage.module.scss';
import imageStyles from 'components/SharedCss/Images.module.scss';
import { Book } from '@/types/book';

type AddToCartMessageProps = {
  setModalOpen: () => void;
  lastItemClicked: Book | null;
};
export default function AddToCartMessage(props: AddToCartMessageProps) {
  const { setModalOpen, lastItemClicked } = props;
  const {
    continueCheckLinksWrapper,
    smallItemPreviewWrapper,
    header,
    imageContainer,
    itemDescription,
  } = styles;
  return (
    <div>
      <h2 className={header}>You&#39;ve added an item to your cart!</h2>
      {lastItemClicked && (
        <div className={smallItemPreviewWrapper}>
          <div
            className={`${imageContainer} ${
              imageStyles[lastItemClicked.imageUrl]
            }`}
          />
          <div className={itemDescription}>
            <p>{lastItemClicked.title}</p>
            <p>${lastItemClicked.price}</p>
          </div>
        </div>
      )}
      <div className={continueCheckLinksWrapper}>
        <Link href="javascript:void(0);" onClick={setModalOpen}>
          Continue Shopping
        </Link>
        <Link href="/cart">Go to cart</Link>
      </div>
    </div>
  );
}
