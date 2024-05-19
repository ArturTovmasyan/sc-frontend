import {Space} from '../../models/space';

export class CreditItem implements IdInterface {
  id: number;

  title: string;

  amount: number;

  can_be_changed: boolean;

  space: Space;
}
