import Link from 'next/link';
import styles from './PaymentResponseMessage.module.scss';

export default function PaymentResponse(): JSX.Element {
  const { firstP, lastP } = styles;
  return (
    <div>
      <p className={firstP}>
        Unfortunately, we were unable to process your order. Please make another
        attempt to purchase.
      </p>

      <p>
        You have <strong>not</strong> been charged for this attempt.
      </p>

      <p className={lastP}>
        If you continue to exprience issues purchasing, please contact support{' '}
        <Link href="mailto:gtngbooks@gmail.com">gtngbooks@gmail.com</Link>.
      </p>
    </div>
  );
}
