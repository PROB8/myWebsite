type PaymentResponseProps = {
  paymentSuccessful: boolean;
};
export default function PaymentResponse(
  props: PaymentResponseProps
): JSX.Element {
  const { paymentSuccessful } = props;
  if (!paymentSuccessful) {
    return <div>Was unsuccessful</div>;
  }
  return <div>in here Payment Response Was successful</div>;
}
