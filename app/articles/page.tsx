import Footer from 'components/Footer/Footer';
import '../globals.css';
import ArticleTileView from 'components/ArticleTileView/ArticleTileView';

export default function Blog(): JSX.Element {
  return (
    <>
      <ArticleTileView sharedHeader />
      <Footer />
    </>
  );
}
