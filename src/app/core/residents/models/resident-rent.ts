import {RentType} from './rent-type.enum';
import {PaymentSource} from './payment-source';
import {Resident} from './resident';

export class ResidentRent implements IdInterface {
  id: number;

  start: Date;
  end: Date;

  type: RentType;
  amount: number;
  notes: string;

  source: { key: PaymentSource, value: number } [];

  resident: Resident;
}
