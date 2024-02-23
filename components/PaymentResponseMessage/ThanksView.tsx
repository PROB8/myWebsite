import styles from './PaymentResponseMessage.module.scss';
import { useSearchParams } from 'next/navigation';

export default function ThanksView(): JSX.Element {
  const { thankViewWrapper } = styles;
  const queryParams = useSearchParams()

  return (
    <div className={thankViewWrapper}>
      <p className={'firstP'}>
        Awesome! We have successfully processed your payment.
      </p>
      <p>Please check your email for your confirmation email.</p>
      <p className={'lastP'}>
        Your payment reference ID is <strong>{queryParams?.get('referenceId')}</strong>.
      </p>
    </div>
  );
}
