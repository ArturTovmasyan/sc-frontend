import {CreditItem} from './credit-item';

export class ResidentCreditItem implements IdInterface {
  id: number;

  start: Date;
  end: Date;

  credit_item: CreditItem;

  amount: number;
  notes: string;
}
