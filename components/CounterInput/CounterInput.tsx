import { Book } from '@/types/book';
import CartItem from '@/types/cartItem';
import { useState } from 'react';

type CounterInputProps = {
  item: CartItem;
  addItem: (b: Book) => void;
  removeItem: (b: number) => void;
};
export default function CounterInput(props: CounterInputProps): JSX.Element {
  const { addItem, removeItem, item } = props;
  const { quantity, id } = item;
  const decrement = () => {
    removeItem(id);
  };

  const increment = () => {
    addItem(item);
  };

  return (
    <div>
      <button onClick={decrement}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          e.preventDefault();
          console.log(e.target.value);
        }}
      />
      <button onClick={increment}>+</button>
    </div>
  );
}
