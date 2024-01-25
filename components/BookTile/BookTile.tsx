import Button from '../Button/Button';
import styles from './BookTile.module.scss';
import Link from 'next/link';

type BookTileProps = {
    article: {
        title: string;
        imageUrl: string;
    articleUrl: string;
    price?: number
  };
};

export default function BookTile(props: BookTileProps): JSX.Element {
  const {
    tileWrapper,
    title,
    titleBox,
    imageContainer,
    infoWrapper,
    price
  } = styles;
  const {
    article: {
      title: t,
      imageUrl,
      articleUrl,
      price: p
    },
  } = props;

  return (
    <Link href={articleUrl} className={tileWrapper}>
      <div className={`${imageContainer} ${styles[imageUrl]}`} />
      <div className={titleBox}>
        <h2 className={title}>{t}</h2>
        <div className={infoWrapper}>
            <Button children="Add to Cart" cb={() => console.log('clicking me')} />
            <h2 className={price}>${p}</h2>
        </div>
      </div>
    </Link>
  );
}
