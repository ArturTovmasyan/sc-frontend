import {Pipe, PipeTransform} from '@angular/core';
import {PaymentPeriod} from '../models/payment-period.enum';

@Pipe({name: 'payment_period'})
export class PaymentPeriodPipe implements PipeTransform {
  transform(value: PaymentPeriod) {
    switch (value) {
      case PaymentPeriod.HOURLY:
        return 'Hourly';
      case PaymentPeriod.DAILY:
        return 'Daily';
      case  PaymentPeriod.MONTHLY:
        return 'Monthly';
      case  PaymentPeriod.WEEKLY:
        return 'Weekly';
      default:
        return value;
    }
  }
}
