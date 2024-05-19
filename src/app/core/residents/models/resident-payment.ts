import {PaymentSource} from './payment-source';
import {Resident} from './resident';

export class ResidentPayment implements IdInterface {
  id: number;

  amount: number;
  notes: string;

  source: { key: PaymentSource, value: number } [];

  resident: Resident;
}
