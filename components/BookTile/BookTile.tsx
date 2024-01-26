import addToCart from '@/utils/addToCart';
import Button from '../Button/Button';
import styles from './BookTile.module.scss';
import Link from 'next/link';
import { Book } from '@/types/book';
import useCart from '@/hooks/useCart';

type BookTileProps = {
  book: Book;
};

export default function BookTile(props: BookTileProps): JSX.Element {
  const { tileWrapper, title, titleBox, imageContainer, infoWrapper, price } =
    styles;
  const {
    book: { title: t, imageUrl, bookUrl, price: p },
  } = props;
  const [_x, _y, _z, addToCart] = useCart();
  return (
    <Link href={bookUrl} className={tileWrapper}>
      <div className={`${imageContainer} ${styles[imageUrl]}`} />
      <div className={titleBox}>
        <h2 className={title}>{t}</h2>
        <div className={infoWrapper}>
          <Button cb={() => addToCart(props.book)}>Add to Cart</Button>
          <h2 className={price}>${p}</h2>
        </div>
      </div>
    </Link>
  );
}
