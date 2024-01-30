import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import Home from 'components/Icons/Home';
import Link from 'next/link';
import styles from './PageHeader.module.scss';
import ShoppingCartIcon from '../ShoppingCartIcon/ShoppingCartIcon';

type PageHeaderProps = { headerName: string; hideLinks: boolean };
export default function PageHeader(props: PageHeaderProps): JSX.Element {
  const { headerName, hideLinks } = props;
  const { size, twoItemWrapper } = styles;
  const { sectionHeader2, headerWrapper } = sharedStyles;
  return (
    <div className={headerWrapper}>
      <h2 className={sectionHeader2}>{headerName}</h2>
      {!hideLinks && (
        <div className={twoItemWrapper}>
          <Link href="/" className={size}>
            <Home fill="black" />
          </Link>
          <ShoppingCartIcon unsetPosition fill="black" />
        </div>
      )}
    </div>
  );
}
