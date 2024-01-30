import { Book } from '@/types/book';
import { useState, useCallback, useEffect } from 'react';
import { Subject } from 'rxjs';

export const itemCountUpdated = new Subject<number>();

interface CartItem extends Book {
  quantity: number;
}

export default function useCart(): [
  (arg: Book) => void,
  CartItem[],
  (id: number) => void
] {
  const [cart, setCart] = useState<CartItem[]>([]);
  const updateCartAndStorage = (newCart: CartItem[]) => {
    window.localStorage.setItem('cart-jng', JSON.stringify(newCart));
    const quantity = newCart.reduce((prev, curr) => prev + curr.quantity, 0);
    const newCount = quantity > 99 ? 99 : quantity;
    itemCountUpdated.next(newCount);
  };

  useEffect(() => {
    const savedCart = window.localStorage.getItem('cart-jng');
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    setCart(parsedCart as CartItem[]);
    updateCartAndStorage(parsedCart);
  }, []);

  const addItem = useCallback((item: Book) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === item.id
      );
      let updatedCart = [...currentCart];

      if (existingItemIndex >= 0) {
        const updatedItem = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        updatedCart[existingItemIndex] = updatedItem;
      } else {
        updatedCart = [...updatedCart, { ...item, quantity: 1 }];
      }
      window.localStorage.setItem('cart-jng', JSON.stringify(updatedCart));
      updateCartAndStorage(updatedCart);
      return updatedCart;
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex((item) => item.id === id);

      if (existingItemIndex < 0) {
        // Item not found in the cart, return the current cart
        return currentCart;
      }

      let updatedCart = [...currentCart];
      const updatedItem = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity - 1,
      };

      if (updatedItem.quantity <= 0) {
        // Remove the item from the cart if quantity is 0 or less
        updatedCart.splice(existingItemIndex, 1);
      } else {
        // Update the item in the cart
        updatedCart[existingItemIndex] = updatedItem;
      }

      window.localStorage.setItem('cart-jng', JSON.stringify(updatedCart));
      updateCartAndStorage(updatedCart);
      return updatedCart;
    });
  }, []);

  return [addItem, cart, removeItem];
}
