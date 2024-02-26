import React from 'react';

import styles from './LoadingDots.module.scss';

interface LoadingDotsProps {
  outerClassName?: string;
  dotClassName?: string;
}

const LoadingDots = (props: LoadingDotsProps) => {
  const { outerClassName } = props;
  return (
    <div
      className={`${styles.loaderContainer} ${
        outerClassName ? outerClassName : ''
      }`}
    >
      <div className={`${styles.dot} ${styles.dot1} ${props.dotClassName}`} />
      <div className={`${styles.dot} ${styles.dot2} ${props.dotClassName}`} />
      <div className={`${styles.dot} ${styles.dot3} ${props.dotClassName}`} />
      <div className={`${styles.dot} ${styles.dot4} ${props.dotClassName}`} />
      <div className={`${styles.dot} ${styles.dot5} ${props.dotClassName}`} />
    </div>
  );
};

export default LoadingDots;
