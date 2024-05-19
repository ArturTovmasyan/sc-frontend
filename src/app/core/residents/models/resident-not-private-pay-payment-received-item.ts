import {RpPaymentType} from './rp-payment-type';
import {ResidentRent} from './resident-rent';

export class ResidentNotPrivatePayPaymentReceivedItem implements IdInterface {
  id: number;

  date: Date;

  payment_type: RpPaymentType;
  rent: ResidentRent;

  amount: number;
  transaction_number: string;
  notes: string;
}
