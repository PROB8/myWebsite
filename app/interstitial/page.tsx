'use client';
import React, { Suspense, useEffect } from 'react';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import { useSearchParams } from 'next/navigation';

import styles from './InterstitialPage.module.scss';

function Interstitial(): JSX.Element {
  const searchParams = useSearchParams();
  const url = searchParams?.get('url');
  const siteName = searchParams?.get('where');
  useEffect(() => {
    if (!url) {
      console.error('No redirectUrl param found');
      return;
    }

    const timer = setTimeout(() => {
      window.location.href = url;
      window.history.replaceState(null, '', null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);
  return (
    <div className={styles.page}>
      <div id="particles-js" className={styles.hide} />
      <div className={styles.container}>
        <LoadingDots outerClassName={styles.loaderWrapper} />
        <h1 className={styles.header}>Now taking you to {siteName}...</h1>
      </div>
    </div>
  );
}

export default function InterstitialPage(): JSX.Element {
  return (
    <Suspense>
      <Interstitial />
    </Suspense>
  );
}
