import Link from 'next/link';
import PageHeader from '../PageHeader/PageHeader';
import styles from './PaymentResponseMessage.module.scss';
import { useSearchParams } from 'next/navigation';

export default function ThanksView(): JSX.Element {
  const { thanksViewWrapper, width300Center } = styles;
  const queryParams = useSearchParams();

  return (
    <div className={thanksViewWrapper}>
      <PageHeader headerName="thank you!" hideLinks={false} />
      <div className={width300Center}>
        <p className={'firstP'}>
          Awesome! We have successfully processed your payment.
        </p>
        <p>
          Please check your email for your confirmation. Check your spam folder
          if you do not see it in your inbox.
        </p>
        <p>
          Your payment reference ID is{' '}
          <strong>{queryParams?.get('referenceId')}</strong>.
        </p>

        <p>
          Should you experience any complications with your order please email{' '}
          <Link href="mailto:gtngbooks@gmail.com">gtngbooks@gmail.com</Link>{' '}
          with your reference ID and concern.
        </p>

        <p></p>
      </div>
    </div>
  );
}
