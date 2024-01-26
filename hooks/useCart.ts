import { Book } from '@/types/book';
import { useState, SetStateAction, Dispatch } from 'react';

interface CartItem extends Book {
  quantity: number;
}
export default function useCart(): [
  number,
  CartItem[],
  Dispatch<SetStateAction<CartItem[]>>,
  (arg: Book) => void
] {
  let savedCart = (window.localStorage.getItem('cart-jng') as string) || [];
  savedCart = typeof savedCart === 'string' ? JSON.parse(savedCart) : savedCart;

  const [cart, setCart] = useState<CartItem[]>(savedCart as CartItem[]);
  const addItem = (arg: Book) => {
    console.log('In here', cart);
    for (const item of cart) {
      if (arg.id === item.id) {
        console.log('found Item');
        item.quantity++;
        setCart(cart);
        return;
      }
    }
    setCart([...cart, { ...arg, quantity: 1 }]);
  };

  let itemCount = cart.reduce((prev, curr) => {
    return prev + curr.quantity;
  }, 0);
  itemCount = itemCount > 99 ? 99 : itemCount;

  return [itemCount, cart, setCart, addItem];
}
