'use client';
import { Book } from '@/types/book';
import { useState, SetStateAction, Dispatch, useEffect } from 'react';
import { Subject } from 'rxjs';

export const itemCountUpdated = new Subject<number>();
interface CartItem extends Book {
  quantity: number;
}

export default function useCart(): [
  number,
  CartItem[],
  Dispatch<SetStateAction<CartItem[]>>,
  (arg: Book) => void
] {
  const [cart, setCart] = useState<CartItem[]>([]);
  // Effect for initializing the cart
  useEffect(() => {
    const savedCart = window.localStorage.getItem('cart-jng');
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    setCart(parsedCart as CartItem[]);
    const newCount = parsedCart.reduce((prev: number, curr: CartItem) => prev + curr.quantity, 0);
      itemCountUpdated.next(newCount);
  }, []);

  const addItem = (arg: Book) => {
    const existingItemIndex = cart.findIndex(
      (item) => item.id === arg.id
    );

    // Copy the current cart to a new array
    let updatedCart = [...cart];

    if (existingItemIndex >= 0) {
      // If the item exists, increase its quantity
      const updatedItem = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
      };
      updatedCart[existingItemIndex] = updatedItem;
    } else {
      // If the item is new, add it to the cart
      updatedCart.push({ ...arg, quantity: 1 });
    }

    // Update localStorage
    window.localStorage.setItem('cart-jng', JSON.stringify(updatedCart));

    const newCount = updatedCart.reduce((prev, curr) => prev + curr.quantity, 0);
    itemCountUpdated.next(newCount);
    setCart(updatedCart);
  };
  console.log(cart);
  return [0, cart, setCart, addItem];
}
