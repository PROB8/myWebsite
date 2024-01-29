import Link from "next/link";
import Button from "../Button/Button";

type AddToCartMessageProps = {
  setModalOpen: () => void;
};
export default function AddToCartMessage(props: AddToCartMessageProps) {
    const {setModalOpen} = props;
  return (
    <div>
      <h2>You&#39;ve added an item to your cart!</h2>
      <Link href="javascript:void(0);" onClick={setModalOpen}>
        Continue Shopping
      </Link>
      <Link href="/checkout">
        Checkout
      </Link>
    </div>
  );
}
