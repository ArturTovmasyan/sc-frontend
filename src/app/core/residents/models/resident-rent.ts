import {PaymentSource} from './payment-source';
import {Resident} from './resident';
import {PaymentPeriod} from './payment-period.enum';

export class ResidentRent implements IdInterface {
  id: number;

  start: Date;
  end: Date;
  period: PaymentPeriod;

  amount: number;
  notes: string;

  source: { key: PaymentSource, value: number } [];

  resident: Resident;
}
