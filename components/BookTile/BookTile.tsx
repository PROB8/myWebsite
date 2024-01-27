import addToCart from '@/utils/addToCart';
import Button from '../Button/Button';
import styles from './BookTile.module.scss';
import Link from 'next/link';
import { Book } from '@/types/book';
import { Dispatch, SetStateAction } from 'react';
import CartItem from '@/types/cartItem';

type BookTileProps = {
  book: Book;
  addToCart: (arg: Book) => void;
};

export default function BookTile(props: BookTileProps): JSX.Element {
  const { tileWrapper, title, titleBox, imageContainer, infoWrapper, price } =
    styles;
  const {
    addToCart,
    book: { title: t, imageUrl, bookUrl, price: p },
  } = props;
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
