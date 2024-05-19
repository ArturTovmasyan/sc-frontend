import {Space} from '../../models/space';

export class PaymentSource implements IdInterface {
  id: number;

  title: string;

  space: Space;

  disabled: boolean;
}
