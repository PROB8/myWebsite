'use client';
import BookTile from '../BookTile/BookTile';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import ReturnArrow from 'components/ReturnArrow/ReturnArrow';
import PageHeader from '../PageHeader/PageHeader';
import { Book } from '@/types/book';
import styles from './BooksView.module.scss';
import useCart from '@/hooks/useCart';

export default function BooksView(): JSX.Element {
  const { viewWrapper } = sharedStyles;
  const { booksWrapper } = styles;
  const [addToCart] = useCart();
  return (
    <div id="books" className={booksWrapper}>
      <PageHeader headerName="myBooks" />
      <div className={viewWrapper}>
        {books.map((a: any) => {
          return <BookTile book={a} key={a.title} addToCart={addToCart} />;
        })}
      </div>
      <ReturnArrow />
    </div>
  );
}

const books: Book[] = [
  {
    title: 'Program Your Life: Lessons of a Software Engineer',
    imageUrl: 'pylcover',
    bookUrl: '/item?item_id=01',
    price: 20,
    id: 1,
  },
  {
    title: 'Rapid Back-End',
    imageUrl: 'rapidbackend',
    bookUrl: '/item?item_id=02',
    price: 14.99,
    id: 2,
  },
];
