import { Book } from './book';

export default interface CartItem extends Book {
  quantity: number;
}
