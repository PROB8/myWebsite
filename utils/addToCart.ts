import { Book } from '@/types/book';

export default function addToCart(arg: Book): void {
  const stringifiedCart = window.localStorage.getItem('cart-jng');
  if (stringifiedCart) {
    let cart = JSON.parse(stringifiedCart);
    for (const item of cart) {
      if (arg.id === item.id) {
        item.quantity++;
        window.localStorage.setItem('cart-jng', JSON.stringify(cart));
        return;
      }
    }
    cart = [...cart, { ...arg, quantity: 1 }];
    window.localStorage.setItem('cart-jng', JSON.stringify(cart));
    return;
  }

  window.localStorage.setItem(
    'cart-jng',
    JSON.stringify([{ ...arg, quantity: 1 }])
  );
}
