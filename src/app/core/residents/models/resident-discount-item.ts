import {DiscountItem} from './discount-item';

export class ResidentDiscountItem implements IdInterface {
  id: number;

  start: Date;
  end: Date;

  discount_item: DiscountItem;

  amount: number;
  notes: string;
}
