import sharedStyles from 'components/SharedCss/SharedCss.module.scss';
import Home from 'components/Icons/Home';
import Link from 'next/link';
import styles from './PageHeader.module.scss';

type PageHeaderProps = { headerName: string };
export default function PageHeader(props: PageHeaderProps): JSX.Element {
  const { headerName } = props;
  const { size } = styles;
  const { sectionHeader2, headerWrapper } = sharedStyles;
  return (
    <div className={headerWrapper}>
      <h2 className={sectionHeader2}>{headerName}</h2>
      <Link href="/" className={size}>
        <Home fill="black" />
      </Link>
    </div>
  );
}
