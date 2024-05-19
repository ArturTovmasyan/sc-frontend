import {Space} from '../../models/space';

export class CreditDiscountItem implements IdInterface {
  id: number;

  title: string;

  amount: number;

  can_be_changed: boolean;

  valid_through_date: Date;

  space: Space;
}
