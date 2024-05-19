import {Space} from '../../models/space';
import {PaymentPeriod} from './payment-period.enum';
import {CareLevel} from './care-level';

export class PaymentSource implements IdInterface {
  id: number;

  title: string;

  space: Space;

  disabled: boolean;

  away_reduction: boolean;

  period: PaymentPeriod;

  care_level_adjustment: boolean;
  amount: number;
  base_rates: any[];

  public get_amount(care_level: CareLevel): number {
    let amount: number = 0;
    if (this.care_level_adjustment) {
      const care_level_rate = this.base_rates
        .filter(base_rate => base_rate.care_level.id === care_level.id)
        .map(base_rate => base_rate.amount).pop();

      amount = care_level_rate ? care_level_rate : 0;
    } else {
      amount = this.amount;
    }

    if (amount) {
      // TODO: review with RentPeriod
      switch (this.period) {
        case PaymentPeriod.DAILY:
          amount *= 365 / 12;
          break;
        case PaymentPeriod.WEEKLY:
          amount *= 52 / 12;
          break;
      }
    }

    return amount;
  }
}
