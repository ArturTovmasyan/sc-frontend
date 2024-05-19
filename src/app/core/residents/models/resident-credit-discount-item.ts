import {CreditDiscountItem} from './credit-discount-item';

export class ResidentCreditDiscountItem implements IdInterface {
  id: number;

  date: Date;

  credit_discount_item: CreditDiscountItem;

  amount: number;
  notes: string;
}
