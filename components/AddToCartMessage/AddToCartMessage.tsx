type AddToCartMessageProps = {
  setModalOpen: () => void;
};
export default function AddToCartMessage(props: AddToCartMessageProps) {
  return (
    <div>
      <h2>You&#39;ve added this to your cart!</h2>
    </div>
  );
}
