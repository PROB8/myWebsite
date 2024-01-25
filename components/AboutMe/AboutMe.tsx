import styles from './AboutMe.module.scss';
import Link from 'next/link';

export default function AboutMe(): JSX.Element {
  const { aboutMe, headshot, about, textCenter, myWorkWrapper } = styles;
  return (
    <div id="aboutMe" className={myWorkWrapper}>
      <div className={textCenter}>
        <div id="standard" className={headshot} />
      </div>
      <h2 className={aboutMe}>aboutMe</h2>
      <p className={about}>
        Peace, I&apos;m Jaha Naeem Gitonga, but you can call me Naeem. I am from
        Clinton, NC &#40;born and raised&#41;. Do <strong>not</strong> ask me if
        I need a work sponsorhip to work in the USA. I am a technical leader.
        I&apos;ve worked with teams to deliver software for the last six years,
        being responsible for guiding and overseeing the technical aspects of
        projects, ensuring the team&apos;s adherence to best practices, and
        making key technical decisions. I build enterprise web applications. I
        teach software engineering, DevOps, and mentor students in coding a boot
        camp with{' '}
        <Link
          href="/interstitial?url=https://www.gtngfoundation.org&where=GTNG Foundation"
          target="_blank"
          rel="noreferrer"
        >
          GTNG Foundation
        </Link>
        , where the focus is the JavaScript MERN stack, AWS and a few other
        technologies. Outside of coding, I do more art. Yeah that&apos;s
        right--programming a computer, building apps and websites is an art!
      </p>
      <p className={about}>
        I enjoy designing applications, employing new technologies to create
        event driven systems. I am an author. I have written two books:{' '}
        <Link
          className="link"
          href="/interstitial?url=https://www.amazon.com/Program-Your-Life-Naeem-Gitonga/dp/1733442405/ref=sr_1_1?keywords=program+your+life+jaha+naeem+gitonga&qid=1580526523&sr=8-1&where=Amazon"
          target="_blank"
          rel="noreferrer"
        >
          Program Your Life
        </Link>
        ,{' '}
        <Link
          className="link"
          href="/interstitial?url=https://rapidbackend.co&where=Rapid Back-End"
          target="_blank"
          rel="noreferrer"
        >
          Rapid Back-End
        </Link>
        . I write tech articles on{' '}
        <Link
          className="link"
          href="/interstitial?url=https://naeemgtng.medium.com/&where=Medium"
        >
          Medium
        </Link>{' '}
        exploring various technologies that I know or am learning.
      </p>
      <p className={about}>
        Here you will see some samples of my work. If you hover over the
        screencaptures you&apos;ll see info about the app. Click on{' '}
        <span className="link">Live site</span> and you&apos;ll be able to play
        around with some stuff.
      </p>
      <p className={about}>
        Please, if you would like to work with me or just stopped by look
        around, click on the envelope icon above and drop me a line or two. Or,
        reach out to me on LinkedIn I will be sure to follow up. Enjoy and
        thanks for dropping by!
      </p>
    </div>
  );
}
