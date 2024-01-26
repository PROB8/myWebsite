'use client'
import { Book } from '@/types/book';
import { useState, SetStateAction, Dispatch, useEffect } from 'react';

interface CartItem extends Book {
  quantity: number;
}
// export default function useCart(): [
//   number,
//   CartItem[],
//   Dispatch<SetStateAction<CartItem[]>>,
//   (arg: Book) => void
// ] {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   useEffect(() => {
//     if (window) {
//       savedCart = (window.localStorage.getItem('cart-jng') as string) || [];
//       savedCart = typeof savedCart === 'string' ? JSON.parse(savedCart) : savedCart;
//       setCart(savedCart as CartItem[]);
//     }
//   },[])
//   let savedCart: unknown = []
//   if (typeof window !== undefined) {
//     savedCart = (window.localStorage.getItem('cart-jng') as string) || [];
//     savedCart = typeof savedCart === 'string' ? JSON.parse(savedCart) : savedCart;
//     setCart(savedCart as CartItem[]);
//   }

//   const addItem = (arg: Book) => {
//     console.log('In here', cart);
//     for (const item of cart) {
//       if (arg.id === item.id) {
//         console.log('found Item');
//         item.quantity++;
//         setCart(cart);
//         return;
//       }
//     }
//     setCart([...cart, { ...arg, quantity: 1 }]);
//   };

//   let itemCount = cart.reduce((prev, curr) => {
//     return prev + curr.quantity;
//   }, 0);
//   itemCount = itemCount > 99 ? 99 : itemCount;

//   return [itemCount, cart, setCart, addItem];
// }

export default function useCart(): [
  number,
  CartItem[],
  Dispatch<SetStateAction<CartItem[]>>,
  (arg: Book) => void
] {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0)
  // Effect for initializing the cart
useEffect(() => {
  const savedCart = window.localStorage.getItem('cart-jng');
  const parsedCart = savedCart ? JSON.parse(savedCart) : [];
  setCart(parsedCart as CartItem[]);
}, []);

// Effect for updating item count
useEffect(() => {
  
  console.log('IN HERE')
  const newCount = cart.reduce((prev, curr) => prev + curr.quantity, 0);
  setItemCount(newCount);
}, [cart]);


  const addItem = (arg: Book) => {
    setCart(currentCart => {
      // Check if the item already exists in the cart
      const existingItemIndex = currentCart.findIndex(item => item.id === arg.id);
      
      // Copy the current cart to a new array
      let updatedCart = [...currentCart];
  
      if (existingItemIndex >= 0) {
        // If the item exists, increase its quantity
        const updatedItem = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        updatedCart[existingItemIndex] = updatedItem;
      } else {
        // If the item is new, add it to the cart
        updatedCart.push({ ...arg, quantity: 1 });
      }
  
      // Update localStorage
      // window.localStorage.setItem('cart-jng', JSON.stringify(updatedCart));
  
      // Return the updated cart
      return updatedCart;
    });
  };

  return [itemCount > 99 ? 99 : itemCount, cart, setCart, addItem];
}
