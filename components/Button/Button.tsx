import { ReactNode } from 'react';
import styles from './Button.module.scss';


type ButtonProps = {
  children: unknown;
  cb: () => void;
};

export default function Button(props: ButtonProps): JSX.Element {
  const {
   
  } = styles;
  const {
    children,
    cb
  } = props;
  return (
    <button onClick={(e): void => {e.preventDefault(); cb()}}>
      {children as ReactNode}
    </button>
  );
}
