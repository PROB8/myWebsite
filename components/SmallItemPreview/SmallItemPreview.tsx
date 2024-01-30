import sharedStyles from 'components/SharedCss/Images.module.scss';

type SmallItemPreviewProps = {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  styles: {
    readonly [key: string]: string;
  };
};
export default function SmallItemPreview(
  props: SmallItemPreviewProps
): JSX.Element {
  const { title, price, imageUrl, styles } = props;
  const {
    imageContainer,
    itemDescription,
    smallItemPreviewWrapper,
    imageWrapper,
  } = styles;
  return (
    <div className={smallItemPreviewWrapper}>
      <div className={imageWrapper}>
        <div className={`${imageContainer} ${sharedStyles[imageUrl]}`} />
      </div>
      <div className={itemDescription}>
        <p>{title}</p>
        <p>${price}</p>
      </div>
    </div>
  );
}
