import {RpPaymentType} from './rp-payment-type';

export class ResidentPaymentReceivedItem implements IdInterface {
  id: number;

  date: Date;

  payment_type: RpPaymentType;

  amount: number;
  transaction_number: string;
  notes: string;
}
