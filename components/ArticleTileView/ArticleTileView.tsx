'use client';
import ArticleTile from '../ArticleTile/ArticleTile';
import styles from './ArticleTileView.module.scss';
import sharedStyles from '../SharedCss/SharedCss.module.scss';
import ReturnArrow from '../ReturnArrow/ReturnArrow';

export default function ArticleTileView(): JSX.Element {
  const { viewWrapper } = styles;
  const { sectionHeader } = sharedStyles;
  return (
    <div id="articles">
      <h2 className={sectionHeader}>myArticles</h2>
      <div className={viewWrapper}>
        {articles.map((a: any) => {
          return <ArticleTile article={a} key={a.title} />;
        })}
      </div>
      <ReturnArrow />
    </div>
  );
}

const articles = [
  {
    title: 'Exploring Functions as Microservices: A Powerful Approach...',
    imageUrl: 'exprapidbackend',
    lengthInMinutes: 3,
    publishedDate: 'Jun 11, 2023',
    articleUrl:
      '/interstitial?url=https://medium.com/@naeemgtng/exploring-functions-as-microservices-a-powerful-approach-for-cloud-based-applications-d7fdfe4c9e1e&where=Medium',
  },
  {
    title: 'Do I really need a CKA certification?',
    imageUrl: 'expcka',
    lengthInMinutes: 4,
    publishedDate: 'Jun 5, 2023',
    articleUrl:
      '/interstitial?url=https://medium.com/@naeemgtng/do-i-really-need-a-cka-certification-60f626bebf0e&where=Medium',
  },
  {
    title: 'AWS IAM — Quick Dive/Quick Guide',
    imageUrl: 'awsiam',
    lengthInMinutes: 6,
    publishedDate: 'May 28, 2023',
    articleUrl:
      '/interstitial?url=https://medium.com/p/bfc198770bb5&where=Medium',
  },
  {
    title: "Are JavaScript's default parameters slowing me down?",
    imageUrl: 'dontpanic',
    lengthInMinutes: 3,
    publishedDate: 'Nov 27, 2020',
    articleUrl:
      '/interstitial?url=https://naeemgtng.medium.com/dont-use-default-parameters-91cde9abde&where=Medium',
  },
  {
    title: "JavaScript's New Sexy",
    imageUrl: 'jsnew',
    lengthInMinutes: 5,
    publishedDate: 'Aug 30, 2020',
    articleUrl:
      '/interstitial?url=https://medium.com/p/javascripts-new-sexy-2843b0cf4a06&where=Medium',
  },
  {
    title: 'Explain Servers to a 5 Year Old',
    imageUrl: 'explservers',
    lengthInMinutes: 3,
    publishedDate: 'Jul 25, 2020',
    articleUrl:
      '/interstitial?url=https://medium.com/p/explain-servers-to-a-5-year-old-c59f8a4a2fac&where=Medium',
  },
  {
    title: 'Deploy GoLambda With MongoDB and AWS SAM (Part 3)',
    imageUrl: 'samgolambda',
    lengthInMinutes: 11,
    publishedDate: 'Dec 29, 2019',
    articleUrl:
      '/interstitial?url=https://betterprogramming.pub/sam-deploys-golambda-w-mongodb-a03cd97bae45?source=friends_link&sk=21ab91d7cfdf2242928e9de61fab4f93&where=Medium',
  },
  {
    title: 'XML, read, send, write: Javascript front to Express/Node.js back',
    imageUrl: 'xml',
    lengthInMinutes: 4,
    publishedDate: 'Sep 2, 2019',
    articleUrl:
      '/interstitial?url=https://medium.com/swlh/xml-read-send-write-javascript-front-to-node-back-167df21c98df?source=friends_link&sk=0a7a38647a21182748516408a15b24ba&where=Medium',
  },
  {
    title: 'Micro Services Part II: AWS EC2 Linux AMIs',
    imageUrl: 'mspt2',
    lengthInMinutes: 4,
    publishedDate: 'Mar 16, 2019',
    articleUrl:
      '/interstitial?url=https://faun.pub/micro-services-part-ii-aws-ec2-linux-amis-4e5e644aa43a?source=friends_link&sk=0d641edad9f092218a1e5543c7cf1d82&where=Medium',
  },
  {
    title: 'Micro Services Part I: Node, Docker, and Docker Compose',
    imageUrl: 'mspt1',
    lengthInMinutes: 5,
    publishedDate: 'Mar 9, 2019',
    articleUrl:
      '/interstitial?url=https://medium.com/p/micro-services-part-i-d9059d1a8ac0&where=Medium',
  },
  {
    title: 'React Context-Api and Lazy-loading',
    imageUrl: 'reactcontext',
    lengthInMinutes: 6,
    publishedDate: 'Dec 26, 2018',
    articleUrl:
      '/interstitial?url=https://medium.com/swlh/react-context-api-and-lazy-loading-4c4b0a48f696?source=friends_link&sk=37e076874f86e49dc260d97b92025734&where=Medium',
  },
];
