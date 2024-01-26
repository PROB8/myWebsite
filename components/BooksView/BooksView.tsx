'use client';
import BookTile from '../BookTile/BookTile';
import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import ReturnArrow from 'components/ReturnArrow/ReturnArrow';
import PageHeader from '../PageHeader/PageHeader';

export default function BooksView(): JSX.Element {
  const { viewWrapper } = sharedStyles;

  return (
    <div id="articles">
      <PageHeader headerName="myBooks" />
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
    articleUrl: '/item?item_id=01',
    price: 20,
  },
  {
    title: 'Rapid Back-End',
    imageUrl: 'rapidbackend',
    lengthInMinutes: 0,
    publishedDate: 'Aug 1, 2023',
    articleUrl: '/item?item_id=02',
    type: 'ebook',
    isBook: 'true',
    price: 14.99,
  },
];
