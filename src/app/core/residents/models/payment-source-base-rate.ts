import {CareLevel} from './care-level';
import {PaymentSource} from './payment-source';

export class PaymentSourceBaseRate implements IdInterface {
  id: number;

  date: Date;

  payment_source: PaymentSource;

  levels: any[];

  public get_amount(care_level: CareLevel): number {
    const care_level_rate = this.levels
      .filter(level => level.care_level.id === care_level.id)
      .map(level => level.amount).pop();

    return care_level_rate ? care_level_rate : 0;
  }
}
