import {RpPaymentType} from './rp-payment-type';
import {ResidentResponsiblePerson} from './resident-responsible-person';
import {ResidentRent} from './resident-rent';

export class ResidentPrivatePayPaymentReceivedItem implements IdInterface {
  id: number;

  date: Date;

  payment_type: RpPaymentType;
  rent: ResidentRent;
  responsible_person: ResidentResponsiblePerson;

  amount: number;
  transaction_number: string;
  notes: string;
}
