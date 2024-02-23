import styles from './PaymentResponseMessage.module.scss';

type PaymentResponseProps = {
  paymentSuccessful: boolean;
  paymentReferenceId: string;
};
export default function PaymentResponse(
  props: PaymentResponseProps
): JSX.Element {
  const { paymentSuccessful, paymentReferenceId } = props;
  const { firstP, lastP } = styles;
  if (!paymentSuccessful) {
    return (
      <div>
        <p className={firstP}>
          Unfortunately, we were unable to process your order. Please make
          another attempt to purchase.
        </p>

        <p>
          You have <strong>not</strong> been charged for this attempt.
        </p>

        <p className={lastP}>
          If you continue to exprience issues purchasing, please contact support{' '}
          <a href="mailto:gtngbooks@gmail.com">gtngbooks@gmail.com</a>.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className={firstP}>
        Awesome! We have successfully process your payment.
      </p>
      <p>Please check your email for your confirmation email.</p>
      <p className={lastP}>Your payment reference ID is {paymentReferenceId}</p>
    </div>
  );
}
