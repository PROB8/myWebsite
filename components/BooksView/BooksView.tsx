'use client';
import BookTile from '../BookTile/BookTile';
import styles from './BooksView.module.scss';
import sharedStyles from '../SharedCss/SharedCss.module.scss';
import ReturnArrow from '../ReturnArrow/ReturnArrow';

export default function BooksView(): JSX.Element {
  const { } = styles;
  const { sectionHeader, viewWrapper } = sharedStyles;
  return (
    <div id="articles">
      <h2 className={sectionHeader}>myBooks</h2>
      <div className={viewWrapper}>
        {books.map((a: any) => {
          return <BookTile article={a} key={a.title} />;
        })}
      </div>
      <ReturnArrow />
    </div>
  );
}

const books = [
  {
    title: 'Program Your Life: Lessons of a Software Engineer',
    imageUrl: 'pylcover',
    lengthInMinutes: 0,
    publishedDate: 'Jan 1, 2019',
    isBook: true,
    type: 'Book',
    articleUrl:'/item?item_id=01',
    price: 20
  },
  {
    title: 'Rapid Back-End',
    imageUrl: 'rapidbackend',
    lengthInMinutes: 0,
    publishedDate: 'Aug 1, 2023',
    articleUrl: '/item?item_id=02',
    type: 'ebook',
    isBook: 'true',
    price: 14.99
  },
];
