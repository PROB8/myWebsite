export default interface PaypalCartItem {
  amount: { currency_code: string; value: number };
  reference_id: string;
}
