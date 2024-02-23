import Link from 'next/link';
import PageHeader from '../PageHeader/PageHeader';
import styles from './PaymentResponseMessage.module.scss';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function ThanksView(): JSX.Element {
  
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Add a fallback UI here */}
      <ThanksContent />
    </Suspense>
  );
}

function ThanksContent(): JSX.Element {
  const searchParams = useSearchParams();

  // Note: Directly using `searchParams.get` in the render might cause issues
  // if searchParams is not ready. Ensure searchParams is loaded or handled correctly.
  const referenceId = searchParams?.get('referenceId');

  const { thanksViewWrapper, width300Center } = styles;
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
          Your payment reference ID is <strong>{referenceId}</strong>.
        </p>
        <p>
          Should you experience any complications with your order please email{' '}
          <Link href="mailto:gtngbooks@gmail.com">gtngbooks@gmail.com</Link> with
          your reference ID and concern.
        </p>
      </div>
    </div>
  );
}
