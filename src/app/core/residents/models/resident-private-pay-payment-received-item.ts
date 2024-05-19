import {RpPaymentType} from './rp-payment-type';
import {ResidentResponsiblePerson} from './resident-responsible-person';

export class ResidentPrivatePayPaymentReceivedItem implements IdInterface {
  id: number;

  date: Date;

  payment_type: RpPaymentType;
  responsible_person: ResidentResponsiblePerson;

  amount: number;
  transaction_number: string;
  notes: string;
}
