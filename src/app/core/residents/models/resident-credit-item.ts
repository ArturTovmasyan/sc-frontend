import {CreditItem} from './credit-item';

export class ResidentCreditItem implements IdInterface {
  id: number;

  date: Date;

  credit_item: CreditItem;

  amount: number;
  notes: string;
}
