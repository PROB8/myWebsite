'use client';
import { useState } from 'react';
import BookTile from '../BookTile/BookTile';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import ReturnArrow from 'components/ReturnArrow/ReturnArrow';
import PageHeader from '../PageHeader/PageHeader';
import { Book } from '@/types/book';
import styles from './ShopView.module.scss';
import useCart from '@/hooks/useCart';
import Modal from '../Modal/Modal';
import useModal from '@/hooks/useModal';
import AddToCartMessage from '../AddToCartMessage/AddToCartMessage';

export default function ShopView(): JSX.Element {
  const [lastItemClicked, setLastItemClicked] = useState<Book | null>(null);
  const [isOpen, setModalOpen] = useModal();
  const [addToCart] = useCart();
  const { viewWrapper } = sharedStyles;
  const { shopWrapper } = styles;
  return (
    <div id="shop" className={shopWrapper}>
      <PageHeader headerName="shop" />
      <div className={viewWrapper}>
        {books.map((a: any) => {
          return (
            <BookTile
              book={a}
              key={a.title}
              addToCart={addToCart}
              openModal={setModalOpen}
              setLastItemClicked={setLastItemClicked}
            />
          );
        })}
      </div>
      <ReturnArrow />
      <Modal isOpen={isOpen} setModalOpen={setModalOpen}>
        <AddToCartMessage
          setModalOpen={setModalOpen}
          lastItemClicked={lastItemClicked}
        />
      </Modal>
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
